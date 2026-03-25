import React, { useEffect, useState } from 'react';
import { Quickdraw, useQuickdrawStore, type Editor } from '@quickdrawjs/react';
import '@quickdrawjs/core/quickdraw.css';
import type { BoardChannelMessage } from '../hooks/useWebRTC';
import { UserAvatar } from '../components/UserAvatar';
import { captureBoardThumbnail } from '../lib/boardThumbnail';

interface QuickDrawCanvasProps {
  roomId: string;
  userId: string;
  userName: string;
  connected: boolean;
  subscribeBoard: (handler: (message: BoardChannelMessage) => void) => () => void;
  sendBoardMessage: (payload: { diff?: unknown; snapshot?: unknown }) => void;
  sendCursor: (payload: { x: number; y: number; tool?: string }) => void;
  onConnectionChange?: (connected: boolean) => void;
  onThumbnail?: (dataUrl: string) => void;
}

interface RemoteCursor {
  x: number;
  y: number;
  name: string;
  avatarUrl?: string;
  tool?: string;
  updatedAt: number;
}

const getCursorColor = (value: string) => {
  const palette = ['#a78bfa', '#34d399', '#fbbf24', '#f472b6', '#60a5fa', '#fb7185', '#22d3ee', '#f87171'];
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
};

export const QuickDrawCanvas: React.FC<QuickDrawCanvasProps> = ({
  roomId,
  userId,
  userName,
  connected,
  subscribeBoard,
  sendBoardMessage,
  sendCursor,
  onConnectionChange,
  onThumbnail,
}) => {
  const store = useQuickdrawStore();
  const [editor, setEditor] = useState<Editor | null>(null);
  const [cursors, setCursors] = useState<Record<string, RemoteCursor>>({});
  const [, setCameraTick] = useState(0);
  const editorRef = React.useRef<Editor | null>(null);
  const onThumbnailRef = React.useRef(onThumbnail);
  editorRef.current = editor;
  onThumbnailRef.current = onThumbnail;

  useEffect(() => {
    onConnectionChange?.(connected);
  }, [connected, onConnectionChange]);

  useEffect(() => {
    let thumbTimer: number | undefined;
    let thumbPending = false;

    const flushThumbnail = () => {
      const current = editorRef.current;
      const publish = onThumbnailRef.current;
      if (!current || !publish) return;
      thumbPending = false;
      void captureBoardThumbnail(current)
        .then((url) => {
          if (url) publish(url);
        })
        .catch(() => undefined);
    };

    const unsubscribeStore = store.listen((diff, source) => {
      if (source !== 'user') return;
      sendBoardMessage({ diff, snapshot: store.getSnapshot() });
      thumbPending = true;
      if (thumbTimer) window.clearTimeout(thumbTimer);
      thumbTimer = window.setTimeout(flushThumbnail, 3000);
    });

    const resetHandler = () => {
      store.clear('user');
      sendBoardMessage({ snapshot: store.getSnapshot() });
      thumbPending = true;
      if (thumbTimer) window.clearTimeout(thumbTimer);
      thumbTimer = window.setTimeout(flushThumbnail, 800);
    };

    const unsubscribeBoard = subscribeBoard((message) => {
      if (message.roomId && message.roomId !== roomId) return;

      if (message.type === 'CURSOR_MOVE') {
        if (!message.userId || message.userId === userId) return;
        if (typeof message.payload?.x !== 'number' || typeof message.payload?.y !== 'number') return;
        setCursors((prev) => ({
          ...prev,
          [message.userId as string]: {
            x: message.payload!.x as number,
            y: message.payload!.y as number,
            name: message.payload?.name || 'Guest',
            avatarUrl: message.payload?.avatarUrl,
            tool: message.payload?.tool,
            updatedAt: Date.now(),
          },
        }));
        return;
      }

      if (message.type === 'BOARD_SNAPSHOT') {
        if (message.payload?.snapshot) {
          store.loadSnapshot(message.payload.snapshot as never, 'remote');
        }
        return;
      }

      if (message.type !== 'BOARD_SYNC' || message.userId === userId) return;

      if (message.payload?.diff) {
        store.applyDiff(message.payload.diff as never, 'remote');
      } else if (message.payload?.snapshot) {
        store.loadSnapshot(message.payload.snapshot as never, 'remote');
      }
    });

    window.addEventListener(`quickdraw-reset:${roomId}`, resetHandler);

    const prune = window.setInterval(() => {
      const cutoff = Date.now() - 4000;
      setCursors((prev) => {
        const next = { ...prev };
        let changed = false;
        Object.entries(next).forEach(([id, cursor]) => {
          if (cursor.updatedAt < cutoff) {
            delete next[id];
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }, 1000);

    return () => {
      unsubscribeStore();
      unsubscribeBoard();
      window.clearInterval(prune);
      window.removeEventListener(`quickdraw-reset:${roomId}`, resetHandler);
      if (thumbTimer) window.clearTimeout(thumbTimer);
      if (thumbPending) flushThumbnail();
    };
  }, [roomId, sendBoardMessage, store, subscribeBoard, userId]);

  useEffect(() => {
    if (!userName) return;
    const board = document.querySelector('[data-board-root]');
    if (board) {
      board.setAttribute('data-author', userName);
    }
  }, [userName]);

  useEffect(() => {
    if (!editor) return;

    let lastSent = 0;
    const onMove = (event: PointerEvent) => {
      const now = Date.now();
      if (now - lastSent < 40) return;
      lastSent = now;
      const rect = editor.container.getBoundingClientRect();
      const page = editor.screenToPage(event.clientX - rect.left, event.clientY - rect.top);
      sendCursor({ x: page.x, y: page.y, tool: editor.tool });
    };

    const unsubCamera = editor.on('camera', () => {
      setCameraTick((tick) => tick + 1);
    });

    editor.container.addEventListener('pointermove', onMove);
    return () => {
      editor.container.removeEventListener('pointermove', onMove);
      unsubCamera();
    };
  }, [editor, sendCursor]);

  return (
    <div className="w-full h-full relative">
      <Quickdraw
        store={store}
        theme="dark"
        grid="lines"
        autoFit
        className="w-full h-full"
        onMount={(nextEditor) => {
          setEditor(nextEditor);
        }}
      />

      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {Object.entries(cursors).map(([peerId, cursor]) => {
          const screen = editor
            ? editor.pageToScreen(cursor.x, cursor.y)
            : { x: cursor.x, y: cursor.y };
          const color = getCursorColor(peerId);

          return (
            <div
              key={peerId}
              className="absolute flex items-start gap-1"
              style={{ left: screen.x, top: screen.y, transform: 'translate(-2px, -2px)' }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <path
                  d="M2 2L16 8.2L9.4 9.4L8.2 16L2 2Z"
                  fill={color}
                  stroke="#172033"
                  strokeWidth="1"
                />
              </svg>
              <div
                className="flex items-center gap-1 rounded-full pl-0.5 pr-2 py-0.5 border border-black/40"
                style={{ backgroundColor: color }}
              >
                <UserAvatar name={cursor.name} avatarUrl={cursor.avatarUrl} size={18} />
                <span className="max-w-[120px] truncate text-[10px] font-semibold text-[#172033]">
                  {cursor.name}
                  {cursor.tool ? ` · ${cursor.tool}` : ''}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const TLDrawCanvas = QuickDrawCanvas;
export default QuickDrawCanvas;

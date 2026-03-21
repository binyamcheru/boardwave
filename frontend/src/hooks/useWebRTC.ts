import { useCallback, useEffect, useRef, useState } from 'react';
import { API_BASE, WS_BASE } from '../config';

const FALLBACK_ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

const FATAL_CLOSE_CODES = new Set([4001, 4003, 4004, 4008]);

interface UseWebRTCProps {
  roomId: string;
  userId: string;
  token: string;
  enabled?: boolean;
}

export interface BoardChannelMessage {
  type: 'BOARD_SYNC' | 'BOARD_SNAPSHOT' | 'CURSOR_MOVE';
  roomId?: string;
  userId?: string;
  payload?: {
    diff?: unknown;
    snapshot?: unknown;
    x?: number;
    y?: number;
    tool?: string;
    name?: string;
    avatarUrl?: string;
  };
}

type CaptureStreamCanvas = HTMLCanvasElement & {
  captureStream?: (fps?: number) => MediaStream;
};

function createFallbackStream(): MediaStream {
  const canvas = document.createElement('canvas') as CaptureStreamCanvas;
  canvas.width = 320;
  canvas.height = 240;

  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#172033';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1957d2';
    ctx.font = '16px sans-serif';
    ctx.fillText('No Camera Detected', 80, 125);
  }

  return canvas.captureStream ? canvas.captureStream(10) : new MediaStream();
}

async function getLocalMediaStream(): Promise<MediaStream> {
  try {
    return await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  } catch {
    try {
      return await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    } catch {
      try {
        return await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      } catch {
        return createFallbackStream();
      }
    }
  }
}

function mergeMediaStream(existing: MediaStream | null, incoming: MediaStream): MediaStream {
  const merged = existing ?? new MediaStream();

  incoming.getTracks().forEach((track) => {
    const hasTrack = merged.getTracks().some((existingTrack) => existingTrack.id === track.id);
    if (!hasTrack) {
      merged.addTrack(track);
    }
  });

  return merged;
}

async function fetchIceServers(token: string): Promise<RTCIceServer[]> {
  try {
    const res = await fetch(`${API_BASE}/api/ice-config`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = (await res.json()) as { iceServers?: RTCIceServer[] };
    if (res.ok && Array.isArray(data.iceServers) && data.iceServers.length > 0) {
      return data.iceServers;
    }
  } catch {
    // Keep fallback STUN servers if the config endpoint is unavailable.
  }

  return FALLBACK_ICE_SERVERS;
}

export function useWebRTC({
  roomId,
  userId,
  token,
  enabled = true,
}: UseWebRTCProps) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<Record<string, MediaStream>>({});
  const [peerNames, setPeerNames] = useState<Record<string, string>>({});
  const [peerAvatars, setPeerAvatars] = useState<Record<string, string>>({});
  const [socketReady, setSocketReady] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const peerConnections = useRef<Record<string, RTCPeerConnection>>({});
  const localStreamRef = useRef<MediaStream | null>(null);
  const pendingIce = useRef<Record<string, RTCIceCandidateInit[]>>({});
  const pendingBoard = useRef<Record<string, unknown>[]>([]);
  const boardListeners = useRef(new Set<(message: BoardChannelMessage) => void>());

  const attachLocalStreamToConnection = (pc: RTCPeerConnection) => {
    if (!localStreamRef.current) return;

    const existingSenders = pc.getSenders();
    const localTracks = localStreamRef.current.getTracks();

    localTracks.forEach((track) => {
      const senderExists = existingSenders.some((sender) => sender.track?.id === track.id);
      if (!senderExists) {
        pc.addTrack(track, localStreamRef.current!);
      }
    });
  };

  const setTrackEnabled = (kind: 'audio' | 'video', enabledState: boolean) => {
    const stream = localStreamRef.current;
    if (!stream) return;

    stream.getTracks().forEach((track) => {
      if (track.kind === kind) {
        track.enabled = enabledState;
      }
    });

    if (kind === 'video') {
      setIsVideoEnabled(enabledState);
    } else {
      setIsAudioEnabled(enabledState);
    }
  };

  const toggleVideo = () => {
    setTrackEnabled('video', !isVideoEnabled);
  };

  const toggleAudio = () => {
    setTrackEnabled('audio', !isAudioEnabled);
  };

  const subscribeBoard = useCallback((handler: (message: BoardChannelMessage) => void) => {
    boardListeners.current.add(handler);
    return () => {
      boardListeners.current.delete(handler);
    };
  }, []);

  const sendBoardMessage = useCallback(
    (payload: { diff?: unknown; snapshot?: unknown }) => {
      const message = {
        type: 'BOARD_SYNC',
        roomId,
        userId,
        payload,
      };

      const ws = socketRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        pendingBoard.current.push(message);
        return;
      }

      ws.send(JSON.stringify(message));
    },
    [roomId, userId]
  );

  const sendCursor = useCallback(
    (payload: { x: number; y: number; tool?: string }) => {
      const ws = socketRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      ws.send(
        JSON.stringify({
          type: 'CURSOR_MOVE',
          roomId,
          userId,
          payload,
        })
      );
    },
    [roomId, userId]
  );

  useEffect(() => {
    if (!enabled || !token || !roomId || !userId) return;

    let cancelled = false;
    let activeSocket: WebSocket | null = null;
    let reconnectTimer: number | undefined;
    let pingTimer: number | undefined;
    let reconnectAttempt = 0;
    const connections = peerConnections.current;

    const emitBoard = (message: BoardChannelMessage) => {
      boardListeners.current.forEach((listener) => listener(message));
    };

    const resetPeers = () => {
      Object.values(peerConnections.current).forEach((pc) => pc.close());
      peerConnections.current = {};
      pendingIce.current = {};
      setPeers({});
      setPeerNames({});
      setPeerAvatars({});
    };

    const forgetPeerName = (peerId: string) => {
      setPeerNames((prev) => {
        if (!(peerId in prev)) return prev;
        const updated = { ...prev };
        delete updated[peerId];
        return updated;
      });
      setPeerAvatars((prev) => {
        if (!(peerId in prev)) return prev;
        const updated = { ...prev };
        delete updated[peerId];
        return updated;
      });
    };

    const destroyPeer = (peerId: string) => {
      peerConnections.current[peerId]?.close();
      delete peerConnections.current[peerId];
      delete pendingIce.current[peerId];
      setPeers((prev) => {
        if (!(peerId in prev)) return prev;
        const updated = { ...prev };
        delete updated[peerId];
        return updated;
      });
    };

    const flushIce = async (pc: RTCPeerConnection, peerId: string) => {
      const queued = pendingIce.current[peerId] ?? [];
      pendingIce.current[peerId] = [];
      for (const candidate of queued) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error('Failed to add queued ICE candidate:', err);
        }
      }
    };

    const addIceCandidate = async (
      pc: RTCPeerConnection,
      peerId: string,
      candidate: RTCIceCandidateInit
    ) => {
      if (!pc.remoteDescription) {
        pendingIce.current[peerId] = pendingIce.current[peerId] ?? [];
        pendingIce.current[peerId].push(candidate);
        return;
      }

      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    };

    void (async () => {
      const iceServers = await fetchIceServers(token);
      if (cancelled) return;

      const stream = await getLocalMediaStream();
      if (cancelled) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      localStreamRef.current = stream;
      setLocalStream(stream);
      connectSocket(iceServers);
    })();

    function connectSocket(iceServers: RTCIceServer[]) {
      if (cancelled) return;

      if (activeSocket && activeSocket.readyState < WebSocket.CLOSING) {
        activeSocket.close(4000, 'replaced');
      }

      const ws = new WebSocket(`${WS_BASE}?token=${encodeURIComponent(token)}`);
      activeSocket = ws;
      socketRef.current = ws;

      const createPeerConnection = (peerId: string, isInitiator: boolean) => {
        const existing = peerConnections.current[peerId];
        if (existing) return existing;

        const pc = new RTCPeerConnection({ iceServers });
        peerConnections.current[peerId] = pc;

        pc.ontrack = (event) => {
          setPeers((prev) => {
            const incoming = event.streams[0] ?? new MediaStream([event.track]);
            const nextStream = mergeMediaStream(prev[peerId] ?? null, incoming);
            return {
              ...prev,
              [peerId]: nextStream,
            };
          });
        };

        pc.onicecandidate = (event) => {
          if (event.candidate && socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(
              JSON.stringify({
                type: 'ICE_CANDIDATE',
                roomId,
                userId,
                targetId: peerId,
                payload: { candidate: event.candidate },
              })
            );
          }
        };

        attachLocalStreamToConnection(pc);

        if (isInitiator) {
          pc.createOffer()
            .then((offer) => pc.setLocalDescription(offer))
            .then(() => {
              socketRef.current?.send(
                JSON.stringify({
                  type: 'SIGNAL_OFFER',
                  roomId,
                  userId,
                  targetId: peerId,
                  payload: { offer: pc.localDescription },
                })
              );
            })
            .catch((err) => console.error('Failed to create offer:', err));
        }

        return pc;
      };

      const handleMessage = async (event: MessageEvent) => {
        const message = JSON.parse(String(event.data)) as {
          type?: string;
          payload?: {
            peers?: string[];
            peerNames?: Record<string, string>;
            peerAvatars?: Record<string, string>;
            newPeerId?: string;
            displayName?: string;
            avatarUrl?: string;
            offer?: RTCSessionDescriptionInit;
            answer?: RTCSessionDescriptionInit;
            candidate?: RTCIceCandidateInit;
            snapshot?: unknown;
            diff?: unknown;
            x?: number;
            y?: number;
            tool?: string;
            name?: string;
            code?: string;
            message?: string;
          };
          userId?: string;
          roomId?: string;
        };

        const { type, payload, userId: senderId } = message;

        switch (type) {
          case 'ERROR': {
            setError(payload?.message || payload?.code || 'Room connection failed');
            break;
          }
          case 'EXISTING_PEERS': {
            const existingPeers = payload?.peers ?? [];
            if (payload?.peerNames) {
              setPeerNames((prev) => ({ ...prev, ...payload.peerNames }));
            }
            if (payload?.peerAvatars) {
              setPeerAvatars((prev) => ({ ...prev, ...payload.peerAvatars }));
            }
            existingPeers.forEach((peerId) => {
              if (peerId !== userId) {
                destroyPeer(peerId);
                createPeerConnection(peerId, true);
              }
            });
            break;
          }
          case 'USER_JOINED': {
            const newPeerId = payload?.newPeerId;
            if (newPeerId && newPeerId !== userId) {
              if (payload.displayName) {
                setPeerNames((prev) => ({ ...prev, [newPeerId]: payload.displayName as string }));
              }
              if (payload.avatarUrl) {
                setPeerAvatars((prev) => ({ ...prev, [newPeerId]: payload.avatarUrl as string }));
              }
              destroyPeer(newPeerId);
              createPeerConnection(newPeerId, false);
            }
            break;
          }
          case 'SIGNAL_OFFER': {
            if (!senderId || !payload?.offer) break;
            destroyPeer(senderId);
            const pc = createPeerConnection(senderId, false);
            await pc.setRemoteDescription(new RTCSessionDescription(payload.offer));
            await flushIce(pc, senderId);
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socketRef.current?.send(
              JSON.stringify({
                type: 'SIGNAL_ANSWER',
                roomId,
                userId,
                targetId: senderId,
                payload: { answer },
              })
            );
            break;
          }
          case 'SIGNAL_ANSWER': {
            const pc = senderId ? peerConnections.current[senderId] : undefined;
            if (pc && payload?.answer) {
              await pc.setRemoteDescription(new RTCSessionDescription(payload.answer));
              await flushIce(pc, senderId!);
            }
            break;
          }
          case 'ICE_CANDIDATE': {
            const pc = senderId ? peerConnections.current[senderId] : undefined;
            if (pc && payload?.candidate) {
              await addIceCandidate(pc, senderId!, payload.candidate);
            }
            break;
          }
          case 'USER_LEFT': {
            if (senderId) {
              destroyPeer(senderId);
              forgetPeerName(senderId);
            }
            break;
          }
          case 'BOARD_SNAPSHOT':
          case 'BOARD_SYNC':
          case 'CURSOR_MOVE': {
            emitBoard({
              type,
              roomId: message.roomId,
              userId: senderId,
              payload: {
                diff: payload?.diff,
                snapshot: payload?.snapshot,
                x: payload?.x,
                y: payload?.y,
                tool: payload?.tool,
                name: payload?.name,
                avatarUrl: payload?.avatarUrl,
              },
            });
            break;
          }
        }
      };

      ws.addEventListener('open', () => {
        if (cancelled || socketRef.current !== ws) return;
        reconnectAttempt = 0;
        setSocketReady(true);
        setError(null);
        ws.send(
          JSON.stringify({
            type: 'JOIN_ROOM',
            roomId,
            userId,
            payload: { token },
          })
        );

        pendingBoard.current.forEach((queued) => ws.send(JSON.stringify(queued)));
        pendingBoard.current = [];

        pingTimer = window.setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'PING' }));
          }
        }, 25000);
      });

      let chain = Promise.resolve();
      ws.addEventListener('message', (event) => {
        chain = chain
          .then(() => handleMessage(event))
          .catch((err) => console.error('Signaling parse error:', err));
      });

      ws.addEventListener('close', (event) => {
        if (pingTimer) {
          window.clearInterval(pingTimer);
          pingTimer = undefined;
        }
        if (socketRef.current === ws) {
          socketRef.current = null;
        }
        setSocketReady(false);

        if (cancelled || event.code === 4000) return;

        if (FATAL_CLOSE_CODES.has(event.code)) {
          setError(event.reason || 'Unable to join this room');
          return;
        }

        resetPeers();
        const delay = Math.min(8000, 500 * 2 ** reconnectAttempt);
        reconnectAttempt += 1;
        reconnectTimer = window.setTimeout(() => connectSocket(iceServers), delay);
      });
    }

    return () => {
      cancelled = true;
      if (reconnectTimer) window.clearTimeout(reconnectTimer);
      if (pingTimer) window.clearInterval(pingTimer);
      setSocketReady(false);
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      Object.values(connections).forEach((pc) => pc.close());
      Object.values(peerConnections.current).forEach((pc) => pc.close());
      peerConnections.current = {};
      pendingIce.current = {};
      pendingBoard.current = [];
      activeSocket?.close();
      socketRef.current = null;
    };
  }, [enabled, roomId, token, userId]);

  return {
    localStream,
    peers,
    peerNames,
    peerAvatars,
    socketReady,
    isVideoEnabled,
    isAudioEnabled,
    error,
    toggleVideo,
    toggleAudio,
    subscribeBoard,
    sendBoardMessage,
    sendCursor,
  };
}

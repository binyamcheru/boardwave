import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiGrid, FiMoreVertical, FiCopy, FiTrash2, FiEdit2, FiCheck } from 'react-icons/fi';
import type { LiveParticipant, Room } from './types';
import { UserAvatar } from '../components/UserAvatar';

interface RoomCardProps {
  room: Room;
  onDeleteRoom: (roomId: string) => void;
  onRenameRoom: (roomId: string, currentTitle: string) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onDeleteRoom, onRenameRoom }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const copiedTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (copiedTimer.current) window.clearTimeout(copiedTimer.current);
    };
  }, []);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(room.code);
      setCopied(true);
      if (copiedTimer.current) window.clearTimeout(copiedTimer.current);
      copiedTimer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const handleCopyLink = () => {
    const roomUrl = `${window.location.origin}/room/${room.code}`;
    void navigator.clipboard.writeText(roomUrl);
    setMenuOpen(false);
  };

  const getRelativeTime = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) {
      const minutes = Math.max(1, Math.floor(diff / 60));
      return `${minutes} min ago`;
    }
    if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }
    if (diff < 172800) return 'Yesterday';
    return `${Math.floor(diff / 86400)} days ago`;
  };

  const livePeople: LiveParticipant[] = room.liveParticipants ?? [];
  const visiblePeople =
    livePeople.length > 0
      ? livePeople
      : (room.members ?? []).map((member) => ({
          id: member.user.id,
          name: member.user.name,
          avatarUrl: member.user.avatarUrl,
        }));
  const extraCount = Math.max(0, visiblePeople.length - 3);

  return (
    <div className="group relative flex flex-col gap-4 rounded-md border border-[#244765] bg-[#0b2540] px-4 py-4 transition hover:border-[#3c6c96] hover:shadow-[0_10px_30px_rgba(0,0,0,0.18)] sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-3.5">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <div className="h-16 w-24 shrink-0 overflow-hidden rounded-md border border-[#315475] bg-[#071a2f] sm:h-[4.25rem] sm:w-[7.5rem]">
          {room.thumbnail ? (
            <img
              src={room.thumbnail}
              alt={`${room.title} preview`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xl text-[#51a9ff]">
              <FiGrid />
            </div>
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="truncate font-display text-base font-bold text-[#f4f8fc]">
              {room.title}
            </span>
            {room.isLive && (
              <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/40 shrink-0">
                Live now
              </span>
            )}
          </div>
          <span className="mt-1 text-xs text-[#8fa3b8]">
            {getRelativeTime(room.updatedAt)}
            {room.isLive && livePeople.length > 0
              ? ` · ${livePeople.length} inside`
              : ''}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:shrink-0">
        <div className="flex items-center -space-x-2">
          {visiblePeople.slice(0, 3).map((person) => (
            <UserAvatar
              key={person.id}
              name={person.name}
              avatarUrl={person.avatarUrl}
              size={28}
              className={`border-2 border-[#0b2540] ${room.isLive ? 'ring-2 ring-emerald-400/80' : ''}`}
            />
          ))}
          {extraCount > 0 && (
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0b2540] bg-[#183b5d] text-[10px] font-medium text-[#d1dce8]">
              +{extraCount}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => void handleCopyCode()}
          title="Copy join code"
          className="flex h-9 flex-1 items-center justify-center gap-2 rounded-md border border-[#315475] bg-[#071a2f] px-3 text-xs font-semibold text-[#d1dce8] transition hover:bg-[#102f4f] sm:flex-none"
        >
          {copied ? (
            <FiCheck className="text-sm text-emerald-400" />
          ) : (
            <FiCopy className="text-sm text-[#51a9ff]" />
          )}
          <span className="font-mono tracking-wide">{copied ? 'Copied' : room.code}</span>
        </button>

        <button
          onClick={() => navigate(`/room/${room.code}`)}
          className="h-9 flex-1 rounded-md bg-[#ffdc45] px-5 text-xs font-bold text-[#102039] transition hover:bg-[#ffe675] sm:flex-none"
        >
          Enter Room
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-md p-1.5 text-lg text-[#8fa3b8] transition hover:bg-[#173b5d] hover:text-white"
            aria-label={`Open actions for ${room.title}`}
          >
            <FiMoreVertical />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-10 z-30 flex w-44 flex-col rounded-md border border-[#315475] bg-[#0a2038] py-1.5 shadow-xl">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  void handleCopyCode();
                }}
                className="flex items-center gap-2.5 px-4 py-2 text-left text-xs text-[#aebed4] transition hover:bg-[#123454] hover:text-white"
              >
                <FiCopy className="text-sm text-[#51a9ff]" />
                <span>Copy join code</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2.5 px-4 py-2 text-left text-xs text-[#aebed4] transition hover:bg-[#123454] hover:text-white"
              >
                <FiCopy className="text-sm" />
                <span>Copy Link</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  onRenameRoom(room.id, room.title);
                }}
                className="flex items-center gap-2.5 px-4 py-2 text-left text-xs text-[#aebed4] transition hover:bg-[#123454] hover:text-white"
              >
                <FiEdit2 className="text-sm" />
                <span>Rename Board</span>
              </button>

              <div className="my-1 h-px bg-[#244765]"></div>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDeleteRoom(room.id);
                }}
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition text-left"
              >
                <FiTrash2 className="text-sm" />
                <span>Delete Room</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

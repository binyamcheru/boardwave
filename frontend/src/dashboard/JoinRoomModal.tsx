import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { joinRoomByCode, normalizeRoomCode } from '../api/rooms';

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinRoomModal: React.FC<JoinRoomModalProps> = ({ isOpen, onClose }) => {
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedCode = normalizeRoomCode(roomCode);
    if (!normalizedCode || !token) return;

    setError('');
    setLoading(true);

    try {
      const room = await joinRoomByCode(token, normalizedCode);
      onClose();
      setRoomCode('');
      navigate(`/room/${room.code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dialog-backdrop">
      <div className="dialog-panel">
        <h2 className="font-display mb-1 text-lg font-bold text-[#f4f8fc]">Join a room</h2>
        <p className="mb-5 text-xs text-[#aebed4]">
          Enter the room code shared with you to jump into the live board.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="px-3.5 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">
              {error}
            </div>
          )}

          <input
            type="text"
            required
            autoFocus
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="e.g. room-fc4a2b or fc4a2b"
            className="field-input"
          />

          <div className="flex items-center justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#aebed4] transition hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!roomCode.trim() || loading}
              className="primary-button min-h-9 px-5 text-xs"
            >
              {loading ? 'Joining...' : 'Join Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinRoomModal;

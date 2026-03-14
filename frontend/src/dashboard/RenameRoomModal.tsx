import React, { useState, useEffect } from 'react';

interface RenameRoomModalProps {
  isOpen: boolean;
  currentTitle: string;
  onClose: () => void;
  onRename: (newTitle: string) => Promise<void>;
}

export const RenameRoomModal: React.FC<RenameRoomModalProps> = ({
  isOpen,
  currentTitle,
  onClose,
  onRename,
}) => {
  const [title, setTitle] = useState(currentTitle);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(currentTitle);
  }, [currentTitle]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    await onRename(title.trim());
    setLoading(false);
    onClose();
  };

  return (
    <div className="dialog-backdrop">
      <div className="dialog-panel">
        <h2 className="font-display mb-1 text-lg font-bold text-[#f4f8fc]">Rename board</h2>
        <p className="mb-5 text-xs text-[#aebed4]">Enter a new title for this whiteboard room.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            required
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
              disabled={loading || !title.trim()}
              className="primary-button min-h-9 px-5 text-xs"
            >
              {loading ? 'Saving...' : 'Save Title'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
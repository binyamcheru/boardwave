import React, { useEffect, useState } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { randomAvataaarsUrl } from '../lib/avataaars';
import { UserAvatar } from '../components/UserAvatar';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || randomAvataaarsUrl());
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setName(user?.name || '');
    setAvatarUrl(user?.avatarUrl || randomAvataaarsUrl());
    setError('');
  }, [isOpen, user?.avatarUrl, user?.name]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await updateProfile({ name: name.trim(), avatarUrl });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dialog-backdrop">
      <div className="dialog-panel max-h-[90vh] overflow-y-auto">
        <h2 className="font-display mb-1 text-lg font-bold text-[#f4f8fc]">Edit profile</h2>
        <p className="mb-5 text-xs text-[#aebed4]">
          Change your display name and pick a random Avataaars avatar.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="px-3.5 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">
              {error}
            </div>
          )}

          <div className="flex flex-col items-center gap-3">
            <UserAvatar name={name} avatarUrl={avatarUrl} size={96} />
            <button
              type="button"
              onClick={() => setAvatarUrl(randomAvataaarsUrl())}
              className="secondary-button min-h-9 text-xs"
            >
              <FiRefreshCw className="text-xs" />
              Random avatar
            </button>
            <a
              href="https://getavataaars.com/"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-[#73869c] transition hover:text-[#51a9ff]"
            >
              Avataaars by Pablo Stanley
            </a>
          </div>

          <div>
            <label className="field-label">Display name</label>
            <input
              type="text"
              required
              maxLength={60}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="field-input"
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#aebed4] transition hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="primary-button min-h-9 px-5 text-xs"
            >
              {saving ? 'Saving...' : 'Save profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;

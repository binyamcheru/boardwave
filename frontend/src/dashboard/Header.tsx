import React from 'react';
import { FiPlus, FiLogIn, FiMenu } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onOpenCreateModal: () => void;
  onOpenJoinModal: () => void;
  onMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCreateModal, onOpenJoinModal, onMenuToggle }) => {
  const { user } = useAuth();
  const firstName = user?.name ? user.name.split(' ')[0] : 'John';

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3 min-w-0">
        {onMenuToggle && (
          <button
            type="button"
            onClick={onMenuToggle}
            className="mt-0.5 rounded-md border border-[#315475] bg-[#0b2540] p-2.5 text-[#d7e1ed] transition hover:bg-[#123454] lg:hidden"
            aria-label="Open menu"
          >
            <FiMenu className="text-lg" />
          </button>
        )}

        <div className="min-w-0">
          <h1 className="font-display flex items-center gap-2 text-2xl font-bold text-[#f4f8fc] sm:text-3xl">
            <span className="truncate">Welcome back, {firstName}</span>
          </h1>
          <p className="mt-1 text-sm text-[#9eafc3]">
            Pick up where your team left off or start a new board.
          </p>
        </div>
      </div>

      <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-3">
        <button
          onClick={onOpenJoinModal}
          className="secondary-button flex-1 sm:flex-none"
        >
          <FiLogIn className="text-base" />
          <span>Join Room</span>
        </button>

        <button
          onClick={onOpenCreateModal}
          className="primary-button flex-1 px-5 sm:flex-none"
        >
          <FiPlus className="text-lg" />
          <span>Create Room</span>
        </button>
      </div>
    </div>
  );
};

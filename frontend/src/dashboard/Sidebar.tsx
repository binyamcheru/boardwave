import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiSettings,
  FiHome,
  FiLogOut,
  FiX,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { UserAvatar } from '../components/UserAvatar';
import { BrandMark } from '../components/BrandMark';

interface SidebarProps {
  currentSection: string;
  onSelectSection: (section: string) => void;
  onOpenProfile: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  onOpenProfile,
  mobileOpen = false,
  onMobileClose,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    onMobileClose?.();
  };

  const handleSelectSection = (section: string) => {
    onSelectSection(section);
    onMobileClose?.();
  };

  const handleOpenProfile = () => {
    onOpenProfile();
    onMobileClose?.();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
  ];

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col justify-between border-r border-[#183b5d] bg-[#061526] transition-transform duration-300 select-none lg:static lg:z-auto lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          <div className="flex h-16 items-center justify-between px-4 sm:h-20 sm:px-6">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition">
              <BrandMark inverse />
            </Link>

            <button
              type="button"
              onClick={onMobileClose}
              className="rounded-md p-2 text-[#9eafc3] hover:bg-white/10 hover:text-white lg:hidden"
              aria-label="Close sidebar"
            >
              <FiX className="text-lg" />
            </button>
          </div>

          <nav className="px-3 flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectSection(item.id)}
                  className={`flex w-full items-center justify-between rounded-md px-3.5 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-[#0d6efd] text-white'
                      : 'text-[#9eafc3] hover:bg-[#0b2540] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`text-lg ${isActive ? 'text-[#ffdc45]' : ''}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-[#183b5d] p-4">
          <div className="flex items-center justify-between px-2">
            <button
              onClick={handleOpenProfile}
              className="flex items-center gap-2 text-xs text-[#9eafc3] transition hover:text-white"
            >
              <FiSettings className="text-sm" />
              <span>Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition"
              title="Log Out"
            >
              <FiLogOut className="text-sm" />
              <span>Logout</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleOpenProfile}
            className="flex items-center gap-3 rounded-md px-2 py-2 text-left transition hover:bg-[#0b2540]"
          >
            <UserAvatar name={user?.name} avatarUrl={user?.avatarUrl} size={40} />
            <div className="flex flex-col text-left overflow-hidden">
              <span className="truncate text-xs font-semibold text-[#f4f8fc]">
                {user?.name || 'John Doe'}
              </span>
              <span className="truncate text-[10px] text-[#73869c]">
                {user?.email || 'user@boardwave.app'}
              </span>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};

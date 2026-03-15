import React, { useState, useEffect, useCallback } from 'react';
import { FiGrid } from 'react-icons/fi';
import { Oval } from 'react-loader-spinner';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { RoomFilters } from './RoomFilters';
import { RoomCard } from './RoomCard';
import { CreateRoomModal } from './CreateRoomModal';
import { JoinRoomModal } from './JoinRoomModal';
import { RenameRoomModal } from './RenameRoomModal';
import { ProfileModal } from './ProfileModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Toast } from '../components/Toast';
import type { Room, TabType } from './types';

export const Dashboard: React.FC = () => {
  const { token } = useAuth();
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [renameData, setRenameData] = useState<{ id: string; title: string } | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteRoomId, setDeleteRoomId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notice, setNotice] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);

  const fetchRooms = useCallback(async (silent = false) => {
    if (!token) return;
    if (!silent) setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (activeTab !== 'all') queryParams.append('filter', activeTab);
      if (searchQuery.trim()) queryParams.append('search', searchQuery.trim());

      const res = await fetch(`${API_BASE}/api/rooms?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.rooms) {
        setRooms(data.rooms);
      }
    } catch (err) {
      console.error('Failed to load rooms:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [token, activeTab, searchQuery]);

  useEffect(() => {
    void fetchRooms();

    const poll = () => {
      if (document.hidden) return;
      void fetchRooms(true);
    };

    const interval = window.setInterval(poll, 8000);
    const onVisible = () => {
      if (!document.hidden) void fetchRooms(true);
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [fetchRooms]);

  // Handle Delete Room
  const confirmDeleteRoom = async () => {
    if (!deleteRoomId || !token) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/api/rooms/${deleteRoomId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setRooms((prev) => prev.filter((room) => room.id !== deleteRoomId));
        setDeleteRoomId(null);
        setNotice({ message: 'Board deleted successfully.', variant: 'success' });
      } else {
        const data = await res.json();
        setNotice({ message: data.error || 'Failed to delete board.', variant: 'error' });
      }
    } catch (err) {
      console.error('Delete error:', err);
      setNotice({ message: 'Could not delete the board. Please try again.', variant: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Rename Room
  const handleRenameRoom = async (newTitle: string) => {
    if (!renameData || !token) return;

    try {
      const res = await fetch(`${API_BASE}/api/rooms/${renameData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTitle }),
      });

      if (res.ok) {
        setRooms((prev) =>
          prev.map((r) => (r.id === renameData.id ? { ...r, title: newTitle } : r))
        );
      }
    } catch (err) {
      console.error('Rename error:', err);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#071a2f] font-sans text-[#f4f8fc] antialiased">
      <Sidebar
        currentSection={currentSection}
        onSelectSection={setCurrentSection}
        onOpenProfile={() => setShowProfileModal(true)}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
        <Header
          onOpenCreateModal={() => setShowCreateModal(true)}
          onOpenJoinModal={() => setShowJoinModal(true)}
          onMenuToggle={() => setSidebarOpen(true)}
        />

        <RoomFilters
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Room Cards List */}
        <div className="mt-6 flex flex-col gap-3.5">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Oval
                visible={true}
                height="32"
                width="32"
                color="#ffdc45"
                secondaryColor="#274867"
                strokeWidth={4}
                strokeWidthSecondary={4}
                ariaLabel="loading-rooms"
              />
            </div>
          ) : rooms.length > 0 ? (
            rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onDeleteRoom={setDeleteRoomId}
                onRenameRoom={(id, title) => setRenameData({ id, title })}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-[#315475] bg-[#0b2540] py-20 text-center">
              <FiGrid className="mb-3 text-4xl text-[#51a9ff]" />
              <h2 className="font-display text-base font-bold text-[#f4f8fc]">No rooms found</h2>
              <p className="mt-1 mb-4 text-xs text-[#aebed4]">
                Create a new board to start live visual brainstorming.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="primary-button min-h-9 px-4 text-xs"
              >
                Create Room
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <CreateRoomModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
      <JoinRoomModal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} />
      
      <RenameRoomModal
        isOpen={!!renameData}
        currentTitle={renameData?.title || ''}
        onClose={() => setRenameData(null)}
        onRename={handleRenameRoom}
      />
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
      <ConfirmDialog
        isOpen={Boolean(deleteRoomId)}
        title="Delete this board?"
        message="This board and its saved canvas data will be permanently removed. This action cannot be undone."
        confirmLabel="Delete board"
        isLoading={isDeleting}
        onCancel={() => setDeleteRoomId(null)}
        onConfirm={() => void confirmDeleteRoom()}
      />
      <Toast
        message={notice?.message ?? ''}
        variant={notice?.variant}
        onDismiss={() => setNotice(null)}
      />
    </div>
  );
};

export default Dashboard;
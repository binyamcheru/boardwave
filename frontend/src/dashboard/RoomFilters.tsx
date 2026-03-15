import React from 'react';
import { FiSearch } from 'react-icons/fi';
import type { TabType } from './types';

interface RoomFiltersProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const RoomFilters: React.FC<RoomFiltersProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="mt-6 flex flex-col gap-4 border-b border-[#244765] pb-2 sm:mt-8 lg:mt-10 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-4 overflow-x-auto text-sm sm:gap-6 lg:gap-8">
        <button
          onClick={() => setActiveTab('all')}
          className={`shrink-0 pb-3 font-semibold transition relative ${
            activeTab === 'all'
              ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#ffdc45]'
              : 'text-[#8fa3b8] hover:text-white'
          }`}
        >
          All Rooms
        </button>
        <button
          onClick={() => setActiveTab('owned')}
          className={`shrink-0 pb-3 font-semibold transition relative ${
            activeTab === 'owned'
              ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#ffdc45]'
              : 'text-[#8fa3b8] hover:text-white'
          }`}
        >
          Owned by me
        </button>
        <button
          onClick={() => setActiveTab('joined')}
          className={`shrink-0 pb-3 font-semibold transition relative ${
            activeTab === 'joined'
              ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#ffdc45]'
              : 'text-[#8fa3b8] hover:text-white'
          }`}
        >
          Joined
        </button>
      </div>

      <div className="relative mb-2 w-full lg:mb-2 lg:w-80">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-[#73869c]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search rooms..."
          className="field-input h-10 pl-10 text-xs"
        />
      </div>
    </div>
  );
};

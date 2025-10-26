'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TodoList from '@/components/TodoList';

export default function Home() {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSelectGroup = (groupId: number | null) => {
    setSelectedGroupId(groupId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - hidden on mobile, slides in when menu is open */}
      <div
        className={`fixed lg:relative inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:transform-none ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Sidebar
          selectedGroupId={selectedGroupId}
          onSelectGroup={handleSelectGroup}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-lg font-bold">Sealion Todos</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        <TodoList groupId={selectedGroupId} />
      </div>
    </div>
  );
}

'use client';

import { Group } from '@/types';
import { useGroups } from '@/hooks/useApi';
import AddGroupForm from './AddGroupForm';

interface SidebarProps {
  selectedGroupId: number | null;
  onSelectGroup: (groupId: number | null) => void;
}

export default function Sidebar({
  selectedGroupId,
  onSelectGroup,
}: SidebarProps) {
  const { groups, isLoading, isError, mutate } = useGroups();

  if (isLoading) {
    return (
      <div className="w-64 border-r border-gray-200 bg-gray-50 p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-64 border-r border-gray-200 bg-gray-50 p-4">
        <div className="text-red-600 text-sm">Failed to load groups</div>
      </div>
    );
  }

  return (
    <div className="w-64 h-full border-r border-gray-200 bg-gray-50 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-900">Groups</h2>

      {/* All Todos option */}
      <button
        onClick={() => onSelectGroup(null)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
          selectedGroupId === null
            ? 'bg-blue-100 text-blue-900'
            : 'hover:bg-gray-100 text-gray-700'
        }`}
      >
        <span className="text-xl">📋</span>
        <span className="font-medium">All Todos</span>
      </button>

      {/* Groups list */}
      <div className="space-y-1 mb-4">
        {groups?.map((group: Group) => (
          <button
            key={group.id}
            onClick={() => onSelectGroup(group.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              selectedGroupId === group.id
                ? 'bg-blue-100 text-blue-900'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: group.color }}
            ></div>
            <span className="font-medium">{group.name}</span>
          </button>
        ))}
      </div>

      {/* Add group form */}
      <AddGroupForm onGroupAdded={mutate} />
    </div>
  );
}

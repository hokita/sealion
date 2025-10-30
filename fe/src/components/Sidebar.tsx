'use client';

import { useState } from 'react';
import { Group } from '@/types';
import { useGroups } from '@/hooks/useApi';
import AddGroupForm from './AddGroupForm';
import EditGroupForm from './EditGroupForm';
import GroupIcon from './GroupIcon';
import { Pencil } from 'lucide-react';

interface SidebarProps {
  selectedGroupId: number | null;
  onSelectGroup: (groupId: number | null) => void;
}

export default function Sidebar({
  selectedGroupId,
  onSelectGroup,
}: SidebarProps) {
  const { groups, isLoading, isError, mutate } = useGroups();
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

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
          <div
            key={group.id}
            className={`group/item w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              selectedGroupId === group.id
                ? 'bg-blue-100 text-blue-900'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <button
              onClick={() => onSelectGroup(group.id)}
              className="flex items-center gap-3 flex-1 min-w-0"
            >
              <div style={{ color: group.color }}>
                <GroupIcon iconName={group.icon} className="w-5 h-5" />
              </div>
              <span className="font-medium truncate">{group.name}</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingGroup(group);
              }}
              className="md:opacity-0 md:group-hover/item:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity"
              title="Edit group"
            >
              <Pencil className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        ))}
      </div>

      {/* Add group form */}
      <AddGroupForm onGroupAdded={mutate} />

      {/* Edit group modal */}
      {editingGroup && (
        <EditGroupForm
          group={editingGroup}
          onGroupUpdated={() => {
            mutate();
            setEditingGroup(null);
          }}
          onCancel={() => setEditingGroup(null)}
        />
      )}
    </div>
  );
}

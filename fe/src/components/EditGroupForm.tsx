'use client';

import { useState } from 'react';
import { updateGroup } from '@/lib/api';
import { Group } from '@/types';
import GroupIcon from './GroupIcon';

interface EditGroupFormProps {
  group: Group;
  onGroupUpdated: () => void;
  onCancel: () => void;
}

const COLORS = [
  { name: 'Red', value: '#EF4444' },
  { name: 'Orange', value: '#F59E0B' },
  { name: 'Yellow', value: '#EAB308' },
  { name: 'Green', value: '#10B981' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Gray', value: '#6B7280' },
];

const ICONS = [
  'inbox',
  'shopping-cart',
  'book',
  'briefcase',
  'user',
  'heart',
  'star',
  'home',
  'calendar',
  'folder',
  'flag',
  'target',
  'trophy',
  'music',
  'camera',
  'coffee',
  'gamepad',
  'gift',
  'plane',
  'tag',
  'bell',
  'clock',
  'check-circle',
  'code',
];

export default function EditGroupForm({
  group,
  onGroupUpdated,
  onCancel,
}: EditGroupFormProps) {
  const [name, setName] = useState(group.name);
  const [color, setColor] = useState(group.color);
  const [icon, setIcon] = useState(group.icon);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await updateGroup(group.id, {
        name: name.trim(),
        color,
        icon,
      });
      onGroupUpdated();
    } catch (error) {
      console.error('Failed to update group:', error);
      alert('Failed to update group. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md border-2 border-gray-300 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Edit Group</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Group name"
              className="w-full px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-8 h-8 rounded-full ${
                    color === c.value
                      ? 'ring-2 ring-offset-2 ring-blue-500'
                      : ''
                  }`}
                  style={{ backgroundColor: c.value }}
                  disabled={isSubmitting}
                  title={c.name}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2">Icon</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={`w-9 h-9 flex items-center justify-center rounded border transition-colors ${
                    icon === i
                      ? 'border-blue-500 bg-blue-50 border-2'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  disabled={isSubmitting}
                  title={i}
                >
                  <GroupIcon iconName={i} className="w-5 h-5 text-gray-700" />
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

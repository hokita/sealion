'use client';

import { useState } from 'react';
import { createGroup } from '@/lib/api';

interface AddGroupFormProps {
  onGroupAdded: () => void;
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
];

export default function AddGroupForm({ onGroupAdded }: AddGroupFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0].value);
  const [icon, setIcon] = useState(ICONS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await createGroup(name.trim(), color, icon);
      setName('');
      setColor(COLORS[0].value);
      setIcon(ICONS[0]);
      setIsOpen(false);
      onGroupAdded();
    } catch (error) {
      console.error('Failed to create group:', error);
      alert('Failed to create group. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      >
        + New Group
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded-lg">
      <div className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Group name"
          className="w-full px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
          autoFocus
        />
        <div>
          <label className="block text-xs text-gray-600 mb-1">Color</label>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setColor(c.value)}
                className={`w-6 h-6 rounded-full ${
                  color === c.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                }`}
                style={{ backgroundColor: c.value }}
                disabled={isSubmitting}
              />
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Icon</label>
          <select
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            {ICONS.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setName('');
              setColor(COLORS[0].value);
              setIcon(ICONS[0]);
            }}
            disabled={isSubmitting}
            className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}

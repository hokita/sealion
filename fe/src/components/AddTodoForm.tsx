'use client';

import { useState } from 'react';
import { useGroups } from '@/hooks/useApi';
import { createTodo } from '@/lib/api';

interface AddTodoFormProps {
  selectedGroupId: number | null;
  onTodoAdded: () => void;
}

export default function AddTodoForm({
  selectedGroupId,
  onTodoAdded,
}: AddTodoFormProps) {
  const [title, setTitle] = useState('');
  const [groupId, setGroupId] = useState<number>(selectedGroupId || 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { groups } = useGroups();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await createTodo(title.trim(), groupId);
      setTitle('');
      onTodoAdded();
    } catch (error) {
      console.error('Failed to create todo:', error);
      alert('Failed to create todo. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isSubmitting}
        />
        <div className="flex gap-2 sm:gap-3">
          <select
            value={groupId}
            onChange={(e) => setGroupId(Number(e.target.value))}
            className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
          >
            {groups?.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={isSubmitting || !title.trim()}
            className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>
    </form>
  );
}

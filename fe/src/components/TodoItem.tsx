'use client';

import { useState } from 'react';
import { Todo } from '@/types';
import { updateTodo } from '@/lib/api';

interface TodoItemProps {
  todo: Todo;
  onTodoUpdated: () => void;
}

export default function TodoItem({ todo, onTodoUpdated }: TodoItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    setIsUpdating(true);
    try {
      await updateTodo(todo.id, { completed: !todo.completed });
      onTodoUpdated();
    } catch (error) {
      console.error('Failed to update todo:', error);
      alert('Failed to update todo. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        disabled={isUpdating}
        className="w-5 h-5 text-blue-600 rounded cursor-pointer disabled:cursor-not-allowed"
      />
      <span
        className={`flex-1 ${
          todo.completed ? 'line-through text-gray-400' : 'text-gray-900'
        }`}
      >
        {todo.title}
      </span>
      {todo.completed && (
        <span className="text-xs text-green-600 font-medium">✓ Done</span>
      )}
    </div>
  );
}

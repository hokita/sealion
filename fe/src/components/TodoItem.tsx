'use client';

import { useState } from 'react';
import { Todo } from '@/types';
import { updateTodo, deleteTodo } from '@/lib/api';

interface TodoItemProps {
  todo: Todo;
  onTodoUpdated: () => void;
}

export default function TodoItem({ todo, onTodoUpdated }: TodoItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this todo?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteTodo(todo.id);
      onTodoUpdated();
    } catch (error) {
      console.error('Failed to delete todo:', error);
      alert('Failed to delete todo. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        disabled={isUpdating || isDeleting}
        className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 rounded cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
      />
      <span
        className={`flex-1 text-sm sm:text-base ${
          todo.completed ? 'line-through text-gray-400' : 'text-gray-900'
        }`}
      >
        {todo.title}
      </span>
      {todo.completed && (
        <span className="text-xs text-green-600 font-medium flex-shrink-0">
          ✓ Done
        </span>
      )}
      <button
        onClick={handleDelete}
        disabled={isUpdating || isDeleting}
        className="text-gray-400 hover:text-red-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50 flex-shrink-0"
        aria-label="Delete todo"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}

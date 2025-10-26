'use client';

import { Todo } from '@/types';

interface TodoItemProps {
  todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
      <input
        type="checkbox"
        checked={todo.completed}
        readOnly
        className="w-5 h-5 text-blue-600 rounded cursor-not-allowed"
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

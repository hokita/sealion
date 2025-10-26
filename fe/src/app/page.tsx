'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TodoList from '@/components/TodoList';

export default function Home() {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  return (
    <div className="flex h-screen bg-white">
      <Sidebar
        selectedGroupId={selectedGroupId}
        onSelectGroup={setSelectedGroupId}
      />
      <TodoList groupId={selectedGroupId} />
    </div>
  );
}

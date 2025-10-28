'use client';

import { useTodos, useGroupTodos, useGroup } from '@/hooks/useApi';
import TodoItem from './TodoItem';
import AddTodoForm from './AddTodoForm';
import GroupIcon from './GroupIcon';

interface TodoListProps {
  groupId: number | null;
}

export default function TodoList({ groupId }: TodoListProps) {
  const { todos: allTodos, isLoading: allLoading, mutate: mutateAll } = useTodos();
  const { todos: groupTodos, isLoading: groupLoading, mutate: mutateGroup } = useGroupTodos(groupId);
  const { group } = useGroup(groupId);

  const todos = groupId ? groupTodos : allTodos;
  const isLoading = groupId ? groupLoading : allLoading;

  const handleRefresh = () => {
    mutateAll();
    if (groupId) {
      mutateGroup();
    }
  };

  const title = groupId && group ? group.name : 'All Todos';

  if (isLoading) {
    return (
      <div className="flex-1 p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          {groupId && group && (
            <div className="flex-shrink-0" style={{ color: group.color }}>
              <GroupIcon iconName={group.icon} className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
        </div>

        <AddTodoForm selectedGroupId={groupId} onTodoAdded={handleRefresh} />

        {!todos || todos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No todos yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onTodoUpdated={handleRefresh} />
            ))}
          </div>
        )}

        <div className="mt-6 text-sm text-gray-500">
          {todos && (
            <>
              Total: {todos.length} todo{todos.length !== 1 && 's'}
              {' · '}
              Completed: {todos.filter((t) => t.completed).length}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

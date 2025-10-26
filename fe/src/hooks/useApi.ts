import useSWR from 'swr';
import { Group, Todo } from '@/types';
import {
  fetchGroups,
  fetchTodos,
  fetchGroupTodos,
  fetchGroupById,
} from '@/lib/api';

export function useGroups() {
  const { data, error, isLoading, mutate } = useSWR<Group[]>(
    '/api/groups',
    fetchGroups
  );

  return {
    groups: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useGroup(id: number | null) {
  const { data, error, isLoading } = useSWR<Group>(
    id ? `/api/groups/${id}` : null,
    () => (id ? fetchGroupById(id) : null)
  );

  return {
    group: data,
    isLoading,
    isError: error,
  };
}

export function useTodos() {
  const { data, error, isLoading, mutate } = useSWR<Todo[]>(
    '/api/todos',
    fetchTodos
  );

  return {
    todos: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useGroupTodos(groupId: number | null) {
  const { data, error, isLoading, mutate } = useSWR<Todo[]>(
    groupId ? `/api/groups/${groupId}/todos` : null,
    () => (groupId ? fetchGroupTodos(groupId) : null)
  );

  return {
    todos: data,
    isLoading,
    isError: error,
    mutate,
  };
}

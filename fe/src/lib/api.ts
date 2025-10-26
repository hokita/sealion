import axios from 'axios';
import { Group, Todo } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Groups API
export const fetchGroups = async (): Promise<Group[]> => {
  const response = await apiClient.get<Group[]>('/api/groups');
  return response.data;
};

export const fetchGroupById = async (id: number): Promise<Group> => {
  const response = await apiClient.get<Group>(`/api/groups/${id}`);
  return response.data;
};

export const fetchGroupTodos = async (id: number): Promise<Todo[]> => {
  const response = await apiClient.get<Todo[]>(`/api/groups/${id}/todos`);
  return response.data;
};

// Todos API
export const fetchTodos = async (): Promise<Todo[]> => {
  const response = await apiClient.get<Todo[]>('/api/todos');
  return response.data;
};

export const fetchTodoById = async (id: number): Promise<Todo> => {
  const response = await apiClient.get<Todo>(`/api/todos/${id}`);
  return response.data;
};

export default apiClient;

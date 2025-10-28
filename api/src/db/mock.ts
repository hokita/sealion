// Mock database for development
// This simulates MySQL database operations without requiring a real DB connection

import { GROUPS } from '../constants/groups';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  groupId: number;
  createdAt: Date;
  updatedAt: Date;
}

class MockDatabase {
  private todos: Todo[] = [
    {
      id: 1,
      title: 'Buy groceries',
      completed: false,
      groupId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      title: 'Buy milk and eggs',
      completed: true,
      groupId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      title: 'Read Chapter 5',
      completed: false,
      groupId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 4,
      title: 'Complete math homework',
      completed: false,
      groupId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 5,
      title: 'Prepare presentation',
      completed: true,
      groupId: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 6,
      title: 'Review project proposal',
      completed: false,
      groupId: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 7,
      title: 'Call dentist',
      completed: false,
      groupId: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 8,
      title: 'Schedule car maintenance',
      completed: false,
      groupId: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  private currentTodoId = 9;

  // Todo methods
  async getAllTodos(): Promise<Todo[]> {
    return [...this.todos];
  }

  async getTodoById(id: number): Promise<Todo | undefined> {
    return this.todos.find((todo) => todo.id === id);
  }

  async getTodosByGroupId(groupId: number): Promise<Todo[]> {
    return this.todos.filter((todo) => todo.groupId === groupId);
  }

  async createTodo(title: string, groupId: number): Promise<Todo | null> {
    // Validate groupId exists
    const groupExists = GROUPS.some((group) => group.id === groupId);
    if (!groupExists) {
      return null;
    }

    const now = new Date();
    const todo: Todo = {
      id: this.currentTodoId++,
      title,
      completed: false,
      groupId,
      createdAt: now,
      updatedAt: now,
    };
    this.todos.push(todo);
    return todo;
  }

  async updateTodo(
    id: number,
    updates: Partial<Omit<Todo, 'id' | 'createdAt'>>
  ): Promise<Todo | undefined> {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index === -1) {
      return undefined;
    }
    // Validate groupId if it's being updated
    if (updates.groupId !== undefined) {
      const groupExists = GROUPS.some(
        (group) => group.id === updates.groupId
      );
      if (!groupExists) {
        return undefined;
      }
    }
    this.todos[index] = {
      ...this.todos[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.todos[index];
  }

  async deleteTodo(id: number): Promise<boolean> {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index === -1) {
      return false;
    }
    this.todos.splice(index, 1);
    return true;
  }

  // Reset database (useful for testing)
  reset(): void {
    this.todos = [];
    this.currentTodoId = 1;
  }
}

export const db = new MockDatabase();

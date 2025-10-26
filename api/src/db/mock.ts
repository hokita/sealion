// Mock database for development
// This simulates MySQL database operations without requiring a real DB connection

export interface Group {
  id: number;
  name: string;
  color: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  groupId: number;
  createdAt: Date;
  updatedAt: Date;
}

class MockDatabase {
  private groups: Group[] = [
    {
      id: 1,
      name: 'Uncategorized',
      color: '#6B7280',
      icon: 'inbox',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: 'Shopping',
      color: '#10B981',
      icon: 'shopping-cart',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      name: 'Study',
      color: '#3B82F6',
      icon: 'book',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 4,
      name: 'Work',
      color: '#F59E0B',
      icon: 'briefcase',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 5,
      name: 'Personal',
      color: '#8B5CF6',
      icon: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  private todos: Todo[] = [];
  private currentTodoId = 1;
  private currentGroupId = 6;

  // Group methods
  async getAllGroups(): Promise<Group[]> {
    return [...this.groups];
  }

  async getGroupById(id: number): Promise<Group | undefined> {
    return this.groups.find((group) => group.id === id);
  }

  async createGroup(name: string, color: string, icon: string): Promise<Group> {
    const now = new Date();
    const group: Group = {
      id: this.currentGroupId++,
      name,
      color,
      icon,
      createdAt: now,
      updatedAt: now,
    };
    this.groups.push(group);
    return group;
  }

  async updateGroup(
    id: number,
    updates: Partial<Omit<Group, 'id' | 'createdAt'>>
  ): Promise<Group | undefined> {
    const index = this.groups.findIndex((group) => group.id === id);
    if (index === -1) {
      return undefined;
    }
    this.groups[index] = {
      ...this.groups[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.groups[index];
  }

  async deleteGroup(id: number): Promise<boolean> {
    // Check if group has todos (simulating RESTRICT constraint)
    const hasTodos = this.todos.some((todo) => todo.groupId === id);
    if (hasTodos) {
      return false;
    }
    const index = this.groups.findIndex((group) => group.id === id);
    if (index === -1) {
      return false;
    }
    this.groups.splice(index, 1);
    return true;
  }

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
    const groupExists = this.groups.some((group) => group.id === groupId);
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
      const groupExists = this.groups.some(
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
    this.groups = [
      {
        id: 1,
        name: 'Uncategorized',
        color: '#6B7280',
        icon: 'inbox',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Shopping',
        color: '#10B981',
        icon: 'shopping-cart',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: 'Study',
        color: '#3B82F6',
        icon: 'book',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        name: 'Work',
        color: '#F59E0B',
        icon: 'briefcase',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        name: 'Personal',
        color: '#8B5CF6',
        icon: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    this.currentTodoId = 1;
    this.currentGroupId = 6;
  }
}

export const db = new MockDatabase();

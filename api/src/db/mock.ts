// Mock database for development
// This simulates MySQL database operations without requiring a real DB connection

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

class MockDatabase {
  private todos: Todo[] = [];
  private currentId = 1;

  async getAllTodos(): Promise<Todo[]> {
    return [...this.todos];
  }

  async getTodoById(id: number): Promise<Todo | undefined> {
    return this.todos.find((todo) => todo.id === id);
  }

  async createTodo(title: string): Promise<Todo> {
    const now = new Date();
    const todo: Todo = {
      id: this.currentId++,
      title,
      completed: false,
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
    this.currentId = 1;
  }
}

export const db = new MockDatabase();

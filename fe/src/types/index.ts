export interface Group {
  id: number;
  name: string;
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  groupId: number;
  createdAt: string;
  updatedAt: string;
}

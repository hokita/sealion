export interface Group {
  id: number;
  name: string;
  color: string;
  icon: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  groupId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getPool } from './connection';
import { GROUPS } from '../constants/groups';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  groupId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface TodoRow extends RowDataPacket {
  id: number;
  title: string;
  completed: number;
  group: string;
  created_at: Date;
  updated_at: Date;
}

const mapRowToTodo = (row: TodoRow): Todo => {
  const group = GROUPS.find((g) => g.name === row.group);
  return {
    id: row.id,
    title: row.title,
    completed: Boolean(row.completed),
    groupId: group?.id || 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const getGroupNameById = (groupId: number): string => {
  const group = GROUPS.find((g) => g.id === groupId);
  return group?.name || 'Uncategorized';
};

export const getAllTodos = async (): Promise<Todo[]> => {
  const pool = getPool();
  const [rows] = await pool.query<TodoRow[]>(
    'SELECT * FROM sealion_todos ORDER BY created_at DESC'
  );
  return rows.map(mapRowToTodo);
};

export const getTodoById = async (id: number): Promise<Todo | null> => {
  const pool = getPool();
  const [rows] = await pool.query<TodoRow[]>(
    'SELECT * FROM sealion_todos WHERE id = ?',
    [id]
  );
  return rows.length > 0 ? mapRowToTodo(rows[0]) : null;
};

export const getTodosByGroupId = async (groupId: number): Promise<Todo[]> => {
  const pool = getPool();
  const groupName = getGroupNameById(groupId);
  const [rows] = await pool.query<TodoRow[]>(
    'SELECT * FROM sealion_todos WHERE `group` = ? ORDER BY created_at DESC',
    [groupName]
  );
  return rows.map(mapRowToTodo);
};

export const createTodo = async (
  title: string,
  groupId: number
): Promise<Todo | null> => {
  // Validate groupId exists
  const group = GROUPS.find((g) => g.id === groupId);
  if (!group) {
    return null;
  }

  const pool = getPool();
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO sealion_todos (title, completed, `group`) VALUES (?, ?, ?)',
    [title, false, group.name]
  );

  const newTodo = await getTodoById(result.insertId);
  return newTodo;
};

export const updateTodo = async (
  id: number,
  updates: { title?: string; completed?: boolean; groupId?: number }
): Promise<Todo | null> => {
  // Validate groupId if it's being updated
  if (updates.groupId !== undefined) {
    const group = GROUPS.find((g) => g.id === updates.groupId);
    if (!group) {
      return null;
    }
  }

  const pool = getPool();
  const setClauses: string[] = [];
  const values: any[] = [];

  if (updates.title !== undefined) {
    setClauses.push('title = ?');
    values.push(updates.title);
  }

  if (updates.completed !== undefined) {
    setClauses.push('completed = ?');
    values.push(updates.completed);
  }

  if (updates.groupId !== undefined) {
    const groupName = getGroupNameById(updates.groupId);
    setClauses.push('`group` = ?');
    values.push(groupName);
  }

  if (setClauses.length === 0) {
    return getTodoById(id);
  }

  values.push(id);

  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE sealion_todos SET ${setClauses.join(', ')} WHERE id = ?`,
    values
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return getTodoById(id);
};

export const deleteTodo = async (id: number): Promise<boolean> => {
  const pool = getPool();
  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM sealion_todos WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};

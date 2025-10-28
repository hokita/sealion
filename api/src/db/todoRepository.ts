import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getPool } from './connection';
import { Todo } from '../types';

interface TodoRow extends RowDataPacket {
  id: number;
  title: string;
  completed: number;
  group_id: number;
  created_at: Date;
  updated_at: Date;
}

const mapRowToTodo = (row: TodoRow): Todo => {
  return {
    id: row.id,
    title: row.title,
    completed: Boolean(row.completed),
    groupId: row.group_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
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
  const [rows] = await pool.query<TodoRow[]>(
    'SELECT * FROM sealion_todos WHERE group_id = ? ORDER BY created_at DESC',
    [groupId]
  );
  return rows.map(mapRowToTodo);
};

export const createTodo = async (
  title: string,
  groupId: number
): Promise<Todo | null> => {
  const pool = getPool();
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO sealion_todos (title, completed, group_id) VALUES (?, ?, ?)',
      [title, false, groupId]
    );
    const newTodo = await getTodoById(result.insertId);
    return newTodo;
  } catch (_error) {
    // Foreign key constraint will fail if groupId doesn't exist
    return null;
  }
};

export const updateTodo = async (
  id: number,
  updates: { title?: string; completed?: boolean; groupId?: number }
): Promise<Todo | null> => {
  const pool = getPool();
  const setClauses: string[] = [];
  const values: (string | boolean | number)[] = [];

  if (updates.title !== undefined) {
    setClauses.push('title = ?');
    values.push(updates.title);
  }

  if (updates.completed !== undefined) {
    setClauses.push('completed = ?');
    values.push(updates.completed);
  }

  if (updates.groupId !== undefined) {
    setClauses.push('group_id = ?');
    values.push(updates.groupId);
  }

  if (setClauses.length === 0) {
    return getTodoById(id);
  }

  values.push(id);

  try {
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE sealion_todos SET ${setClauses.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return getTodoById(id);
  } catch (_error) {
    // Foreign key constraint will fail if groupId doesn't exist
    return null;
  }
};

export const deleteTodo = async (id: number): Promise<boolean> => {
  const pool = getPool();
  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM sealion_todos WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};

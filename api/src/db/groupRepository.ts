import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getPool } from './connection';
import { Group } from '../types';

interface GroupRow extends RowDataPacket {
  id: number;
  name: string;
  color: string;
  icon: string;
  created_at: Date;
  updated_at: Date;
}

const mapRowToGroup = (row: GroupRow): Group => {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    icon: row.icon,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

export const getAllGroups = async (): Promise<Group[]> => {
  const pool = getPool();
  const [rows] = await pool.query<GroupRow[]>(
    'SELECT * FROM sealion_groups ORDER BY id ASC'
  );
  return rows.map(mapRowToGroup);
};

export const getGroupById = async (id: number): Promise<Group | null> => {
  const pool = getPool();
  const [rows] = await pool.query<GroupRow[]>(
    'SELECT * FROM sealion_groups WHERE id = ?',
    [id]
  );
  return rows.length > 0 ? mapRowToGroup(rows[0]) : null;
};

export const getGroupByName = async (name: string): Promise<Group | null> => {
  const pool = getPool();
  const [rows] = await pool.query<GroupRow[]>(
    'SELECT * FROM sealion_groups WHERE name = ?',
    [name]
  );
  return rows.length > 0 ? mapRowToGroup(rows[0]) : null;
};

export const createGroup = async (
  name: string,
  color: string,
  icon: string
): Promise<Group> => {
  const pool = getPool();
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO sealion_groups (name, color, icon) VALUES (?, ?, ?)',
    [name, color, icon]
  );
  const [rows] = await pool.query<GroupRow[]>(
    'SELECT * FROM sealion_groups WHERE id = ?',
    [result.insertId]
  );
  return mapRowToGroup(rows[0]);
};

export const updateGroup = async (
  id: number,
  updates: { name?: string; color?: string; icon?: string }
): Promise<Group | null> => {
  const pool = getPool();
  const fields: string[] = [];
  const values: any[] = [];

  if (updates.name !== undefined) {
    fields.push('name = ?');
    values.push(updates.name);
  }
  if (updates.color !== undefined) {
    fields.push('color = ?');
    values.push(updates.color);
  }
  if (updates.icon !== undefined) {
    fields.push('icon = ?');
    values.push(updates.icon);
  }

  if (fields.length === 0) {
    return getGroupById(id);
  }

  values.push(id);
  await pool.query(
    `UPDATE sealion_groups SET ${fields.join(', ')} WHERE id = ?`,
    values
  );

  return getGroupById(id);
};

export const deleteGroup = async (id: number): Promise<boolean> => {
  const pool = getPool();
  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM sealion_groups WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};

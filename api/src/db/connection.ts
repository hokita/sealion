import mysql from 'mysql2/promise';
import { dbConfig } from '../config/database';

let pool: mysql.Pool | null = null;

export const getPool = (): mysql.Pool => {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
};

// For testing: allow setting a custom pool
export const setPool = (customPool: mysql.Pool): void => {
  pool = customPool;
};

export const closePool = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = null;
  }
};

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await getPool().getConnection();
    await connection.ping();
    connection.release();
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

import Database from 'better-sqlite3';
import mysql from 'mysql2/promise';

let testDb: Database.Database | null = null;
let mockPool: mysql.Pool | null = null;

export const setupTestDatabase = (): mysql.Pool => {
  // Create in-memory SQLite database
  testDb = new Database(':memory:');

  // Create tables matching MySQL schema
  testDb.exec(`
    CREATE TABLE IF NOT EXISTS sealion_groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      color TEXT NOT NULL,
      icon TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sealion_todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      group_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (group_id) REFERENCES sealion_groups(id)
    );
  `);

  // Insert default groups
  const insertGroup = testDb.prepare(
    'INSERT INTO sealion_groups (name, color, icon) VALUES (?, ?, ?)'
  );
  insertGroup.run('Uncategorized', '#6B7280', 'Inbox');
  insertGroup.run('Work', '#3B82F6', 'Briefcase');
  insertGroup.run('Personal', '#10B981', 'User');
  insertGroup.run('Shopping', '#F59E0B', 'ShoppingCart');
  insertGroup.run('Health', '#EF4444', 'Heart');

  // Create a mock pool that adapts SQLite to mysql2 interface
  mockPool = {
    query: async (sql: string, params?: unknown[]) => {
      try {
        const normalizedSql = sql.trim();

        // Handle DELETE queries
        if (normalizedSql.startsWith('DELETE')) {
          const stmt = testDb!.prepare(sql);
          const result = params ? stmt.run(...params) : stmt.run();
          return [{ affectedRows: result.changes }, []];
        }

        // Handle INSERT queries
        if (normalizedSql.startsWith('INSERT')) {
          // Convert boolean to integer for SQLite
          const convertedParams = params?.map((param) =>
            typeof param === 'boolean' ? (param ? 1 : 0) : param
          );
          const stmt = testDb!.prepare(sql);
          const result = convertedParams
            ? stmt.run(...convertedParams)
            : stmt.run();
          return [
            { insertId: result.lastInsertRowid, affectedRows: result.changes },
            [],
          ];
        }

        // Handle UPDATE queries
        if (normalizedSql.startsWith('UPDATE')) {
          // Convert boolean to integer for SQLite
          const convertedParams = params?.map((param) =>
            typeof param === 'boolean' ? (param ? 1 : 0) : param
          );
          const stmt = testDb!.prepare(sql);
          const result = convertedParams
            ? stmt.run(...convertedParams)
            : stmt.run();
          return [{ affectedRows: result.changes }, []];
        }

        // Handle SELECT queries
        if (normalizedSql.startsWith('SELECT')) {
          const stmt = testDb!.prepare(sql);
          const rows = params ? stmt.all(...params) : stmt.all();

          // Convert SQLite integer booleans to JavaScript booleans for completed field
          const convertedRows = (rows as Record<string, unknown>[]).map(
            (row) => {
              if ('completed' in row) {
                return { ...row, completed: row.completed === 1 };
              }
              return row;
            }
          );

          return [convertedRows, []];
        }

        throw new Error(`Unsupported SQL operation: ${sql}`);
      } catch (error: unknown) {
        // Convert SQLite constraint errors to MySQL-like errors
        if (
          error instanceof Error &&
          error.message?.includes('FOREIGN KEY constraint failed')
        ) {
          throw new Error('Foreign key constraint failed');
        }
        throw error;
      }
    },
    getConnection: async () =>
      ({
        ping: async () => {},
        release: () => {},
      }) as mysql.PoolConnection,
    end: async () => {
      if (testDb) {
        testDb.close();
        testDb = null;
      }
    },
  } as unknown as mysql.Pool;

  return mockPool;
};

export const cleanupTestDatabase = async (): Promise<void> => {
  if (mockPool) {
    await mockPool.end();
    mockPool = null;
  }
};

export const clearTestData = async (): Promise<void> => {
  if (testDb) {
    testDb.exec('DELETE FROM sealion_todos');
  }
};

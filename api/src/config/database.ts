import dotenv from 'dotenv';

dotenv.config();

export const dbConfig = {
  host: process.env.DB_ENDPOINT?.split(':')[0] || 'localhost',
  port: parseInt(process.env.DB_ENDPOINT?.split(':')[1] || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sealion',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

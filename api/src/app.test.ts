import request from 'supertest';
import app from './app';
import { getPool } from './db/connection';

describe('API Server', () => {
  beforeEach(async () => {
    // Clean up database before each test
    const pool = getPool();
    await pool.query('DELETE FROM sealion_todos');
  });

  it('should respond to health check', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('should respond with API info at root', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
  });
});

describe('Groups API', () => {
  it('should get groups from database', async () => {
    const response = await request(app).get('/api/groups');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(5);
    expect(response.body[0]).toHaveProperty('name', 'Uncategorized');
    expect(response.body[0]).toHaveProperty('id', 1);
    expect(response.body[0]).toHaveProperty('color');
    expect(response.body[0]).toHaveProperty('icon');
  });
});

describe('Todos API', () => {
  beforeEach(async () => {
    const pool = getPool();
    await pool.query('DELETE FROM sealion_todos');
  });

  it('should get empty todos list initially', async () => {
    const response = await request(app).get('/api/todos');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });

  it('should create a new todo with group', async () => {
    const response = await request(app)
      .post('/api/todos')
      .send({ title: 'Test todo', groupId: 1 });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('title', 'Test todo');
    expect(response.body).toHaveProperty('completed', false);
    expect(response.body).toHaveProperty('groupId', 1);
  });

  it('should not create todo with invalid groupId', async () => {
    const response = await request(app)
      .post('/api/todos')
      .send({ title: 'Test todo', groupId: 999 });
    expect(response.status).toBe(400);
  });

  it('should update todo group', async () => {
    const createResponse = await request(app)
      .post('/api/todos')
      .send({ title: 'Test todo', groupId: 1 });
    const todoId = createResponse.body.id;

    const response = await request(app)
      .put(`/api/todos/${todoId}`)
      .send({ groupId: 2 });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('groupId', 2);
  });
});

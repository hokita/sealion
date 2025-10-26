import request from 'supertest';
import app from './app';
import { db } from './db/mock';

describe('API Server', () => {
  beforeEach(() => {
    db.reset();
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
  beforeEach(() => {
    db.reset();
  });

  it('should get default groups', async () => {
    const response = await request(app).get('/api/groups');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(5);
    expect(response.body[0]).toHaveProperty('name', 'Uncategorized');
  });

  it('should create a new group', async () => {
    const response = await request(app).post('/api/groups').send({
      name: 'Fitness',
      color: '#EF4444',
      icon: 'dumbbell',
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name', 'Fitness');
    expect(response.body).toHaveProperty('color', '#EF4444');
    expect(response.body).toHaveProperty('icon', 'dumbbell');
  });

  it('should get a group by id', async () => {
    const response = await request(app).get('/api/groups/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'Uncategorized');
  });

  it('should update a group', async () => {
    const response = await request(app)
      .put('/api/groups/1')
      .send({ name: 'General' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'General');
  });

  it('should not delete group with todos', async () => {
    await request(app)
      .post('/api/todos')
      .send({ title: 'Test todo', groupId: 1 });
    const response = await request(app).delete('/api/groups/1');
    expect(response.status).toBe(400);
  });
});

describe('Todos API', () => {
  beforeEach(() => {
    db.reset();
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

  it('should get todos for a group', async () => {
    await request(app)
      .post('/api/todos')
      .send({ title: 'Shopping todo', groupId: 2 });
    await request(app)
      .post('/api/todos')
      .send({ title: 'Study todo', groupId: 3 });

    const response = await request(app).get('/api/groups/2/todos');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty('title', 'Shopping todo');
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

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import todoRoutes from './routes/todoRoutes';
import { GROUPS } from './constants/groups';
import { getTodosByGroupId } from './controllers/todoController';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Sealion API - Todo List Application' });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Simple read-only groups endpoint
app.get('/api/groups', (req: Request, res: Response) => {
  res.json(GROUPS);
});

app.get('/api/groups/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const group = GROUPS.find((g) => g.id === id);
  if (!group) {
    return res.status(404).json({ error: 'Group not found' });
  }
  res.json(group);
});

app.get('/api/groups/:id/todos', getTodosByGroupId);

app.use('/api/todos', todoRoutes);

export default app;

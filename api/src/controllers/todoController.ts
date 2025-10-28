import { Request, Response } from 'express';
import * as todoRepository from '../db/todoRepository';

export const getAllTodos = async (req: Request, res: Response) => {
  try {
    const todos = await todoRepository.getAllTodos();
    res.json(todos);
  } catch (_error) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
};

export const getTodoById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const todo = await todoRepository.getTodoById(id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo);
  } catch (_error) {
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
};

export const getTodosByGroupId = async (req: Request, res: Response) => {
  try {
    const groupId = parseInt(req.params.id);
    if (isNaN(groupId)) {
      return res.status(400).json({ error: 'Invalid group ID' });
    }
    const todos = await todoRepository.getTodosByGroupId(groupId);
    res.json(todos);
  } catch (_error) {
    res.status(500).json({ error: 'Failed to fetch todos for group' });
  }
};

export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, groupId } = req.body;
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!groupId || typeof groupId !== 'number') {
      return res.status(400).json({ error: 'Group ID is required' });
    }
    const todo = await todoRepository.createTodo(title, groupId);
    if (!todo) {
      return res.status(400).json({ error: 'Invalid group ID' });
    }
    res.status(201).json(todo);
  } catch (_error) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { title, completed, groupId } = req.body;
    const updates: { title?: string; completed?: boolean; groupId?: number } =
      {};
    if (title !== undefined) updates.title = title;
    if (completed !== undefined) updates.completed = completed;
    if (groupId !== undefined) updates.groupId = groupId;

    const todo = await todoRepository.updateTodo(id, updates);
    if (!todo) {
      return res
        .status(404)
        .json({ error: 'Todo not found or invalid group ID' });
    }
    res.json(todo);
  } catch (_error) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const success = await todoRepository.deleteTodo(id);
    if (!success) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(204).send();
  } catch (_error) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
};

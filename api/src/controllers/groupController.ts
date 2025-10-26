import { Request, Response } from 'express';
import { db } from '../db/mock';

export const getAllGroups = async (req: Request, res: Response) => {
  try {
    const groups = await db.getAllGroups();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
};

export const getGroupById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const group = await db.getGroupById(id);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch group' });
  }
};

export const createGroup = async (req: Request, res: Response) => {
  try {
    const { name, color, icon } = req.body;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!color || typeof color !== 'string') {
      return res.status(400).json({ error: 'Color is required' });
    }
    if (!icon || typeof icon !== 'string') {
      return res.status(400).json({ error: 'Icon is required' });
    }
    const group = await db.createGroup(name, color, icon);
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create group' });
  }
};

export const updateGroup = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, color, icon } = req.body;
    const updates: { name?: string; color?: string; icon?: string } = {};
    if (name !== undefined) updates.name = name;
    if (color !== undefined) updates.color = color;
    if (icon !== undefined) updates.icon = icon;

    const group = await db.updateGroup(id, updates);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update group' });
  }
};

export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const success = await db.deleteGroup(id);
    if (!success) {
      return res
        .status(400)
        .json({ error: 'Cannot delete group with existing todos' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete group' });
  }
};

export const getGroupTodos = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const group = await db.getGroupById(id);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    const todos = await db.getTodosByGroupId(id);
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch group todos' });
  }
};

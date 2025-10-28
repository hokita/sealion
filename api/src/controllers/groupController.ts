import { Request, Response } from 'express';
import * as groupRepository from '../db/groupRepository';

export const getAllGroups = async (req: Request, res: Response) => {
  try {
    const groups = await groupRepository.getAllGroups();
    res.json(groups);
  } catch (_error) {
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
};

export const getGroupById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid group ID' });
    }
    const group = await groupRepository.getGroupById(id);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    res.json(group);
  } catch (_error) {
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
    const group = await groupRepository.createGroup(name.trim(), color, icon);
    res.status(201).json(group);
  } catch (error: unknown) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'ER_DUP_ENTRY'
    ) {
      return res.status(400).json({ error: 'Group name already exists' });
    }
    res.status(500).json({ error: 'Failed to create group' });
  }
};

export const updateGroup = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid group ID' });
    }
    const { name, color, icon } = req.body;
    const updates: { name?: string; color?: string; icon?: string } = {};
    if (name !== undefined) updates.name = name;
    if (color !== undefined) updates.color = color;
    if (icon !== undefined) updates.icon = icon;

    const group = await groupRepository.updateGroup(id, updates);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    res.json(group);
  } catch (error: unknown) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'ER_DUP_ENTRY'
    ) {
      return res.status(400).json({ error: 'Group name already exists' });
    }
    res.status(500).json({ error: 'Failed to update group' });
  }
};

export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid group ID' });
    }
    const success = await groupRepository.deleteGroup(id);
    if (!success) {
      return res.status(404).json({ error: 'Group not found' });
    }
    res.status(204).send();
  } catch (error: unknown) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'ER_ROW_IS_REFERENCED_2'
    ) {
      return res
        .status(400)
        .json({ error: 'Cannot delete group with existing todos' });
    }
    res.status(500).json({ error: 'Failed to delete group' });
  }
};

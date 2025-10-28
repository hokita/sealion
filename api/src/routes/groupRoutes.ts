import { Router } from 'express';
import {
  getAllGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
} from '../controllers/groupController';
import { getTodosByGroupId } from '../controllers/todoController';

const router = Router();

router.get('/', getAllGroups);
router.get('/:id', getGroupById);
router.get('/:id/todos', getTodosByGroupId);
router.post('/', createGroup);
router.put('/:id', updateGroup);
router.delete('/:id', deleteGroup);

export default router;

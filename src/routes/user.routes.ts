import express from 'express';
import { getUserById } from '../controllers/user.controlller';

const router = express.Router();

// GET /api/users/:id
router.get('/:id', getUserById);

export default router;

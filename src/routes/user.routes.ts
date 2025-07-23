import express from 'express';
import { getUserById } from '../controllers/user.controlller';
import { verifyAccessToken } from '../middlewares/auth.middleware';

const router = express.Router();

// GET /api/users/:id
router.get('/:id', verifyAccessToken, getUserById);

export default router;

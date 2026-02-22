import { Router } from 'express';
import { createLikeController } from './like.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();

router.post('/', authMiddleware, createLikeController);

export default router;

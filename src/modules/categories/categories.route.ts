import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { createCategoryController } from './categories.controller';

const router = Router();

router.post('/', authMiddleware, createCategoryController);

export default router;

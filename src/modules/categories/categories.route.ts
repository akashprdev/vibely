import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  updateCategoryController,
} from './categories.controller';

const router = Router();

router.post('/', authMiddleware, createCategoryController);

router.get('/', getAllCategoriesController);

router.delete('/:categoryId', authMiddleware, deleteCategoryController);

router.patch('/:categoryId', authMiddleware, updateCategoryController);

export default router;

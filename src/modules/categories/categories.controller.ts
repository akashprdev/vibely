import { NextFunction, Request, Response } from 'express';
import {
  createCategoryService,
  deleteCategoryServices,
  getAllCategoriesService,
  updateCategoryService,
} from './createCategory.service';
import { sendSuccess } from '@/utils/response';

export const createCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new Error('Unauthorized'));
  }

  // const adminUserId = process.env.ADMIN_USER_ID;
  // if (!adminUserId || req.user.id !== adminUserId) {
  //   return next(new Error('Forbidden'));
  // }

  const { name } = req.body;

  const result = await createCategoryService({
    name,
  });

  return sendSuccess({
    res,
    statusCode: 201,
    message: 'category created successfully',
    data: result,
  });
};

export const getAllCategoriesController = async (req: Request, res: Response) => {
  const result = await getAllCategoriesService();

  return sendSuccess({
    res,
    statusCode: 200,
    message: 'categories fetched successfully',
    data: result,
  });
};

export const deleteCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new Error('Unauthorized'));
  }

  const categoryId = req.params!.categoryId as string;

  const result = await deleteCategoryServices({ categoryId });

  return sendSuccess({
    res,
    statusCode: 200,
    message: 'categories deleted successfully',
    data: result,
  });
};

export const updateCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new Error('Unauthorized'));
  }

  const categoryId = req.params!.categoryId as string;

  const { name } = req.body;

  const result = await updateCategoryService({ categoryId, name });

  return sendSuccess({
    res,
    statusCode: 200,
    message: 'categories uodated successfully',
    data: result,
  });
};

import { NextFunction, Request, Response } from 'express';
import { createCategoryService } from './createCategory.service';
import { sendSuccess } from '@/utils/response';

export const createCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new Error('Unauthorized'));
  }

  const adminUserId = process.env.ADMIN_USER_ID;
  if (!adminUserId || req.user.id !== adminUserId) {
    return next(new Error('Forbidden'));
  }

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

import { sendSuccess } from '@/utils/response';
import { NextFunction, Request, Response } from 'express';
import { createLikeService } from './like.service';

export const createLikeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.body;
    const userId = req.user?.id;

    if (!postId || !userId) {
      throw new Error('Post id and user id are required');
    }

    const result = await createLikeService({ postId, userId });

    return sendSuccess({
      res,
      statusCode: 201,
      message: 'Like created successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

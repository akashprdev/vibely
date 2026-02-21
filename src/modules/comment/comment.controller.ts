import {
  createCommentService,
  deleteCommentService,
  getCommentsByPostService,
  updateCommentService,
} from './comment.service';
import { sendError, sendSuccess } from '@/utils/response';
import { NextFunction, Request, Response } from 'express';

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { comment, postId } = req.body;
    const userId = req.user!.id;

    const result = await createCommentService({ postId, userId, comment });

    return sendSuccess({
      res,
      statusCode: 201,
      message: 'comment added successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const commentId = req.params.commentId as string;
    const { comment } = req.body;
    const userId = req.user!.id;
    const result = await updateCommentService({ commentId, userId, comment });

    return sendSuccess({
      res,
      statusCode: 200,
      message: 'comment edited successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const commentId = req.params.commentId as string;

    const userId = req.user!.id;

    const result = await deleteCommentService({ commentId, userId });

    return sendSuccess({
      res,
      statusCode: 200,
      message: 'comment deleted successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// get commets for post
export const getCommentsByPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = req.query.postId as string;

    if (!postId) {
      return sendError({ res, statusCode: 400, message: 'Post ID is required' });
    }
    const result = await getCommentsByPostService({ postId });

    return sendSuccess({ res, statusCode: 200, message: 'Comments retrieved', data: result });
  } catch (error) {
    next(error);
  }
};

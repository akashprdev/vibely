import {
  createPostService,
  getAllPostservice,
  getMyPostService,
  deleteMypost,
} from './post.service';
import { sendSuccess } from '@/utils/response';
import { NextFunction, Request, Response } from 'express';

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content } = req.body;

    if (!req.user) {
      return next(new Error('Unauthorized'));
    }

    const userId = req.user!.id;

    const files = Array.isArray(req.files) ? req.files : [];

    const result = await createPostService({
      content,
      userId,
      files,
    });

    return sendSuccess({
      res,
      statusCode: 201,
      message: 'Post created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getAllPostservice();

    return sendSuccess({
      res,
      statusCode: 201,
      message: 'post retrived succesfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new Error('Unauthorized'));
    }

    const userId = req.user!.id;

    const result = await getMyPostService({ userId });

    return sendSuccess({
      res,
      statusCode: 201,
      message: 'post retrived succesfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMyPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new Error('Unauthorized'));
    }

    const userId = req.user!.id;

    const postId = req.params.id as string;

    const result = await deleteMypost({ userId, postId });

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Post not found or not authorized',
      });
    }

    return sendSuccess({
      res,
      statusCode: 200,
      message: 'post delete succesfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

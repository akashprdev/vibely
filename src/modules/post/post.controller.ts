import {
  createPostService,
  getAllPostservice,
  getMyPostService,
  deleteMypost,
  postsByCategoryService,
} from './post.service';
import { sendSuccess } from '@/utils/response';
import { NextFunction, Request, Response } from 'express';
import { categoryIsExists } from '../categories/categories.utils';

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, content, categoryId } = req.body;

    if (!req.user) {
      return next(new Error('Unauthorized'));
    }

    if (!title || !content || !categoryId) {
      return next(new Error('Missing required fields'));
    }

    const userId = req.user!.id;

    const files = Array.isArray(req.files) ? req.files : [];

    const result = await createPostService({
      title,
      description,
      content,
      userId,
      files,
      categoryId,
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
    const { page, limit } = req.query;

    const pageNumber = page ? Number(page) : undefined;
    const limitNumber = limit ? Number(limit) : undefined;

    const { posts, total } = await getAllPostservice({
      page: Number(pageNumber) || 1,
      limit: Number(limitNumber) || 10,
    });

    const noOfPages =
      pageNumber && limitNumber ? Math.ceil(total / Number(limitNumber)) : undefined;

    return sendSuccess({
      res,
      statusCode: 201,
      message: 'post retrived succesfully',
      ...(pageNumber && { page: pageNumber }),
      ...(limitNumber && { limit: limitNumber }),
      ...(noOfPages && { noOfPages }),
      data: posts,
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

export const getPostsByCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryId = req.params.id as string;

    const categoryExits = await categoryIsExists({ categoryId });

    if (!categoryExits) {
      throw new Error('category is not extis');
    }

    const posts = await postsByCategoryService({
      categoryId: String(categoryId),
    });

    return sendSuccess({
      res,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

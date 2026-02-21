import { createPost, deleteMyPost, getAllPost, getMyPost } from './post.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { upload } from '@/middlewares/upload.middleware';
import { validate } from '@/middlewares/validate.middleware';
import { createPostSchema } from '@/validations/post.validation';
import { Router } from 'express';

// http://localhost:3000/api/v1/post/upload
const router = Router();
router.post(
  '/upload',
  authMiddleware,
  upload.array('media', 5),
  validate(createPostSchema),
  createPost
);

router.get('/', authMiddleware, getAllPost);

// get user post
router.get('/mypost', authMiddleware, getMyPost);

router.delete('/mypost/:id/delete', authMiddleware, deleteMyPost);

export default router;

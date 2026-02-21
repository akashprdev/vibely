import { createComment, deleteComment, editComment, getCommentsByPost } from './comment.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { Router } from 'express';

const router = Router();

router.post('/', authMiddleware, createComment);
router.patch('/:commentId', authMiddleware, editComment);
router.delete('/:commentId/delete', authMiddleware, deleteComment);
router.get('/', authMiddleware, getCommentsByPost);

export default router;

import { Router } from 'express';
import auth from '@/modules/auth/auth.route';
import post from '@/modules/post/post.route';
import comment from '@/modules/comment/comment.route';
import like from '@/modules/like/like.route';
import categories from '@/modules/categories/categories.route';

const router = Router();

router.use('/auth', auth);
router.use('/posts', post);
router.use('/categories', categories);
// router.use('/features', post);

router.use('/comments', comment);
router.use('/likes', like);

export default router;

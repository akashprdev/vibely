import { Router } from 'express';
import auth from '@/modules/auth/auth.route';
import post from '@/modules/post/post.route';
import comment from '@/modules/comment/comment.route';
import like from '@/modules/like/like.route';

const router = Router();

router.use('/auth', auth);
router.use('/post', post);

router.use('/comments', comment);
router.use('/likes', like);

export default router;

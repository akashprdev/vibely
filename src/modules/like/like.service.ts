import db from '@/database/database';
import { likes } from '@/database/schema';
import { and, eq } from 'drizzle-orm';

export const createLikeService = async ({ postId, userId }: { postId: string; userId: string }) => {
  const existingLike = await db.query.likes.findFirst({
    where: and(eq(likes.postId, postId), eq(likes.userId, userId)),
  });

  if (existingLike) {
    await db.delete(likes).where(and(eq(likes.id, existingLike.id), eq(likes.userId, userId)));

    return { action: 'deleted', like: existingLike };
  }

  const newLike = await db.insert(likes).values({ postId, userId }).returning();

  return { action: 'created', like: newLike };
};

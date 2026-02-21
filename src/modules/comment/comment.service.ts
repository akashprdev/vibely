import db from '@/database/database';
import { comments } from '@/database/schema';
import { and, eq } from 'drizzle-orm';

export const createCommentService = async ({
  postId,
  userId,
  comment,
}: {
  postId: string;
  userId: string;
  comment: string;
}) => {
  const postExists = await db.query.post.findFirst({
    where: (post, { eq }) => eq(post.id, postId),
  });

  if (!postExists) {
    throw new Error('Post not found');
  }

  const [newComment] = await db
    .insert(comments)
    .values({
      postId,
      userId,
      comment,
    })
    .returning();

  return newComment;
};

export const updateCommentService = async ({
  commentId,
  userId,
  comment,
}: {
  commentId: string;
  userId: string;
  comment: string;
}) => {
  const updated = await db
    .update(comments)
    .set({
      comment,
      updatedAt: new Date(),
    })
    .where(and(eq(comments.id, commentId), eq(comments.userId, userId)))
    .returning();

  if (updated.length === 0) {
    throw new Error('Comment not found or unauthorized');
  }
  return updated;
};

export const deleteCommentService = async ({
  commentId,
  userId,
}: {
  commentId: string;
  userId: string;
}) => {
  const deleted = await db
    .delete(comments)
    .where(and(eq(comments.id, commentId), eq(comments.userId, userId)))
    .returning();

  if (deleted.length == 0) {
    throw new Error('Comment not found or unauthorized');
  }
  return deleted;
};

export const getCommentsByPostService = ({ postId }: { postId: string }) => {
  const allcomments = db.query.comments.findMany({
    where: (comment, { eq }) => eq(comment.postId, postId),
    with: {
      user: {
        columns: {
          password: false,
          updatedAt: false,
          createdAt: false,
        },
      },
    },
    orderBy: (comment, { desc }) => desc(comment.createdAt),
  });

  return allcomments;
};

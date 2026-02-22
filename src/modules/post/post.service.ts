import db from '@/database/database';
import { comments, likes, media, post } from '@/database/schema';
import cloudinary from '@/utils/cloudinary';
import { UploadApiResponse } from 'cloudinary';
import { and, count, eq, inArray } from 'drizzle-orm';

interface CreatePostServiceParameter {
  content: string;
  userId: string;
  files: Express.Multer.File[];
}

export const createPostService = async ({ content, userId, files }: CreatePostServiceParameter) => {
  const [newPost] = await db.insert(post).values({ content, userId }).returning();

  for (const file of files) {
    const uploaded = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto', folder: 'posts' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as UploadApiResponse);
        }
      );
      stream.end(file.buffer);
    });

    const mediaType = uploaded.resource_type === 'video' ? 'video' : 'image';

    await db.insert(media).values({
      url: uploaded.secure_url,
      type: mediaType,
      postId: newPost.id,
    });
  }

  return newPost;
};

export const getAllPostservice = async () => {
  const posts = await db.query.post.findMany({
    with: {
      media: true,
      comments: {
        limit: 2,
        columns: {
          userId: false,
          postId: false,
        },
        with: {
          user: {
            columns: {
              password: false,
              createdAt: false,
              updatedAt: false,
            },
          },
        },
        orderBy: (comments, { desc }) => [desc(comments.createdAt)],
      },
    },
    orderBy: (post, { desc }) => desc(post.createdAt),
  });

  const postIds = posts?.map((p) => p.id);

  if (postIds.length === 0) return [];

  // count comments
  const commentCounts = await db
    .select({
      postId: comments.postId,
      count: count(),
    })
    .from(comments)
    .where(inArray(comments.postId, postIds))
    .groupBy(comments.postId);

  const countMap = new Map(commentCounts.map((c) => [c.postId, c.count]));

  const likesCount = await db
    .select({
      postId: likes.postId,
      count: count(),
    })
    .from(likes)
    .where(inArray(likes.postId, postIds))
    .groupBy(likes.postId);

  const likesMap = new Map(likesCount.map((c) => [c.postId, c.count]));

  const result = posts.map((p) => ({
    ...p,
    commentCount: countMap.get(p.id) ?? 0,
    likeCount: likesMap.get(p.id) ?? 0,
  }));

  return result;
};

export const getMyPostService = async ({ userId }: { userId: string }) => {
  const posts = await db.query.post.findMany({
    where: (post, { eq }) => eq(post.userId, userId),
    orderBy: (post, { desc }) => desc(post.createdAt),
    with: {
      media: true,
      comments: {
        limit: 2,
        with: {
          user: {
            columns: {
              password: false,
              createdAt: false,
              updatedAt: false,
            },
          },
        },
        orderBy: (post, { desc }) => desc(post.createdAt),
      },
    },
  });

  const postIds = posts?.map((p) => p.id);

  if (postIds.length === 0) return [];

  const commentCounts = await db
    .select({
      postId: comments.postId,
      count: count(),
    })
    .from(comments)
    .where(inArray(comments.postId, postIds))
    .groupBy(comments.postId);

  const countMap = new Map(commentCounts.map((c) => [c.postId, c.count]));

  const result = posts.map((p) => ({
    ...p,
    commentCount: countMap.get(p.id) ?? 0,
  }));
  return result;
};

export const deleteMypost = async ({ userId, postId }: { userId: string; postId: string }) => {
  const deleted = await db
    .delete(post)
    .where(and(eq(post.id, postId), eq(post.userId, userId)))
    .returning();

  return deleted;
};

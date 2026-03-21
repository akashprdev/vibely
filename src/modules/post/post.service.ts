import db from '@/database/database';
import { comments, media, post } from '@/database/schema';
import cloudinary from '@/utils/cloudinary';
import { UploadApiResponse } from 'cloudinary';
import { and, count, eq, inArray } from 'drizzle-orm';
import { categoryIsExists } from '../categories/categories.utils';
import { slugExists, titleExists } from './post.utilis';
import slugify from 'slugify';

interface CreatePostServiceParameter {
  title: string;
  description: string;
  content: string;
  userId: string;
  files: Express.Multer.File[];
  categoryId: string;
}
export const createPostService = async ({
  title,
  description,
  content,
  userId,
  files,
  categoryId,
}: CreatePostServiceParameter) => {
  const existingTitle = await titleExists({ title });

  if (existingTitle) {
    throw new Error('Title is already extis');
  }

  const existing = await categoryIsExists({ categoryId });

  if (!existing) {
    throw new Error('Category not found');
  }

  const slug = slugify(title, {
    lower: true,
    strict: true,
  });

  const slugAlreadyExists = await slugExists({ slug });
  if (slugAlreadyExists) {
    throw new Error('Slug already exists');
  }

  const [newPost] = await db
    .insert(post)
    .values({ title, slug, description, content, userId, categoryId })
    .returning();

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
    },
    orderBy: (post, { desc }) => desc(post.createdAt),
  });

  // const postIds = posts?.map((p) => p.id);

  // if (postIds.length === 0) return [];

  // count comments
  // const commentCounts = await db
  //   .select({
  //     postId: comments.postId,
  //     count: count(),
  //   })
  //   .from(comments)
  //   .where(inArray(comments.postId, postIds))
  //   .groupBy(comments.postId);

  // const countMap = new Map(commentCounts.map((c) => [c.postId, c.count]));

  // const likesCount = await db
  //   .select({
  //     postId: likes.postId,
  //     count: count(),
  //   })
  //   .from(likes)
  //   .where(inArray(likes.postId, postIds))
  //   .groupBy(likes.postId);

  // const likesMap = new Map(likesCount.map((c) => [c.postId, c.count]));

  // const result = posts.map((p) => ({
  //   ...p,
  //   commentCount: countMap.get(p.id) ?? 0,
  //   likeCount: likesMap.get(p.id) ?? 0,
  // }));

  return posts;
};

export const getMyPostService = async ({ userId }: { userId: string }) => {
  const posts = await db.query.post.findMany({
    where: (post, { eq }) => eq(post.userId, userId),
    orderBy: (post, { desc }) => desc(post.createdAt),
    with: {
      media: true,
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

export const postsByCategoryService = async ({ categoryId }: { categoryId: string }) => {
  const isExists = await categoryIsExists({ categoryId });

  if (!isExists) {
    throw new Error('Categories does not exits');
  }

  const posts = db.query.post.findMany({
    where: (post, { eq }) => eq(post.categoryId, categoryId),
    orderBy: (post, { desc }) => desc(post.createdAt),
    with: {
      media: true,
    },
  });
  return posts;
};

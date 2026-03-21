import { z } from 'zod';

export const createPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  slug: z.string().trim().min(1, 'Slug is required'),
  description: z.string().trim().optional().default(''),
  content: z
    .string()
    .trim()
    .min(1, 'Content is required')
    .max(1000, 'Content must be less than 1000 characters'),
  categoryId: z.string().trim().min(1, 'Category is required'),
});

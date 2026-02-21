import { z } from 'zod';

export const createPostSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Content is required')
    .max(1000, 'Content must be less than 1000 characters'),
});

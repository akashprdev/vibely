import db from '@/database/database';
import { post } from '@/database/schema';
import { eq } from 'drizzle-orm';

type TitleExistsParams = {
  title: string;
};

export const titleExists = async ({ title }: TitleExistsParams): Promise<boolean> => {
  const result = await db
    .select({ title: post.title })
    .from(post)
    .where(eq(post.title, title))
    .limit(1);

  return result.length > 0;
};

export const slugExists = async ({ slug }: { slug: string }) => {
  const result = await db
    .select({ slug: post.slug })
    .from(post)
    .where(eq(post.slug, slug))
    .limit(1);

  return result.length > 0;
};

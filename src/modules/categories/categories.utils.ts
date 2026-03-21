import db from '@/database/database';
import { categories } from '@/database/schema';
import { eq } from 'drizzle-orm';

type CategoryExistsParams = {
  categoryId: string;
};

export const categoryIsExists = async ({ categoryId }: CategoryExistsParams): Promise<boolean> => {
  try {
    const result = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    return !!result.length;
  } catch {
    throw new Error('Unable to verify category');
  }
};

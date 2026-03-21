import db from '@/database/database';
import { categories } from '@/database/schema/categories';
import { eq } from 'drizzle-orm';
import { categoryIsExists } from './categories.utils';

export const createCategoryService = async ({ name }: { name: string }) => {
  const [newCategory] = await db.insert(categories).values({ name }).returning();
  return newCategory;
};

export const getAllCategoriesService = async () => {
  const allCategories = await db.query.categories.findMany();
  return allCategories;
};

export const deleteCategoryServices = async ({ categoryId }: { categoryId: string }) => {
  const deletedCategories = await db
    .delete(categories)
    .where(eq(categories.id, categoryId))
    .returning();
  return deletedCategories;
};

export const updateCategoryService = async ({
  categoryId,
  name,
}: {
  categoryId: string;
  name: string;
}) => {
  const existing = await categoryIsExists({ categoryId });

  if (!existing) {
    throw new Error('Category not found');
  }

  const updatedCategory = await db
    .update(categories)
    .set({
      name,
      updatedAt: new Date(),
    })
    .where(eq(categories.id, categoryId))
    .returning();

  return updatedCategory;
};

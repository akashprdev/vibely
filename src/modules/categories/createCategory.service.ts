import db from '@/database/database';
import { categories } from '@/database/schema/categories';

export const createCategoryService = async ({ name }: { name: string }) => {
  const [newCategory] = await db.insert(categories).values({ name }).returning();
  return newCategory;
};

// export const getAllCategoriesService = async () => {
//   const allCategories = await db.query;
//   return allCategories;
// }

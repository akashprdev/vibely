import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from './user';
import { relations } from 'drizzle-orm';
import { media } from './media';
import { categories } from './categories';
import { comments } from './comment';
import { likes } from './like';

export const post = pgTable('post', {
  id: uuid('id').defaultRandom().primaryKey(),

  title: text('title').notNull().unique(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  content: text('content').notNull(),

  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'set null' }),

  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),

  createdAt: timestamp('created_at').defaultNow().notNull(),

  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const postRelations = relations(post, ({ one, many }) => ({
  media: many(media),
  category: one(categories, { fields: [post.categoryId], references: [categories.id] }),
  comments: many(comments),
  likes: many(likes),
}));

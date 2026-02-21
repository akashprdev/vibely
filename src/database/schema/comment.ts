import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from './user';
import { post } from './post';
import { relations } from 'drizzle-orm';

export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),

  comment: text('comment').notNull(),

  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),

  postId: uuid('post_id')
    .notNull()
    .references(() => post.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at').defaultNow().notNull(),

  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const commentRelations = relations(comments, ({ one }) => ({
  user: one(user, {
    fields: [comments.userId],
    references: [user.id],
  }),
  post: one(post, {
    fields: [comments.postId],
    references: [post.id],
  }),
}));

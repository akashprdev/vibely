import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from './user';
import { relations } from 'drizzle-orm';
import { media } from './media';
import { comments } from './comment';
import { likes } from './like';

export const post = pgTable('post', {
  id: uuid('id').defaultRandom().primaryKey(),

  content: text('content'),

  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at').defaultNow().notNull(),

  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const postRelations = relations(post, ({ many }) => ({
  media: many(media),
  comments: many(comments),
  likes: many(likes),
}));

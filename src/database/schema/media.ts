import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { post } from './post';
import { relations } from 'drizzle-orm';

export const mediaTypeEnum = pgEnum('media_type', ['image', 'video']);

export const media = pgTable('media', {
  id: uuid('id').defaultRandom().primaryKey(),

  url: text('url').notNull(),
  type: mediaTypeEnum('type').notNull(),

  postId: uuid('post_id')
    .notNull()
    .references(() => post.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at').defaultNow().notNull(),

  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const mediaRelations = relations(media, ({ one }) => ({
  post: one(post, {
    fields: [media.postId],
    references: [post.id],
  }),
}));

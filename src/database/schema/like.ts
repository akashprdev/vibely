import { pgTable, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { user } from './user';
import { post } from './post';

export const likes = pgTable(
  'likes',
  {
    id: uuid('id').defaultRandom().primaryKey(),

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
  },
  (table) => [uniqueIndex('user_post_unique').on(table.userId, table.postId)]
);

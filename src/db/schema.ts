import { pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  submitDate: timestamp('submit_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  tickonoff: boolean('tickonoff').default(false).notNull(),
});

export type Todo = typeof todos.$inferSelect;
import { pgTable, serial, text, timestamp, boolean, varchar } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  submitDate: timestamp('submit_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  tickonoff: boolean('tickonoff').default(false).notNull(),
  priority: varchar('priority', { length: 10 }).notNull(),
}, (table) => {
  return {
    priorityCheck: sql`check (${table.priority} in ('high', 'medium', 'low'))`
  }
});

export type Todo = typeof todos.$inferSelect;
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

export const db = drizzle(sql, { schema });

// Test the database connection
sql`SELECT NOW()`.then(() => {
  console.log('Database connection successful');
}).catch((err) => {
  console.error('Database connection failed:', err);
});
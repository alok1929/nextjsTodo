import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

// Check for POSTGRES_URL, but don't throw an error
if (!process.env.POSTGRES_URL) {
  console.warn('POSTGRES_URL environment variable is not set. This may cause issues with database connections.');
}

export const db = drizzle(sql, { schema });

// Test the database connection
sql`SELECT NOW()`.then(() => {
  console.log('Database connection successful');
}).catch((err) => {
  console.error('Database connection failed:', err);
});
// src/db/migrate.ts
import { config } from 'dotenv';
import { resolve } from 'path';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { migrate } from 'drizzle-orm/vercel-postgres/migrator';
import { sql } from '@vercel/postgres';

// Load environment variables
config({ path: resolve(__dirname, '../../.env.local') });

const runMigrate = async () => {
  if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL is not set in the environment variables');
  }

  const db = drizzle(sql);
  console.log('Running migrations...');
  
  const start = Date.now();
  await migrate(db, { migrationsFolder: 'drizzle' });
  const end = Date.now();
  
  console.log(`Migrations completed in ${end - start}ms`);
  process.exit(0);
};

runMigrate().catch((err) => {
  console.error('Error running migrations');
  console.error(err);
  process.exit(1);
});
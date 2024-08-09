// src/db/seed.ts
import { config } from 'dotenv';
import { resolve } from 'path';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { todos } from './schema';

// Load environment variables
config({ path: resolve(__dirname, '../../.env.local') });

const runSeed = async () => {
  if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL is not set in the environment variables');
  }

  const db = drizzle(sql);
  console.log('Starting seed process...');
  
  const start = Date.now();

  try {
    const insertedTodos = await db.insert(todos).values([
      { content: 'First todo', submitDate: new Date(), createdAt: new Date() },
      { content: 'Second todo', submitDate: new Date(), createdAt: new Date() },
      // Add more todos as needed
    ]).returning();

    console.log('Seed data inserted successfully:', insertedTodos);
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }

  const end = Date.now();
  console.log(`Seeding completed in ${end - start}ms`);
};

runSeed().catch((err) => {
  console.error('Error running seed');
  console.error(err);
  process.exit(1);
}).finally(() => {
  process.exit(0);
});
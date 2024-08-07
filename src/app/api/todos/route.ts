import { NextResponse } from 'next/server';
import { db } from '@/db';
import { todos } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const result = await db.select().from(todos).orderBy(todos.createdAt);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const { content } = await request.json();
  const result = await db.insert(todos).values({ content }).returning();
  return NextResponse.json(result[0]);
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    console.log('Received delete request for id:', id);

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const result = await db.delete(todos).where(eq(todos.id, id));
    console.log('Delete operation result:', result);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
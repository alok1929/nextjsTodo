import { NextResponse } from 'next/server';
import { db } from '@/db';
import { todos } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const result = await db.select({
      id: todos.id,
      content: todos.content,
      submitDate: todos.submitDate,
      createdAt: todos.createdAt,
      tickonoff:todos.tickonoff
    }).from(todos).orderBy(todos.createdAt);
    console.log('Fetched todos:', result); // Add this line for debugging
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/todos:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, tickonoff } = await request.json();
    console.log('Received PATCH data:', { id, tickonoff });

    if (id === undefined || tickonoff === undefined) {
      return NextResponse.json({ error: 'ID and tickonoff are required' }, { status: 400 });
    }

    const result = await db.update(todos)
      .set({ tickonoff })
      .where(eq(todos.id, id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error in PATCH /api/todos:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { content, submitDate, tickonoff = false } = await request.json();

    const parsedDate = submitDate ? new Date(submitDate) : null;

    console.log('Received POST data:', { content, submitDate, tickonoff });

    const result = await db.insert(todos).values({
      content,
      submitDate: parsedDate,
      tickonoff,  // Add this line
    }).returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error in POST /api/todos:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
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
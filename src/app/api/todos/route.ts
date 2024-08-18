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
      tickonoff: todos.tickonoff,
      priority: todos.priority // Add this line
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
    const { id, tickonoff, content } = await request.json();
    console.log('Received PATCH request:', { id, tickonoff, content });

    if (id === undefined) {
      console.log('Invalid request data');
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updateData: { tickonoff?: boolean; content?: string } = {};
    if (tickonoff !== undefined) updateData.tickonoff = tickonoff;
    if (content !== undefined) updateData.content = content;

    const result = await db.update(todos)
      .set(updateData)
      .where(eq(todos.id, id))
      .returning();

    console.log('Update result:', result);

    if (result.length === 0) {
      console.log('Todo not found');
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    console.log('Sending response:', result[0]);
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error in PATCH /api/todos:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { content, submitDate, tickonoff = false, priority } = await request.json();

    const parsedDate = submitDate ? new Date(submitDate) : null;

    console.log('Received POST data:', { content, submitDate, tickonoff, priority });

    const result = await db.insert(todos).values({
      content,
      submitDate: parsedDate,
      tickonoff,
      priority
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
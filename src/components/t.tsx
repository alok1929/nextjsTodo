import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from './ui/badge';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type Todo = {
  id: number;
  content: string,
  submitDate: string | null;
};

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTodos(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
      // You might want to set an error state here to display to the user
    }
  };

  const deleteTodo = async (id: number) => {
    console.log('Deleting todo with id:', id);
    await fetch('/api/todos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchTodos();
  };

  return (
    
    <ul>
      {todos.map((todo) => (
        <div className='rounded-lg border shadow-sm  p-2 m-2'>
          <li key={todo.id} className='m-2'>
            {todo.content}
            
            <div className='flex p-2 justify-end space-x-2 '>
            <Badge
                variant={"outline"}
                
              >
                {todo.submitDate && <span>  Due: {new Date(todo.submitDate).toLocaleDateString()}</span>}
              </Badge>
              <Button className='p-1 ' onClick={() => deleteTodo(todo.id)}>Delete</Button>
            </div>
          </li>
        </div>
      ))}
    </ul>
  );
}
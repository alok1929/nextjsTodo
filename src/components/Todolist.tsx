import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { addDays, format, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { Badge } from './ui/badge';
import { Checkbox } from "@/components/ui/checkbox"


type Todo = {
  id: number;
  content: string;
  submitDate: string | null;
  tickonoff: boolean;
};

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [filterRange, setFilterRange] = useState<{ start: Date, end: Date } | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    if (filterRange) {
      const filtered = todos.filter(todo => {
        if (!todo.submitDate) return false;
        const todoDate = parseISO(todo.submitDate);
        return isWithinInterval(todoDate, {
          start: startOfDay(filterRange.start),
          end: endOfDay(filterRange.end)
        });
      });
      setFilteredTodos(filtered);
    } else {
      setFilteredTodos(todos);
    }
  }, [todos, filterRange]);

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

  const formatDateForDisplay = (date: Date) => {
    return format(date, 'EEE, MMM d, yyyy');
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const today = startOfDay(new Date());
    if (value === "") {
      setFilterRange(null);
    } else {
      const days = parseInt(value);
      setFilterRange({
        start: today,
        end: endOfDay(addDays(today, days))
      });
    }
  };

  const handleTickChange = async (id: number, checked: boolean) => {
    try {
      console.log('Sending PATCH request:', { id, tickonoff: checked });
      const response = await fetch('/api/todos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, tickonoff: checked }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
      }

      const updatedTodo = await response.json();
      console.log('Updated todo:', updatedTodo);

      // Update the local state instead of fetching all todos again
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...todo, tickonoff: checked } : todo
        )
      );
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <div className="max-w-full  mx-auto">
      <div className='flex items-center justify-between mb-4'>
        <h2 className='px-3 m-1 mt-8 font-semibold text-lg'>Your Todos:</h2>
        <select onChange={handleDateChange} className='m-4 mt-8 p-2'>
          <option value="">All Dates</option>
          <option value="0">Today</option>
          <option value="1">Tomorrow</option>
          <option value="3">Next 3 Days</option>
          <option value="7">Next Week</option>
        </select>
      </div>

      <ScrollArea className="h-[400px] m-3 max-w-full rounded-md border">
        <div className="p-4 py-1 m-2">
          {filteredTodos.map((todo, index) => (
            <React.Fragment key={todo.id}>
              <div className="flex justify-between items-center">



                <div className='flex space-x-2 '>
                  <div>
                    <Checkbox
                      checked={todo.tickonoff}
                      onCheckedChange={(checked) => handleTickChange(todo.id, checked as boolean)}
                    />
                  </div>
                  <div className=''>
                    <p className="text-sm font-medium">{todo.content}</p>
                    {todo.submitDate && (
                      <Badge variant="outline" className="mt-1 rounded-lg">
                        {formatDateForDisplay(parseISO(todo.submitDate))}
                      </Badge>
                    )}
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={() => deleteTodo(todo.id)}
                >

                  Delete
                </Button>
              </div>
              {index < filteredTodos.length - 1 && <Separator className="my-2" />}
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
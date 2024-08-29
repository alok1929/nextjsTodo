import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { addDays, format, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { Badge } from './ui/badge';
import { Delete, DeleteIcon, SeparatorHorizontal, TypeOutline } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import AddTodoForm from './AddTodoForm';

type Todo = {
  id: number;
  content: string;
  submitDate: string | null;
  tickonoff: boolean;
  priority: 'high' | 'medium' | 'low';
};

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [filterRange, setFilterRange] = useState<{ start: Date, end: Date } | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<'high' | 'medium' | 'low' | 'all'>('all');

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    let filtered = todos;

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(todo => todo.priority === priorityFilter);
    }

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
  }, [todos, filterRange, priorityFilter]);

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const deleteTodo = async (id: number) => {
    await fetch('/api/todos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchTodos();
  };

  const handleTickChange = async (id: number, checked: boolean) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, tickonoff: checked }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...todo, tickonoff: checked } : todo
        )
      );
    } catch (error) {
      console.error('Error updating todo:', error);
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...todo, tickonoff: !checked } : todo
        )
      );
    }
  };

  const completedCount = todos.filter(todo => todo.tickonoff).length;

  return (
    <div className="max-w-full mx-auto">
      <div className="flex justify-between items-center px-4 py-3">
        <AddTodoForm onAdd={() => fetchTodos()} />
       
      </div>

      {/* Other UI Components */}
      <ScrollArea className="h-[350px] m-3 max-w-full rounded-md border">
        <div className="p-4 py-1 m-2">
          {filteredTodos.map((todo, index) => (
            <React.Fragment key={todo.id}>
              <div className="flex justify-between items-center">
                <div className='flex space-x-2 '>
                  <Checkbox
                    className='rounded-full'
                    checked={todo.tickonoff}
                    onCheckedChange={(checked) => handleTickChange(todo.id, checked as boolean)}
                  />
                  <div className=''>
                    <p className="text-sm font-medium">{todo.content}</p>
                    {todo.submitDate && (
                      <Badge variant="outline" className="mt-1 rounded-lg">
                        {format(parseISO(todo.submitDate), 'EEE, MMM d, yyyy')}
                      </Badge>
                    )}
                    <Badge className={`mt-1 ml-2 rounded-lg ${todo.priority === 'high' ? 'bg-red-500' : todo.priority === 'medium' ? 'bg-blue-400' : 'bg-yellow-400'}`}>
                      Priority: {todo.priority}
                    </Badge>
                  </div>
                </div>
                <Button size="sm" type="submit" onClick={() => deleteTodo(todo.id)}>
                  <Delete size={15} />
                </Button>
              </div>
              {index < filteredTodos.length - 1 && <Separator className="my-3" />}
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

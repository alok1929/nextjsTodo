import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { addDays, format, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { Badge } from './ui/badge';
import { Checkbox } from "@/components/ui/checkbox"
import { MdOutlineDelete } from "react-icons/md";
import { Select, SelectContent, SelectItem } from './ui/select';
import { SelectTrigger, SelectValue } from './ui/select';


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
      console.log('Fetched todos:', data); // Log the full data
      setTodos(data);
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
      console.log('Attempting to send PATCH request:', { id, tickonoff: checked });
      const response = await fetch('/api/todos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, tickonoff: checked }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server responded with an error:', response.status, errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedTodo = await response.json();
      console.log('Successfully updated todo:', updatedTodo);

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...todo, tickonoff: checked } : todo
        )
      );
    } catch (error) {
      console.error('Error updating todo:', error);
      // Revert the checkbox state in case of error
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...todo, tickonoff: !checked } : todo
        )
      );
    }
  };

  const handlePriorityChange = (value: string) => {
    setPriorityFilter(value as 'high' | 'medium' | 'low' | 'all');
  };

  return (
    <div className="max-w-full  mx-auto">
      <h2 className='px-3 m-1 mt-8 font-semibold text-lg'>Your Todos:</h2>

      <div className='flex items-center space-x-4 justify-end mb-4 mr-4'>
        <select onChange={handleDateChange} className='relative flex  cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50' >
          <option value="">All Dates</option>
          <option value="0">Today</option>
          <option value="1">Tomorrow</option>
          <option value="3">Next 3 Days</option>
          <option value="7">Next Week</option>
        </select>
        <Select onValueChange={handlePriorityChange} >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="h-[350px] m-3 max-w-full rounded-md border">
        <div className="p-4 py-1 m-2">
          {filteredTodos.map((todo, index) => (
            <React.Fragment key={todo.id}>
              <div className="flex justify-between items-center">
                <div className='flex space-x-2 '>
                  <div>
                    <Checkbox
                      className='rounded-full'
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
                    {todo.priority == 'high' ? (
                      <Badge variant="destructive" className="mt-1 ml-2 rounded-lg">
                        Priority: {todo.priority}
                      </Badge>
                    ) : <></>}
                    {todo.priority == 'low' ? (
                      <Badge className="mt-1 ml-2 rounded-lg bg-yellow-400">
                        Priority: {todo.priority}
                      </Badge>
                    ) : <></>}
                    {todo.priority == 'medium' ? (
                      <Badge className="mt-1 ml-2 rounded-lg bg-blue-400">
                        Priority: {todo.priority}
                      </Badge>
                    ) : <></>}
                  </div>
                </div>
                <Button
                  size="sm"
                  type="submit"
                  onClick={() => deleteTodo(todo.id)}
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                </Button>              </div>
              {index < filteredTodos.length - 1 && <Separator className="my-3" />}
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
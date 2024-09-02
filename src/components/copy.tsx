import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { addDays, format, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { Badge } from './ui/badge';
import { Checkbox } from "@/components/ui/checkbox";
import { MdOutlineDelete } from "react-icons/md";
import { Select, SelectContent, SelectItem } from './ui/select';
import { SelectTrigger, SelectValue } from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";

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
  const [newTodo, setNewTodo] = useState('');
  const [newTodoDate, setNewTodoDate] = useState<Date | null>(null);
  const [newTodoPriority, setNewTodoPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [showNewTodoOptions, setShowNewTodoOptions] = useState(false);

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
      console.log('Fetched todos:', data);
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
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...todo, tickonoff: !checked } : todo
        )
      );
    }
  };

  const completedCount = todos.filter(todo => todo.tickonoff).length;

  const handlePriorityChange = (value: string) => {
    setPriorityFilter(value as 'high' | 'medium' | 'low' | 'all');
  };

  const handleNewTodoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedDate = newTodoDate ? format(newTodoDate, "EEE MMM dd yyyy HH:mm:ss") : null;
    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newTodo, submitDate: formattedDate, priority: newTodoPriority }),
    });
    setNewTodo('');
    setNewTodoDate(null);
    setNewTodoPriority('medium');
    fetchTodos();
  };

  const handleNewTodoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '/') {
      e.preventDefault();
      setShowNewTodoOptions(true);
    }
  };

  return (
    <div className="max-w-full mx-auto">
      <div className='flex justify-between p-2'>
        <div className='flex justify-between text-gray-800 font-bold'>
          Your Todos:
        </div>
        <p className="text-sm px-4 text-gray-600">
          Completed Todos: <span className="font-bold">{completedCount}</span>
        </p>
      </div>

      <ScrollArea className="h-[350px] m-3 max-w-full">
        <div className="p-4 py-1 m-2">
          {filteredTodos.map((todo, index) => (
            <React.Fragment key={todo.id}>
              <div className="flex justify-between items-center">
                <div className='flex space-x-2'>
                  <div>
                    <Checkbox
                      className='rounded-full'
                      checked={todo.tickonoff}
                      onCheckedChange={(checked) => handleTickChange(todo.id, checked as boolean)}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{todo.content}</p>
                    {todo.submitDate && (
                      <Badge variant="outline" className="mt-1 rounded-lg">
                        {formatDateForDisplay(parseISO(todo.submitDate))}
                      </Badge>
                    )}
                    <Badge
                      variant={
                        todo.priority === 'high' ? 'destructive' :
                          todo.priority === 'low' ? 'default' :
                            'primary'
                      }
                      className="mt-1 ml-2 rounded-lg"
                    >
                      Priority: {todo.priority}
                    </Badge>
                  </div>
                </div>
                <Button
                  size="sm"
                  type="submit"
                  onClick={() => deleteTodo(todo.id)}
                >
                  <MdOutlineDelete />
                </Button>
              </div>
              {index < filteredTodos.length - 1 && <Separator className="my-3" />}
            </React.Fragment>
          ))}
        </div>
        {/* Input for New Todo */}
        <form onSubmit={handleNewTodoSubmit} className='flex w-full max-w-md items-center space-x-2 px-8 p-4'>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={handleNewTodoKeyDown}
            placeholder="Enter a new todo...press / to get options"
            required
            className='flex-1'
          />

          {showNewTodoOptions && (
            <DropdownMenu open={showNewTodoOptions} onOpenChange={setShowNewTodoOptions}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Options</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <label className="block text-sm font-medium text-gray-700">
                    Priority:
                    <Select onValueChange={(value) => setNewTodoPriority(value as 'high' | 'medium' | 'low')}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </label>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <label className="block text-sm font-medium text-gray-700">
                    Due Date:
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                          {newTodoDate ? format(newTodoDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newTodoDate}
                          onSelect={setNewTodoDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </label>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button type="submit" className='px-4'>Add</Button>
        </form>

        {/* Filter Controls */}
        <div className='flex justify-between'>
          <label className='block m-1'>
            Filter by date range:
            <select onChange={handleDateChange} className='border p-2 ml-1'>
              <option value="">All</option>
              <option value="0">Today</option>
              <option value="7">Next 7 days</option>
              <option value="30">Next 30 days</option>
            </select>
          </label>
          <label className='block m-1'>
            Filter by priority:
            <select onChange={(e) => handlePriorityChange(e.target.value)} className='border p-2 ml-1'>
              <option value="all">All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
        </div>
      </ScrollArea>
    </div>
  );
}

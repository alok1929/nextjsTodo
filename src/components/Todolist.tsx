import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { addDays,format } from 'date-fns';
import { Badge } from './ui/badge';

type Todo = {
  id: number;
  content: string,
  submitDate: string | null;
};

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [filterDate, setFilterDate] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    if (filterDate) {
      // Filter todos based on the selected submitDate
      const filtered = todos.filter(todo => todo.submitDate === filterDate);
      setFilteredTodos(filtered);
    } else {
      // Show all todos if no date is selected
      setFilteredTodos(todos);
    }
  }, [todos, filterDate]);

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

  const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterDate(event.target.value);
  };

  return (
    <div>
       <div className='flex items-center justify-between mb-4'>
      <h2 className='px-3 p-1 py-1 font-semibold text-lg'>Your Todos:</h2>
      <select onChange={handleDateChange} className='m-4 p-2'>
        <option value="">All Dates</option>
        <option value={format(new Date(), "EEE MMM dd yyyy HH:mm:ss")}>Today</option>
        <option value={format(addDays(new Date(), 1), "EEE MMM dd yyyy HH:mm:ss")}>Tomorrow</option>
        <option value={format(addDays(new Date(), 3), "EEE MMM dd yyyy HH:mm:ss")}>In 3 Days</option>
        <option value={format(addDays(new Date(), 7), "EEE MMM dd yyyy HH:mm:ss")}>In a Week</option>
      </select>
      </div>
     

      <ul>
        {filteredTodos.map((todo) => (
          <div key={todo.id} className='rounded-lg border shadow-sm p-2 m-2'>
            <li className='m-2'>
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
    </div>
  );
}

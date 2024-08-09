'use client';

import TodoList from '@/components/Todolist';
import AddTodoForm from '@/components/AddTodoForm';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Carousell from '@/components/carouse';


export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAdd = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <main className=''>
      <div className='flex justify-center items-center p-3 font-serif text-xl'>Todolist</div>
      <AddTodoForm onAdd={handleAdd} />
     
      <TodoList  key={refreshKey} />
    </main>
  );
}
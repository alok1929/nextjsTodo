'use client';

import TodoList from '@/components/Todolist';
import AddTodoForm from '@/components/AddTodoForm';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Carousell from '@/components/carouse';
import GAuth from '@/components/gAuth';  // Changed to capital 'G'
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAdd = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <main className='bg-slate-100'>
    <div className='flex justify-between border-2 border-b-black p-1  items-center'>
      <div className='flex justify-center m-2 font-serif font-bold p-1 items-center'>Todolist</div>
      <div className='mr-4'>
      <GAuth />
      </div>
    </div>

    <AddTodoForm onAdd={handleAdd}  />
    <TodoList key={refreshKey} />
  </main>
  );
}
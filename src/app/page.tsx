'use client';

import TodoList from '@/components/Todolist';
import AddTodoForm from '@/components/AddTodoForm';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Carousell from '@/components/carouse';
import GAuth from '@/components/gAuth';  // Changed to capital 'G'
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAdd = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <main className=''>
    <div className='flex justify-between   bg-slate-300 items-center'>
      <div className='flex justify-center m-2 font-serif font-bold p-1 items-center'>Todolist</div>
      <Badge className='flex justify-end p-1 mr-2 '>
        <GAuth />
      </Badge>
    </div>

    <AddTodoForm onAdd={handleAdd}  />
    <TodoList key={refreshKey} />
  </main>
  );
}
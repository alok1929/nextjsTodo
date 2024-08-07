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
    <main>
      <h1>Todo List</h1>
      <AddTodoForm onAdd={handleAdd} />
      <TodoList key={refreshKey} />
      <Carousell></Carousell>

    </main>
  );
}
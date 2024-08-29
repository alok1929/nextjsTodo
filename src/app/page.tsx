'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TodoList from '@/components/Todolist';
import AddTodoForm from '@/components/AddTodoForm';
import GAuth from '@/components/gAuth';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SeparatorHorizontal, TypeOutline } from 'lucide-react';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

 

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-4">
          <h3 className="text-2xl font-bold text-gray-800">

          </h3>
        </div>
        <p className='flex justify-center items-center text-gray-400'> 
        animation will come here

        </p>
        <Separator className='m-2' />
        <ScrollArea className="flex-1 px-4">
          <TodoList key={refreshKey} />
        
        </ScrollArea>
      </main>
    </div>
  );
}
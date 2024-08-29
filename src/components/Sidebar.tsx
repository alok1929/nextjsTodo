// components/Sidebar.tsx
import Link from 'next/link';
import { useState } from 'react';
import { Home, CircleCheckBig, ChevronLeft, ChevronRight, Eclipse } from 'lucide-react';
import GAuth from './gAuth';
import { Separator } from './ui/separator';

const Sidebar = () => {
  // State to handle the collapsed state of the sidebar
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Function to toggle the collapsed state
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`bg-white h-screen shadow-lg transition-width duration-300 flex flex-col justify-between ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div>
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && <h2 className="text-2xl font-bold text-gray-800">Todo-me</h2>}
          <button
            onClick={toggleSidebar}
            className="p-1 text-gray-700 hover:bg-gray-200 rounded-md"
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
        <nav className="mt-6">
          <Link
            href="/"
            className={`flex items-center py-2 px-4 text-gray-700 hover:bg-gray-200 ${isCollapsed ? 'justify-center' : ''}`}
          >
            <Home className="mr-3" size={20} />
            {!isCollapsed && <span>Home</span>}
          </Link>
          <Link
            href="/settings"
            className={`flex items-center py-2 px-4 text-gray-700 hover:bg-gray-200 ${isCollapsed ? 'justify-center' : ''}`}
          >
            <CircleCheckBig className="mr-3" size={20} />
            {!isCollapsed && <span>Your Todos:</span>}
          </Link>
          <div>
            <Link
              href="/settings"
              className={`flex items-center py-2 px-6 text-gray-700 hover:bg-gray-200 ${isCollapsed ? 'hidden' : ''}`}
            >
              <Eclipse className="mr-3" size={20} />
              Today
            </Link>
          </div>
        </nav>
      </div>
      <div className="p-4">
      <Separator className='my-3 mt-2'></Separator>

        <GAuth />
        
      </div>
    </div>
  );
};

export default Sidebar;

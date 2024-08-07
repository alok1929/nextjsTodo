import { useState, useEffect } from 'react';

type Todo = {
  id: number;
  content: string;
};

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await fetch('/api/todos');
    const data = await response.json();
    setTodos(data);
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
  
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          {todo.content}
          <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
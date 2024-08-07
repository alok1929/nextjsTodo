import { useState } from 'react';

type Props = {
  onAdd: () => void;
};

export default function AddTodoForm({ onAdd }: Props) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    setContent('');
    onAdd();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter a new todo"
        required
      />
      <button type="submit">Add Todo</button>
    </form>
  );
}
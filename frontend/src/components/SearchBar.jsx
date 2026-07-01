import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ placeholder = 'Search by title, author, or course code...' }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-4 pr-24 py-2.5 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:border-stone-400"
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1.5 px-4 py-1.5 bg-ink text-white text-sm rounded-md hover:bg-stone-800"
      >
        Search
      </button>
    </form>
  );
}

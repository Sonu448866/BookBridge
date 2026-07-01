import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import LoadingGrid from '../components/LoadingGrid';
import EmptyState from '../components/EmptyState';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    api.get('/search', { params: { q } })
      .then(({ data }) => setItems(data.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-1">Search results</h1>
      <p className="text-sm text-muted mb-8">
        {q ? `Showing results for "${q}"` : 'Enter a search term'}
      </p>

      {loading ? (
        <LoadingGrid />
      ) : items.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState title="No results" description="Try searching by course code, title, or author." />
      )}
    </div>
  );
}

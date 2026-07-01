import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import LoadingGrid from '../components/LoadingGrid';
import EmptyState from '../components/EmptyState';
import { Link } from 'react-router-dom';

export default function Marketplace() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [condition, setCondition] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const url = q ? '/search' : '/items';
        const params = q ? { q, type: 'book', condition: condition || undefined } : { type: 'book', condition: condition || undefined };
        const { data } = await api.get(url, { params });
        setItems(data.items);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [q, condition]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Marketplace</h1>
          <p className="text-sm text-muted mt-1">Physical books from fellow students</p>
        </div>
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="text-sm border border-border rounded-md px-3 py-2 bg-surface"
        >
          <option value="">All conditions</option>
          <option value="new">New</option>
          <option value="like_new">Like New</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
        </select>
      </div>

      {loading ? (
        <LoadingGrid />
      ) : items.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No books found"
          description={q ? `Nothing matched "${q}". Try a different search.` : 'Be the first to list a book this semester.'}
          action={<Link to="/sell" className="text-sm text-accent hover:underline">List a book</Link>}
        />
      )}
    </div>
  );
}

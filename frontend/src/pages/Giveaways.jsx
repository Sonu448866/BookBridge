import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import LoadingGrid from '../components/LoadingGrid';
import EmptyState from '../components/EmptyState';

export default function Giveaways() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/items', { params: { type: 'giveaway' } })
      .then(({ data }) => setItems(data.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Giveaways</h1>
        <p className="text-sm text-muted mt-1">
          Seniors donating books — pick up for free on campus
        </p>
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
          title="No giveaways right now"
          description="Check back later or list a book you want to donate."
          action={<Link to="/sell" className="text-sm text-accent hover:underline">Donate a book</Link>}
        />
      )}
    </div>
  );
}

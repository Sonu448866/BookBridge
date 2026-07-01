import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import LoadingGrid from '../components/LoadingGrid';
import EmptyState from '../components/EmptyState';

export default function Resources() {
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState('note');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const { data } = await api.get('/items', { params: { type: tab } });
        setItems(data.items);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [tab]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Resource Hub</h1>
        <p className="text-sm text-muted mt-1">Notes and question papers shared by students</p>
      </div>

      <div className="flex gap-2 mb-8">
        {[
          { key: 'note', label: 'Notes' },
          { key: 'question_paper', label: 'Question Papers' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm rounded-md border ${
              tab === t.key
                ? 'bg-ink text-white border-ink'
                : 'bg-surface border-border text-muted hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
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
          title="Nothing here yet"
          description="Upload your notes or past papers to help juniors."
          action={<Link to="/sell" className="text-sm text-accent hover:underline">Upload resource</Link>}
        />
      )}
    </div>
  );
}

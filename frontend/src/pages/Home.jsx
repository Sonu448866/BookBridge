import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api';
import SearchBar from '../components/SearchBar';
import ItemCard from '../components/ItemCard';
import LoadingGrid from '../components/LoadingGrid';

export default function Home() {
  const { user, token } = useSelector((s) => s.auth);
  const [recommended, setRecommended] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const recUrl = token ? '/recommendations' : '/recommendations/public';
        const [recRes, itemsRes] = await Promise.all([
          api.get(recUrl, { params: token ? {} : { major: 'Computer Science', semester: 3 } }),
          api.get('/items', { params: { limit: 8 } }),
        ]);
        setRecommended(recRes.data.items);
        setRecent(itemsRes.data.items);
      } catch {
        setRecommended([]);
        setRecent([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token, user]);

  return (
    <div>
      <section className="border-b border-border bg-surface">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
          <p className="text-sm text-accent font-medium mb-3">Campus marketplace</p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight max-w-lg leading-tight mb-4">
            Buy, sell, and share academic resources on campus
          </h1>
          <p className="text-muted max-w-md mb-8 text-[15px] leading-relaxed">
            Textbooks, notes, and question papers from verified students.
            No more overpaying for books you use for one semester.
          </p>
          <SearchBar />
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-14">
        <section>
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">
                {user ? `Picks for Semester ${user.semester}` : 'Popular this semester'}
              </h2>
              {user?.major && (
                <p className="text-sm text-muted mt-0.5">{user.major}</p>
              )}
            </div>
            <Link to="/marketplace" className="text-sm text-accent hover:underline">
              View all
            </Link>
          </div>
          {loading ? (
            <LoadingGrid count={4} />
          ) : recommended.length ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recommended.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No recommendations yet. Try browsing the marketplace.</p>
          )}
        </section>

        <section>
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-lg font-semibold">Recently listed</h2>
            <Link to="/marketplace" className="text-sm text-accent hover:underline">
              Browse marketplace
            </Link>
          </div>
          {loading ? (
            <LoadingGrid count={4} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recent.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </section>

        <section className="grid md:grid-cols-3 gap-4">
          {[
            { title: 'Sell your books', desc: 'List with ISBN scan and fair price suggestions', to: '/sell' },
            { title: 'Share notes', desc: 'Upload PDFs or markdown for your courses', to: '/resources' },
            { title: 'Give away', desc: 'Donate books instead of letting them collect dust', to: '/giveaways' },
          ].map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="p-5 bg-surface border border-border rounded-lg hover:border-stone-300 transition-colors"
            >
              <h3 className="font-medium mb-1">{card.title}</h3>
              <p className="text-sm text-muted">{card.desc}</p>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}

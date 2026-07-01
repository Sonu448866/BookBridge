import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { formatPrice, formatCondition, formatType } from '../utils/helpers';
import { isPdfUrl, getPdfViewUrl, getPdfDownloadUrl } from '../utils/media';

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    api.get(`/items/${id}`)
      .then(({ data }) => setItem(data))
      .catch(() => navigate('/marketplace'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  async function startChat() {
    if (!user) return navigate('/login');
    const { data } = await api.post('/chat', {
      recipientId: item.seller._id,
      itemId: item._id,
    });
    navigate(`/messages/${data._id}`);
  }

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-16 text-center text-muted">Loading...</div>;
  }

  if (!item) return null;

  const images = (item.images || []).filter((url) => !url.includes('placehold.co'));
  const hasImages = images.length > 0;
  const hasPdf = item.documentUrl && isPdfUrl(item.documentUrl);

  const isOwner = user?.id === item.seller?._id;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <div className="aspect-[4/5] bg-stone-100 rounded-lg overflow-hidden mb-3">
            {hasImages ? (
              <img
                src={images[activeImage]}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : hasPdf ? (
              <iframe
                src={getPdfViewUrl(item.documentUrl)}
                title={item.title}
                className="w-full h-full border-0"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted text-sm">
                No preview available
              </div>
            )}
          </div>
          {hasImages && images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-20 rounded overflow-hidden border-2 ${
                    i === activeImage ? 'border-accent' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-0.5 bg-tag rounded text-amber-900">
              {formatType(item.type)}
            </span>
            {item.courseCode && (
              <span className="text-xs text-muted">{item.courseCode}</span>
            )}
          </div>

          <h1 className="text-2xl font-semibold mb-1">{item.title}</h1>
          {item.author && <p className="text-muted mb-4">{item.author}</p>}

          <p className="text-3xl font-semibold text-accent mb-1">
            {formatPrice(item.price)}
          </p>
          {item.suggestedPrice > 0 && item.price !== item.suggestedPrice && (
            <p className="text-sm text-muted mb-4">
              Suggested fair price: {formatPrice(item.suggestedPrice)}
            </p>
          )}
          {item.originalPrice > 0 && (
            <p className="text-sm text-muted mb-4">
              Original MRP: {formatPrice(item.originalPrice)}
            </p>
          )}

          {item.condition && (
            <p className="text-sm mb-4">
              Condition: <span className="font-medium">{formatCondition(item.condition)}</span>
            </p>
          )}

          {item.description && (
            <p className="text-sm text-muted leading-relaxed mb-6">{item.description}</p>
          )}

          {item.meetupPoint?.name && (
            <div className="text-sm mb-6 p-3 bg-surface border border-border rounded-md">
              <p className="font-medium mb-0.5">Meetup point</p>
              <p className="text-muted">{item.meetupPoint.name}</p>
            </div>
          )}

          {item.documentUrl && (
            <div className="mb-6">
              <a
                href={getPdfDownloadUrl(item.documentUrl)}
                target="_blank"
                rel="noreferrer"
                download
                className="inline-block text-sm text-accent hover:underline"
              >
                Open / download PDF
              </a>
            </div>
          )}

          <div className="border-t border-border pt-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center text-sm font-medium">
                {item.seller?.name?.[0]}
              </div>
              <div>
                <p className="font-medium text-sm">{item.seller?.name}</p>
                <div className="flex items-center gap-2">
                  {item.seller?.isVerified && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded">
                      Verified Student
                    </span>
                  )}
                  {item.seller?.rating > 0 && (
                    <span className="text-xs text-muted">{item.seller.rating.toFixed(1)} ★</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {!isOwner && item.status === 'available' && (
            <button
              onClick={startChat}
              className="w-full py-3 bg-accent text-white rounded-md hover:bg-accent-hover text-sm font-medium"
            >
              Message seller
            </button>
          )}

          {isOwner && (
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  await api.patch(`/items/${item._id}/status`, { status: 'sold' });
                  setItem({ ...item, status: 'sold' });
                }}
                className="flex-1 py-2.5 border border-border rounded-md text-sm hover:bg-stone-50"
              >
                Mark as sold
              </button>
              <Link
                to="/sell"
                className="flex-1 py-2.5 text-center border border-border rounded-md text-sm hover:bg-stone-50"
              >
                List another
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

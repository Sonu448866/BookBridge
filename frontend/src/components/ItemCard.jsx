import { Link } from 'react-router-dom';
import { formatPrice, formatCondition, formatType } from '../utils/helpers';
import { getItemCover } from '../utils/media';

export default function ItemCard({ item }) {
  const cover = getItemCover(item);
  const seller = item.seller;

  return (
    <Link
      to={`/item/${item._id}`}
      className="group block bg-surface border border-border rounded-lg overflow-hidden hover:border-stone-300 transition-colors"
    >
      <div className="aspect-[4/5] bg-stone-100 overflow-hidden">
        {cover.type === 'image' ? (
          <img
            src={cover.src}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            onError={(e) => { e.target.src = 'https://placehold.co/400x500/e7e5e4/78716c?text=No+Image'; }}
          />
        ) : cover.type === 'pdf' ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 text-red-800">
            <span className="text-3xl font-bold">PDF</span>
            <span className="text-xs mt-1 text-red-600">Document</span>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted text-sm">
            No preview
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-medium text-sm leading-snug line-clamp-2">{item.title}</h3>
          <span className="text-sm font-semibold text-accent shrink-0">
            {formatPrice(item.price)}
          </span>
        </div>
        {item.author && (
          <p className="text-xs text-muted mb-2 truncate">{item.author}</p>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] px-2 py-0.5 bg-tag rounded text-amber-900">
            {formatType(item.type)}
          </span>
          {item.courseCode && (
            <span className="text-[11px] text-muted">{item.courseCode}</span>
          )}
          {item.condition && (
            <span className="text-[11px] text-muted">{formatCondition(item.condition)}</span>
          )}
        </div>
        {seller && (
          <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
            <span className="text-xs text-muted">{seller.name}</span>
            {seller.isVerified && (
              <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded">
                Verified
              </span>
            )}
            {seller.rating > 0 && (
              <span className="text-xs text-muted ml-auto">{seller.rating.toFixed(1)} ★</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

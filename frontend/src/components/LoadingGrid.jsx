export default function LoadingGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-surface border border-border rounded-lg overflow-hidden animate-pulse">
          <div className="aspect-[4/5] bg-stone-200" />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-stone-200 rounded w-3/4" />
            <div className="h-3 bg-stone-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

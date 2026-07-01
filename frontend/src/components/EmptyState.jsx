export default function EmptyState({ title, description, action }) {
  return (
    <div className="text-center py-16 px-4">
      <p className="text-lg font-medium mb-1">{title}</p>
      <p className="text-sm text-muted mb-6 max-w-sm mx-auto">{description}</p>
      {action}
    </div>
  );
}

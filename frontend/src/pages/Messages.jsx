import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { connectSocket } from '../services/socket';

export default function Messages() {
  const { user, token } = useSelector((s) => s.auth);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if (!token) return;
    connectSocket(user.id);
    api.get('/chat')
      .then(({ data }) => setConversations(data))
      .catch(() => setConversations([]));
  }, [token, user]);

  if (!token) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-muted mb-4">Log in to view your messages</p>
        <Link to="/login" className="text-accent hover:underline text-sm">Log in</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Messages</h1>

      {conversations.length === 0 ? (
        <p className="text-sm text-muted">No conversations yet. Message a seller from a listing page.</p>
      ) : (
        <div className="divide-y divide-border border border-border rounded-lg bg-surface overflow-hidden">
          {conversations.map((conv) => {
            const other = conv.participants.find((p) => p._id !== user.id);
            return (
              <Link
                key={conv._id}
                to={`/messages/${conv._id}`}
                className="flex items-center gap-4 px-4 py-3 hover:bg-stone-50"
              >
                <div className="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center text-sm shrink-0">
                  {other?.name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{other?.name}</p>
                  <p className="text-xs text-muted truncate">
                    {conv.item?.title} · {conv.lastMessage || 'No messages yet'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

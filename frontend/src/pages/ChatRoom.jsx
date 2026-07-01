import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { connectSocket, getSocket } from '../services/socket';

export default function ChatRoom() {
  const { id } = useParams();
  const { user, token } = useSelector((s) => s.auth);
  const [conversation, setConversation] = useState(null);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    connectSocket(user.id);
    const socket = getSocket();
    socket.emit('join_conversation', id);

    api.get(`/chat/${id}`).then(({ data }) => {
      setConversation(data);
      api.patch(`/chat/${id}/seen`);
    });

    socket.on('new_message', (msg) => {
      setConversation((prev) => {
        if (!prev) return prev;
        return { ...prev, messages: [...prev.messages, msg] };
      });
    });

    socket.on('user_typing', (name) => setTyping(name));
    socket.on('messages_seen', () => {
      setConversation((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: prev.messages.map((m) =>
            m.sender?._id !== user.id && m.sender !== user.id ? { ...m, seen: true } : m
          ),
        };
      });
    });

    return () => {
      socket.off('new_message');
      socket.off('user_typing');
      socket.off('messages_seen');
    };
  }, [id, token, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  function sendMessage(e) {
    e.preventDefault();
    if (!text.trim()) return;

    const socket = getSocket();
    socket.emit('send_message', {
      conversationId: id,
      senderId: user.id,
      text: text.trim(),
    });
    setText('');
    socket.emit('mark_seen', id);
  }

  if (!token) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <Link to="/login" className="text-accent hover:underline text-sm">Log in to chat</Link>
      </div>
    );
  }

  if (!conversation) {
    return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-muted">Loading...</div>;
  }

  const other = conversation.participants.find((p) => p._id !== user.id);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
        <Link to="/messages" className="text-sm text-muted hover:text-ink">← Back</Link>
        <div>
          <p className="font-medium text-sm">{other?.name}</p>
          <p className="text-xs text-muted">{conversation.item?.title}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {conversation.messages.map((msg, i) => {
          const senderId = msg.sender?._id || msg.sender;
          const isMine = senderId === user.id;
          return (
            <div key={msg._id || i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
                  isMine ? 'bg-ink text-white' : 'bg-surface border border-border'
                }`}
              >
                <p>{msg.text}</p>
                {isMine && (
                  <p className="text-[10px] opacity-60 mt-1 text-right">
                    {msg.seen ? 'Seen' : 'Sent'}
                  </p>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {typing && <p className="text-xs text-muted mb-2">{typing} is typing...</p>}

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            getSocket().emit('typing', { conversationId: id, userName: user.name });
          }}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border border-border rounded-md bg-surface text-sm"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-accent text-white text-sm rounded-md hover:bg-accent-hover"
        >
          Send
        </button>
      </form>
    </div>
  );
}

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/api';
import { fetchMe } from '../store/authSlice';
import { MAJORS } from '../utils/helpers';

export default function Profile() {
  const { user, token } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: user?.name || '',
    major: user?.major || 'Computer Science',
    semester: user?.semester || 1,
  });
  const [saved, setSaved] = useState(false);

  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center text-muted">
        Please log in to view your profile.
      </div>
    );
  }

  async function handleSave(e) {
    e.preventDefault();
    await api.put('/auth/profile', { ...form, semester: Number(form.semester) });
    dispatch(fetchMe());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Profile</h1>

      <div className="bg-surface border border-border rounded-lg p-5 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-stone-200 rounded-full flex items-center justify-center text-xl font-medium">
            {user.name[0]}
          </div>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted">{user.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted">Rating</p>
            <p className="font-medium">{user.rating ? `${user.rating.toFixed(1)} ★` : '—'}</p>
          </div>
          <div>
            <p className="text-muted">Karma</p>
            <p className="font-medium">{user.karmaPoints} pts</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm mb-1.5">Display name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-md bg-surface text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1.5">Major</label>
          <select
            value={form.major}
            onChange={(e) => setForm({ ...form, major: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-md bg-surface text-sm"
          >
            {MAJORS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1.5">Current semester</label>
          <select
            value={form.semester}
            onChange={(e) => setForm({ ...form, semester: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-md bg-surface text-sm"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-2.5 bg-ink text-white text-sm rounded-md hover:bg-stone-800"
        >
          {saved ? 'Saved!' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}

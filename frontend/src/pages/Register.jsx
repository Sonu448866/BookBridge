import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../store/authSlice';
import { MAJORS } from '../utils/helpers';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    major: 'Computer Science',
    semester: 1,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  function handleChange(e) {
    dispatch(clearError());
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await dispatch(registerUser({
      ...form,
      semester: Number(form.semester),
    }));
    if (registerUser.fulfilled.match(result)) navigate('/');
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-semibold mb-1">Create account</h1>
      <p className="text-sm text-muted mb-8">Verified campus email required</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{error}</p>
        )}
        <div>
          <label className="block text-sm mb-1.5">Full name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-border rounded-md bg-surface text-sm focus:outline-none focus:border-stone-400"
          />
        </div>
        <div>
          <label className="block text-sm mb-1.5">University email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@spit.ac.in"
            className="w-full px-3 py-2 border border-border rounded-md bg-surface text-sm focus:outline-none focus:border-stone-400"
          />
        </div>
        <div>
          <label className="block text-sm mb-1.5">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full px-3 py-2 border border-border rounded-md bg-surface text-sm focus:outline-none focus:border-stone-400"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1.5">Major</label>
            <select
              name="major"
              value={form.major}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md bg-surface text-sm"
            >
              {MAJORS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1.5">Semester</label>
            <select
              name="semester"
              value={form.semester}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md bg-surface text-sm"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>Sem {s}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-ink text-white text-sm rounded-md hover:bg-stone-800 disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
      </form>

      <p className="text-sm text-muted text-center mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-accent hover:underline">Log in</Link>
      </p>
    </div>
  );
}

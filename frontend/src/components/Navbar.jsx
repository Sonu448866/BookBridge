import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { disconnectSocket } from '../services/socket';

const links = [
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/resources', label: 'Resources' },
  { to: '/giveaways', label: 'Giveaways' },
];

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    disconnectSocket();
    dispatch(logout());
    navigate('/');
  }

  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg tracking-tight">
          <span className="w-7 h-7 bg-accent rounded flex items-center justify-center text-white text-xs font-bold">B</span>
          BookBridge
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm ${isActive ? 'text-ink font-medium' : 'text-muted hover:text-ink'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/sell"
                className="hidden sm:inline text-sm px-3 py-1.5 bg-accent text-white rounded-md hover:bg-accent-hover"
              >
                List Item
              </Link>
              <Link to="/messages" className="text-sm text-muted hover:text-ink">
                Messages
              </Link>
              <Link to="/profile" className="text-sm text-muted hover:text-ink">
                {user.name.split(' ')[0]}
              </Link>
              <button onClick={handleLogout} className="text-sm text-muted hover:text-ink">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-muted hover:text-ink">
                Log in
              </Link>
              <Link
                to="/register"
                className="text-sm px-3 py-1.5 bg-ink text-white rounded-md hover:bg-stone-800"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

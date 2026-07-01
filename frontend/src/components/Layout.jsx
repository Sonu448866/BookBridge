import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted">
          <p>BookBridge — campus resource exchange for SPIT students</p>
        </div>
      </footer>
    </div>
  );
}

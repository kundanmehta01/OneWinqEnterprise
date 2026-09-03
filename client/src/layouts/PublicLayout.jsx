import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col">
      {/* Public Navbar */}
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-500 flex items-center justify-center text-white font-extrabold text-lg shadow-xs">
              W
            </div>
            <span className="text-lg font-black text-slate-900 tracking-tight">OneWinq</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Public Page View */}
      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-100 bg-white py-6 text-center text-xs text-slate-400">
        <p>&copy; {new Date().getFullYear()} OneWinq Enterprise. Verified Digital Identity.</p>
      </footer>
    </div>
  );
};

import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative blurred background shapes */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Header Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link to="/" className="inline-flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-md tracking-tighter">
            W
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">OneWinq</span>
        </Link>
        <p className="mt-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
          Enterprise Identity & Platform
        </p>
      </div>

      {/* Card Content */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-slate-100">
          <Outlet />
        </div>
        <p className="mt-6 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} OneWinq Enterprise. All rights reserved.
        </p>
      </div>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getDashboardPath } from '../../utils/roleRouting';
import { Home, ArrowLeft, Zap } from 'lucide-react';

export const NotFoundPage = () => {
  const { user, role } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-6">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366F1_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 mb-6">
          <Zap className="w-8 h-8 text-indigo-400" />
        </div>

        <h1 className="text-8xl font-black text-white/10 leading-none select-none">404</h1>
        <h2 className="text-2xl font-extrabold text-white mt-2">Page Not Found</h2>
        <p className="text-sm text-white/50 mt-3 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist, has been moved, or the link may be broken.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Link
            to={user ? getDashboardPath(role) : '/login'}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-5 py-3 rounded-xl transition shadow-lg shadow-indigo-900/40"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-white/50 hover:text-white font-semibold text-sm px-5 py-3 rounded-xl border border-white/10 hover:border-white/20 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        <p className="text-[11px] text-white/20 mt-8">
          OneWinq Enterprise · Not Found
        </p>
      </div>
    </div>
  );
};

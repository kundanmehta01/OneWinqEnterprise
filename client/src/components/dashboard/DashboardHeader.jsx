import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

export const DashboardHeader = ({ userName = 'Super Admin' }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Welcome back, {userName}! Here&apos;s what&apos;s happening with OneWinq.
        </p>
      </div>

      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition self-start sm:self-auto cursor-pointer"
      >
        <Calendar className="w-4 h-4 text-slate-400" />
        <span>May 18 – May 24, 2025</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>
    </div>
  );
};

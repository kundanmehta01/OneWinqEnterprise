import React from 'react';
import { Calendar } from 'lucide-react';

export const AnalyticsDateFilter = ({ selected = '30d', onSelect }) => {
  const ranges = [
    { label: 'Today', value: 'today' },
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '90 Days', value: '90d' }
  ];

  return (
    <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/80">
      <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
      {ranges.map((r) => (
        <button
          key={r.value}
          onClick={() => onSelect?.(r.value)}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
            selected === r.value ? 'bg-white text-indigo-600 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
};

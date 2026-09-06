import React from 'react';
import { Calendar } from 'lucide-react';

export const DateRangePicker = ({ value = '30d', onChange }) => {
  const options = [
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '90 Days', value: '90d' },
    { label: '1 Year', value: '1y' }
  ];

  return (
    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-xl p-1">
      <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange?.(opt.value)}
          className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition cursor-pointer ${
            value === opt.value
              ? 'bg-white text-indigo-600 shadow-2xs font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

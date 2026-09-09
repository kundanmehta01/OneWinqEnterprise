import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const QuickActionCard = ({ title, description, icon: Icon, onClick, color = 'indigo' }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-start justify-between p-4 rounded-2xl bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all text-left w-full group cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-800">{title}</h4>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{description}</p>
        </div>
      </div>
      <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors flex-shrink-0" />
    </button>
  );
};

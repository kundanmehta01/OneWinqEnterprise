import React from 'react';
import { Search } from 'lucide-react';

export const TemplateFilters = ({ search, onSearchChange }) => {
  return (
    <div className="relative max-w-sm">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        placeholder="Filter templates..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200/80 bg-slate-50/50 text-xs text-slate-800"
      />
    </div>
  );
};

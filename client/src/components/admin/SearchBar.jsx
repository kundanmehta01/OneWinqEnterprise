import React from 'react';
import { Search } from 'lucide-react';

export const SearchBar = ({ onOpen, placeholder = 'Search anything...' }) => {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="relative hidden sm:flex items-center w-full max-w-sm rounded-xl border border-slate-200/80 bg-slate-50/60 px-3.5 py-2 text-xs text-slate-400 hover:border-slate-300 hover:bg-slate-50 transition shadow-2xs group"
    >
      <Search className="w-4 h-4 mr-2.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
      <span className="flex-1 text-left">{placeholder}</span>
      <kbd className="inline-flex items-center rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 shadow-2xs">
        Ctrl + K
      </kbd>
    </button>
  );
};

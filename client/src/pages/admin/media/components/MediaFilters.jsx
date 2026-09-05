import React from 'react';

export default function MediaFilters({ value, onChange }) {
  return <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3">
    {['all', 'image', 'document'].map((filter) => <button key={filter} type="button" onClick={() => onChange(filter)} className={`rounded-lg px-3 py-2 text-xs font-semibold capitalize ${value === filter ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>{filter}s</button>)}
  </div>;
}

import React from 'react';

export const NotificationFilters = ({ filter = 'all', onFilterChange, counts = {} }) => {
  return (
    <div className="flex items-center gap-2">
      {['all', 'unread', 'read'].map((f) => (
        <button
          key={f}
          onClick={() => onFilterChange?.(f)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
            filter === f ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-600'
          }`}
        >
          {f} {counts[f] !== undefined ? `(${counts[f]})` : ''}
        </button>
      ))}
    </div>
  );
};

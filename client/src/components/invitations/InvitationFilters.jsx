import React from 'react';
import { Search } from 'lucide-react';

export const InvitationFilters = ({ search, onSearchChange, status, onStatusChange }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by invitee..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200/80 bg-slate-50/50 text-xs text-slate-800"
        />
      </div>
      <div className="flex gap-2">
        {['all', 'pending', 'accepted', 'expired'].map((s) => (
          <button
            key={s}
            onClick={() => onStatusChange(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize ${
              status === s ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-600'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};

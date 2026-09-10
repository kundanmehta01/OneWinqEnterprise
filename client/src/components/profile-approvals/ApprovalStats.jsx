import React from 'react';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

export const ApprovalStats = ({ pending = 0, approved = 0, rejected = 0 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending Review</span>
        <h3 className="text-2xl font-black text-amber-700 mt-2">{pending}</h3>
      </div>
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Approved Live</span>
        <h3 className="text-2xl font-black text-emerald-700 mt-2">{approved}</h3>
      </div>
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card">
        <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Changes Requested</span>
        <h3 className="text-2xl font-black text-rose-700 mt-2">{rejected}</h3>
      </div>
    </div>
  );
};

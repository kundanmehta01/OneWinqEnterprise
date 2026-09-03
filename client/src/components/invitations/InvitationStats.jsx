import React from 'react';
import { Send, CheckCircle2, Clock } from 'lucide-react';

export const InvitationStats = ({ total = 0, accepted = 0, pending = 0 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sent</span>
        <h3 className="text-2xl font-black text-slate-900 mt-2">{total}</h3>
      </div>
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Accepted & Active</span>
        <h3 className="text-2xl font-black text-emerald-700 mt-2">{accepted}</h3>
      </div>
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending Response</span>
        <h3 className="text-2xl font-black text-amber-700 mt-2">{pending}</h3>
      </div>
    </div>
  );
};

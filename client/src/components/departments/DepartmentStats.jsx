import React from 'react';
import { Network, Users, CheckCircle2 } from 'lucide-react';

export const DepartmentStats = ({ total = 0, totalMembers = 0, active = 0 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Departments</span>
        <h3 className="text-2xl font-black text-slate-900 mt-2">{total}</h3>
      </div>
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Assigned Members</span>
        <h3 className="text-2xl font-black text-indigo-700 mt-2">{totalMembers}</h3>
      </div>
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Active Units</span>
        <h3 className="text-2xl font-black text-emerald-700 mt-2">{active}</h3>
      </div>
    </div>
  );
};

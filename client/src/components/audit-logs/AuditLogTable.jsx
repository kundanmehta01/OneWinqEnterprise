import React from 'react';

export const AuditLogTable = ({ children }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <th className="py-3.5 px-4 pl-6">Actor</th>
            <th className="py-3.5 px-4">Action</th>
            <th className="py-3.5 px-4">Module</th>
            <th className="py-3.5 px-4">IP Address</th>
            <th className="py-3.5 px-4 pr-6">Timestamp</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 text-xs text-slate-700">
          {children}
        </tbody>
      </table>
    </div>
  );
};

import React from 'react';

export const PermissionTable = ({ permissions = [] }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <th className="py-3 px-4 pl-6">Permission Name</th>
            <th className="py-3 px-4">Code</th>
            <th className="py-3 px-4">Module</th>
            <th className="py-3 px-4 pr-6">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 text-xs">
          {permissions.map((p) => (
            <tr key={p._id || p.code} className="hover:bg-slate-50/50">
              <td className="py-3 px-4 pl-6 font-bold text-slate-800">{p.name}</td>
              <td className="py-3 px-4 font-mono text-indigo-600 text-[11px]">{p.code}</td>
              <td className="py-3 px-4 text-slate-500 capitalize">{p.module}</td>
              <td className="py-3 px-4 pr-6 text-slate-400">{p.description || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

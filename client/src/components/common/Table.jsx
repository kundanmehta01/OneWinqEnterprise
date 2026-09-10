import React from 'react';

export const Table = ({ headers = [], children, className = '' }) => {
  return (
    <div className={`overflow-x-auto rounded-2xl border border-slate-100 bg-white ${className}`}>
      <table className="w-full text-left border-collapse">
        {headers.length > 0 && (
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {headers.map((h, idx) => (
                <th key={idx} className="py-3.5 px-4 first:pl-6 last:pr-6">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-slate-50 text-xs text-slate-700">
          {children}
        </tbody>
      </table>
    </div>
  );
};

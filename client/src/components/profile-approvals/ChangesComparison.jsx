import React from 'react';

export const ChangesComparison = ({ before = {}, after = {} }) => {
  return (
    <div className="grid grid-cols-2 gap-3 text-xs">
      <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl">
        <h5 className="font-bold text-rose-700 mb-1">Previous State</h5>
        <p className="text-slate-600">{before.bio || 'Empty'}</p>
      </div>
      <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
        <h5 className="font-bold text-emerald-700 mb-1">Proposed Update</h5>
        <p className="text-slate-600">{after.bio || 'Empty'}</p>
      </div>
    </div>
  );
};

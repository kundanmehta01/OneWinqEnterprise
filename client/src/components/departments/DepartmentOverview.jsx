import React from 'react';

export const DepartmentOverview = ({ department }) => {
  if (!department) return null;
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card">
      <h3 className="text-sm font-bold text-slate-900">{department.name}</h3>
      <p className="text-xs text-slate-500 mt-1">{department.description}</p>
    </div>
  );
};

import React from 'react';

const departmentColorMap = {
  marketing: 'bg-purple-50 text-purple-700 border-purple-100',
  engineering: 'bg-blue-50 text-blue-700 border-blue-100',
  design: 'bg-pink-50 text-pink-700 border-pink-100',
  'human-resources': 'bg-amber-50 text-amber-700 border-amber-100',
  hr: 'bg-amber-50 text-amber-700 border-amber-100',
  product: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  sales: 'bg-orange-50 text-orange-700 border-orange-100',
  'customer-support': 'bg-indigo-50 text-indigo-700 border-indigo-100',
  support: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  finance: 'bg-teal-50 text-teal-700 border-teal-100',
  executive: 'bg-slate-100 text-slate-800 border-slate-200'
};

export const DepartmentBadge = ({ name, className = '' }) => {
  if (!name) return null;
  const key = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const matchedClass = departmentColorMap[key] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${matchedClass} ${className}`}>
      {name}
    </span>
  );
};

export const RoleBadge = ({ role, type = '', className = '' }) => {
  if (!role && !type) return null;
  const isCustom = type.toLowerCase() === 'custom';
  const isSystem = type.toLowerCase() === 'system';

  if (type) {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        isSystem ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
      } ${className}`}>
        {type}
      </span>
    );
  }

  const isAdm = role.toLowerCase().includes('admin');
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      isAdm ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-blue-50 text-blue-700 border border-blue-100'
    } ${className}`}>
      {role}
    </span>
  );
};

export const StatusBadge = ({ status, text, className = '' }) => {
  const norm = (status || '').toLowerCase();
  const label = text || status;

  if (norm === 'active' || norm === 'approved' || norm === 'success') {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 ${className}`}>
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        {label || 'Active'}
      </span>
    );
  }

  if (norm === 'pending' || norm === 'pending_approval' || norm === 'changes_requested') {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 ${className}`}>
        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
        {label || 'Pending Approval'}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 ${className}`}>
      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
      {label || 'Inactive'}
    </span>
  );
};

import React from 'react';
import { Network, Edit, Trash2 } from 'lucide-react';

export const DepartmentRow = ({ department, onEdit, onDelete }) => {
  return (
    <tr className="hover:bg-slate-50/50 transition">
      <td className="py-3.5 px-4 pl-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Network className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-900">{department.name}</span>
        </div>
      </td>
      <td className="py-3.5 px-4 text-xs text-slate-500 max-w-xs truncate">
        {department.description || '-'}
      </td>
      <td className="py-3.5 px-4 font-bold text-slate-700">
        {department.memberCount || 0}
      </td>
      <td className="py-3.5 px-4 text-slate-400">
        {department.parentDepartmentId?.name || 'None'}
      </td>
      <td className="py-3.5 px-4 pr-6 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onEdit?.(department)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(department)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

import React from 'react';
import { Badge } from '../common/Badge';
import { ExternalLink, MoreVertical } from 'lucide-react';

export const MemberRow = ({ member, onEdit, onArchive, onRestore }) => {
  const profile = member.profileId || {};
  const status = member.status || 'active';
  const approvalStatus = profile.approvalStatus || 'draft';

  return (
    <tr className="hover:bg-slate-50/50 transition">
      <td className="py-3 px-4 pl-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
            {member.name?.charAt(0) || 'M'}
          </div>
          <div>
            <p className="font-bold text-slate-800">{member.name}</p>
            <p className="text-[11px] text-slate-400">{member.email}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-xs font-medium text-slate-700">
        {member.departmentId?.name || 'General'}
      </td>
      <td className="py-3 px-4 text-xs text-slate-500">
        {member.designation || '-'}
      </td>
      <td className="py-3 px-4">
        <Badge variant={status === 'active' ? 'green' : 'default'} dot>
          {status}
        </Badge>
      </td>
      <td className="py-3 px-4 pr-6 text-right">
        <button
          type="button"
          onClick={() => onEdit?.(member)}
          className="text-indigo-600 hover:text-indigo-800 font-bold text-xs"
        >
          Edit
        </button>
      </td>
    </tr>
  );
};

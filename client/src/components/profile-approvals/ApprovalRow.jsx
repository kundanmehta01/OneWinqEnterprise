import React from 'react';
import { Badge } from '../common/Badge';
import { formatDate } from '../../utils/formatDate';

export const ApprovalRow = ({ item, onReview }) => {
  const member = item.memberId || {};
  const status = item.status || 'pending';

  return (
    <tr className="hover:bg-slate-50/50 transition">
      <td className="py-3.5 px-4 pl-6">
        <div>
          <p className="font-bold text-slate-800">{member.name || 'Member'}</p>
          <p className="text-[11px] text-slate-400">{member.email}</p>
        </div>
      </td>
      <td className="py-3.5 px-4 text-xs text-slate-600">
        {member.departmentId?.name || 'General'}
      </td>
      <td className="py-3.5 px-4 text-xs text-slate-400">
        {formatDate(item.createdAt)}
      </td>
      <td className="py-3.5 px-4">
        <Badge variant={status === 'approved' ? 'green' : status === 'pending' ? 'amber' : 'rose'} dot>
          {status}
        </Badge>
      </td>
      <td className="py-3.5 px-4 pr-6 text-right">
        <button
          type="button"
          onClick={() => onReview?.(item)}
          className="text-indigo-600 hover:text-indigo-800 font-bold text-xs"
        >
          Review Changes
        </button>
      </td>
    </tr>
  );
};

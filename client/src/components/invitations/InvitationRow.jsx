import React from 'react';
import { Badge } from '../common/Badge';
import { formatDate } from '../../utils/formatDate';

export const InvitationRow = ({ invitation, onResend, onCancel, onCopy }) => {
  const status = invitation.status || 'pending';

  return (
    <tr className="hover:bg-slate-50/50 transition">
      <td className="py-3.5 px-4 pl-6">
        <div>
          <p className="font-bold text-slate-800">{invitation.name}</p>
          <p className="text-[11px] text-slate-400">{invitation.email}</p>
        </div>
      </td>
      <td className="py-3.5 px-4 text-xs text-slate-600">
        {invitation.designation || 'Team Member'}
      </td>
      <td className="py-3.5 px-4">
        <Badge variant={status === 'accepted' ? 'green' : status === 'pending' ? 'amber' : 'default'} dot>
          {status}
        </Badge>
      </td>
      <td className="py-3.5 px-4 text-xs text-slate-400">
        {formatDate(invitation.expiresAt)}
      </td>
      <td className="py-3.5 px-4 pr-6 text-right">
        {status === 'pending' && (
          <div className="flex items-center justify-end gap-2 text-xs font-semibold">
            <button type="button" onClick={() => onCopy?.(invitation)} className="text-indigo-600 hover:underline">
              Copy
            </button>
            <button type="button" onClick={() => onResend?.(invitation._id)} className="text-slate-600 hover:underline">
              Resend
            </button>
            <button type="button" onClick={() => onCancel?.(invitation._id)} className="text-rose-500 hover:underline">
              Cancel
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

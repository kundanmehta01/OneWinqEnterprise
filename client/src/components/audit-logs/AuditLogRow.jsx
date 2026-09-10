import React from 'react';
import { Badge } from '../common/Badge';
import { formatDate } from '../../utils/formatDate';

export const AuditLogRow = ({ log, onSelect }) => {
  return (
    <tr onClick={() => onSelect?.(log)} className="hover:bg-slate-50/50 transition cursor-pointer">
      <td className="py-3.5 px-4 pl-6 font-bold text-slate-800">
        {log.actorEmail || 'System'}
      </td>
      <td className="py-3.5 px-4">
        <Badge variant="indigo">{log.action}</Badge>
      </td>
      <td className="py-3.5 px-4 capitalize text-slate-600">{log.module}</td>
      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{log.ipAddress || '-'}</td>
      <td className="py-3.5 px-4 pr-6 text-slate-400">{formatDate(log.createdAt)}</td>
    </tr>
  );
};

import React from 'react';
import { formatRelativeTime } from '../../utils/formatDate';

export const ActivityItem = ({ icon: Icon, title, description, timestamp }) => {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition">
      {Icon && (
        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-800 truncate">{title}</p>
        {description && <p className="text-[11px] text-slate-400 mt-0.5 truncate">{description}</p>}
      </div>
      {timestamp && (
        <span className="text-[10px] text-slate-400 whitespace-nowrap">
          {formatRelativeTime(timestamp)}
        </span>
      )}
    </div>
  );
};

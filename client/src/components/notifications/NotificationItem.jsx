import React from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatDate';

export const NotificationItem = ({ notification, onMarkRead }) => {
  return (
    <div
      className={`p-4 rounded-2xl border flex items-start gap-4 transition ${
        !notification.isRead ? 'bg-indigo-50/20 border-indigo-100' : 'bg-white border-slate-100'
      }`}
    >
      <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
        <Bell className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold text-slate-900">{notification.title}</h4>
        <p className="text-xs text-slate-500 mt-0.5">{notification.body}</p>
        <span className="text-[10px] text-slate-400 mt-1 block">
          {formatRelativeTime(notification.createdAt)}
        </span>
      </div>
      {!notification.isRead && (
        <button
          onClick={() => onMarkRead?.(notification._id)}
          className="p-1 text-slate-400 hover:text-indigo-600 cursor-pointer"
          title="Mark read"
        >
          <CheckCheck className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { notificationService } from '../../services/notificationService';
import { useNotification } from '../../hooks/useNotification';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Bell, CheckCheck, Trash2, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatDate';

export const MyNotificationsPage = () => {
  const { notifications, loading, refetch, unreadCount } = useNotifications();
  const { success, error: notifyError } = useNotification();
  const [filter, setFilter] = useState('all');

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      refetch();
    } catch (err) {
      notifyError('Failed to mark notification as read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      success('All notifications marked as read');
      refetch();
    } catch (err) {
      notifyError('Failed to mark all as read');
    }
  };

  const getIcon = (type = '') => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      default:
        return <Info className="w-4 h-4 text-indigo-500" />;
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true;
  });

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-xs text-slate-500 mt-1">
            {unreadCount} unread • {notifications.length} total
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['all', 'unread', 'read'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition cursor-pointer ${
              filter === f
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {f === 'all' ? `All (${notifications.length})` : f === 'unread' ? `Unread (${unreadCount})` : 'Read'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-24">
          <LoadingSpinner message="Loading notifications..." />
        </div>
      ) : filteredNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up! No notifications in this category."
        />
      ) : (
        <div className="space-y-2.5">
          {filteredNotifications.map((n) => (
            <div
              key={n._id}
              className={`bg-white rounded-2xl border p-4 flex items-start gap-4 transition ${
                !n.isRead ? 'border-indigo-100 shadow-sm bg-indigo-50/30' : 'border-slate-100'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 shadow-xs">
                {getIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{n.body}</p>
                <p className="text-[10px] text-slate-400 mt-1.5">{formatRelativeTime(n.createdAt)}</p>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkRead(n._id)}
                    title="Mark as read"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                  </button>
                )}
                {!n.isRead && (
                  <div className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0 ml-1" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

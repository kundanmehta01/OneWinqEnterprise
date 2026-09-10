import React, { useState } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { notificationService } from '../../services/notificationService';
import { useNotification } from '../../hooks/useNotification';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  Bell,
  CheckCheck,
  Info,
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter,
  Trash2
} from 'lucide-react';
import { formatRelativeTime, formatDate } from '../../utils/formatDate';

export const NotificationsPage = () => {
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
      notifyError('Failed to mark all notifications as read');
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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Notifications & Alerts
            </h1>
            {unreadCount > 0 && (
              <Badge variant="indigo">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            System notices, profile approvals, member invitations, and team activity
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            icon={CheckCheck}
            onClick={handleMarkAllRead}
          >
            Mark All Read
          </Button>
        )}
      </div>

      {/* Filter Tabs & Stats */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 mr-1" />
          {[
            { key: 'all', label: 'All', count: notifications.length },
            { key: 'unread', label: 'Unread', count: unreadCount },
            { key: 'read', label: 'Read', count: notifications.length - unreadCount }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition cursor-pointer flex items-center gap-1.5 ${
                filter === item.key
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-50 border border-slate-200/80 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{item.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  filter === item.key
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {item.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="py-24">
          <LoadingSpinner message="Loading notifications..." />
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 shadow-card">
          <EmptyState
            icon={Bell}
            title="No notifications found"
            description="You are completely up-to-date! When changes occur in your enterprise, notifications will show up here."
          />
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((n) => (
            <div
              key={n._id}
              className={`bg-white rounded-2xl border p-4 sm:p-5 flex items-start gap-4 transition-all duration-200 ${
                !n.isRead
                  ? 'border-indigo-100 shadow-sm bg-indigo-50/20 hover:bg-indigo-50/40'
                  : 'border-slate-100 shadow-card hover:border-slate-200'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 shadow-2xs">
                {getIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {n.title}
                  </h4>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-300" />
                    {formatRelativeTime(n.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {n.body}
                </p>
                {n.createdAt && (
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">
                    {formatDate(n.createdAt, { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkRead(n._id)}
                    title="Mark as read"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                {!n.isRead && (
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 flex-shrink-0 ml-1 shadow-xs" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

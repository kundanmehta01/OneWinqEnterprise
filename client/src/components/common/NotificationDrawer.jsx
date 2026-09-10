import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Bell,
  CheckCheck,
  Check,
  X,
  Clock,
  Sparkles,
  ShieldCheck,
  Calendar,
  CreditCard,
  UserCheck,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { notificationApi } from '../../api/notificationApi';

export const NotificationDrawer = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all'); // 'all', 'unread'

  const { data: notificationResponse, isLoading } = useQuery({
    queryKey: ['my-notifications', filter],
    queryFn: async () => {
      const params = {};
      if (filter === 'unread') params.unreadOnly = true;
      const res = await notificationApi.getMyNotifications(params);
      return res?.data || res;
    },
    enabled: isOpen
  });

  const { data: unreadResponse } = useQuery({
    queryKey: ['my-unread-count'],
    queryFn: async () => {
      const res = await notificationApi.getUnreadCount();
      return res?.data?.unreadCount ?? res?.unreadCount ?? 0;
    },
    refetchInterval: 30000
  });

  const notificationsList = Array.isArray(notificationResponse)
    ? notificationResponse
    : notificationResponse?.notifications || [];

  const unreadCount = typeof unreadResponse === 'number' ? unreadResponse : 0;

  const markAsReadMutation = useMutation({
    mutationFn: (id) => notificationApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['my-unread-count'] });
    }
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['my-unread-count'] });
    }
  });

  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'profile_approved':
      case 'profile_review':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'connection_request':
      case 'connection_accepted':
        return <UserCheck className="w-4 h-4 text-purple-600" />;
      case 'event_reminder':
      case 'event_invite':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'card_linked':
      case 'card_tap':
        return <CreditCard className="w-4 h-4 text-amber-600" />;
      default:
        return <Bell className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-100 flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Notifications</h2>
              <p className="text-[11px] text-slate-400">
                {unreadCount > 0 ? `${unreadCount} unread update(s)` : 'All caught up'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={() => markAllReadMutation.mutate()}
                disabled={markAllReadMutation.isPending}
                className="flex items-center gap-1 text-[11px] font-semibold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="px-5 pt-3 flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              filter === 'unread'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 divide-y divide-slate-50">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
              <p className="text-xs text-slate-400">Loading notifications...</p>
            </div>
          ) : notificationsList.length === 0 ? (
            <div className="text-center py-20 text-slate-400 text-xs">
              <Bell className="w-10 h-10 text-slate-200 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">No notifications</p>
              <p className="text-[11px] text-slate-400 mt-0.5">You're completely up to date!</p>
            </div>
          ) : (
            notificationsList.map((item) => {
              const isUnread = !item.isRead;

              return (
                <div
                  key={item._id}
                  onClick={() => {
                    if (isUnread) markAsReadMutation.mutate(item._id);
                  }}
                  className={`pt-3 first:pt-0 p-3 rounded-2xl transition-all cursor-pointer ${
                    isUnread ? 'bg-purple-50/40 border border-purple-100/80' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 shadow-2xs flex items-center justify-center shrink-0 mt-0.5">
                      {getIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-slate-900 truncate">{item.title}</p>
                        {isUnread && <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0"></span>}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                        {item.message || item.body}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-center">
          <p className="text-[11px] text-slate-400 font-medium">OneWinq Enterprise Real-Time Gateway</p>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Bell, User, CheckCircle2, Clock, FileText, ChevronRight } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatDate';

export const UserDashboardPage = () => {
  const { user } = useAuth();
  const { notifications, loading: notifLoading } = useNotifications();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 shadow-lg shadow-indigo-900/20">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-white">
              Good to see you, {user?.name?.split(' ')[0] || 'there'} 👋
            </h1>
            <p className="text-sm text-indigo-200 mt-1">
              Manage your public profile and view your engagement analytics.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/me/profile"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm hover:bg-indigo-50 transition"
            >
              <User className="w-4 h-4" />
              Edit My Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <User className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Profile Status</h3>
          </div>
          <p className="text-base font-extrabold text-slate-900">
            {user?.profileId?.approvalStatus === 'approved' ? 'Published' :
              user?.profileId?.approvalStatus === 'pending' ? 'Under Review' : 'Draft'}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {user?.profileId?.approvalStatus === 'approved' ?
              'Your profile is live and publicly visible.' :
              'Submit your profile for admin review.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Profile Completeness</h3>
          </div>
          <p className="text-base font-extrabold text-slate-900">
            {user?.profileId?.completionPercentage ?? 0}%
          </p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{ width: `${user?.profileId?.completionPercentage ?? 0}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Bell className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unread Alerts</h3>
          </div>
          <p className="text-base font-extrabold text-slate-900">
            {notifications.filter((n) => !n.isRead).length}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">New notifications waiting</p>
        </div>
      </div>

      {/* Quick Actions + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Links */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Edit My Profile', sub: 'Update bio, skills, experience', to: '/me/profile', icon: User },
                { label: 'View Notifications', sub: 'Check all system alerts', to: '/me/notifications', icon: Bell },
                { label: 'My Public Profile', sub: 'See what the world sees', to: '#', icon: FileText }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-indigo-50/60 transition group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900">{item.label}</p>
                      <p className="text-[11px] text-slate-400">{item.sub}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Recent Notifications</h3>
              <Link
                to="/me/notifications"
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                View All
              </Link>
            </div>

            {notifLoading ? (
              <LoadingSpinner message="Loading..." />
            ) : notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {notifications.slice(0, 5).map((n) => (
                  <div
                    key={n._id}
                    className={`flex items-start gap-3 p-3 rounded-xl transition ${
                      !n.isRead ? 'bg-indigo-50/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.isRead ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{n.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{n.body}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {formatRelativeTime(n.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

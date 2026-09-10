import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useEmployeeProfile } from '../../hooks/useEmployeeProfile';
import { useNotifications } from '../../hooks/useNotifications';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  Bell, User, CheckCircle2, Send, QrCode, Users,
  MessageCircle, Building2, CalendarDays, ChevronRight,
  FileText, ExternalLink, ShieldCheck, TrendingUp
} from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatDate';
import { publicProfileService } from '../../services/publicProfileService';

const StatCard = ({ icon: Icon, label, value, color = 'indigo' }) => {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    violet: 'bg-violet-50 text-violet-600',
  };
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</h3>
      </div>
      <p className="text-xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
};

export const UserDashboardPage = () => {
  const { user, member } = useAuth();
  const { profile } = useEmployeeProfile();
  const { notifications, loading: notifLoading, unreadCount } = useNotifications();

  const firstName = member?.name?.split(' ')[0] || user?.name?.split(' ')[0] || 'there';
  const profileStatus = profile?.approvalStatus || 'draft';
  const completionPct = profile?.completionPercentage ?? 0;
  const slug = member?.profileId?.slug;
  const qrUrl = slug ? publicProfileService.getQrCodeUrl(slug) : null;

  const quickActions = [
    { label: 'Edit My Profile', sub: 'Update bio, skills, experience', to: '/me/profile', icon: User },
    { label: 'Digital Card', sub: 'View, share or copy your card link', to: '/me/card', icon: ShieldCheck },
    { label: 'My Network', sub: 'Discover and connect with colleagues', to: '/me/network', icon: Users },
    { label: 'Messages', sub: 'Chat with your connections', to: '/me/messages', icon: MessageCircle },
    { label: 'Events', sub: 'Upcoming company events', to: '/me/events', icon: CalendarDays },
    { label: 'View Notifications', sub: 'All system alerts', to: '/me/notifications', icon: Bell },
  ];

  return (
    <div className="space-y-6">
      {/* ── Welcome Banner ── */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 shadow-lg shadow-indigo-900/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="relative flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-extrabold text-white">Good to see you, {firstName} 👋</h1>
            <p className="text-sm text-indigo-200 mt-1">
              {profileStatus === 'approved'
                ? 'Your profile is live and publicly visible.'
                : profileStatus === 'pending'
                  ? 'Your profile is under admin review.'
                  : 'Complete your profile and submit for review.'}
            </p>
            {member?.designation && (
              <p className="text-xs text-indigo-300 mt-1 font-medium">
                {member.designation} {member?.departmentId?.name ? `· ${member.departmentId.name}` : ''}
              </p>
            )}
          </div>
          <div className="hidden sm:flex items-center gap-3">
            {slug && (
              <a
                href={`/p/${slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-white/20 transition backdrop-blur-sm"
              >
                <ExternalLink className="w-4 h-4" /> View Public Card
              </a>
            )}
            <Link
              to="/me/profile"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm hover:bg-indigo-50 transition"
            >
              <User className="w-4 h-4" /> Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={User}
          label="Profile Status"
          value={profileStatus === 'approved' ? 'Published' : profileStatus === 'pending' ? 'In Review' : 'Draft'}
          color={profileStatus === 'approved' ? 'emerald' : profileStatus === 'pending' ? 'amber' : 'indigo'}
        />
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completion</h3>
          </div>
          <p className="text-xl font-extrabold text-slate-900">{completionPct}%</p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>
        <StatCard icon={Bell} label="Unread Alerts" value={unreadCount || 0} color="amber" />
        <StatCard icon={TrendingUp} label="Profile Views" value={profile?.viewCount || '—'} color="violet" />
      </div>

      {/* ── QR Card Preview (if published) ── */}
      {slug && qrUrl && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-5">
          <div className="w-20 h-20 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
            <img src={qrUrl} alt="QR Code" className="w-full h-full object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <QrCode className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Your Digital Identity Card</h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                <CheckCircle2 className="w-2.5 h-2.5" /> Live
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate font-mono">{window.location.origin}/p/{slug}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              to="/me/card"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Manage Card
            </Link>
          </div>
        </div>
      )}

      {/* ── Quick Actions + Recent Notifications ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-1">
              {quickActions.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50/60 transition group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4" />
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
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Recent Notifications</h3>
              <Link to="/me/notifications" className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold">
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
              <div className="space-y-2">
                {notifications.slice(0, 6).map((n) => (
                  <div
                    key={n._id}
                    className={`flex items-start gap-3 p-3 rounded-xl transition ${!n.isRead ? 'bg-indigo-50/60' : 'hover:bg-slate-50'}`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.isRead ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{n.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">{n.body}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap flex-shrink-0">
                      {formatRelativeTime(n.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Profile Completion Tips ── */}
      {completionPct < 80 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            Complete Your Profile
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { label: 'Add a headline', done: !!profile?.headline, to: '/me/profile' },
              { label: 'Write your bio', done: !!profile?.bio, to: '/me/profile' },
              { label: 'Add skills', done: (profile?.skills?.length || 0) > 0, to: '/me/profile' },
              { label: 'Add experience', done: (profile?.experience?.length || 0) > 0, to: '/me/profile' },
              { label: 'Add social links', done: !!profile?.socialLinks && Object.keys(profile?.socialLinks || {}).length > 0, to: '/me/profile' },
              { label: 'Submit for review', done: profileStatus !== 'draft', to: '/me/profile' },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`flex items-center gap-3 p-3 rounded-xl border transition ${item.done ? 'border-emerald-100 bg-emerald-50/50' : 'border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30'}`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-emerald-500 text-white' : 'border-2 border-slate-300'}`}>
                  {item.done && <CheckCircle2 className="w-3 h-3" />}
                </div>
                <span className={`text-xs font-semibold ${item.done ? 'text-emerald-700 line-through' : 'text-slate-700'}`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <Link
              to="/me/profile"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition"
            >
              <User className="w-3.5 h-3.5" /> Complete Profile Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Check,
  Settings as SettingsIcon,
  Calendar,
  MessageSquare,
  Users,
  FileText,
  ThumbsUp,
  Award,
  Bell,
  MoreVertical,
  ChevronRight,
  Mail,
  Trash2,
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const INITIAL_NOTIFICATIONS = [
  // Today
  {
    id: 1,
    period: 'today',
    title: 'Design Thinking Workshop',
    desc: 'Your event registration has been confirmed.',
    time: '10:24 AM',
    unread: true,
    category: 'Events',
    icon: Calendar,
    iconBg: 'bg-indigo-100 text-indigo-600',
    type: 'standard'
  },
  {
    id: 2,
    period: 'today',
    title: 'Rohan Sharma mentioned you in a message',
    desc: '"@Alisha can you please review this?"',
    time: '09:18 AM',
    unread: true,
    category: 'Mentions',
    icon: MessageSquare,
    iconBg: 'bg-sky-100 text-sky-600',
    type: 'standard'
  },
  {
    id: 3,
    period: 'today',
    title: 'Engineering Team',
    desc: 'New announcement: Updated sprint timeline for Q4.',
    time: '08:45 AM',
    unread: true,
    category: 'Teams',
    icon: Users,
    iconBg: 'bg-emerald-100 text-emerald-600',
    type: 'standard'
  },
  // Yesterday
  {
    id: 4,
    period: 'yesterday',
    title: 'Megha Jain sent you a connection request',
    desc: 'Senior Developer at Nexisparkx Technologies',
    time: '',
    unread: false,
    category: 'Messages',
    icon: Users,
    iconBg: 'bg-indigo-100 text-indigo-600',
    type: 'connection_request'
  },
  {
    id: 5,
    period: 'yesterday',
    title: 'New Company Policy',
    desc: 'Work From Anywhere Policy has been published.',
    time: '05:32 PM',
    unread: false,
    category: 'Company',
    icon: FileText,
    iconBg: 'bg-rose-100 text-rose-500',
    type: 'standard'
  },
  {
    id: 6,
    period: 'yesterday',
    title: 'Team Building Activities',
    desc: "You've been invited to this event.",
    time: '03:10 PM',
    unread: false,
    category: 'Events',
    icon: Calendar,
    iconBg: 'bg-indigo-100 text-indigo-600',
    type: 'standard'
  },
  {
    id: 7,
    period: 'yesterday',
    title: 'Priya Singh liked your post',
    desc: '"Excited to be part of the OneWinq team!"',
    time: '11:27 AM',
    unread: false,
    category: 'Mentions',
    icon: ThumbsUp,
    iconBg: 'bg-emerald-100 text-emerald-600',
    type: 'standard'
  },
  // This Week
  {
    id: 8,
    period: 'this_week',
    title: 'Congratulations!',
    desc: "You've completed your profile setup.",
    time: 'Mon, 22 Sep',
    unread: false,
    category: 'System',
    icon: Award,
    iconBg: 'bg-amber-100 text-amber-600',
    type: 'standard'
  },
  {
    id: 9,
    period: 'this_week',
    title: "You've been added to the Product Team",
    desc: 'By Karan Malhotra',
    time: 'Mon, 22 Sep',
    unread: false,
    category: 'Teams',
    icon: Users,
    iconBg: 'bg-indigo-100 text-indigo-600',
    type: 'standard'
  },
  {
    id: 10,
    period: 'this_week',
    title: 'System Update',
    desc: 'New features have been added to improve your experience.',
    time: 'Sun, 21 Sep',
    unread: false,
    category: 'System',
    icon: Bell,
    iconBg: 'bg-rose-100 text-rose-500',
    type: 'standard'
  }
];

export default function Notifications() {
  const [activeTab, setActiveTab] = useState('All');
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [connectionHandled, setConnectionHandled] = useState({});

  // Settings toggles
  const [settings, setSettings] = useState({
    messages: true,
    mentions: true,
    events: true,
    companyUpdates: true,
    teamActivities: true,
    profileActivity: false,
    systemNotifications: true
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleAcceptConnection = (id) => {
    setConnectionHandled(prev => ({ ...prev, [id]: 'accepted' }));
  };

  const handleDeclineConnection = (id) => {
    setConnectionHandled(prev => ({ ...prev, [id]: 'declined' }));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const filteredNotifications = notifications.filter(item => {
    if (activeTab === 'All') return true;
    return item.category.toLowerCase() === activeTab.toLowerCase();
  });

  const todayList = filteredNotifications.filter(n => n.period === 'today');
  const yesterdayList = filteredNotifications.filter(n => n.period === 'yesterday');
  const thisWeekList = filteredNotifications.filter(n => n.period === 'this_week');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Notifications</h1>
          <p className="text-sm text-gray-500 mt-0.5">Stay updated with what's happening across OneWinq.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleMarkAllAsRead}
            className="inline-flex items-center gap-2 px-4 py-2 border border-indigo-500 text-indigo-600 bg-white hover:bg-indigo-50/50 rounded-xl text-sm font-semibold transition-all shadow-sm"
          >
            <Check className="w-4 h-4 text-indigo-600" />
            <span>Mark All as Read</span>
          </button>
          <button
            className="w-9 h-9 border border-indigo-500 text-indigo-600 bg-white hover:bg-indigo-50/50 rounded-xl flex items-center justify-center transition-all shadow-sm"
            title="Notification Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-0.5 scrollbar-none">
        {[
          { name: 'All', badge: unreadCount > 0 ? unreadCount : null },
          { name: 'Mentions' },
          { name: 'Messages' },
          { name: 'Events' },
          { name: 'Company' },
          { name: 'Teams' },
          { name: 'System' }
        ].map(tab => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 -mb-[2px] ${
              activeTab === tab.name
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <span>{tab.name}</span>
            {tab.badge && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Notifications List (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Today Group */}
          {todayList.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-bold text-gray-900">Today</h2>
                <span className="text-xs font-semibold text-indigo-600">
                  {todayList.filter(n => n.unread).length} new
                </span>
              </div>
              <div className="space-y-2">
                {todayList.map(n => (
                  <NotificationCard key={n.id} item={n} />
                ))}
              </div>
            </div>
          )}

          {/* Yesterday Group */}
          {yesterdayList.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-gray-900 px-1">Yesterday</h2>
              <div className="space-y-2">
                {yesterdayList.map(n => (
                  <NotificationCard
                    key={n.id}
                    item={n}
                    handledStatus={connectionHandled[n.id]}
                    onAccept={() => handleAcceptConnection(n.id)}
                    onDecline={() => handleDeclineConnection(n.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* This Week Group */}
          {thisWeekList.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-gray-900 px-1">This Week</h2>
              <div className="space-y-2">
                {thisWeekList.map(n => (
                  <NotificationCard key={n.id} item={n} />
                ))}
              </div>
            </div>
          )}

          {filteredNotifications.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-900">No notifications found</h3>
              <p className="text-xs text-gray-500 mt-1">You're all caught up for this category!</p>
            </div>
          )}
        </div>

        {/* Right Sidebar: Settings & Quick Actions (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card 1: Notification Settings */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-gray-900">Notification Settings</h3>
            <p className="text-xs text-gray-500 mt-0.5 mb-4">Choose what you want to be notified about.</p>

            <div className="space-y-3.5">
              {[
                { key: 'messages', label: 'Messages', icon: Mail },
                { key: 'mentions', label: 'Mentions', icon: Users },
                { key: 'events', label: 'Events', icon: Calendar },
                { key: 'companyUpdates', label: 'Company Updates', icon: Bell },
                { key: 'teamActivities', label: 'Team Activities', icon: Users },
                { key: 'profileActivity', label: 'Profile Activity', icon: Award },
                { key: 'systemNotifications', label: 'System Notifications', icon: SettingsIcon }
              ].map(item => {
                const IconComponent = item.icon;
                const isChecked = settings[item.key];
                return (
                  <div key={item.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <IconComponent className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-medium text-gray-700">{item.label}</span>
                    </div>
                    <button
                      onClick={() => toggleSetting(item.key)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                        isChecked ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          isChecked ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 2: Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
            <h3 className="text-xs font-bold text-gray-900 mb-2 px-1">Quick Actions</h3>
            <div className="space-y-1">
              <button
                onClick={handleMarkAllAsRead}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition-colors text-xs text-gray-700"
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  <span className="font-medium">Mark All as Read</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={handleClearAll}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition-colors text-xs text-gray-700"
              >
                <div className="flex items-center gap-2.5">
                  <Trash2 className="w-4 h-4 text-rose-500" />
                  <span className="font-medium text-rose-600">Clear All Notifications</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition-colors text-xs text-gray-700">
                <div className="flex items-center gap-2.5">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                  <span className="font-medium">Notification Preferences</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Card 3: Stay in the Loop Promo Card */}
          <div className="bg-gradient-to-br from-indigo-50/70 to-purple-50/40 rounded-2xl border border-indigo-100/60 p-4 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-xs">
              <Bell className="w-6 h-6 animate-pulse" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-gray-900">Stay in the Loop</h4>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                Get notified about important updates, events, and opportunities across OneWinq.
              </p>
              <Link
                to="/user/settings"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 mt-1.5"
              >
                <span>Manage Settings</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationCard({ item, handledStatus, onAccept, onDecline }) {
  const Icon = item.icon;

  return (
    <div
      className={`rounded-2xl p-4 transition-all border ${
        item.unread
          ? 'bg-indigo-50/50 border-indigo-100/80 shadow-xs'
          : 'bg-white border-gray-100 hover:border-gray-200'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Left Icon with unread indicator */}
        <div className="relative shrink-0">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
          {item.unread && (
            <span className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold text-gray-900 leading-snug">{item.title}</h4>
              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {item.time && (
                <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">
                  {item.time}
                </span>
              )}
              <button className="text-gray-400 hover:text-gray-600 p-1">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Connection Request Actions if type === 'connection_request' */}
          {item.type === 'connection_request' && (
            <div className="flex items-center gap-2 mt-3">
              {handledStatus === 'accepted' ? (
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                  ✓ Request Accepted
                </span>
              ) : handledStatus === 'declined' ? (
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                  Request Declined
                </span>
              ) : (
                <>
                  <button
                    onClick={onAccept}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    Accept
                  </button>
                  <button
                    onClick={onDecline}
                    className="px-4 py-1.5 border border-indigo-200 text-indigo-700 hover:bg-indigo-50/50 rounded-xl text-xs font-bold transition-all"
                  >
                    Decline
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

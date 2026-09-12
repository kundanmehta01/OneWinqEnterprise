import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Home,
  User,
  UserCheck,
  Layers,
  Building2,
  Calendar,
  Bell,
  Settings,
  Search,
  ChevronDown,
  Menu,
  X,
  LogOut,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { GlobalSearchModal } from '../../components/common/GlobalSearchModal';
import { NotificationDrawer } from '../../components/common/NotificationDrawer';
import { notificationApi } from '../../api/notificationApi';
import { hasAdminAccess } from '../../utils/permissions';
import { useMessagingStore } from '../../stores/messagingStore';

export const UserLayout = () => {
  const navigate = useNavigate();
  const { user, member, role, isSuperAdmin, permissions, logout, accessToken } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  const { connectSocket, disconnectSocket, totalUnread, fetchTotalUnread } = useMessagingStore();

  // Connect socket on mount, disconnect on unmount
  useEffect(() => {
    if (accessToken) {
      connectSocket(accessToken);
      fetchTotalUnread();
    }
    return () => {
      disconnectSocket();
    };
  }, [accessToken]);

  const hasAdminPerm = hasAdminAccess(permissions, isSuperAdmin);

  const getPanelLabel = (roleName) => {
    if (isSuperAdmin) return 'Super Admin Console';
    if (!roleName) return 'Admin Panel';
    const clean = roleName.trim();
    if (clean.toLowerCase().endsWith('panel')) return clean;
    if (clean.toLowerCase().endsWith('admin')) return `${clean} Panel`;
    return `${clean} Admin Panel`;
  };

  const panelTitle = getPanelLabel(role);

  // Live Notification Unread Count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['user-unread-count'],
    queryFn: async () => {
      const res = await notificationApi.getUnreadCount();
      return res?.data?.unreadCount ?? res?.unreadCount ?? 0;
    },
    refetchInterval: 30000
  });

  const navItems = [
    { to: '/app/home', label: 'Home', icon: Home },
    { to: '/app/my-profile', label: 'My Profile', icon: User },
    { to: '/app/network', label: 'Network', icon: UserCheck },
    { to: '/app/messages', label: 'Messages', icon: MessageSquare, badge: totalUnread },
    { to: '/app/team-departments', label: 'Team & Departments', icon: Layers },
    { to: '/company', label: 'Company', icon: Building2, external: true },
    { to: '/app/events', label: 'Events', icon: Calendar },
    { to: '#notifications', label: 'Notifications', icon: Bell, badge: unreadCount, isNotificationAction: true },
    { to: '/app/settings', label: 'Settings', icon: Settings }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const displayName = member?.name || user?.email?.split('@')[0] || 'Team Member';
  const designation = member?.designation || role || 'Software Engineer';
  const avatarUrl = member?.avatarUrl || member?.profileId?.published?.avatarUrl || member?.profileId?.draft?.avatarUrl || user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=fff`;

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 flex flex-col lg:flex-row antialiased">
      {/* 1. Sidebar for Desktop (Users Side Matching Mockups) */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 shrink-0 select-none z-20">
        {/* Brand Logo Header */}
        <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight text-slate-900 font-display">
              onewinq
            </span>
            <span className="text-[10px] tracking-widest uppercase font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md">
              ENTERPRISE
            </span>
          </div>
        </div>

        {/* Role Admin Panel Switcher (If user has assigned administrative role or superadmin) */}
        {hasAdminPerm && (
          <div className="px-3 pt-3">
            <NavLink
              to="/admin"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-purple-50 via-indigo-50/40 to-purple-50 hover:from-purple-100 hover:to-indigo-100 border border-purple-200/90 text-purple-900 text-xs font-semibold transition-all shadow-2xs group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <ShieldAlert className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 text-left">
                  <span className="block truncate font-bold text-purple-950 text-xs">{panelTitle}</span>
                  <span className="block text-[10px] text-purple-600 font-medium">Switch to Role View</span>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-purple-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </NavLink>
          </div>
        )}

        {/* Navigation Items List */}
        <div className="p-3 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;

            if (item.isNotificationAction) {
              return (
                <button
                  key={item.label}
                  onClick={() => setNotificationDrawerOpen(true)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0 text-slate-500" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </button>
              );
            }

            if (item.external) {
              return (
                <a
                  key={item.label}
                  href={item.to}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0 text-slate-500" />
                    <span>{item.label}</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              );
            }

            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50/80 text-indigo-700 font-bold border border-indigo-100 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="w-4 h-4 rounded-full bg-indigo-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Banner Card (Matching all 3 screenshots) */}
        <div className="p-3 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-[#0a0f1d] to-[#1e1b4b] text-white space-y-2 relative overflow-hidden shadow-md border border-slate-800">
            <div className="relative z-10">
              <span className="font-extrabold text-xs tracking-tight text-indigo-400 font-mono">onewinq</span>
              <p className="text-[11px] text-slate-300 font-medium leading-snug mt-1">
                People. Possibilities. Progress.
              </p>
              <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span>Build · Connect · Grow</span>
                <span className="text-indigo-300 font-bold">Together.</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-100 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          {/* Left: Mobile Brand & Desktop Spacer */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 lg:hidden">
              <span className="font-extrabold text-base tracking-tight text-slate-900 font-display">
                onewinq
              </span>
              <span className="text-[9px] tracking-widest uppercase font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md">
                ENTERPRISE
              </span>
            </div>
          </div>

          {/* Right: Notifications, Messages, User Profile */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button
              onClick={() => setNotificationDrawerOpen(true)}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-indigo-50 transition-colors"
            >
              <Bell className="w-5 h-5 text-slate-700" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-xl hover:bg-slate-50 transition-colors text-left"
              >
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-100"
                />
                <div className="hidden md:block">
                  <p className="text-xs font-semibold text-slate-800 leading-none truncate max-w-[130px]">
                    {displayName}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5 leading-none truncate max-w-[130px]">
                    {designation}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 text-xs animate-in fade-in zoom-in-95">
                  <div className="px-3.5 py-2.5 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
                    <p className="font-semibold text-slate-900 truncate">{displayName}</p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{user?.email}</p>
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-semibold">
                      {role || 'Team Member'}
                    </span>
                  </div>

                  <NavLink
                    to="/app/my-profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    <User className="w-3.5 h-3.5 text-indigo-600" /> My Digital Profile
                  </NavLink>

                  {hasAdminPerm && (
                    <NavLink
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-purple-700 hover:bg-purple-50 font-semibold"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-purple-600" /> {panelTitle}
                    </NavLink>
                  )}

                  <a
                    href="/company"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" /> Company Overview
                  </a>

                  <NavLink
                    to="/app/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" /> Settings
                  </NavLink>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-rose-600 hover:bg-rose-50 border-t border-slate-100 mt-1 font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Slide Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-100 p-4 space-y-3 shadow-lg z-40 max-h-[80vh] overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium ${
                      isActive ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-600'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}

            {hasAdminPerm && (
              <NavLink
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-purple-700 bg-purple-50"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Go to {panelTitle}</span>
              </NavLink>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button onClick={handleLogout} className="text-xs text-rose-600 font-semibold flex items-center gap-1.5">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        )}

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
          <Outlet />
        </main>

        {/* Mobile Bottom Tab Bar (lg:hidden) */}
        <nav
          aria-label="Mobile Navigation"
          className="fixed bottom-0 left-0 right-0 z-40 lg:hidden px-4 pb-3 pt-2 bg-gradient-to-t from-[#f8f9fa] via-[#f8f9fa]/95 to-transparent pointer-events-none"
        >
          <div className="pointer-events-auto max-w-md mx-auto flex items-center justify-around bg-white/95 border border-slate-200/90 rounded-2xl sm:rounded-full px-2 py-1.5 shadow-xl shadow-indigo-950/10 backdrop-blur-xl ring-1 ring-black/5">
            {/* 1. Home */}
            <NavLink
              to="/app/home"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all ${
                  isActive
                    ? 'text-indigo-600 font-bold scale-105'
                    : 'text-slate-500 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Home className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 rounded-full shadow-[0_0_6px_#4f46e5]" />
                    )}
                  </div>
                  <span className="text-[10px] mt-0.5 tracking-tight font-medium">Home</span>
                </>
              )}
            </NavLink>

            {/* 2. Network */}
            <NavLink
              to="/app/network"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all ${
                  isActive
                    ? 'text-indigo-600 font-bold scale-105'
                    : 'text-slate-500 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <UserCheck className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 rounded-full shadow-[0_0_6px_#4f46e5]" />
                    )}
                  </div>
                  <span className="text-[10px] mt-0.5 tracking-tight font-medium">Network</span>
                </>
              )}
            </NavLink>

            {/* 3. Messages */}
            <NavLink
              to="/app/messages"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all ${
                  isActive
                    ? 'text-indigo-600 font-bold scale-105'
                    : 'text-slate-500 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <MessageSquare className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                    {totalUnread > 0 && (
                      <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                        {totalUnread > 9 ? '9+' : totalUnread}
                      </span>
                    )}
                    {isActive && !totalUnread && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 rounded-full shadow-[0_0_6px_#4f46e5]" />
                    )}
                  </div>
                  <span className="text-[10px] mt-0.5 tracking-tight font-medium">Messages</span>
                </>
              )}
            </NavLink>

            {/* 4. Notifications / Alerts */}
            <button
              type="button"
              onClick={() => setNotificationDrawerOpen(true)}
              className="flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              <div className="relative">
                <Bell className="w-5 h-5 stroke-[1.75]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">Alerts</span>
            </button>

            {/* 5. Menu / More */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all cursor-pointer ${
                mobileMenuOpen
                  ? 'text-indigo-600 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 stroke-[2.5]" />
                ) : (
                  <Menu className="w-5 h-5 stroke-[1.75]" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">Menu</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Global Command Search Modal */}
      <GlobalSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />

      {/* Live In-App Notification Drawer */}
      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
      />
    </div>
  );
};

export default UserLayout;

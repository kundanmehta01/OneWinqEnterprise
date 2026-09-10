import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Building2,
  Users,
  FolderTree,
  Shield,
  Send,
  FileEdit,
  ShieldCheck,
  BarChart2,
  Settings,
  Search,
  Bell,
  Mail,
  ChevronDown,
  Menu,
  X,
  LogOut,
  Sparkles,
  Crown,
  User,
  ExternalLink,
  CreditCard,
  Calendar,
  Layers,
  ArrowRight,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { GlobalSearchModal } from '../../components/common/GlobalSearchModal';
import { NotificationDrawer } from '../../components/common/NotificationDrawer';
import { notificationApi } from '../../api/notificationApi';

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, member, role, isSuperAdmin, permissions, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  // Helper to get descriptive panel name
  const getPanelName = (roleName, isSuper) => {
    if (isSuper) return 'Organization Admin';
    if (!roleName) return 'Admin Panel';
    const clean = roleName.trim();
    if (clean.toLowerCase().endsWith('panel')) return clean;
    if (clean.toLowerCase().endsWith('admin')) return `${clean} Panel`;
    return `${clean} Admin Panel`;
  };

  const panelName = getPanelName(role, isSuperAdmin);

  // Helper to check granular user permissions
  const hasPerm = (requiredPerm) => {
    if (isSuperAdmin) return true;
    if (!requiredPerm) return true;
    const userPerms = Array.isArray(permissions) ? permissions : [];
    if (Array.isArray(requiredPerm)) {
      return requiredPerm.some((p) => userPerms.includes(p));
    }
    return userPerms.includes(requiredPerm);
  };

  // Live Notification Unread Count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['my-unread-count'],
    queryFn: async () => {
      const res = await notificationApi.getUnreadCount();
      return res?.data?.unreadCount ?? res?.unreadCount ?? 0;
    },
    refetchInterval: 30000
  });

  const rawNavSections = [
    {
      items: [
        { to: '/admin/dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, permission: 'dashboard.read' },
        { to: '/admin/events', label: 'Manage Events', icon: Calendar, permission: 'event.manage' }
      ]
    },
    {
      sectionTitle: 'ORGANIZATION & HARDWARE',
      items: [
        { to: '/admin/cards', label: 'NFC Smart Cards', icon: CreditCard, permission: 'card.read' },
        { to: '/admin/company-profile', label: 'Company Profile Studio', icon: Building2, permission: ['company_profile.read', 'company_profile.update'] },
        { to: '/admin/team', label: 'Team Directory', icon: Users, permission: 'team.read' },
        { to: '/admin/departments', label: 'Departments', icon: FolderTree, permission: 'department.read' },
        { to: '/admin/roles', label: 'Roles & Permissions', icon: Shield, permission: 'role.read' },
        { to: '/admin/invitations', label: 'Invitations', icon: Send, permission: ['invitation.read', 'invitation.create'] }
      ]
    },
    {
      sectionTitle: 'PROFILE & GOVERNANCE',
      items: [
        { to: '/admin/templates', label: 'Templates Studio', icon: FileEdit, permission: 'template.read' },
        { to: '/admin/approvals', label: 'Profile Approvals', icon: ShieldCheck, permission: ['profile_approval.read', 'profile_approval.approve'] }
      ]
    },
    {
      sectionTitle: 'INTELLIGENCE',
      items: [
        { to: '/admin/analytics', label: 'Enterprise Analytics', icon: BarChart2, permission: 'analytics.read' }
      ]
    },
    {
      sectionTitle: 'PREFERENCES',
      items: [
        { to: '/admin/settings', label: 'Organization Settings', icon: Settings, permission: ['settings.read', 'settings.update'] }
      ]
    }
  ];

  const navSections = rawNavSections
    .map((sec) => ({
      ...sec,
      items: sec.items.filter((item) => hasPerm(item.permission))
    }))
    .filter((sec) => sec.items.length > 0);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 flex flex-col lg:flex-row antialiased">
      {/* 1. Sidebar for Desktop (Role-Aware Console) */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 shrink-0 select-none z-20">
        {/* Brand Logo Header with Role Title */}
        <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
          <div className="min-w-0">
            <span className="font-bold text-lg tracking-tight text-slate-900 font-display block truncate">
              OneWinq
            </span>
            <p className="text-[10px] font-bold text-purple-700 uppercase tracking-wider truncate">
              {panelName}
            </p>
          </div>
        </div>

        {/* Navigation Items List */}
        <div className="p-3 space-y-4 flex-1 overflow-y-auto">
          {navSections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {sec.sectionTitle && (
                <p className="px-3 pt-2 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {sec.sectionTitle}
                </p>
              )}
              {sec.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Organization/Role Plan Card */}
        <div className="p-3 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              {isSuperAdmin ? <Crown className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800 truncate">
                {isSuperAdmin ? 'OneWinq Enterprise' : (member?.name || 'Authorized Member')}
              </p>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-[10px] text-purple-600 font-medium truncate">
                  {isSuperAdmin ? 'Supreme Admin' : `${role || 'Staff'} Role Active`}
                </span>
                <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-100 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          {/* Left: Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Right: Return to User Dashboard, Notifications, User Profile */}
          <div className="flex items-center gap-3">
            {/* Quick Switch to User Dashboard Button (Only for members with assigned roles, NOT for superadmin) */}
            {!isSuperAdmin && (
              <NavLink
                to="/app/home"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100/80 border border-purple-200/70 text-purple-700 text-xs font-bold transition-all shadow-2xs"
              >
                <User className="w-3.5 h-3.5 text-purple-600" />
                <span>User Dashboard</span>
              </NavLink>
            )}

            {/* Notification Bell */}
            <button
              onClick={() => setNotificationDrawerOpen(true)}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-purple-50 transition-colors"
            >
              <Bell className="w-5 h-5 text-slate-700" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-purple-600 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
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
                {isSuperAdmin ? (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                    <Crown className="w-4 h-4 text-amber-300" />
                  </div>
                ) : (member?.avatarUrl || member?.profileId?.published?.avatarUrl || member?.profileId?.draft?.avatarUrl) ? (
                  <img
                    src={member.avatarUrl || member.profileId?.published?.avatarUrl || member.profileId?.draft?.avatarUrl}
                    alt={member?.name || 'Admin'}
                    className="w-8 h-8 rounded-full object-cover border border-purple-200 shadow-2xs"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                    {(member?.name || user?.email || 'OW').substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="hidden md:block">
                  <p className="text-xs font-semibold text-slate-800 leading-none">
                    {isSuperAdmin ? 'OneWinq Enterprise' : (member?.name || 'Administrator')}
                  </p>
                  <p className="text-[10px] text-purple-600 font-medium mt-0.5 leading-none">
                    {isSuperAdmin ? 'Supreme Admin' : (role || 'Admin')}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 text-xs animate-in fade-in zoom-in-95">
                  <div className="px-3.5 py-2.5 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      {isSuperAdmin && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                      <span>{isSuperAdmin ? 'OneWinq Enterprise' : (member?.name || 'Staff Account')}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{user?.email || 'superadmin@onewinq.com'}</p>
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-semibold">
                      {role || 'Admin'}
                    </span>
                  </div>
                  {!isSuperAdmin && (
                    <NavLink
                      to="/app/home"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-purple-700 hover:bg-purple-50 font-semibold"
                    >
                      <User className="w-3.5 h-3.5 text-purple-600" /> Switch to User Dashboard
                    </NavLink>
                  )}
                  <a
                    href="/company"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" /> Company Public Page
                  </a>
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
          <div className="lg:hidden bg-white border-b border-slate-100 p-4 space-y-4 shadow-lg z-40 max-h-[80vh] overflow-y-auto">
            {!isSuperAdmin && (
              <div className="pb-2 border-b border-slate-100">
                <NavLink
                  to="/app/home"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold"
                >
                  <User className="w-4 h-4" />
                  <span>Return to User Dashboard</span>
                </NavLink>
              </div>
            )}
            {navSections.map((sec, sIdx) => (
              <div key={sIdx} className="space-y-1">
                {sec.sectionTitle && (
                  <p className="px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {sec.sectionTitle}
                  </p>
                )}
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
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
              </div>
            ))}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button onClick={handleLogout} className="text-xs text-rose-600 font-semibold flex items-center gap-1.5">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        )}

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
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

export default AdminLayout;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { notificationService } from '../../services/notificationService';
import {
  Menu,
  Search,
  Bell,
  Mail,
  ChevronDown,
  User,
  Settings,
  LogOut,
  ExternalLink
} from 'lucide-react';
import { Dropdown } from '../common/Dropdown';

export const Header = ({ onMenuToggle, onOpenSearch }) => {
  const { user, member, role, isSuperAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const count = await notificationService.getUnreadCount();
        setUnreadCount(count);
      } catch {
        // silently fallback
      }
    };
    fetchUnread();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userMenuItems = [
    {
      label: 'My Profile',
      icon: User,
      onClick: () => navigate('/me/profile')
    },
    {
      label: 'Public Card Preview',
      icon: ExternalLink,
      onClick: () => {
        const slug = member?.profileId?.slug || 'superadmin';
        window.open(`/p/${slug}`, '_blank');
      }
    },
    {
      label: 'General Settings',
      icon: Settings,
      onClick: () => navigate('/admin/settings')
    },
    { divider: true },
    {
      label: 'Sign Out',
      icon: LogOut,
      danger: true,
      onClick: handleLogout
    }
  ];

  const displayName = member?.name || (isSuperAdmin ? 'OneWinq' : user?.email?.split('@')[0] || 'Admin');
  const roleLabel = isSuperAdmin ? 'Super Admin' : role || 'Admin';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-100 bg-white px-4 sm:px-8">
      {/* Left section: Hamburger & Global Search */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <button
          type="button"
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={onOpenSearch}
          className="relative hidden sm:flex items-center w-full max-w-sm rounded-xl border border-slate-200/80 bg-slate-50/60 px-3.5 py-2 text-xs text-slate-400 hover:border-slate-300 hover:bg-slate-50 transition shadow-2xs group"
        >
          <Search className="w-4 h-4 mr-2.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          <span className="flex-1 text-left">Search anything...</span>
          <kbd className="inline-flex items-center rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 shadow-2xs">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right section: Quick notifications & Profile dropdown */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notification Bell */}
        <button
          type="button"
          onClick={() => navigate('/admin/notifications')}
          className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white shadow-xs">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Invitations icon */}
        <button
          type="button"
          onClick={() => navigate('/admin/invitations')}
          className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
          title="Team Invitations"
        >
          <Mail className="w-5 h-5" />
        </button>

        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

        {/* User Profile Avatar & Details */}
        <Dropdown
          trigger={
            <button
              type="button"
              className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 transition cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {initial}
              </div>
              <div className="hidden sm:block text-left leading-none">
                <h4 className="text-xs font-bold text-slate-800">{displayName}</h4>
                <p className="text-[10px] font-medium text-slate-400 mt-1">{roleLabel}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block ml-1" />
            </button>
          }
          items={userMenuItems}
        />
      </div>
    </header>
  );
};

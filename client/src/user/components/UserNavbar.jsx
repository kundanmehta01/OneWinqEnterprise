import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Search, Bell, ChevronDown, Menu, User, ShieldCheck,
  Settings, LogOut
} from 'lucide-react';
import { Dropdown } from '../../components/common/Dropdown';

export const UserNavbar = ({ onMenuToggle }) => {
  const { user, member, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const displayName = member?.name || user?.name || user?.email?.split('@')[0] || 'Alisha Batham';
  const displayTitle = member?.designation || 'Software Engineer';
  const avatarUrl = member?.avatarUrl || user?.avatarUrl;
  const initial = displayName.charAt(0).toUpperCase();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/user/network?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userMenuItems = [
    {
      label: 'My Profile',
      icon: User,
      onClick: () => navigate('/user/profile')
    },
    {
      label: 'My Digital Card',
      icon: ShieldCheck,
      onClick: () => navigate('/user/card')
    },
    {
      label: 'Settings',
      icon: Settings,
      onClick: () => navigate('/user/settings')
    },
    { divider: true },
    {
      label: 'Sign Out',
      icon: LogOut,
      danger: true,
      onClick: handleLogout
    }
  ];

  return (
    <header className="sticky top-0 z-30 h-20 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Left side: Mobile menu toggle + Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearch} className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search people, departments, events..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50/80 border border-slate-100 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-indigo-200 focus:ring-2 focus:ring-indigo-100 transition outline-none"
          />
        </form>
      </div>

      {/* Right side: Notifications bell + Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell with red badge */}
        <Link
          to="/user/notifications"
          className="relative p-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs">
            3
          </span>
        </Link>

        {/* User Dropdown */}
        <Dropdown
          trigger={
            <button
              type="button"
              className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 transition cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full border border-slate-200 bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white text-xs font-extrabold overflow-hidden shadow-2xs">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  initial
                )}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <h4 className="text-xs font-extrabold text-slate-900">{displayName}</h4>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">{displayTitle}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>
          }
          items={userMenuItems}
        />
      </div>
    </header>
  );
};

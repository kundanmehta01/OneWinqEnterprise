import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Dropdown } from '../common/Dropdown';
import { ChevronDown, User, Settings, LogOut, ExternalLink } from 'lucide-react';

export const ProfileDropdown = () => {
  const { user, member, role, isSuperAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const displayName = member?.name || (isSuperAdmin ? 'OneWinq' : user?.email?.split('@')[0] || 'Admin');
  const roleLabel = isSuperAdmin ? 'Super Admin' : role || 'Admin';
  const initial = displayName.charAt(0).toUpperCase();

  const menuItems = [
    { label: 'My Profile', icon: User, onClick: () => navigate('/me/profile') },
    {
      label: 'Public Card Preview',
      icon: ExternalLink,
      onClick: () => {
        const slug = member?.profileId?.slug || 'superadmin';
        window.open(`/p/${slug}`, '_blank');
      }
    },
    { label: 'General Settings', icon: Settings, onClick: () => navigate('/admin/settings') },
    { divider: true },
    { label: 'Sign Out', icon: LogOut, danger: true, onClick: handleLogout }
  ];

  return (
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
      items={menuItems}
    />
  );
};

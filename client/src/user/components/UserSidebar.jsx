import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home, User, Users, Building2, Building, Calendar,
  MessageSquare, Bell, Settings, HelpCircle
} from 'lucide-react';

export const UserSidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { label: 'Home', path: '/user/dashboard', altPath: '/me/dashboard', icon: Home },
    { label: 'My Profile', path: '/user/profile', altPath: '/me/profile', icon: User },
    { label: 'Network', path: '/user/network', altPath: '/me/network', icon: Users },
    { label: 'Team & Departments', path: '/user/teams', altPath: '/me/team', icon: Building2 },
    { label: 'Company', path: '/user/company', altPath: '/me/company', icon: Building },
    { label: 'Events', path: '/user/events', altPath: '/me/events', icon: Calendar },
    { label: 'Messages', path: '/user/messages', altPath: '/me/messages', icon: MessageSquare },
    { label: 'Notifications', path: '/user/notifications', altPath: '/me/notifications', icon: Bell, badge: 3 },
    { label: 'Settings', path: '/user/settings', altPath: '/me/settings', icon: Settings },
    { label: 'Help & Support', path: '/user/help', altPath: '/me/help', icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-100 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center px-7 border-b border-slate-50">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">
              onewinq
            </span>
            <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase mt-0.5">
              ENTERPRISE
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-indigo-50/90 text-indigo-600 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-indigo-600' : 'text-slate-400'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Promo Card */}
        <div className="p-4">
          <div className="rounded-2xl bg-[#090D1A] p-4 text-white relative overflow-hidden shadow-lg shadow-indigo-950/20">
            {/* Soft purple gradient wave glow */}
            <div className="absolute -bottom-6 -right-6 w-36 h-36 bg-gradient-to-br from-indigo-500/30 to-violet-600/30 rounded-full blur-2xl" />
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/10 rounded-full blur-xl" />

            <div className="relative z-10">
              <span className="text-sm font-extrabold text-white tracking-tight">onewinq</span>
              <p className="text-xs font-semibold text-slate-200 mt-2 leading-tight">
                People.<br />
                Possibilities.<br />
                Progress.
              </p>

              {/* Decorative wave bar */}
              <div className="w-full h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400 rounded-full my-3 opacity-80" />

              <div className="text-[10px] text-slate-400 font-medium leading-relaxed">
                Build · Connect · Grow
              </div>
              <div className="text-xs font-extrabold text-white mt-1">Together.</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

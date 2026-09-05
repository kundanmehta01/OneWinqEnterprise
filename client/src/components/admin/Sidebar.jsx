import React from 'react';
import { NavLink } from 'react-router-dom';
import { ADMIN_NAV_SECTIONS } from '../../constants/navigation';
import { useAuth } from '../../hooks/useAuth';
import { Crown, X } from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { hasPermission } = useAuth();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-100 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo & Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50">
          <div className="flex items-center gap-3">
            {/* Custom stylized W icon */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-500 flex items-center justify-center text-white font-extrabold text-xl shadow-sm tracking-tighter">
              W
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 leading-none tracking-tight">OneWinq</h1>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5">Admin Panel</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {ADMIN_NAV_SECTIONS.map((section, sIdx) => {
            const visibleItems = section.items.filter(
              (item) => !item.permission || hasPermission(item.permission)
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={sIdx}>
                {section.title && (
                  <h2 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    {section.title}
                  </h2>
                )}
                <div className="space-y-1">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink key={item.path} to={item.path} onClick={() => { if (window.innerWidth < 1024) onClose(); }} className={({ isActive }) => `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${isActive ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}>
                        <Icon className="w-4 h-4 flex-shrink-0" /><span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Organization Card */}
        <div className="p-4 border-t border-slate-50">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-indigo-100/80 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <Crown className="w-4 h-4" />
              </div>
              <div className="truncate">
                <h4 className="text-xs font-bold text-slate-900 truncate">OneWinq Enterprise</h4>
                <p className="text-[10px] text-slate-500 font-medium">Premium Plan</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0 bg-white border border-slate-200/60 rounded-full px-2 py-0.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-semibold text-emerald-700">Active</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

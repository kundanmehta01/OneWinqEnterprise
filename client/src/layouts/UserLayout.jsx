import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User, Bell, LayoutDashboard, LogOut, ExternalLink } from 'lucide-react';

export const UserLayout = () => {
  const { user, member, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Overview', path: '/me/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', path: '/me/profile', icon: User },
    { label: 'Notifications', path: '/me/notifications', icon: Bell }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col">
      {/* Employee Top Navbar */}
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-100 bg-white px-4 sm:px-8">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-500 flex items-center justify-center text-white font-extrabold text-xl shadow-sm tracking-tighter">
              W
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 leading-none tracking-tight">OneWinq</h1>
              <p className="text-[10px] font-medium text-slate-400 mt-0.5">Employee Portal</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 ml-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {member?.profileId?.slug && (
            <a
              href={`/p/${member.profileId.slug}`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Card</span>
            </a>
          )}

          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
              {member?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left leading-none">
              <p className="text-xs font-bold text-slate-800">{member?.name || user?.email}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{member?.designation || 'Employee'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 transition ml-2"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Employee Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

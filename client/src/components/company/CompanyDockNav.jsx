import React from 'react';
import { Home, Info, Plus, Users, Menu } from 'lucide-react';
import { usePreviewStore } from '../../stores/previewStore';

export const CompanyDockNav = ({
  activeScreen: propActiveScreen,
  onNavigate,
  onToggleMenu,
  menuOpen = false,
  theme = 'light',
  isFixed = false,
  className = ''
}) => {
  const store = usePreviewStore();
  const activeScreen = propActiveScreen !== undefined ? propActiveScreen : store.activeScreen;
  const navigate = onNavigate || store.setActiveScreen;

  const handleNav = (targetScreen) => {
    navigate(targetScreen);
  };

  const navItems = [
    {
      id: 1,
      label: 'Home',
      icon: Home,
      targetScreen: 1,
      isActive: activeScreen === 1 && !menuOpen
    },
    {
      id: 2,
      label: 'About',
      icon: Info,
      targetScreen: 2,
      isActive: activeScreen === 2 && !menuOpen
    },
    {
      id: 'plus',
      label: 'Action',
      icon: Plus,
      isAction: true,
      targetScreen: 8
    },
    {
      id: 4,
      label: 'Teams',
      icon: Users,
      targetScreen: 4,
      isActive: activeScreen === 4 && !menuOpen
    },
    {
      id: 'menu',
      label: 'Menu',
      icon: Menu,
      isMenu: true,
      isActive: menuOpen
    },
  ];

  const isDark = theme === 'dark';

  const containerClasses = isFixed
    ? `fixed bottom-0 left-0 right-0 z-40 lg:hidden px-4 pb-3 pt-2 pointer-events-none ${
        isDark
          ? 'bg-gradient-to-t from-[#04060f] via-[#070b1a]/90 to-transparent'
          : 'bg-gradient-to-t from-white via-white/95 to-transparent'
      } ${className}`
    : `sticky bottom-0 left-0 right-0 z-30 px-3 pb-3 pt-2 ${
        isDark
          ? 'bg-gradient-to-t from-[#04060f] via-[#070b1a]/95 to-transparent'
          : 'bg-gradient-to-t from-white via-white/95 to-transparent'
      } ${className}`;

  const dockClasses = isDark
    ? 'flex items-center justify-around bg-[#0c1229]/90 border border-white/10 rounded-full px-3 py-2 shadow-2xl backdrop-blur-xl'
    : 'flex items-center justify-around bg-white/95 border border-slate-200/90 rounded-full px-3 py-2 shadow-xl shadow-purple-900/10 backdrop-blur-xl ring-1 ring-black/5';

  return (
    <div className={containerClasses}>
      <div className={`${dockClasses} max-w-md mx-auto ${isFixed ? 'pointer-events-auto' : ''}`}>
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.targetScreen)}
                className={`relative -top-2.5 w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer ${
                  isDark
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-indigo-500/50 border-2 border-[#0c1229]'
                    : 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-purple-500/35 border-2 border-white ring-2 ring-purple-100'
                }`}
                title="Quick Connect & Action"
              >
                <Icon className="w-5 h-5 stroke-[2.5]" />
              </button>
            );
          }

          if (item.isMenu) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => (onToggleMenu ? onToggleMenu() : handleNav(2))}
                className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all cursor-pointer ${
                  item.isActive
                    ? isDark
                      ? 'text-indigo-400 font-semibold scale-105'
                      : 'text-purple-600 font-bold scale-105'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-500 hover:text-purple-600'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${item.isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                  {item.isActive && (
                    <span
                      className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                        isDark
                          ? 'bg-indigo-400 shadow-[0_0_8px_#818cf8]'
                          : 'bg-purple-600 shadow-[0_0_6px_#9333ea]'
                      }`}
                    />
                  )}
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight font-medium">{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.targetScreen)}
              className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all cursor-pointer ${
                item.isActive
                  ? isDark
                    ? 'text-indigo-400 font-semibold scale-105'
                    : 'text-purple-600 font-bold scale-105'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-500 hover:text-purple-600'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${item.isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                {item.isActive && (
                  <span
                    className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                      isDark
                        ? 'bg-indigo-400 shadow-[0_0_8px_#818cf8]'
                        : 'bg-purple-600 shadow-[0_0_6px_#9333ea]'
                    }`}
                  />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

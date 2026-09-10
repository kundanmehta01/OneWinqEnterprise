import React from 'react';
import { Home, Search, Plus, UserCheck, Menu, Sparkles } from 'lucide-react';
import { usePreviewStore } from '../../stores/previewStore';

export const CompanyDockNav = () => {
  const { activeScreen, setActiveScreen, openConnectModal } = usePreviewStore();

  const navItems = [
    { id: 1, label: 'Home', icon: Home, targetScreen: 1 },
    { id: 3, label: 'Search', icon: Search, targetScreen: 3 },
    { id: 'plus', label: 'Action', icon: Plus, isAction: true },
    { id: 8, label: 'Connect', icon: UserCheck, targetScreen: 8 },
    { id: 2, label: 'Menu', icon: Menu, targetScreen: 2 },
  ];

  return (
    <div className="sticky bottom-0 left-0 right-0 z-30 px-3 pb-3 pt-2 bg-gradient-to-t from-[#04060f] via-[#070b1a]/95 to-transparent backdrop-blur-md">
      <div className="flex items-center justify-around bg-[#0c1229]/90 border border-white/10 rounded-full px-3 py-2 shadow-2xl backdrop-blur-xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          if (item.isAction) {
            return (
              <button
                key={item.id}
                onClick={openConnectModal}
                className="relative -top-3 w-11 h-11 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/50 hover:scale-110 active:scale-95 transition-all border-2 border-[#0c1229]"
                title="Quick Connect & Action"
              >
                <Icon className="w-5 h-5 stroke-[2.5]" />
              </button>
            );
          }

          const isActive = activeScreen === item.targetScreen;

          return (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.targetScreen)}
              className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all ${
                isActive
                  ? 'text-indigo-400 font-semibold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-400 rounded-full shadow-[0_0_8px_#818cf8]" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

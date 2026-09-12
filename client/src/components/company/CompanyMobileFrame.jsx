import React from 'react';
import { Wifi, Battery, Signal, ChevronLeft, Menu, Sparkles } from 'lucide-react';
import { usePreviewStore } from '../../stores/previewStore';
import { Screen1Overview } from './screens/Screen1Overview';
import { Screen2About } from './screens/Screen2About';
import { Screen3Products } from './screens/Screen3Products';
import { Screen4Team } from './screens/Screen4Team';
import { Screen5Projects } from './screens/Screen5Projects';
import { Screen6Achievements } from './screens/Screen6Achievements';
import { Screen7Media } from './screens/Screen7Media';
import { Screen8Contact } from './screens/Screen8Contact';
import { CompanyDockNav } from './CompanyDockNav';

export const CompanyMobileFrame = ({ profile, className = '', isStandalone = false }) => {
  const { activeScreen, setActiveScreen, prevScreen } = usePreviewStore();
  const data = profile || {};

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 1:
        return <Screen1Overview profile={data} onNavigate={setActiveScreen} />;
      case 2:
        return <Screen2About profile={data} onBack={() => setActiveScreen(1)} />;
      case 3:
        return <Screen3Products profile={data} onBack={() => setActiveScreen(1)} />;
      case 4:
        return <Screen4Team profile={data} onBack={() => setActiveScreen(1)} />;
      case 5:
        return <Screen5Projects profile={data} onBack={() => setActiveScreen(1)} />;
      case 6:
        return <Screen6Achievements profile={data} onBack={() => setActiveScreen(1)} />;
      case 7:
        return <Screen7Media profile={data} onBack={() => setActiveScreen(1)} />;
      case 8:
        return <Screen8Contact profile={data} onBack={() => setActiveScreen(1)} />;
      default:
        return <Screen1Overview profile={data} onNavigate={setActiveScreen} />;
    }
  };

  return (
    <div className={`relative mx-auto flex flex-col items-center justify-center ${className}`}>
      {/* Outer Phone Hardware Chassis */}
      <div className="relative w-[380px] h-[780px] max-w-full bg-[#070b1a] rounded-[48px] p-3 shadow-phone-frame border-[3px] border-slate-700/60 ring-1 ring-white/15 flex flex-col overflow-hidden">
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 flex items-center justify-between w-[120px] h-[22px] bg-black rounded-full px-2.5 shadow-md">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-950/80" />
        </div>

        {/* Phone Screen Glass Viewport */}
        <div className="relative flex-1 w-full bg-[#04060f] rounded-[38px] overflow-hidden flex flex-col border border-white/5">
          {/* Top Status Bar (Time, Signals) */}
          <div className="flex items-center justify-between px-6 pt-3 pb-1 text-slate-300 text-[11px] font-semibold select-none z-30 bg-[#04060f]/80 backdrop-blur-sm">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5 text-slate-200" />
            </div>
          </div>

          {/* App Top Bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-[#070b1a]/90 backdrop-blur-md z-30">
            <div className="flex items-center gap-2">
              {activeScreen > 1 ? (
                <button
                  onClick={() => setActiveScreen(1)}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-extrabold text-xs tracking-tight text-white font-display">OneWing</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                Page {activeScreen}/8
              </span>
              <button
                onClick={() => setActiveScreen(2)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 transition-colors"
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrolling Screen Content */}
          <div className="flex-1 overflow-y-auto px-3.5 pt-3 phone-screen-content relative">
            {renderActiveScreen()}
          </div>

          {/* Bottom Dock Navigation */}
          <CompanyDockNav />

          {/* Home Indicator Bar */}
          <div className="pb-1.5 pt-0.5 bg-[#04060f] flex justify-center">
            <div className="w-28 h-1 bg-slate-600/60 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

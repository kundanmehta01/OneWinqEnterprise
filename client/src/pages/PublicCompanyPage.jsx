import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Menu,
  X,
  Lock,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { companyApi } from '../api/companyApi';
import { usePreviewStore } from '../stores/previewStore';
import { MediaLightboxModal } from '../components/company/MediaLightboxModal';
import { Screen1Overview } from '../components/company/screens/Screen1Overview';
import { Screen2About } from '../components/company/screens/Screen2About';
import { Screen3Products } from '../components/company/screens/Screen3Products';
import { Screen4Team } from '../components/company/screens/Screen4Team';
import { Screen5Projects } from '../components/company/screens/Screen5Projects';
import { Screen6Achievements } from '../components/company/screens/Screen6Achievements';
import { Screen7Media } from '../components/company/screens/Screen7Media';
import { Screen8Contact } from '../components/company/screens/Screen8Contact';

export const PublicCompanyPage = () => {
  const { activeScreen, setActiveScreen } = usePreviewStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: profileResponse } = useQuery({
    queryKey: ['publicCompanyProfile'],
    queryFn: companyApi.getPublicCompanyProfile,
    staleTime: 1000 * 60 * 5,
  });

  const profile = profileResponse?.data || profileResponse || {};
  const branding = profile.branding || {};
  const contact = profile.contact || {};
  const location = profile.location || {};

  const handleSelectScreen = (screenId) => {
    setActiveScreen(screenId);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { id: 1, label: 'Home' },
    { id: 2, label: 'About' },
    { id: 3, label: 'Products & Services' },
    { id: 4, label: 'Team' },
    { id: 5, label: 'Projects' },
    { id: 6, label: 'Achievements' },
    { id: 7, label: 'Media' },
    { id: 8, label: 'Contact' },
  ];

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 1:
        return <Screen1Overview profile={profile} onNavigate={handleSelectScreen} />;
      case 2:
        return <Screen2About profile={profile} onBack={() => handleSelectScreen(1)} />;
      case 3:
        return <Screen3Products profile={profile} onBack={() => handleSelectScreen(1)} onNavigate={handleSelectScreen} />;
      case 4:
        return <Screen4Team profile={profile} onBack={() => handleSelectScreen(1)} onNavigate={handleSelectScreen} />;
      case 5:
        return <Screen5Projects profile={profile} onBack={() => handleSelectScreen(1)} onNavigate={handleSelectScreen} />;
      case 6:
        return <Screen6Achievements profile={profile} onBack={() => handleSelectScreen(1)} onNavigate={handleSelectScreen} />;
      case 7:
        return <Screen7Media profile={profile} onBack={() => handleSelectScreen(1)} />;
      case 8:
        return <Screen8Contact profile={profile} onBack={() => handleSelectScreen(1)} />;
      default:
        return <Screen1Overview profile={profile} onNavigate={handleSelectScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-purple-600 selection:text-white">
      {/* 1. Header matching exact Reference Design (White + Purple) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 lg:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Brand Logo & Clean Text Links */}
          <div className="flex items-center gap-8 lg:gap-10">
            {/* onewinq Logo with purple dot */}
            <button
              onClick={() => handleSelectScreen(1)}
              className="flex items-center gap-2 focus:outline-none group text-left"
            >
              <div className="flex items-center">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-display">
                  onew<span className="text-purple-600">i</span>nq
                </span>
              </div>
            </button>

            {/* Clean Text Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
              {navLinks.map((link) => {
                const isActive = activeScreen === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleSelectScreen(link.id)}
                    className={`transition-colors relative py-1 ${
                      isActive
                        ? 'text-purple-600 font-bold'
                        : 'text-slate-600 hover:text-purple-600'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: Log in Pill & Get Started Button */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/admin/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-50 hover:bg-purple-100/80 border border-purple-200/80 text-purple-700 text-xs font-semibold transition-all shadow-2xs"
            >
              <Lock className="w-3.5 h-3.5 text-purple-600" />
              <span>Log in</span>
            </Link>

            <button
              onClick={() => handleSelectScreen(8)}
              className="px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/25 hover:shadow-lg hover:shadow-purple-500/35 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Hamburger Trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              to="/admin/login"
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-xs font-bold text-purple-700"
            >
              <Lock className="w-3 h-3 text-purple-600" />
              <span>Log in</span>
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-slate-700" />}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Slide-Over Mobile Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xs bg-white h-full shadow-2xl flex flex-col overflow-y-auto animate-slideLeft">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xl font-black text-slate-900 font-display">
                onew<span className="text-purple-600">i</span>nq
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-1 flex-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleSelectScreen(link.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold text-left transition-all ${
                    activeScreen === link.id
                      ? 'bg-purple-50 text-purple-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}

              <div className="pt-4 mt-4 border-t border-slate-100">
                <Link
                  to="/admin/login"
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-full bg-purple-600 text-white text-xs font-bold shadow-md shadow-purple-500/25"
                >
                  <Lock className="w-4 h-4" />
                  <span>Log in to Studio</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Full-Screen Canvas */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-12 py-8">
        {/* Render Active Section Content */}
        <div className="animate-fadeIn">
          {renderActiveScreen()}
        </div>
      </main>

      {/* 5. Clean Modern Footer */}
      <footer className="bg-white border-t border-slate-100 mt-14 py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="space-y-3 md:col-span-2">
            <span className="text-xl font-black tracking-tight text-slate-900 font-display">
              onew<span className="text-purple-600">i</span>nq
            </span>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed">
              The ultimate NFC digital card and professional identity manager. Share your details, links, documents, and company brochure with a simple tap.
            </p>
          </div>

          <div className="space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900">Product</p>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><button onClick={() => handleSelectScreen(1)} className="hover:text-purple-600">Features</button></li>
              <li><button onClick={() => handleSelectScreen(3)} className="hover:text-purple-600">Pricing & Offerings</button></li>
              <li><button onClick={() => handleSelectScreen(3)} className="hover:text-purple-600">NFC Cards Shop</button></li>
              <li><button onClick={() => handleSelectScreen(2)} className="hover:text-purple-600">How It Works</button></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900">Support & Legal</p>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><button onClick={() => handleSelectScreen(8)} className="hover:text-purple-600">Contact Us</button></li>
              <li><Link to="/admin" className="text-purple-600 font-semibold hover:underline">Admin Studio</Link></li>
              <li><a href={`mailto:${contact.email || 'support@onewinq.com'}`} className="hover:text-purple-600">{contact.email || 'support@onewinq.com'}</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
          <p>© 2026 OneWinq. All rights reserved.</p>
        </div>
      </footer>

      {/* Lightbox */}
      <MediaLightboxModal />
    </div>
  );
};

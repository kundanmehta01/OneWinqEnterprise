import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, Link } from 'react-router-dom';
import {
  Sparkles,
  Building2,
  Save,
  RotateCcw,
  Check,
  AlertCircle,
  Loader2,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  Lock,
  Edit3
} from 'lucide-react';
import { companyApi } from '../../api/companyApi';
import { useCompanyProfileStore } from '../../stores/companyProfileStore';
import { usePreviewStore } from '../../stores/previewStore';
import { MediaLightboxModal } from '../../components/company/MediaLightboxModal';

// 8 Visual Screen Components with Direct In-Place Editable Mode
import { Screen1Overview } from '../../components/company/screens/Screen1Overview';
import { Screen2About } from '../../components/company/screens/Screen2About';
import { Screen3Products } from '../../components/company/screens/Screen3Products';
import { Screen4Team } from '../../components/company/screens/Screen4Team';
import { Screen5Projects } from '../../components/company/screens/Screen5Projects';
import { Screen6Achievements } from '../../components/company/screens/Screen6Achievements';
import { Screen7Media } from '../../components/company/screens/Screen7Media';
import { Screen8Contact } from '../../components/company/screens/Screen8Contact';

export const CompanyProfileStudioPage = () => {
  const queryClient = useQueryClient();
  const {
    draft,
    setDraft,
    isDirty,
    resetDraft,
    markSaved,
    updateField,
    addArrayItem,
    updateArrayItem,
    removeArrayItem
  } = useCompanyProfileStore();

  const { activeScreen, setActiveScreen } = usePreviewStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Fetch Admin Company Profile
  const { data: serverProfile, isLoading } = useQuery({
    queryKey: ['adminCompanyProfile'],
    queryFn: companyApi.getAdminCompanyProfile,
  });

  useEffect(() => {
    if (serverProfile) {
      setDraft(serverProfile);
    }
  }, [serverProfile, setDraft]);

  // Mutation to Save
  const saveMutation = useMutation({
    mutationFn: (updateData) => companyApi.updateAdminCompanyProfile(updateData),
    onSuccess: (savedData) => {
      markSaved(savedData);
      queryClient.invalidateQueries({ queryKey: ['adminCompanyProfile'] });
      queryClient.invalidateQueries({ queryKey: ['publicCompanyProfile'] });
      setSaveSuccess(true);
      setSaveError('');
      setTimeout(() => setSaveSuccess(false), 3000);
    },
    onError: (err) => {
      setSaveError(err.message || 'Failed to save changes');
    },
  });

  const handleSave = () => {
    if (!draft) return;
    setSaveError('');
    saveMutation.mutate(draft);
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

  const handleSelectScreen = (screenId) => {
    setActiveScreen(screenId);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActiveScreen = () => {
    const props = {
      profile: draft,
      isEditable: true,
      onUpdateField: updateField,
      onAddArrayItem: addArrayItem,
      onUpdateArrayItem: updateArrayItem,
      onRemoveArrayItem: removeArrayItem,
    };

    switch (activeScreen) {
      case 1:
        return <Screen1Overview {...props} onNavigate={handleSelectScreen} />;
      case 2:
        return <Screen2About {...props} onBack={() => handleSelectScreen(1)} />;
      case 3:
        return <Screen3Products {...props} onBack={() => handleSelectScreen(1)} onNavigate={handleSelectScreen} />;
      case 4:
        return <Screen4Team {...props} onBack={() => handleSelectScreen(1)} onNavigate={handleSelectScreen} />;
      case 5:
        return <Screen5Projects {...props} onBack={() => handleSelectScreen(1)} onNavigate={handleSelectScreen} />;
      case 6:
        return <Screen6Achievements {...props} onBack={() => handleSelectScreen(1)} onNavigate={handleSelectScreen} />;
      case 7:
        return <Screen7Media {...props} onBack={() => handleSelectScreen(1)} />;
      case 8:
        return <Screen8Contact {...props} onBack={() => handleSelectScreen(1)} />;
      default:
        return <Screen1Overview {...props} onNavigate={handleSelectScreen} />;
    }
  };

  if (isLoading || !draft) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <p className="text-xs text-slate-500 font-semibold">Loading Company Profile Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-purple-600 selection:text-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden animate-fadeIn mb-12">
      {/* 1. Studio Top Action Bar (Dedicated Floating Action Bar) */}
      <div className="bg-slate-900 text-white px-6 lg:px-12 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold tracking-tight text-white font-display">
                Organization Studio
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-[10px] font-bold flex items-center gap-1">
                <Edit3 className="w-2.5 h-2.5" /> Live In-Place Editor
              </span>
              {isDirty ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[10px] font-bold animate-pulse">
                  Unsaved Changes
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold">
                  All Saved
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {saveSuccess && (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-300 font-bold bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/40 animate-fadeIn">
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Saved Successfully!
            </span>
          )}

          {saveError && (
            <span className="inline-flex items-center gap-1 text-xs text-rose-300 font-bold bg-rose-950/60 px-3 py-1.5 rounded-xl border border-rose-500/40 animate-fadeIn">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" /> {saveError}
            </span>
          )}

          <a
            href="/company"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            <span>Public Page</span>
          </a>

          <button
            type="button"
            onClick={resetDraft}
            disabled={!isDirty || saveMutation.isPending}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40 transition-all cursor-pointer border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all hover:scale-[1.02] disabled:opacity-50 cursor-pointer"
          >
            {saveMutation.isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Company Profile</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Header matching exact Reference Design (White + Purple) */}
      <header className="sticky top-[52px] z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 lg:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Brand Logo & Clean Text Links */}
          <div className="flex items-center gap-8 lg:gap-10">
            {/* onewinq Logo with purple dot */}
            <button
              type="button"
              onClick={() => handleSelectScreen(1)}
              className="flex items-center gap-2 focus:outline-none group text-left cursor-pointer"
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
                    type="button"
                    onClick={() => handleSelectScreen(link.id)}
                    className={`transition-colors relative py-1 cursor-pointer ${
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

          {/* Right: Studio Direct Save & Live Indicators */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/25 hover:shadow-lg hover:shadow-purple-500/35 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              {saveMutation.isPending ? 'Saving...' : 'Publish Live Updates'}
            </button>
          </div>

          {/* Mobile Hamburger Trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-slate-700" />}
            </button>
          </div>
        </div>
      </header>

      {/* 3. Slide-Over Mobile Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xs bg-white h-full shadow-2xl flex flex-col overflow-y-auto animate-slideLeft">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xl font-black text-slate-900 font-display">
                onew<span className="text-purple-600">i</span>nq
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-1 flex-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleSelectScreen(link.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold text-left transition-all cursor-pointer ${
                    activeScreen === link.id
                      ? 'bg-purple-50 text-purple-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Main Full-Screen Canvas (Renders the exact 8 public screens in direct editable mode) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-12 py-8">
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
              <li><button type="button" onClick={() => handleSelectScreen(1)} className="hover:text-purple-600 cursor-pointer">Features</button></li>
              <li><button type="button" onClick={() => handleSelectScreen(3)} className="hover:text-purple-600 cursor-pointer">Pricing & Offerings</button></li>
              <li><button type="button" onClick={() => handleSelectScreen(3)} className="hover:text-purple-600 cursor-pointer">NFC Cards Shop</button></li>
              <li><button type="button" onClick={() => handleSelectScreen(2)} className="hover:text-purple-600 cursor-pointer">How It Works</button></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900">Support & Legal</p>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><button type="button" onClick={() => handleSelectScreen(8)} className="hover:text-purple-600 cursor-pointer">Contact Us</button></li>
              <li><Link to="/admin" className="text-purple-600 font-semibold hover:underline">Admin Studio</Link></li>
              <li><span className="text-slate-500">{draft.contact?.email || 'support@onewinq.com'}</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 OneWinq. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Lightbox Modal */}
      <MediaLightboxModal />
    </div>
  );
};

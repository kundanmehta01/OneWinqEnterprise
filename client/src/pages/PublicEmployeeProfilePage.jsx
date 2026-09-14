import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Building2,
  Phone,
  QrCode,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  UserCheck,
  X,
  Home,
  User,
  Sparkles,
  FolderGit2,
  Award,
  Image as ImageIcon,
  FileText,
  Mail,
  Briefcase,
  Menu,
  ChevronRight,
  Download,
  ArrowLeft,
  Zap
} from 'lucide-react';
import { userProfileApi } from '../api/userProfileApi';
import { TemplateRenderer } from '../components/templates/TemplateRenderer';
import { UserDockNav } from '../components/common/UserDockNav';
import { useSwipeGesture } from '../hooks/useSwipeGesture';

export const PublicEmployeeProfilePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeScreen, setActiveScreen] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [connectSuccess, setConnectSuccess] = useState(false);

  const [connectForm, setConnectForm] = useState({
    name: '',
    email: '',
    phone: '',
    note: ''
  });

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['public-employee-profile', slug],
    queryFn: () => userProfileApi.getPublicProfile(slug),
    enabled: Boolean(slug),
    retry: 1
  });

  const { data: qrData } = useQuery({
    queryKey: ['profile-qr', slug],
    queryFn: () => userProfileApi.getProfileQrCode(slug),
    enabled: Boolean(slug) && isQrModalOpen
  });

  useEffect(() => {
    setActiveScreen(1);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [slug]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [activeScreen]);

  const navLinks = [
    { id: 1, label: 'Overview', icon: Home },
    { id: 2, label: 'About', icon: User },
    { id: 3, label: 'Experience', icon: Briefcase },
    { id: 4, label: 'Skills', icon: Zap },
    { id: 5, label: 'Projects', icon: FolderGit2 },
    { id: 6, label: 'Achievements', icon: Award },
    { id: 7, label: 'Media', icon: ImageIcon },
    { id: 8, label: 'Blogs', icon: FileText },
    { id: 9, label: 'Contact', icon: Mail },
  ];

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/app/network');
    }
  };

  const handleSelectScreen = (screenId) => {
    setActiveScreen(screenId);
    setMenuOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const handleNextScreen = () => {
    const next = activeScreen < 9 ? activeScreen + 1 : 1;
    handleSelectScreen(next);
  };

  const handlePrevScreen = () => {
    const prev = activeScreen > 1 ? activeScreen - 1 : 9;
    handleSelectScreen(prev);
  };

  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: handleNextScreen,
    onSwipeRight: handlePrevScreen,
    minDistance: 45
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadVCard = () => {
    if (!profile) return;
    const vcardContent = `BEGIN:VCARD
VERSION:3.0
FN:${profile.name || ''}
ORG:${profile.companyName || 'OneWinq Enterprise'}
TITLE:${profile.designation || ''}
EMAIL;TYPE=WORK:${profile.workEmail || ''}
TEL;TYPE=WORK,VOICE:${profile.phone || ''}
URL:${window.location.href}
NOTE:${profile.headline || profile.bio || ''}
END:VCARD`;

    const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${slug || 'contact'}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConnectSubmit = (e) => {
    e.preventDefault();
    setConnectSuccess(true);
    setTimeout(() => {
      setConnectSuccess(false);
      setIsConnectModalOpen(false);
      setConnectForm({ name: '', email: '', phone: '', note: '' });
    }, 2500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <p className="text-xs text-slate-500 font-semibold">Loading Verified Digital Profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-200/80 shadow-lg text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Profile Unavailable</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            The requested digital card does not exist, has been made private, or is pending administrative publishing.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold shadow-sm hover:bg-purple-700 transition-colors"
            >
              <Building2 className="w-4 h-4" />
              <span>Visit Company Portal</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfaff] text-slate-900 flex flex-col selection:bg-purple-600 selection:text-white antialiased">
      {/* 1. Header with Desktop Navigation Links matching Company Profile Style */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 lg:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Top-Left Back Button, Brand Logo & Clean Desktop Text Navigation Links */}
          <div className="flex items-center gap-3 sm:gap-6 lg:gap-10">
            <button
              onClick={handleGoBack}
              className="p-2 rounded-full bg-slate-100 hover:bg-purple-50 hover:text-purple-600 text-slate-700 transition-colors cursor-pointer"
              title="Back to previous page"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleSelectScreen(1)}
              className="flex items-center gap-2 focus:outline-none group text-left cursor-pointer"
            >
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-display">
                onew<span className="text-purple-600">i</span>nq
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                Verified
              </span>
            </button>

            {/* Clean Desktop Navigation Links (matching Company Profile style) */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
              {navLinks.map((link) => {
                const isActive = activeScreen === link.id;
                return (
                  <button
                    key={link.id}
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

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="p-2 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/80 transition-colors cursor-pointer"
              title="Share QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>

            <button
              onClick={handleCopyLink}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Copied Link!' : 'Share'}</span>
            </button>

            <button
              onClick={() => setIsConnectModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm shadow-purple-200 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Connect</span>
            </button>

            <Link
              to="/company"
              className="hidden sm:inline-flex px-4 py-2 rounded-full bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 text-xs font-semibold border border-slate-200/80 transition-all"
            >
              Company
            </Link>

            {/* Mobile Header Right Menu & Connect Button */}
            <button
              onClick={() => setIsConnectModalOpen(true)}
              className="flex sm:hidden items-center gap-1 px-3 py-1.5 rounded-full bg-purple-600 text-white text-xs font-bold shadow-sm"
            >
              <UserCheck className="w-3 h-3" />
              <span>Connect</span>
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer lg:hidden"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 3. Slide-Over Mobile Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-xs bg-white h-full shadow-2xl flex flex-col overflow-y-auto animate-slideLeft">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xl font-black text-slate-900 font-display">
                  onew<span className="text-purple-600">i</span>nq
                </span>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">{profile.name}'s Profile</p>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-1 flex-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = activeScreen === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleSelectScreen(link.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-purple-50 text-purple-700 font-bold border border-purple-200'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
                      <span>{link.label}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                );
              })}

              <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setIsConnectModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-purple-600 text-white text-xs font-bold shadow-md shadow-purple-500/20 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Exchange Digital Contact</span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleDownloadVCard();
                  }}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Save Contact (.vcf)</span>
                </button>

                <Link
                  to="/company"
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200/80 cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-purple-600" />
                  <span>Visit Company Portal</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Main Full-Screen Canvas with Mobile Touch Swipe (Matching Company Profile) */}
      <main
        className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 lg:py-8 pb-24 lg:pb-8 touch-pan-y"
        {...swipeHandlers}
      >
        {/* Render Active Screen with Smooth Fade Transition */}
        <div key={activeScreen} className="animate-fadeIn">
          <TemplateRenderer
            templateKey={profile?.template?.key || profile?.template?.id}
            profile={profile}
            activeScreen={activeScreen}
            onNavigate={handleSelectScreen}
            onConnectClick={() => setIsConnectModalOpen(true)}
            onQrClick={() => setIsQrModalOpen(true)}
            onDownloadVCard={handleDownloadVCard}
            onShareClick={handleCopyLink}
          />
        </div>
      </main>

      {/* Mobile Page Indicator Dots */}
      <div className="fixed bottom-16 left-0 right-0 z-30 lg:hidden flex items-center justify-center pointer-events-none px-4">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 border border-purple-100/90 shadow-lg shadow-purple-900/10 backdrop-blur-md pointer-events-auto">
          {navLinks.map((link) => {
            const isActive = activeScreen === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleSelectScreen(link.id)}
                className={`transition-all cursor-pointer ${
                  isActive
                    ? 'w-5 h-2 rounded-full bg-purple-600 shadow-2xs'
                    : 'w-2 h-2 rounded-full bg-slate-300 hover:bg-purple-300'
                }`}
                title={link.label}
              />
            );
          })}
        </div>
      </div>

      {/* 5. Mobile Bottom Dock Navigation Bar */}
      <UserDockNav
        activeScreen={activeScreen}
        onNavigate={handleSelectScreen}
        onToggleMenu={() => setMenuOpen(!menuOpen)}
        menuOpen={menuOpen}
        onActionClick={() => setIsConnectModalOpen(true)}
        theme="light"
        isFixed={true}
      />

      {/* 10. QR Code Share Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-purple-100 shadow-2xl text-center space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900">Scan & Connect</h3>
              <button onClick={() => setIsQrModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-56 h-56 mx-auto bg-slate-50 p-3 rounded-2xl border border-purple-100 flex items-center justify-center">
              {qrData?.qrCodeDataUrl ? (
                <img src={qrData.qrCodeDataUrl} alt="QR Code" className="w-full h-full object-contain" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <QrCode className="w-16 h-16 text-purple-600" />
                  <span className="text-[11px] font-semibold">{profile.name}'s Digital Card</span>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-500">
              Scan with any mobile camera or NFC reader to instantly open and save {profile.name}'s verified contact card.
            </p>

            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-200 transition-all cursor-pointer"
            >
              <Copy className="w-4 h-4" />
              <span>{copiedLink ? 'Profile URL Copied!' : 'Copy Direct Link'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 11. Exchange Contact Modal */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-purple-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Exchange Digital Contact</h3>
                  <p className="text-[11px] text-slate-400">Send your details to {profile.name}</p>
                </div>
              </div>
              <button onClick={() => setIsConnectModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {connectSuccess ? (
              <div className="p-6 text-center space-y-2 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-800">Contact Exchanged Successfully!</h4>
                <p className="text-xs text-emerald-700">{profile.name} will receive your details.</p>
              </div>
            ) : (
              <form onSubmit={handleConnectSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jane Smith"
                    value={connectForm.name}
                    onChange={(e) => setConnectForm({ ...connectForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={connectForm.email}
                    onChange={(e) => setConnectForm({ ...connectForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={connectForm.phone}
                    onChange={(e) => setConnectForm({ ...connectForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Note / Message</label>
                  <textarea
                    rows={2}
                    placeholder="Great meeting you..."
                    value={connectForm.note}
                    onChange={(e) => setConnectForm({ ...connectForm, note: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsConnectModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-200 flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send My Contact</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 12. Clean Modern Footer (Matching Company Profile Style) */}
      <footer className="bg-white border-t border-slate-100 mt-6 sm:mt-8 py-8 pb-28 lg:pb-8 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
          <div className="space-y-3 md:col-span-2">
            <span className="text-xl font-black tracking-tight text-slate-900 font-display">
              onew<span className="text-purple-600">i</span>nq
            </span>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed">
              {profile.name}'s verified enterprise profile on OneWinq. Contactless digital identity, credentials, and real-time networking.
            </p>
          </div>

          <div className="space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900">Explore Profile</p>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><button onClick={() => handleSelectScreen(1)} className="hover:text-purple-600 cursor-pointer">Overview & Bio</button></li>
              <li><button onClick={() => handleSelectScreen(2)} className="hover:text-purple-600 cursor-pointer">About</button></li>
              <li><button onClick={() => handleSelectScreen(3)} className="hover:text-purple-600 cursor-pointer">Work Experience</button></li>
              <li><button onClick={() => handleSelectScreen(4)} className="hover:text-purple-600 cursor-pointer">Skills & Tools</button></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900">Actions & Company</p>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link to="/company" className="hover:text-purple-600">Company Portal</Link></li>
              <li><button onClick={() => setIsConnectModalOpen(true)} className="hover:text-purple-600 cursor-pointer">Exchange Contact</button></li>
              <li><button onClick={handleDownloadVCard} className="hover:text-purple-600 cursor-pointer">Save Contact (.vcf)</button></li>
              <li><button onClick={() => setIsQrModalOpen(true)} className="hover:text-purple-600 cursor-pointer">Share QR Code</button></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
          <p>© 2026 OneWinq Enterprise. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicEmployeeProfilePage;

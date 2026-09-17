import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
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
} from "lucide-react";
import { userProfileApi } from "../../api/userProfileApi";
import { TemplateRenderer } from "../../components/templates/TemplateRenderer";
import { useSwipeGesture } from "../../hooks/useSwipeGesture";

export const AppProfileViewPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeScreen, setActiveScreen] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [connectSuccess, setConnectSuccess] = useState(false);
  const [connectForm, setConnectForm] = useState({ name: "", email: "", phone: "", note: "" });

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["public-employee-profile", slug],
    queryFn: () => userProfileApi.getPublicProfile(slug),
    enabled: Boolean(slug),
    retry: 1
  });

  const { data: qrData } = useQuery({
    queryKey: ["profile-qr", slug],
    queryFn: () => userProfileApi.getProfileQrCode(slug),
    enabled: Boolean(slug) && isQrModalOpen
  });

  useEffect(() => {
    setActiveScreen(1);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [slug]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [activeScreen]);

  useEffect(() => {
    if (profile) {
      const manifest = {
        name: profile.name || 'OneWinq Profile',
        short_name: profile.name?.split(' ')[0] || 'Profile',
        start_url: window.location.pathname,
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#7c3aed',
        icons: [
          {
            src: profile.avatarUrl || '/vite.svg',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: profile.avatarUrl || '/vite.svg',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      };
      const stringManifest = JSON.stringify(manifest);
      const blob = new Blob([stringManifest], { type: 'application/json' });
      const manifestURL = URL.createObjectURL(blob);
      let link = document.querySelector('link[rel="manifest"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'manifest';
        document.head.appendChild(link);
      }
      link.href = manifestURL;
    }
  }, [profile]);

  const navLinks = [
    { id: 1, label: "Overview", icon: Home },
    { id: 2, label: "About", icon: User },
    { id: 3, label: "Experience", icon: Briefcase },
    { id: 4, label: "Projects", icon: FolderGit2 },
    { id: 5, label: "Achievements", icon: Award },
    { id: 6, label: "Media", icon: ImageIcon },
    { id: 7, label: "Blogs", icon: FileText },
    { id: 8, label: "Contact", icon: Mail }
  ];

  const handleGoBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/app/network");
  };

  const handleSelectScreen = (screenId) => {
    setActiveScreen(screenId);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextScreen = () => handleSelectScreen(activeScreen < 8 ? activeScreen + 1 : 1);
  const handlePrevScreen = () => handleSelectScreen(activeScreen > 1 ? activeScreen - 1 : 8);

  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: handleNextScreen,
    onSwipeRight: handlePrevScreen,
    minDistance: 45
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/p/${slug}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadVCard = () => {
    if (!profile) return;
    const vcardContent = `BEGIN:VCARD\nVERSION:3.0\nFN:${profile.name || ""}\nORG:${profile.companyName || "OneWinq Enterprise"}\nTITLE:${profile.designation || ""}\nEMAIL;TYPE=WORK:${profile.workEmail || ""}\nTEL;TYPE=WORK,VOICE:${profile.phone || ""}\nURL:${window.location.origin}/p/${slug}\nNOTE:${profile.headline || profile.bio || ""}\nEND:VCARD`;
    const blob = new Blob([vcardContent], { type: "text/vcard;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${slug || "contact"}.vcf`);
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
      setConnectForm({ name: "", email: "", phone: "", note: "" });
    }, 2500);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <p className="text-xs text-slate-500 font-semibold">Loading Digital Profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-200/80 shadow-lg text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Profile Unavailable</h2>
          <p className="text-xs text-slate-500 leading-relaxed">This profile does not exist, is private, or pending publishing.</p>
          <button
            onClick={handleGoBack}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#fbfaff] flex flex-col -mx-4 sm:-mx-6 lg:-mx-8 -mt-6">

      {/* Mobile Navigation Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-xs bg-white h-full shadow-2xl flex flex-col overflow-y-auto">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">{profile.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{profile.designation}</p>
              </div>
              <button onClick={() => setMenuOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer">
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
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold text-left transition-all cursor-pointer ${isActive ? "bg-purple-50 text-purple-700 border border-purple-200" : "text-slate-700 hover:bg-slate-50"}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? "text-purple-600" : "text-slate-400"}`} />
                      <span>{link.label}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                );
              })}
              <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
                <button onClick={() => { setMenuOpen(false); setIsConnectModalOpen(true); }} className="w-full flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-purple-600 text-white text-xs font-bold cursor-pointer">
                  <UserCheck className="w-4 h-4" /><span>Exchange Contact</span>
                </button>
          
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Profile Content with Touch Swipe — NO arrow buttons */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-24 lg:pb-8 touch-pan-y" {...swipeHandlers}>
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

      {/* QR Code Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-purple-100 shadow-2xl text-center space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900">Scan & Connect</h3>
              <button onClick={() => setIsQrModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div className="w-48 h-48 mx-auto bg-slate-50 p-3 rounded-2xl border border-purple-100 flex items-center justify-center">
              {qrData?.qrCodeDataUrl ? (
                <img src={qrData.qrCodeDataUrl} alt="QR Code" className="w-full h-full object-contain" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <QrCode className="w-14 h-14 text-purple-600" />
                  <span className="text-[11px] font-semibold">{profile.name}</span>
                </div>
              )}
            </div>
            <button onClick={handleCopyLink} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer">
              <Copy className="w-4 h-4" /><span>{copiedLink ? "Copied!" : "Copy Profile Link"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Exchange Contact Modal */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-purple-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center"><UserCheck className="w-4 h-4" /></div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Exchange Contact</h3>
                  <p className="text-[11px] text-slate-400">Send your details to {profile.name}</p>
                </div>
              </div>
              <button onClick={() => setIsConnectModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            {connectSuccess ? (
              <div className="p-6 text-center space-y-2 bg-emerald-50 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-800">Sent Successfully!</h4>
                <p className="text-xs text-emerald-700">{profile.name} will receive your details.</p>
              </div>
            ) : (
              <form onSubmit={handleConnectSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Full Name</label>
                  <input type="text" required placeholder="e.g. Jane Smith" value={connectForm.name} onChange={(e) => setConnectForm({ ...connectForm, name: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input type="email" required placeholder="jane@example.com" value={connectForm.email} onChange={(e) => setConnectForm({ ...connectForm, email: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Note (Optional)</label>
                  <textarea rows={2} placeholder="Great meeting you..." value={connectForm.note} onChange={(e) => setConnectForm({ ...connectForm, note: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 resize-none" />
                </div>
                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button type="button" onClick={() => setIsConnectModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md flex items-center gap-1.5 cursor-pointer">
                    <Send className="w-3.5 h-3.5" /><span>Send</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppProfileViewPage;

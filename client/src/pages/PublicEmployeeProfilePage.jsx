import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  X
} from 'lucide-react';
import { userProfileApi } from '../api/userProfileApi';
import { TemplateRenderer } from '../components/templates/TemplateRenderer';

export const PublicEmployeeProfilePage = () => {
  const { slug } = useParams();
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
      {/* 1. Top Navbar Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-purple-100 px-6 lg:px-12 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 focus:outline-none group">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-display">
              onew<span className="text-purple-600">i</span>nq
            </span>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              Verified Identity
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="p-2 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/80 transition-colors cursor-pointer"
              title="Share QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopyLink}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Copied Link!' : 'Share'}</span>
            </button>
            <Link
              to="/company"
              className="px-4 py-1.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm shadow-purple-200 transition-all hover:scale-105"
            >
              Company
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Main Profile Viewport (Rendered by Backend-Resolved Template) */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TemplateRenderer
          templateKey={profile?.template?.key || profile?.template?.id}
          profile={profile}
          onConnectClick={() => setIsConnectModalOpen(true)}
          onQrClick={() => setIsQrModalOpen(true)}
          onDownloadVCard={handleDownloadVCard}
          onShareClick={handleCopyLink}
        />
      </main>

      {/* 10. QR Code Share Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-purple-100 shadow-2xl text-center space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900">Scan & Connect</h3>
              <button onClick={() => setIsQrModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
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
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-200 transition-all"
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
              <button onClick={() => setIsConnectModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
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
                    placeholder="e.g. John Doe"
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
                    placeholder="john@example.com"
                    value={connectForm.email}
                    onChange={(e) => setConnectForm({ ...connectForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={connectForm.phone}
                    onChange={(e) => setConnectForm({ ...connectForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Note / Message</label>
                  <textarea
                    rows={2}
                    placeholder="Great meeting you at the tech summit..."
                    value={connectForm.note}
                    onChange={(e) => setConnectForm({ ...connectForm, note: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsConnectModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-200 flex items-center gap-1.5 transition-all hover:scale-105"
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

      {/* 12. Footer */}
      <footer className="bg-white border-t border-purple-100 py-8 px-6 text-center text-xs text-slate-400">
        <p>
          Powered by <strong className="text-slate-800">OneWinq Enterprise</strong> &bull; Digital Identity & Smart NFC Cards Platform
        </p>
      </footer>
    </div>
  );
};

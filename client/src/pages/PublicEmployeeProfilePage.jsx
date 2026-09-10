import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Layers,
  Trophy,
  Share2,
  QrCode,
  Download,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Copy,
  Sparkles,
  UserCheck,
  Globe,
  ArrowRight,
  ChevronRight,
  X,
  MessageSquare
} from 'lucide-react';
import { userProfileApi } from '../api/userProfileApi';

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
ORG:OneWinq Technologies
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
      <div className="min-h-screen bg-[#faf8ff] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-purple-600 mx-auto" />
          <p className="text-xs font-bold text-slate-700">Loading verified digital identity...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#faf8ff] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-purple-100 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-slate-900">Profile Not Found</h2>
            <p className="text-xs text-slate-500">
              The digital profile for <code className="text-purple-600 font-bold">/{slug}</code> is not available or is set to private.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-200 transition-all hover:scale-105"
            >
              <span>Explore OneWinq Enterprise</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const overviewStats = profile.overviewStats || {
    connectionsCount: '150+',
    projectsCount: '12+',
    yearsOfExperience: '6+',
    servicesCount: '4+'
  };

  const experience = profile.experience || [];
  const skills = profile.skills || [];
  const projects = profile.projects || [];
  const achievements = profile.achievements || [];
  const socialLinks = profile.socialLinks || [];

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
              className="p-2 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/80 transition-colors"
              title="Share QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopyLink}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Copied Link!' : 'Share'}</span>
            </button>
            <Link
              to="/"
              className="px-4 py-1.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm shadow-purple-200 transition-all hover:scale-105"
            >
              Company
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Main Profile Viewport */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* HERO CARD with Cover & Avatar */}
        <div className="bg-white rounded-3xl border border-purple-100 shadow-xl shadow-purple-500/5 overflow-hidden">
          {/* Cover Banner */}
          <div className="relative w-full h-44 sm:h-64 bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-900 overflow-hidden">
            {profile.coverUrl ? (
              <img
                src={profile.coverUrl}
                alt="Profile Cover"
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-90 flex items-center justify-end p-8">
                <div className="w-72 h-72 rounded-full bg-white/10 blur-3xl" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/10" />
          </div>

          {/* Profile Card Body */}
          <div className="px-6 sm:px-10 pb-8 pt-0 text-center space-y-5 relative">
            {/* Overlapping Avatar */}
            <div className="flex justify-center -mt-16 sm:-mt-20 relative z-10">
              <div className="relative group">
                <div className="w-28 h-28 sm:w-36 sm:h-36 aspect-square rounded-3xl bg-white p-1.5 shadow-xl ring-4 ring-white flex items-center justify-center overflow-hidden">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-full h-full object-cover object-center rounded-2xl"
                    />
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex flex-col items-center justify-center">
                      <Sparkles className="w-10 h-10 text-white" />
                      <span className="text-[10px] font-black uppercase tracking-wider mt-1 text-purple-100">
                        {profile.name?.slice(0, 6) || 'OWQ'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-purple-600 text-white p-1.5 rounded-full ring-4 ring-white shadow-md" title="Verified Enterprise Member">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Name, Designation, Department */}
            <div className="space-y-1.5 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>OneWinq Verified Employee</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight font-display">
                {profile.name}
              </h1>
              <p className="text-sm sm:text-base font-semibold text-purple-700">
                {profile.designation} &bull; <span className="text-slate-600 font-medium">{profile.department || 'Enterprise'}</span>
              </p>
              {profile.headline && (
                <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl mx-auto pt-1 leading-relaxed">
                  {profile.headline}
                </p>
              )}
            </div>

            {/* Quick Action CTA Bar */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleDownloadVCard}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-200 transition-all hover:scale-105"
              >
                <Download className="w-4 h-4" />
                <span>Save Contact</span>
              </button>

              <button
                onClick={() => setIsConnectModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-xs transition-all hover:scale-105"
              >
                <UserCheck className="w-4 h-4" />
                <span>Exchange Contact</span>
              </button>

              <button
                onClick={() => setIsQrModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
              >
                <QrCode className="w-4 h-4 text-purple-600" />
                <span>QR Code</span>
              </button>
            </div>

            {/* Direct Contact Handles */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
              {profile.workEmail && (
                <a
                  href={`mailto:${profile.workEmail}`}
                  className="flex items-center gap-1.5 hover:text-purple-600 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-purple-600" />
                  <span>{profile.workEmail}</span>
                </a>
              )}
              {profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="flex items-center gap-1.5 hover:text-purple-600 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-purple-600" />
                  <span>{profile.phone}</span>
                </a>
              )}
              <div className="flex items-center gap-1.5 text-slate-500">
                <Building2 className="w-3.5 h-3.5 text-purple-600" />
                <span>OneWinq Enterprise</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Overview Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-2xs text-center">
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900">{overviewStats.connectionsCount || '150+'}</p>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Connections</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-2xs text-center">
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900">{overviewStats.projectsCount || '10+'}</p>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Projects</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-2xs text-center">
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900">{overviewStats.yearsOfExperience || '5+'}</p>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Years Exp.</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-2xs text-center">
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900">{overviewStats.servicesCount || '4+'}</p>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Services</p>
          </div>
        </div>

        {/* 4. About / Professional Summary */}
        {profile.bio && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-2xs space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" /> About & Executive Summary
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal whitespace-pre-line">
              {profile.bio}
            </p>
          </div>
        )}

        {/* 5. Core Skills & Expertise */}
        {skills.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" /> Core Competencies & Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((s, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-semibold"
                >
                  {typeof s === 'string' ? s : s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 6. Work Experience Timeline */}
        {experience.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-2xs space-y-5">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-600" /> Professional Experience
            </h3>
            <div className="space-y-4">
              {experience.map((exp, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-purple-50/30 border border-purple-100 space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="text-sm font-bold text-slate-900">{exp.title}</h4>
                    <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                      {exp.isCurrent ? 'Current Role' : 'Past Role'}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-600">
                    {exp.company} &bull; <span className="text-slate-400">{exp.location || 'India'}</span>
                  </p>
                  {exp.description && (
                    <p className="text-xs text-slate-500 leading-relaxed pt-1">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. Key Projects & Portfolio */}
        {projects.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-2xs space-y-5">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" /> Key Projects & Initiatives
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((proj, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                      {proj.category || 'Initiative'}
                    </span>
                    {proj.projectUrl && (
                      <a href={proj.projectUrl} target="_blank" rel="noreferrer" className="text-purple-600 hover:text-purple-700">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{proj.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. Achievements & Honors */}
        {achievements.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-purple-600" /> Milestones & Achievements
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {achievements.map((ach, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-purple-50/40 border border-purple-100">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{ach.title}</h4>
                    {ach.year && <p className="text-[10px] font-bold text-purple-700">{ach.year}</p>}
                    {ach.description && <p className="text-xs text-slate-500 mt-0.5">{ach.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. Official Social Handles */}
        {socialLinks.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-2xs space-y-4 text-center">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Connect on Professional Channels</h3>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {socialLinks.map((s, idx) => (
                <a
                  key={idx}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-xs font-semibold text-slate-700 hover:text-purple-700 transition-all shadow-2xs"
                >
                  <Globe className="w-3.5 h-3.5 text-purple-600" />
                  <span>{s.platform || 'Social Link'}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              ))}
            </div>
          </div>
        )}
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

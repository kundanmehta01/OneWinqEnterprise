import React from 'react';
import {
  TrendingUp,
  Building2,
  Mail,
  Phone,
  MapPin,
  CalendarCheck,
  Sparkles,
  Award,
  Globe,
  Share2,
  Download,
  QrCode,
  ExternalLink,
  Target,
  Handshake,
  Briefcase
} from 'lucide-react';

export const SalesTemplate = ({
  profile,
  onConnectClick,
  onQrClick,
  onDownloadVCard,
  onShareClick,
  isCompact = false
}) => {
  const companyBranding = profile.companyBranding || {};
  const coverUrl = profile.coverUrl;
  const primaryColor = profile.template?.layoutConfig?.colorPalette?.primary || '#d97706';
  const accentColor = profile.template?.layoutConfig?.colorPalette?.accent || '#fcd34d';
  const badgeText = profile.badgeLabel || profile.template?.predefinedDetails?.badgeLabel || '';
  const showBadge = profile.template?.layoutConfig?.showBadge !== false;
  const showQuote = profile.template?.layoutConfig?.showQuote !== false;
  const roleQuote = profile.templateQuote || profile.template?.predefinedDetails?.quote || '';

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* 1. SALES & CLIENT SOLUTIONS HERO */}
      <div className="bg-white rounded-3xl border border-amber-100 shadow-xl overflow-hidden">
        {/* Cover Banner */}
        <div className={`relative w-full overflow-hidden bg-gradient-to-r from-amber-600 via-orange-600 to-slate-900 ${isCompact ? 'h-36 sm:h-44' : 'h-48 sm:h-64'}`}>
          {coverUrl ? (
            <img
              src={coverUrl}
              alt="Organization Banner"
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-700 opacity-90 flex items-center justify-end p-8">
              <div className="w-64 h-64 rounded-full bg-white/10 blur-2xl" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Profile Details Area */}
        <div className={`px-4 sm:px-10 pb-6 sm:pb-8 pt-0 relative ${isCompact ? 'text-center' : 'text-center sm:text-left'}`}>
          <div className={`flex flex-col gap-5 ${isCompact ? 'items-center' : 'sm:flex-row sm:items-start justify-between'}`}>
            {/* Left: Avatar & Identity */}
            <div className={`flex flex-col items-center gap-4 min-w-0 flex-1 ${isCompact ? '' : 'sm:flex-row sm:items-start text-center sm:text-left'}`}>
              {/* Overlapping Avatar */}
              <div className={`relative group shrink-0 z-10 ${isCompact ? '-mt-14' : '-mt-16 sm:-mt-20'}`}>
                <div className={`${isCompact ? 'w-24 h-24 sm:w-28 sm:h-28' : 'w-32 h-32 sm:w-36 sm:h-36'} rounded-3xl bg-white p-1.5 shadow-xl ring-4 ring-amber-50 overflow-hidden`}>
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-full h-full object-cover object-center rounded-2xl"
                    />
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center text-3xl font-bold">
                      {profile.name?.slice(0, 2).toUpperCase() || 'SL'}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-amber-600 text-white p-1.5 rounded-full ring-4 ring-white shadow-md" title="Sales & Enterprise Solutions">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>

              {/* Name & Identity Block */}
              <div className="pt-2 sm:pt-4 space-y-1.5 min-w-0 flex-1">
                {showBadge && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold max-w-full">
                    <Handshake className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">{badgeText || 'Enterprise Solutions'} • {profile.department?.name || 'Sales'}</span>
                  </div>
                )}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight font-display break-words leading-tight">
                  {profile.name}
                </h1>
                <p className="text-xs sm:text-sm text-amber-700 font-semibold">
                  {profile.designation}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-slate-500 pt-0.5">
                  {profile.companyName && (
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Building2 className="w-3.5 h-3.5 text-amber-600 shrink-0" /> {profile.companyName}
                    </span>
                  )}
                  {profile.location?.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {[profile.location.city, profile.location.country].filter(Boolean).join(', ')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end pt-2 sm:pt-4 shrink-0">
              <button
                onClick={onConnectClick}
                className="px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-200 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <CalendarCheck className="w-4 h-4" /> Book a Meeting
              </button>
              <button
                onClick={onDownloadVCard}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Save Contact
              </button>
              <button
                onClick={onQrClick}
                className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
                title="View QR Code"
              >
                <QrCode className="w-4 h-4" />
              </button>
              <button
                onClick={onShareClick}
                className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
                title="Share Profile"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. VALUE PROPOSITION & CLIENT SOLUTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-xs font-extrabold text-amber-700 uppercase tracking-wider flex items-center gap-2">
            <Target className="w-4 h-4" /> Business Value & Client Focus
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {profile.bio || profile.collaborationNote || 'Helping enterprise partners leverage next-generation digital identity solutions, hardware cards, and organizational technology to accelerate growth.'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-3xl p-6 shadow-md shadow-amber-500/20 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <h4 className="text-sm font-bold">Schedule an Enterprise Demo</h4>
            <p className="text-xs text-amber-100">
              Explore how OneWinq transforms your organizational identity and NFC hardware.
            </p>
          </div>
          <button
            onClick={onConnectClick}
            className="w-full py-2.5 bg-white text-amber-800 hover:bg-amber-50 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            Request Demo / Call
          </button>
        </div>
      </div>

      {/* 3. EXPERIENCE & ENTERPRISE DEALS */}
      {profile.experience && profile.experience.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-amber-600" /> Enterprise Track Record
          </h3>
          <div className="space-y-3">
            {profile.experience.map((exp, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{exp.title}</h4>
                  <p className="text-[11px] text-amber-700 font-semibold">{exp.company} • {exp.location}</p>
                  {exp.description && <p className="text-xs text-slate-500 mt-1">{exp.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SOCIAL & PROFESSIONAL LINKS */}
      {profile.socialLinks && profile.socialLinks.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-600" /> Connect on Professional Channels
          </h3>
          <div className="flex items-center gap-3 flex-wrap">
            {profile.socialLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 text-xs font-semibold text-slate-700 hover:text-amber-800 transition-all flex items-center gap-2"
              >
                <span>{link.platform}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ROLE QUOTE — appears last, after all user details */}
      {showQuote && roleQuote && (
        <div
          className="rounded-3xl p-6 border shadow-xs relative overflow-hidden"
          style={{ borderColor: `${primaryColor}30`, background: `linear-gradient(135deg, ${primaryColor}08, ${accentColor}10)` }}
        >
          <div className="absolute top-4 right-5 opacity-10">
            <TrendingUp className="w-16 h-16" style={{ color: primaryColor }} />
          </div>
          <div className="relative z-10 space-y-2">
            <p className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: primaryColor }}>
              Sales Mindset
            </p>
            <p className="text-sm text-slate-700 leading-relaxed italic font-medium">
              &ldquo;{roleQuote}&rdquo;
            </p>
          </div>
        </div>
      )}
    </div>
  );
};


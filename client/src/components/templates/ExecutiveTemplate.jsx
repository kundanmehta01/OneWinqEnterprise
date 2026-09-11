import React from 'react';
import {
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Award,
  ExternalLink,
  Sparkles,
  Globe,
  Quote,
  TrendingUp,
  Crown,
  Share2,
  Download,
  QrCode
} from 'lucide-react';

export const ExecutiveTemplate = ({
  profile,
  onConnectClick,
  onQrClick,
  onDownloadVCard,
  onShareClick,
  isCompact = false
}) => {
  const companyBranding = profile.companyBranding || {};
  const coverUrl = profile.coverUrl;
  const orgLogoUrl = profile.orgLogoUrl || companyBranding.logoUrl;
  const primaryColor = profile.template?.layoutConfig?.colorPalette?.primary || '#4f46e5';
  const accentColor = profile.template?.layoutConfig?.colorPalette?.accent || '#818cf8';
  const badgeText = profile.badgeLabel || profile.template?.predefinedDetails?.badgeLabel || '';
  const showBadge = profile.template?.layoutConfig?.showBadge !== false;
  const showQuote = profile.template?.layoutConfig?.showQuote !== false;
  const roleQuote = profile.templateQuote || profile.template?.predefinedDetails?.quote || '';

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* 1. EXECUTIVE HERO BANNER */}
      <div className="relative rounded-3xl bg-slate-900 text-white overflow-hidden border border-slate-800 shadow-2xl">
        {/* Cover Banner Background */}
        <div className={`relative w-full overflow-hidden ${isCompact ? 'h-36 sm:h-44' : 'h-56 sm:h-72'}`}>
          {coverUrl ? (
            <img
              src={coverUrl}
              alt="Organization Banner"
              className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 opacity-90" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        </div>

        {/* Executive Profile Header Overlay */}
        <div className={`px-4 sm:px-12 pb-8 ${isCompact ? '-mt-16' : '-mt-24 sm:-mt-32'} relative z-10`}>
          <div className={`flex flex-col gap-6 ${isCompact ? 'items-center text-center' : 'md:flex-row items-center md:items-end justify-between'}`}>
            {/* Left: Avatar & Identity */}
            <div className={`flex flex-col gap-5 min-w-0 flex-1 ${isCompact ? 'items-center text-center' : 'sm:flex-row items-center sm:items-end text-center sm:text-left'}`}>
              <div className="relative group shrink-0">
                <div className={`${isCompact ? 'w-24 h-24 sm:w-28 sm:h-28' : 'w-32 h-32 sm:w-40 sm:h-40'} rounded-3xl bg-slate-800 p-1.5 sm:p-2 shadow-2xl ring-4 ring-indigo-500/30 overflow-hidden`}>
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-full h-full object-cover object-center rounded-2xl"
                    />
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-indigo-700 flex items-center justify-center text-3xl font-black">
                      {profile.name?.slice(0, 2).toUpperCase() || 'EX'}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-950 p-2 rounded-xl ring-4 ring-slate-900 shadow-lg" title="Executive Leadership">
                  <Crown className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-2 min-w-0 flex-1">
                {showBadge && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold max-w-full">
                    <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{badgeText || 'Executive Leadership'} • {profile.department?.name || 'Executive'}</span>
                  </div>
                )}
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-display break-words leading-tight">
                  {profile.name}
                </h1>
                <p className="text-sm sm:text-base text-indigo-200 font-medium">
                  {profile.designation}
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-slate-400">
                  {profile.companyName && (
                    <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                      <Building2 className="w-3.5 h-3.5 text-indigo-400" /> {profile.companyName}
                    </span>
                  )}
                  {profile.location?.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {[profile.location.city, profile.location.country].filter(Boolean).join(', ')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Executive Action Controls */}
            <div className="flex items-center gap-2.5 flex-wrap justify-center">
              <button
                onClick={onConnectClick}
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-2"
              >
                <Mail className="w-4 h-4" /> Direct Contact
              </button>
              <button
                onClick={onDownloadVCard}
                className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Save Contact
              </button>
              <button
                onClick={onQrClick}
                className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
                title="View QR Code"
              >
                <QrCode className="w-4 h-4" />
              </button>
              <button
                onClick={onShareClick}
                className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
                title="Share Profile"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. EXECUTIVE VISION / BIO STATEMENT */}
      {(profile.bio || profile.collaborationNote) && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="absolute top-6 right-6 text-indigo-100 opacity-60">
            <Quote className="w-20 h-20" />
          </div>
          <div className="relative z-10 space-y-4 max-w-3xl">
            <h3 className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Executive Mission & Perspective
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-serif italic">
              "{profile.bio || profile.collaborationNote}"
            </p>
          </div>
        </div>
      )}

      {/* 3. KEY MILESTONES & ACHIEVEMENTS */}
      {profile.achievements && profile.achievements.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" /> Executive Milestones & Honors
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profile.achievements.map((item, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-indigo-600 font-medium">{item.subtitle || item.issuer}</p>
                  {item.description && <p className="text-xs text-slate-500 mt-1">{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. CAREER TRAJECTORY & LEADERSHIP HISTORY */}
      {profile.experience && profile.experience.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-600" /> Leadership History
          </h3>
          <div className="space-y-3">
            {profile.experience.map((exp, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">{exp.title}</h4>
                    {exp.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                        Current Position
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">{exp.company} • {exp.location}</p>
                  {exp.description && <p className="text-xs text-slate-500 mt-1">{exp.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. OFFICIAL SOCIAL CHANNELS */}
      {profile.socialLinks && profile.socialLinks.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-600" /> Official Channels & Publications
          </h3>
          <div className="flex items-center gap-3 flex-wrap">
            {profile.socialLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-all flex items-center gap-2"
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
        <div className="rounded-3xl p-6 border border-slate-800 bg-gradient-to-br from-slate-900 to-indigo-950 relative overflow-hidden shadow-xl">
          <div className="absolute top-4 right-5 opacity-10">
            <Quote className="w-16 h-16 text-indigo-400" />
          </div>
          <div className="relative z-10 space-y-2">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400">
              Executive Vision
            </p>
            <p className="text-sm text-slate-200 leading-relaxed italic font-medium">
              &ldquo;{roleQuote}&rdquo;
            </p>
          </div>
        </div>
      )}
    </div>
  );
};


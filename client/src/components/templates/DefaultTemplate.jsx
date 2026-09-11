import React from 'react';
import {
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Layers,
  Sparkles,
  Award,
  Globe,
  Share2,
  Download,
  QrCode,
  ExternalLink
} from 'lucide-react';

export const DefaultTemplate = ({
  profile,
  onConnectClick,
  onQrClick,
  onDownloadVCard,
  onShareClick,
  isCompact = false
}) => {
  const companyBranding = profile.companyBranding || {};
  const coverUrl = profile.coverUrl;
  const primaryColor = profile.template?.layoutConfig?.colorPalette?.primary || '#6366f1';
  const secondaryColor = profile.template?.layoutConfig?.colorPalette?.secondary || '#312e81';
  const accentColor = profile.template?.layoutConfig?.colorPalette?.accent || '#818cf8';
  const ctaText = profile.ctaButtonText || profile.template?.predefinedDetails?.ctaButtonText || `Connect with ${profile.name?.split(' ')[0] || 'Member'}`;
  const badgeText = profile.badgeLabel || profile.template?.predefinedDetails?.badgeLabel || '';
  const showBadge = profile.template?.layoutConfig?.showBadge !== false;
  const showQuote = profile.template?.layoutConfig?.showQuote !== false;
  const roleQuote = profile.templateQuote || profile.template?.predefinedDetails?.quote || '';

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* 1. HERO CARD */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-500/5 overflow-hidden">
        {/* Cover Banner */}
        <div
          className={`relative w-full overflow-hidden ${isCompact ? 'h-36 sm:h-44' : 'h-44 sm:h-64'}`}
          style={{
            background: coverUrl
              ? undefined
              : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
          }}
        >
          {coverUrl ? (
            <img
              src={coverUrl}
              alt="Organization Banner"
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="absolute inset-0 opacity-90 flex items-center justify-end p-8">
              <div className="w-72 h-72 rounded-full bg-white/10 blur-3xl" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Profile Card Body */}
        <div className={`px-4 sm:px-10 pb-6 sm:pb-8 pt-0 text-center space-y-4 sm:space-y-5 relative`}>
          {/* Overlapping Avatar */}
          <div className={`flex justify-center relative z-10 ${isCompact ? '-mt-14' : '-mt-16 sm:-mt-20'}`}>
            <div className="relative group">
              <div className={`${isCompact ? 'w-24 h-24 sm:w-28 sm:h-28' : 'w-28 h-28 sm:w-36 sm:h-36'} aspect-square rounded-3xl bg-white p-1.5 shadow-xl ring-4 ring-white flex items-center justify-center overflow-hidden`}>
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
          <div className="space-y-1.5 max-w-2xl mx-auto min-w-0">
            {showBadge && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold max-w-full">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span className="truncate">{badgeText || 'OneWinq Verified Employee'} • {profile.department?.name || 'Enterprise'}</span>
              </div>
            )}

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display break-words leading-tight">
              {profile.name}
            </h1>

            <p className="text-sm sm:text-base font-semibold text-purple-600">
              {(!profile.designation || profile.designation.toLowerCase() === 'team member') && profile.role?.name && profile.role.name !== 'Employee'
                ? profile.role.name
                : profile.designation || 'Team Member'}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-y-1 gap-x-4 text-xs text-slate-500 pt-1">
              {profile.companyName && (
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <Building2 className="w-3.5 h-3.5 text-purple-500" />
                  {profile.companyName}
                </span>
              )}
              {profile.location?.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {[profile.location.city, profile.location.country].filter(Boolean).join(', ')}
                </span>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onConnectClick}
              className="px-6 py-2.5 rounded-2xl text-white text-xs font-bold shadow-md transition-all hover:scale-105 cursor-pointer flex items-center gap-1.5"
              style={{ backgroundColor: primaryColor }}
            >
              <Mail className="w-4 h-4" /> {ctaText}
            </button>

            <button
              onClick={onDownloadVCard}
              className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Save Contact (.vcf)
            </button>

            <button
              onClick={onQrClick}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
              title="Show QR Code"
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

      {/* 2. ABOUT & BIO */}
      {(profile.bio || profile.headline) && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-xs font-extrabold text-purple-700 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Professional Bio & Overview
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
            {profile.bio || profile.headline}
          </p>
        </div>
      )}

      {/* 3. SKILLS */}
      {profile.skills && profile.skills.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600" /> Skills & Competencies
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 text-xs font-medium"
              >
                {skill.name || skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 4. EXPERIENCE */}
      {profile.experience && profile.experience.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-purple-600" /> Experience Trajectory
          </h3>
          <div className="space-y-3">
            {profile.experience.map((exp, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{exp.title}</h4>
                  <p className="text-[11px] text-purple-600 font-semibold">{exp.company} • {exp.location}</p>
                  {exp.description && <p className="text-xs text-slate-500 mt-1">{exp.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. SOCIAL LINKS */}
      {profile.socialLinks && profile.socialLinks.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-purple-600" /> Professional Channels
          </h3>
          <div className="flex items-center gap-3 flex-wrap">
            {profile.socialLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-200 text-xs font-semibold text-slate-700 hover:text-purple-700 transition-all flex items-center gap-2"
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
            <Sparkles className="w-16 h-16" style={{ color: primaryColor }} />
          </div>
          <div className="relative z-10 space-y-2">
            <p className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: primaryColor }}>
              Team Perspective
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


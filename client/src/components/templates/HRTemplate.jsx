import React from 'react';
import {
  Users,
  Building2,
  Mail,
  Phone,
  MapPin,
  HeartHandshake,
  Sparkles,
  Award,
  Globe,
  MessageSquare,
  UserPlus,
  Share2,
  Download,
  QrCode,
  ExternalLink
} from 'lucide-react';

export const HRTemplate = ({
  profile,
  onConnectClick,
  onQrClick,
  onDownloadVCard,
  onShareClick,
  isCompact = false
}) => {
  const companyBranding = profile.companyBranding || {};
  const coverUrl = profile.coverUrl;
  const primaryColor = profile.template?.layoutConfig?.colorPalette?.primary || '#0d9488';
  const secondaryColor = profile.template?.layoutConfig?.colorPalette?.secondary || '#134e4a';
  const accentColor = profile.template?.layoutConfig?.colorPalette?.accent || '#2dd4bf';
  const ctaText = profile.ctaButtonText || profile.template?.predefinedDetails?.ctaButtonText || 'Get in Touch';
  const badgeText = profile.badgeLabel || profile.template?.predefinedDetails?.badgeLabel || 'People & Culture';
  const showBadge = profile.template?.layoutConfig?.showBadge !== false;
  const showQuote = profile.template?.layoutConfig?.showQuote !== false;
  const roleQuote = profile.templateQuote || profile.template?.predefinedDetails?.quote || '';

  return (
    <div className={`space-y-6 sm:space-y-8 animate-fadeIn ${isCompact ? 'text-left' : ''}`}>
      {/* 1. PEOPLE & CULTURE HERO */}
      <div className="bg-white rounded-3xl border border-teal-100 shadow-xl overflow-hidden">
        {/* Cover Banner */}
        <div
          className={`relative w-full overflow-hidden ${isCompact ? 'h-36 sm:h-40' : 'h-48 sm:h-64'}`}
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
              <div className="w-64 h-64 rounded-full bg-white/10 blur-2xl" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/15" />
        </div>

        {/* Profile Details Area */}
        <div className={`px-4 sm:px-8 pb-6 sm:pb-8 pt-0 relative ${isCompact ? 'text-center' : 'text-center sm:text-left'}`}>
          <div className={`flex flex-col gap-5 ${isCompact ? 'items-center' : 'sm:flex-row sm:items-start justify-between'}`}>
            {/* Avatar & Badges */}
            <div className={`flex flex-col items-center gap-4 min-w-0 flex-1 ${isCompact ? '' : 'sm:flex-row sm:items-start text-center sm:text-left'}`}>
              {/* Overlapping Avatar */}
              <div className={`relative group shrink-0 z-10 ${isCompact ? '-mt-14' : '-mt-16 sm:-mt-20'}`}>
                <div className={`${isCompact ? 'w-24 h-24 sm:w-28 sm:h-28' : 'w-28 h-28 sm:w-36 sm:h-36'} rounded-3xl bg-white p-1.5 shadow-xl ring-4 ring-white overflow-hidden`}>
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-full h-full object-cover object-center rounded-2xl"
                    />
                  ) : (
                    <div
                      className="w-full h-full rounded-2xl text-white flex items-center justify-center text-2xl sm:text-3xl font-bold"
                      style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                    >
                      {profile.name?.slice(0, 2).toUpperCase() || 'HR'}
                    </div>
                  )}
                </div>
                <div
                  className="absolute -bottom-1 -right-1 text-white p-1.5 rounded-full ring-4 ring-white shadow-md"
                  style={{ backgroundColor: primaryColor }}
                  title="People Operations & HR"
                >
                  <Users className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Name & Identity Block */}
              <div className="pt-1 sm:pt-3 space-y-1.5 min-w-0 w-full">
                {showBadge && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-semibold max-w-full">
                    <Users className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="truncate">{badgeText} • {profile.department?.name || 'Human Resources'}</span>
                  </div>
                )}
                <h1 className={`${isCompact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl md:text-4xl'} font-extrabold text-slate-900 tracking-tight font-display break-words leading-tight`}>
                  {profile.name}
                </h1>
                <p className="text-xs sm:text-sm font-semibold" style={{ color: primaryColor }}>
                  {(!profile.designation || profile.designation.toLowerCase() === 'team member') && (profile.role?.name?.toLowerCase().includes('hr') || profile.role?.slug?.toLowerCase().includes('hr'))
                    ? 'HR Administrator'
                    : profile.designation || 'HR Professional'}
                </p>
                <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-0.5 ${isCompact ? 'justify-center' : 'justify-center sm:justify-start'}`}>
                  {profile.companyName && (
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {profile.companyName}
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
            <div className={`flex items-center gap-2 flex-wrap w-full shrink-0 ${isCompact ? 'justify-center pt-2' : 'sm:w-auto justify-center sm:justify-end pt-2 sm:pt-4'}`}>
              <button
                onClick={onConnectClick}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 hover:opacity-95"
                style={{ backgroundColor: primaryColor }}
              >
                <UserPlus className="w-4 h-4 shrink-0" /> <span className="truncate">{ctaText}</span>
              </button>
              <button
                onClick={onDownloadVCard}
                className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4 shrink-0" /> <span className="truncate">Save Contact</span>
              </button>
              <button
                onClick={onQrClick}
                className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer shrink-0"
                title="View QR Code"
              >
                <QrCode className="w-4 h-4" />
              </button>
              <button
                onClick={onShareClick}
                className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer shrink-0"
                title="Share Profile"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TALENT & CULTURE SPOTLIGHT CARD */}
      <div className={`grid gap-4 ${isCompact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
        <div className={`bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-3 ${isCompact ? '' : 'md:col-span-2'}`}>
          <h3 className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-2" style={{ color: primaryColor }}>
            <HeartHandshake className="w-4 h-4 shrink-0" /> People & Workplace Mission
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
            {profile.bio || profile.collaborationNote || 'Empowering team members, driving high-performance culture, and creating exceptional workplace experiences across the enterprise.'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-teal-50/50 rounded-3xl p-5 sm:p-6 border border-slate-200/80 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs" style={{ color: primaryColor }}>
              <Sparkles className="w-4 h-4 shrink-0" /> Talent & Careers
            </div>
            <p className="text-[11px] text-slate-600 leading-normal">
              Looking for career growth or collaborative projects at OneWinq? Connect directly with our team.
            </p>
          </div>
          <button
            onClick={onConnectClick}
            className="w-full py-2.5 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer hover:opacity-95 mt-2"
            style={{ backgroundColor: primaryColor }}
          >
            {ctaText}
          </button>
        </div>
      </div>

      {/* 3. CORE PEOPLE SKILLS & SPECIALIZATIONS */}
      {profile.skills && profile.skills.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-600" /> Areas of Expertise & HR Focus
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-100 text-xs font-medium"
              >
                {skill.name || skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 4. SOCIAL & RECRUITING CHANNELS */}
      {profile.socialLinks && profile.socialLinks.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-teal-600" /> Connect on Professional Networks
          </h3>
          <div className="flex items-center gap-3 flex-wrap">
            {profile.socialLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 text-xs font-semibold text-slate-700 hover:text-teal-700 transition-all flex items-center gap-2"
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
            <MessageSquare className="w-16 h-16" style={{ color: primaryColor }} />
          </div>
          <div className="relative z-10 space-y-2">
            <p className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: primaryColor }}>
              Role Perspective
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


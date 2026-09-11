import React from 'react';
import {
  Palette,
  Sparkles,
  Building2,
  Mail,
  Phone,
  MapPin,
  Image as ImageIcon,
  Share2,
  Download,
  QrCode,
  ExternalLink,
  Globe,
  Layers,
  Heart
} from 'lucide-react';

export const MarketingTemplate = ({
  profile,
  onConnectClick,
  onQrClick,
  onDownloadVCard,
  onShareClick,
  isCompact = false
}) => {
  const companyBranding = profile.companyBranding || {};
  const coverUrl = profile.coverUrl;
  const primaryColor = profile.template?.layoutConfig?.colorPalette?.primary || '#7c3aed';
  const accentColor = profile.template?.layoutConfig?.colorPalette?.accent || '#c084fc';
  const badgeText = profile.badgeLabel || profile.template?.predefinedDetails?.badgeLabel || '';
  const showBadge = profile.template?.layoutConfig?.showBadge !== false;
  const showQuote = profile.template?.layoutConfig?.showQuote !== false;
  const roleQuote = profile.templateQuote || profile.template?.predefinedDetails?.quote || '';

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* 1. CREATIVE & BRAND HERO */}
      <div className="bg-white rounded-3xl border border-purple-100 shadow-xl overflow-hidden">
        {/* Cover Banner */}
        <div className={`relative w-full overflow-hidden bg-gradient-to-r from-purple-700 via-fuchsia-600 to-indigo-800 ${isCompact ? 'h-36 sm:h-44' : 'h-48 sm:h-64'}`}>
          {coverUrl ? (
            <img
              src={coverUrl}
              alt="Organization Banner"
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-fuchsia-600 opacity-90 flex items-center justify-end p-8">
              <div className="w-64 h-64 rounded-full bg-white/10 blur-2xl" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Profile Details Area */}
        <div className={`px-4 sm:px-10 pb-6 sm:pb-8 pt-0 relative ${isCompact ? 'text-center' : 'text-center sm:text-left'}`}>
          <div className={`flex flex-col gap-5 ${isCompact ? 'items-center' : 'sm:flex-row sm:items-start justify-between'}`}>
            {/* Left: Avatar & Identity */}
            <div className={`flex flex-col items-center gap-4 min-w-0 flex-1 ${isCompact ? '' : 'sm:flex-row sm:items-start text-center sm:text-left'}`}>
              {/* Overlapping Avatar */}
              <div className={`relative group shrink-0 z-10 ${isCompact ? '-mt-14' : '-mt-16 sm:-mt-20'}`}>
                <div className={`${isCompact ? 'w-24 h-24 sm:w-28 sm:h-28' : 'w-32 h-32 sm:w-36 sm:h-36'} rounded-3xl bg-white p-1.5 shadow-xl ring-4 ring-purple-50 overflow-hidden`}>
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-full h-full object-cover object-center rounded-2xl"
                    />
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-600 text-white flex items-center justify-center text-3xl font-bold">
                      {profile.name?.slice(0, 2).toUpperCase() || 'MKT'}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-purple-600 text-white p-1.5 rounded-full ring-4 ring-white shadow-md" title="Marketing & Creative">
                  <Palette className="w-4 h-4" />
                </div>
              </div>

              {/* Name & Identity Block */}
              <div className="pt-2 sm:pt-4 space-y-1.5 min-w-0 flex-1">
                {showBadge && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold max-w-full">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span className="truncate">{badgeText || 'Marketing & Creative'} • {profile.department?.name || 'Marketing'}</span>
                  </div>
                )}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight font-display break-words leading-tight">
                  {profile.name}
                </h1>
                <p className="text-xs sm:text-sm text-purple-700 font-semibold">
                  {profile.designation}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-slate-500 pt-0.5">
                  {profile.companyName && (
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Building2 className="w-3.5 h-3.5 text-purple-600 shrink-0" /> {profile.companyName}
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
                className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-200 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" /> Collaborate
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

      {/* 2. CREATIVE MISSION & BIO */}
      {(profile.bio || profile.collaborationNote) && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-xs font-extrabold text-purple-700 uppercase tracking-wider flex items-center gap-2">
            <Palette className="w-4 h-4" /> Brand Vision & Creative Philosophy
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
            {profile.bio || profile.collaborationNote}
          </p>
        </div>
      )}

      {/* 3. MEDIA & CAMPAIGN GALLERY */}
      {profile.mediaGallery && profile.mediaGallery.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-purple-600" /> Creative Portfolio & Brand Highlights
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {profile.mediaGallery.map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs space-y-2 pb-3">
                <div className="h-40 bg-slate-100 overflow-hidden">
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="px-3">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                  {item.description && <p className="text-[11px] text-slate-500 line-clamp-2">{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SOCIAL & BRAND CHANNELS */}
      {profile.socialLinks && profile.socialLinks.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-purple-600" /> Brand & Social Channels
          </h3>
          <div className="flex items-center gap-3 flex-wrap">
            {profile.socialLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200/70 text-xs font-semibold text-purple-800 transition-all flex items-center gap-2"
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
              Creative Philosophy
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


import React from 'react';
import {
  Palette,
  Sparkles,
  Image as ImageIcon,
  ExternalLink,
  Globe
} from 'lucide-react';
import { DigitalHeroCard } from './DigitalHeroCard';

export const MarketingTemplate = ({
  profile,
  onConnectClick,
  onQrClick,
  onDownloadVCard,
  onShareClick,
  isCompact = false
}) => {
  const primaryColor = profile.template?.layoutConfig?.colorPalette?.primary || '#7c3aed';
  const accentColor = profile.template?.layoutConfig?.colorPalette?.accent || '#c084fc';
  const showQuote = profile.template?.layoutConfig?.showQuote !== false;
  const roleQuote = profile.templateQuote || profile.template?.predefinedDetails?.quote || '';

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* 1. UNIFIED DIGITAL HERO CARD */}
      <DigitalHeroCard
        profile={profile}
        onConnectClick={onConnectClick}
        onQrClick={onQrClick}
        onDownloadVCard={onDownloadVCard}
        onShareClick={onShareClick}
        isCompact={isCompact}
      />

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


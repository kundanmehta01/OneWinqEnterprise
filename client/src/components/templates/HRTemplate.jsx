import React from 'react';
import {
  Users,
  HeartHandshake,
  Sparkles,
  Globe,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import { DigitalHeroCard } from './DigitalHeroCard';

export const HRTemplate = ({
  profile,
  onConnectClick,
  onQrClick,
  onDownloadVCard,
  onShareClick,
  isCompact = false
}) => {
  const primaryColor = profile.template?.layoutConfig?.colorPalette?.primary || '#0d9488';
  const accentColor = profile.template?.layoutConfig?.colorPalette?.accent || '#2dd4bf';
  const ctaText = profile.ctaButtonText || profile.template?.predefinedDetails?.ctaButtonText || 'Get in Touch';
  const showQuote = profile.template?.layoutConfig?.showQuote !== false;
  const roleQuote = profile.templateQuote || profile.template?.predefinedDetails?.quote || '';

  return (
    <div className={`space-y-6 sm:space-y-8 animate-fadeIn ${isCompact ? 'text-left' : ''}`}>
      {/* 1. UNIFIED DIGITAL HERO CARD */}
      <DigitalHeroCard
        profile={profile}
        onConnectClick={onConnectClick}
        onQrClick={onQrClick}
        onDownloadVCard={onDownloadVCard}
        onShareClick={onShareClick}
        isCompact={isCompact}
      />

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


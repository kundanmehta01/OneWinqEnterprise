import React from 'react';
import {
  TrendingUp,
  Globe,
  ExternalLink,
  Target,
  Briefcase
} from 'lucide-react';
import { DigitalHeroCard } from './DigitalHeroCard';

export const SalesTemplate = ({
  profile,
  onConnectClick,
  onQrClick,
  onDownloadVCard,
  onShareClick,
  isCompact = false
}) => {
  const primaryColor = profile.template?.layoutConfig?.colorPalette?.primary || '#d97706';
  const accentColor = profile.template?.layoutConfig?.colorPalette?.accent || '#fcd34d';
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


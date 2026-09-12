import React from 'react';
import {
  Briefcase,
  Layers,
  Sparkles,
  Globe,
  ExternalLink
} from 'lucide-react';
import { DigitalHeroCard } from './DigitalHeroCard';

export const DefaultTemplate = ({
  profile,
  onConnectClick,
  onQrClick,
  onDownloadVCard,
  onShareClick,
  isCompact = false
}) => {
  const primaryColor = profile.template?.layoutConfig?.colorPalette?.primary || '#059669';
  const accentColor = profile.template?.layoutConfig?.colorPalette?.accent || '#818cf8';
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


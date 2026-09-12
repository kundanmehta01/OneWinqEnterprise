import React from 'react';
import {
  Briefcase,
  Award,
  ExternalLink,
  Sparkles,
  Globe,
  Quote
} from 'lucide-react';
import { DigitalHeroCard } from './DigitalHeroCard';

export const ExecutiveTemplate = ({
  profile,
  onConnectClick,
  onQrClick,
  onDownloadVCard,
  onShareClick,
  isCompact = false
}) => {
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


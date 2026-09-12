import React from 'react';
import {
  Layers,
  Sparkles,
  ExternalLink,
  Globe,
  Rocket,
  CheckCircle2,
  TrendingUp,
  Target,
  Briefcase
} from 'lucide-react';
import { DigitalHeroCard } from './DigitalHeroCard';

export const ProductTemplate = ({
  profile,
  onConnectClick,
  onQrClick,
  onDownloadVCard,
  onShareClick,
  isCompact = false
}) => {
  const showQuote = profile.template?.layoutConfig?.showQuote !== false;
  const roleQuote = profile.templateQuote || profile.template?.predefinedDetails?.quote || '';

  const pub = profile.published || profile.draft || profile;
  const projects = pub.projects || [];
  const skills = pub.skills || [];
  const experience = pub.experience || [];
  const socialLinks = pub.socialLinks || [];
  const metrics = pub.impactMetrics || [];

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

      {/* 2. PRODUCT VISION & QUOTE */}
      {showQuote && roleQuote && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-white to-cyan-50/60 border border-indigo-100 flex items-start gap-3 shadow-xs">
          <Target className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm italic text-indigo-950 leading-relaxed font-medium">
            "{roleQuote}"
          </p>
        </div>
      )}

      {/* 3. IMPACT & PRODUCT METRICS */}
      {metrics && metrics.length > 0 && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-900">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span>Product Impact & Metrics</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {metrics.map((m, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100/60 text-center">
                <div className="text-lg sm:text-xl font-extrabold text-indigo-950 font-display">{m.metric}</div>
                <div className="text-[11px] font-medium text-indigo-600 mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. FEATURED PRODUCTS & ROADMAPS */}
      {projects && projects.length > 0 && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Products & Shipped Features</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-400">{projects.length} Initiatives</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((proj, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{proj.title}</h4>
                    {proj.badge && (
                      <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-bold shrink-0">
                        {proj.badge}
                      </span>
                    )}
                  </div>
                  {proj.description && (
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {proj.description}
                    </p>
                  )}
                </div>
                {proj.role && (
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                    <span className="text-indigo-600">Role:</span> {proj.role}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. PRODUCT COMPETENCIES & METHODOLOGIES */}
      {skills && skills.length > 0 && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            <span>Product Stack & Methodologies</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {skills.map((skill, idx) => {
              const name = typeof skill === 'string' ? skill : skill.name;
              return (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors"
                >
                  {name}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. PRODUCT LEADERSHIP HISTORY */}
      {experience && experience.length > 0 && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <span>Product Experience & Trajectory</span>
          </div>
          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-xs sm:text-sm font-bold text-slate-900">{exp.title || exp.role}</span>
                  <span className="text-[11px] text-slate-400 font-medium">{exp.duration || (exp.isCurrent ? 'Present' : '')}</span>
                </div>
                <div className="text-xs text-indigo-600 font-medium">{exp.company}</div>
                {exp.description && (
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. CONNECT & SOCIAL CHANNELS */}
      {socialLinks && socialLinks.length > 0 && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
            <Globe className="w-4 h-4 text-indigo-600" />
            <span>Product Channels & Profiles</span>
          </div>
          <div className="flex flex-wrap gap-2.5 pt-1">
            {socialLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url?.startsWith('http') ? link.url : `https://${link.url}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-xs font-semibold text-slate-700 hover:text-indigo-700 transition-all capitalize"
              >
                <span>{link.platform}</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

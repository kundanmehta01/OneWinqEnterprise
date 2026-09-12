import React from 'react';
import {
  Terminal,
  Cpu,
  FolderGit2,
  ExternalLink,
  Globe
} from 'lucide-react';
import { DigitalHeroCard } from './DigitalHeroCard';

export const EngineeringTemplate = ({
  profile,
  onConnectClick,
  onQrClick,
  onDownloadVCard,
  onShareClick,
  isCompact = false
}) => {
  const primaryColor = profile.template?.layoutConfig?.colorPalette?.primary || '#0284c7';
  const accentColor = profile.template?.layoutConfig?.colorPalette?.accent || '#38bdf8';
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

      {/* 2. TECH STACK & CORE SKILLS */}
      {profile.skills && profile.skills.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-600" /> Technical Stack & Core Competencies
            </h3>
            <span className="text-[11px] font-mono text-sky-600 font-bold">{profile.skills.length} Technologies</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {profile.skills.map((skill, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2 hover:border-sky-300 transition-all"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                  <span className="text-xs font-bold text-slate-800 truncate">{skill.name || skill}</span>
                </div>
                {skill.proficiencyLevel && (
                  <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 shrink-0">
                    {skill.proficiencyLevel}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. FEATURED ENGINEERING PROJECTS */}
      {profile.projects && profile.projects.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-sky-600" /> Featured Engineering Projects & Architecture
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profile.projects.map((proj, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-[10px] font-bold border border-sky-100">
                      {proj.status || 'Active'}
                    </span>
                    {proj.url && (
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-sky-600 font-semibold hover:underline flex items-center gap-1"
                      >
                        <span>View Project</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{proj.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {proj.description}
                  </p>
                </div>

                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                    {proj.technologies.map((t, tIdx) => (
                      <span key={tIdx} className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-mono text-slate-700">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. BIO / ENGINEERING FOCUS */}
      {profile.bio && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Terminal className="w-4 h-4 text-sky-600" /> Engineering Bio & Interests
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
            {profile.bio}
          </p>
        </div>
      )}

      {/* 5. GITHUB & SOCIAL LINKS */}
      {profile.socialLinks && profile.socialLinks.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-sky-600" /> Code Repositories & Professional Profiles
          </h3>
          <div className="flex items-center gap-3 flex-wrap">
            {profile.socialLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-200 text-xs font-semibold text-slate-700 hover:text-sky-700 transition-all flex items-center gap-2"
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
            <Terminal className="w-16 h-16" style={{ color: primaryColor }} />
          </div>
          <div className="relative z-10 space-y-2">
            <p className="text-[10px] font-extrabold uppercase tracking-widest font-mono" style={{ color: primaryColor }}>
              Engineering Philosophy
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


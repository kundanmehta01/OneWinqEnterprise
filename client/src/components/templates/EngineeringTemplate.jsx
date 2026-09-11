import React from 'react';
import {
  Code,
  Terminal,
  Cpu,
  Building2,
  Mail,
  Phone,
  MapPin,
  FolderGit2,
  ExternalLink,
  Layers,
  Sparkles,
  Award,
  Globe,
  Share2,
  Download,
  QrCode,
  CheckCircle2
} from 'lucide-react';

export const EngineeringTemplate = ({
  profile,
  onConnectClick,
  onQrClick,
  onDownloadVCard,
  onShareClick,
  isCompact = false
}) => {
  const companyBranding = profile.companyBranding || {};
  const coverUrl = profile.coverUrl;
  const primaryColor = profile.template?.layoutConfig?.colorPalette?.primary || '#0284c7';
  const accentColor = profile.template?.layoutConfig?.colorPalette?.accent || '#38bdf8';
  const badgeText = profile.badgeLabel || profile.template?.predefinedDetails?.badgeLabel || '';
  const showBadge = profile.template?.layoutConfig?.showBadge !== false;
  const showQuote = profile.template?.layoutConfig?.showQuote !== false;
  const roleQuote = profile.templateQuote || profile.template?.predefinedDetails?.quote || '';

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* 1. TECH & DEV HERO BANNER */}
      <div className="bg-white rounded-3xl border border-sky-100 shadow-xl overflow-hidden">
        {/* Cover Banner */}
        <div className={`relative w-full overflow-hidden bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 ${isCompact ? 'h-36 sm:h-44' : 'h-48 sm:h-64'}`}>
          {coverUrl ? (
            <img
              src={coverUrl}
              alt="Organization Banner"
              className="w-full h-full object-cover object-center opacity-80"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-sky-900 to-indigo-950 opacity-90 flex items-center justify-end p-8">
              <div className="w-64 h-64 rounded-full bg-sky-400/10 blur-2xl" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Profile Card Body */}
        <div className={`px-4 sm:px-10 pb-6 sm:pb-8 pt-0 relative ${isCompact ? 'text-center' : 'text-center sm:text-left'}`}>
          <div className={`flex flex-col gap-5 ${isCompact ? 'items-center' : 'sm:flex-row sm:items-start justify-between'}`}>
            {/* Left: Avatar & Identity */}
            <div className={`flex flex-col items-center gap-4 min-w-0 flex-1 ${isCompact ? '' : 'sm:flex-row sm:items-start text-center sm:text-left'}`}>
              {/* Overlapping Avatar */}
              <div className={`relative group shrink-0 z-10 ${isCompact ? '-mt-14' : '-mt-16 sm:-mt-20'}`}>
                <div className={`${isCompact ? 'w-24 h-24 sm:w-28 sm:h-28' : 'w-32 h-32 sm:w-36 sm:h-36'} rounded-3xl bg-white p-1.5 shadow-xl ring-4 ring-sky-50 overflow-hidden`}>
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-full h-full object-cover object-center rounded-2xl"
                    />
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-700 text-white flex items-center justify-center text-3xl font-bold">
                      {profile.name?.slice(0, 2).toUpperCase() || 'DEV'}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-sky-600 text-white p-1.5 rounded-full ring-4 ring-white shadow-md" title="Engineering & Tech">
                  <Terminal className="w-4 h-4" />
                </div>
              </div>

              {/* Name & Identity Block */}
              <div className="pt-2 sm:pt-4 space-y-1.5 min-w-0 flex-1">
                {showBadge && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold max-w-full">
                    <Code className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span className="truncate">{badgeText || 'Engineering'} • {profile.department?.name || 'Technology'}</span>
                  </div>
                )}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight font-display break-words leading-tight">
                  {profile.name}
                </h1>
                <p className="text-xs sm:text-sm text-sky-700 font-semibold font-mono">
                  {profile.designation}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-slate-500 pt-0.5">
                  {profile.companyName && (
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Building2 className="w-3.5 h-3.5 text-sky-600 shrink-0" /> {profile.companyName}
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

            {/* Right: Actions */}
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end pt-2 sm:pt-4 shrink-0">
              <button
                onClick={onConnectClick}
                className="px-5 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md shadow-sky-200 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Mail className="w-4 h-4" /> Connect with Engineer
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


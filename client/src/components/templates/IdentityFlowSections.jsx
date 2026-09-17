import React, { useState } from 'react';
import {
  Briefcase,
  Layers,
  Sparkles,
  Globe,
  ExternalLink,
  Award,
  FolderGit2,
  Mail,
  Phone,
  Share2,
  Calendar,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Image as ImageIcon,
  Video,
  FileText,
  Clock,
  Send,
  UserCheck,
  CheckCircle2,
  Compass,
  BookOpen,
  Linkedin,
  Instagram,
  Facebook,
  Zap
} from 'lucide-react';
import { DigitalHeroCard } from './DigitalHeroCard';

/**
 * Universal 8-Section Identity Flow Component
 * 1. Overview (Unified Digital Hero Card + Quick Hub)
 * 2. About (Introduction, Expertise, Experience)
 * 3. Journey (Career Timeline)
 * 4. Work / Projects (Featured Projects - Impact section removed)
 * 5. Achievements (Honors & Certifications)
 * 6. Media & Gallery (Filter tabs: All, Photos, Videos, Events)
 * 7. Blogs & Thoughts (Articles with dates)
 * 8. Connect & Contact (Contact channels + Send Contact)
 */
export const IdentityFlowSections = ({
  profile,
  onConnectClick,
  onQrClick,
  onDownloadVCard,
  onShareClick,
  isCompact = false,
  activeScreen,
  onNavigate = () => {},
  theme = {}
}) => {
  const [activeMediaTab, setActiveMediaTab] = useState('all');

  if (!profile) return null;

  const primaryColor = theme.primary || profile.template?.layoutConfig?.colorPalette?.primary || '#7c3aed';
  const accentColor = theme.accent || profile.template?.layoutConfig?.colorPalette?.accent || '#a855f7';
  const roleQuote = profile.templateQuote || profile.template?.predefinedDetails?.quote || '';
  const showQuote = profile.template?.layoutConfig?.showQuote !== false;

  const firstName = profile.name?.trim().split(' ')[0] || 'Member';
  const departmentName = profile.department?.name || profile.department || 'Enterprise';

  // Safe array normalizer for skills/capabilities
  const normalizeSkillsList = (source) => {
    if (!source) return [];
    if (Array.isArray(source)) return source;
    if (typeof source === 'string') {
      return source
        .split(/[,;\n]+/)
        .map(s => s.trim())
        .filter(Boolean)
        .map(s => ({ name: s }));
    }
    if (typeof source === 'object') {
      if (Array.isArray(source.skills)) return source.skills;
      if (Array.isArray(source.list)) return source.list;
      if (Array.isArray(source.items)) return source.items;
      return Object.values(source)
        .filter(v => typeof v === 'string' || (typeof v === 'object' && v !== null))
        .map(v => (typeof v === 'string' ? { name: v } : v));
    }
    return [];
  };

  // Filter media gallery based on active tab
  const allMedia = Array.isArray(profile.mediaGallery) ? profile.mediaGallery : [];
  const filteredMedia = allMedia.filter(item => {
    if (activeMediaTab === 'all') return true;
    const type = (item.type || '').toLowerCase();
    if (activeMediaTab === 'photos') return type === 'photo' || type === 'image';
    if (activeMediaTab === 'videos') return type === 'video';
    if (activeMediaTab === 'events') return type === 'event';
    return true;
  });

  // Extract contact links
  const socialLinks = Array.isArray(profile.socialLinks) ? profile.socialLinks : [];
  const linkedinLink = socialLinks.find(l => l.platform?.toLowerCase().includes('linkedin'));
  const twitterLink = socialLinks.find(l => l.platform?.toLowerCase().includes('twitter') || l.platform?.toLowerCase().includes('x'));
  const otherSocials = socialLinks.filter(l => l !== linkedinLink && l !== twitterLink);

  const projectsList = Array.isArray(profile.workAndImpact?.projects)
    ? profile.workAndImpact.projects
    : Array.isArray(profile.projects)
    ? profile.projects
    : [];

  const rawExperience = (Array.isArray(profile.experience) && profile.experience.length > 0)
    ? profile.experience
    : (Array.isArray(profile.journey) && profile.journey.length > 0)
    ? profile.journey
    : (Array.isArray(profile.about?.experience) ? profile.about.experience : []);

  const experienceList = rawExperience
    .filter(item => item && ((item.company && item.company.trim()) || (item.role && item.role.trim()) || (item.title && item.title.trim())))
    .map((item, idx) => {
      const company = item.company || item.organization || item.title || '';
      const role = item.role || item.designation || (item.company ? item.title : '') || item.subtitle || '';
      const isPresent = Boolean(
        item.isCurrent ||
        (typeof item.to === 'string' && /present|current/i.test(item.to)) ||
        (typeof item.period === 'string' && /present|current/i.test(item.period)) ||
        (typeof item.year === 'string' && /present|current/i.test(item.year))
      );

      const fromMonth = item.fromMonth || '';
      const fromYear = item.fromYear || item.from || '';
      const toMonth = isPresent ? '' : (item.toMonth || '');
      const toYear = isPresent ? 'PRESENT' : (item.toYear || item.to || '');

      let from = fromMonth && fromYear ? `${fromMonth} ${fromYear}` : (fromYear || item.from || '');
      let to = isPresent ? 'PRESENT' : (toMonth && toYear ? `${toMonth} ${toYear}` : (toYear || item.to || ''));

      if (!from || (!to && !isPresent)) {
        const raw = item.period || item.year || '';
        if (raw.includes('-')) {
          const parts = raw.split('-');
          if (!from) from = parts[0].trim();
          if (!to && !isPresent) to = parts[1].trim();
        } else if (!from && raw) {
          from = raw.trim();
        }

        if (!from && item.startDate) {
          from = String(new Date(item.startDate).getFullYear());
        }
        if (!to && item.endDate && !isPresent) {
          to = String(new Date(item.endDate).getFullYear());
        }
      }

      let period = '';
      if (from && to) {
        period = isPresent ? `${from}- PRESENT` : `${from}- ${to}`;
      } else if (from) {
        period = isPresent ? `${from}- PRESENT` : from;
      } else if (to) {
        period = to;
      } else if (item.period) {
        period = item.period;
      } else if (isPresent) {
        period = 'PRESENT';
      }

      return {
        _id: item._id || idx,
        company,
        role,
        title: role,
        fromMonth,
        fromYear,
        from,
        toMonth,
        toYear,
        to,
        period,
        isCurrent: isPresent
      };
    });
  const journeyList = experienceList;
  const achievementsList = profile.achievements || [];
  const blogsList = profile.blogs || [];

  // SCREEN 1: OVERVIEW (Hero Card + Navigation Hub)
  // ────────────────────────────────────────────────────────────────
  const renderScreen1 = () => (
    <div className="space-y-6 animate-fadeIn">
      <section id="screen-1-overview">
        <DigitalHeroCard
          profile={profile}
          onConnectClick={onConnectClick}
          onQrClick={onQrClick}
          onDownloadVCard={onDownloadVCard}
          onShareClick={onShareClick}
          isCompact={isCompact}
        />
      </section>

      {/* Quick Navigation Cards Hub (Matching Company Profile Flow) */}
      {activeScreen !== undefined && !isCompact && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Explore Profile Sections
            </h4>
            <span className="text-xs text-purple-600 font-semibold">Quick Jump</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                id: 2,
                name: 'About & Bio',
                subtitle: 'Professional Bio & Key Focus',
              },
              {
                id: 3,
                name: 'Work Experience',
                subtitle: experienceList.length > 0 ? `${experienceList.length} professional roles` : 'Roles & Career Timeline',
              },
              {
                id: 4,
                name: 'Featured Projects',
                subtitle: projectsList.length > 0 ? `${projectsList.length} delivered projects` : 'Initiatives & Deliverables',
              },
              {
                id: 5,
                name: 'Achievements',
                subtitle: achievementsList.length > 0 ? `${achievementsList.length} awards & honors` : 'Honors & Certifications',
              },
              {
                id: 6,
                name: 'Media Gallery',
                subtitle: allMedia.length > 0 ? `${allMedia.length} media assets` : 'Photos, Videos & Events',
              },
              {
                id: 7,
                name: 'Blogs / Thoughts',
                subtitle: blogsList.length > 0 ? `${blogsList.length} articles published` : 'Articles & Thought Leadership',
              },
            ].map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => onNavigate(sec.id)}
                className="clean-card clean-card-hover p-5 text-left flex items-center justify-between group border border-slate-100 bg-white rounded-3xl shadow-2xs cursor-pointer h-full min-h-[82px]"
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors truncate font-display">
                    {sec.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{sec.subtitle}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all shrink-0" />
              </button>
            ))}
          </div>

          {/* Quick Access to Contact Diary */}
          <button
            type="button"
            onClick={() => onNavigate(8)}
            className="w-full clean-card clean-card-hover p-4 sm:p-5 text-left flex items-center justify-between group border border-purple-100/80 bg-gradient-to-r from-purple-50/50 via-white to-white rounded-3xl shadow-2xs cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-sm shadow-purple-500/25 group-hover:scale-105 transition-transform shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors font-display">
                  Contact Diary & Direct Channels
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Save verified vCard, exchange contact details, or email directly
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-purple-600 shrink-0">
              <span>View Channels</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      )}
    </div>
  );

  // ────────────────────────────────────────────────────────────────
  // SCREEN 2: ABOUT
  // ────────────────────────────────────────────────────────────────
  const renderScreen2 = () => (
    <div id="screen-2-about" className="clean-card bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between animate-fadeIn space-y-6">
      <div className="space-y-6">
        {/* Uniform Screen Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            {activeScreen !== undefined && (
              <button
                type="button"
                onClick={() => onNavigate(1)}
                className="w-10 h-10 rounded-full bg-slate-50 hover:bg-purple-50 hover:text-purple-600 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                title="Back to Overview"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight font-display">
                {profile.about?.title || `About ${firstName}`}
              </h3>
              <p className="text-xs text-slate-500">Professional Summary, Core Expertise & Bio</p>
            </div>
          </div>
          <span className="px-3.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
            Profile Bio
          </span>
        </div>

        {/* 2.1 Introduction */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Introduction</h4>
          <p className="text-sm text-slate-700 leading-relaxed font-sans">
            {profile.about?.introduction || profile.bio || profile.headline || 'Dedicated enterprise professional passionate about driving technology excellence and collaborative growth.'}
          </p>
        </div>

        {/* 2.2 Core Expertise Summary */}
        {(() => {
          const rawExpertiseText = typeof profile.about?.expertise === 'string' && profile.about.expertise.trim()
            ? profile.about.expertise.trim()
            : (typeof profile.about?.expertiseText === 'string' && profile.about.expertiseText.trim() ? profile.about.expertiseText.trim() : '');

          const expertiseItems = normalizeSkillsList(
            (Array.isArray(profile.about?.expertiseList) && profile.about.expertiseList.length > 0)
              ? profile.about.expertiseList
              : (Array.isArray(profile.skills) && profile.skills.length > 0)
              ? profile.skills
              : null
          );

          if (!rawExpertiseText && (!expertiseItems || expertiseItems.length === 0)) return null;

          return (
            <div className="space-y-2.5 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Core Focus Areas</h4>
              {rawExpertiseText ? (
                <p className="text-sm text-slate-700 leading-relaxed font-sans">
                  {rawExpertiseText}
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {expertiseItems.map((skill, idx) => {
                    const name = typeof skill === 'string' ? skill : (skill.name || skill.title || skill.label || 'Capability');
                    return (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100/80 text-slate-700 border border-slate-200/80"
                      >
                        {name}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {/* 2.3 Experience Summary */}
        <div className="space-y-2.5 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Experience Overview</h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
            {profile.about?.experienceSummary || `${profile.overviewStats?.years || profile.overviewStats?.yearsOfExperience || '5+'} years in ${departmentName} leadership, high-velocity execution, and driving enterprise digital transformation.`}
          </p>
        </div>
      </div>

      {/* Screen Navigation Footer */}
      {activeScreen !== undefined && (
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold mt-auto">
          <button
            type="button"
            onClick={() => onNavigate(1)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-purple-600 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
          </button>
          <button
            type="button"
            onClick={() => onNavigate(3)}
            className="flex items-center gap-1.5 text-purple-600 hover:underline cursor-pointer"
          >
            Work Experience <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );

  // ────────────────────────────────────────────────────────────────
  // SCREEN 3: WORK EXPERIENCE
  // ────────────────────────────────────────────────────────────────
  const renderScreen3 = () => (
    <div id="screen-3-experience" className="clean-card bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between animate-fadeIn space-y-6">
      <div className="space-y-6">
        {/* Uniform Screen Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            {activeScreen !== undefined && (
              <button
                type="button"
                onClick={() => onNavigate(1)}
                className="w-10 h-10 rounded-full bg-slate-50 hover:bg-purple-50 hover:text-purple-600 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                title="Back to Overview"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight font-display">
                Work Experience
              </h3>
              <p className="text-xs text-slate-500">Career Timeline, Roles & Track Record</p>
            </div>
          </div>
        </div>

        {experienceList.length > 0 ? (
          <div className="relative pl-7 space-y-7 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-3 before:w-[2px] before:bg-slate-200">
            {experienceList.map((item, idx) => {
              const isPresent = Boolean(
                item.isCurrent ||
                /present|current/i.test(item.period || '') ||
                /present|current/i.test(item.year || '')
              );

              return (
                <div key={idx} className="relative group">
                  <div
                    className={`absolute -left-[27px] top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-white transition-all ${
                      isPresent
                        ? 'border-purple-600 bg-purple-50 shadow-xs ring-4 ring-purple-100'
                        : 'border-slate-300'
                    }`}
                    style={isPresent ? { borderColor: primaryColor } : {}}
                  >
                    <div
                      className={`rounded-full ${
                        isPresent
                          ? 'w-2 h-2 bg-purple-600'
                          : 'w-1.5 h-1.5 bg-slate-400'
                      }`}
                      style={isPresent ? { backgroundColor: primaryColor } : {}}
                    />
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                        {item.company || item.title}
                      </h4>

                      {item.period && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs whitespace-nowrap shrink-0 transition-colors ${
                            isPresent
                              ? 'bg-purple-100 text-purple-700 font-bold border border-purple-200/80 shadow-2xs'
                              : 'bg-slate-100 text-slate-500 font-semibold'
                          }`}
                          style={
                            isPresent
                              ? {
                                  backgroundColor: `${primaryColor}18`,
                                  color: primaryColor,
                                  borderColor: `${primaryColor}35`
                                }
                              : {}
                          }
                        >
                          {item.period}
                        </span>
                      )}
                    </div>

                    {(item.role || item.title) && (
                      <p
                        className="text-xs sm:text-sm font-semibold text-purple-600 tracking-tight"
                        style={{ color: primaryColor }}
                      >
                        {item.role || item.title}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-xs font-bold text-slate-700">Experience Records</h4>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              {firstName}'s career and roles history is actively being updated.
            </p>
          </div>
        )}
      </div>

      {activeScreen !== undefined && (
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold mt-auto">
          <button
            type="button"
            onClick={() => onNavigate(2)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-purple-600 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> About
          </button>
          <button
            type="button"
            onClick={() => onNavigate(4)}
            className="flex items-center gap-1.5 text-purple-600 hover:underline cursor-pointer"
          >
            Featured Projects <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );

  // ────────────────────────────────────────────────────────────────
  // SCREEN 4: FEATURED PROJECTS
  // ────────────────────────────────────────────────────────────────
  const renderScreen4 = () => (
    <div id="screen-4-work" className="clean-card bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between animate-fadeIn space-y-6">
      <div className="space-y-6">
        {/* Uniform Screen Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            {activeScreen !== undefined && (
              <button
                type="button"
                onClick={() => onNavigate(1)}
                className="w-10 h-10 rounded-full bg-slate-50 hover:bg-purple-50 hover:text-purple-600 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                title="Back to Overview"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight font-display">
                {profile.workAndImpact?.title || 'Featured Projects'}
              </h3>
              <p className="text-xs text-slate-500">Enterprise Solutions & Key Initiatives</p>
            </div>
          </div>
          <span className="px-3.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
            {projectsList.length} {projectsList.length === 1 ? 'Project' : 'Projects'}
          </span>
        </div>

        {projectsList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectsList.map((proj, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50/80 hover:bg-purple-50/30 border border-slate-200/70 transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                      style={{ backgroundColor: `${primaryColor}10`, borderColor: `${primaryColor}20`, color: primaryColor }}
                    >
                      {proj.badge || proj.status || 'Initiative'}
                    </span>
                    {proj.url && (
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-slate-700 transition-colors"
                        title="View Project"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug font-display">{proj.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {proj.description}
                  </p>
                </div>

                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-3 border-t border-slate-200/60">
                    {proj.technologies.map((t, tIdx) => (
                      <span key={tIdx} className="px-2 py-0.5 rounded-md bg-white text-[10px] font-medium text-slate-600 border border-slate-200/70">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
            <FolderGit2 className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800 font-display">Projects Portfolio</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {firstName}'s featured projects and technical initiatives will appear here once published.
            </p>
          </div>
        )}
      </div>

      {activeScreen !== undefined && (
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold mt-auto">
          <button
            type="button"
            onClick={() => onNavigate(3)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-purple-600 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Work Experience
          </button>
          <button
            type="button"
            onClick={() => onNavigate(5)}
            className="flex items-center gap-1.5 text-purple-600 hover:underline cursor-pointer"
          >
            Achievements <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );

  // ────────────────────────────────────────────────────────────────
  // SCREEN 5: ACHIEVEMENTS
  // ────────────────────────────────────────────────────────────────
  const renderScreen5 = () => (
    <div id="screen-5-achievements" className="clean-card bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between animate-fadeIn space-y-6">
      <div className="space-y-6">
        {/* Uniform Screen Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            {activeScreen !== undefined && (
              <button
                type="button"
                onClick={() => onNavigate(1)}
                className="w-10 h-10 rounded-full bg-slate-50 hover:bg-purple-50 hover:text-purple-600 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                title="Back to Overview"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight font-display">
                My Achievements
              </h3>
              <p className="text-xs text-slate-500">Industry Honors, Certifications & Awards</p>
            </div>
          </div>
          <span className="px-3.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
            {achievementsList.length} {achievementsList.length === 1 ? 'Honor' : 'Honors'}
          </span>
        </div>

        {achievementsList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievementsList.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50/80 hover:bg-purple-50/30 border border-slate-200/70 transition-all flex items-start gap-4"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs bg-purple-50 text-purple-600"
                  style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                >
                  <Award className="w-6 h-6 text-amber-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-slate-900 leading-snug font-display">{item.title}</h4>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">{item.subtitle || item.issuer}</p>
                  {item.description && (
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
            <Award className="w-8 h-8 text-amber-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800 font-display">Honors & Certifications</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {firstName}'s awards, credentials and industry certifications are maintained here.
            </p>
          </div>
        )}
      </div>

      {activeScreen !== undefined && (
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold mt-auto">
          <button
            type="button"
            onClick={() => onNavigate(4)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-purple-600 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Featured Projects
          </button>
          <button
            type="button"
            onClick={() => onNavigate(6)}
            className="flex items-center gap-1.5 text-purple-600 hover:underline cursor-pointer"
          >
            Media Gallery <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );

  // ────────────────────────────────────────────────────────────────
  // SCREEN 6: MEDIA GALLERY
  // ────────────────────────────────────────────────────────────────
  const renderScreen6 = () => (
    <div id="screen-6-media" className="clean-card bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between animate-fadeIn space-y-6">
      <div className="space-y-6">
        {/* Uniform Screen Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            {activeScreen !== undefined && (
              <button
                type="button"
                onClick={() => onNavigate(1)}
                className="w-10 h-10 rounded-full bg-slate-50 hover:bg-purple-50 hover:text-purple-600 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                title="Back to Overview"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight font-display">
                Media Gallery
              </h3>
              <p className="text-xs text-slate-500">Photos, Videos, Press & Events</p>
            </div>
          </div>
          <span className="px-3.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
            {allMedia.length} {allMedia.length === 1 ? 'Media' : 'Assets'}
          </span>
        </div>

        {allMedia.length > 0 ? (
          <>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {['all', 'photos', 'videos', 'events'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveMediaTab(tab)}
                  className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all cursor-pointer ${
                    activeMediaTab === tab
                      ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  style={activeMediaTab === tab ? { backgroundColor: primaryColor } : {}}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
              {(filteredMedia.length > 0 ? filteredMedia : allMedia).map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/70 flex flex-col justify-between group shadow-2xs relative"
                >
                  <div className="h-44 bg-slate-100 overflow-hidden relative">
                    <img
                      src={item.thumbnailUrl || item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-bold capitalize">
                      {item.type || 'Photo'}
                    </span>
                  </div>
                  <div className="p-4 space-y-1">
                    <h4 className="text-xs font-bold text-slate-900 truncate font-display">{item.title}</h4>
                    {item.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-1">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
            <ImageIcon className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800 font-display">Media Portfolio</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {firstName}'s photos, event appearances, and video media will appear here once added.
            </p>
          </div>
        )}
      </div>

      {activeScreen !== undefined && (
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold mt-auto">
          <button
            type="button"
            onClick={() => onNavigate(5)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-purple-600 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Achievements
          </button>
          <button
            type="button"
            onClick={() => onNavigate(7)}
            className="flex items-center gap-1.5 text-purple-600 hover:underline cursor-pointer"
          >
            Blogs & Thoughts <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );

  // ────────────────────────────────────────────────────────────────
  // SCREEN 7: BLOGS / THOUGHTS
  // ────────────────────────────────────────────────────────────────
  const renderScreen7 = () => (
    <div id="screen-7-blogs" className="clean-card bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between animate-fadeIn space-y-6">
      <div className="space-y-6">
        {/* Uniform Screen Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            {activeScreen !== undefined && (
              <button
                type="button"
                onClick={() => onNavigate(1)}
                className="w-10 h-10 rounded-full bg-slate-50 hover:bg-purple-50 hover:text-purple-600 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                title="Back to Overview"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight font-display">
                Blogs & Thoughts
              </h3>
              <p className="text-xs text-slate-500">Publications, Thought Leadership & Articles</p>
            </div>
          </div>
          <span className="px-3.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
            {blogsList.length} {blogsList.length === 1 ? 'Article' : 'Articles'}
          </span>
        </div>

        {blogsList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {blogsList.map((b, idx) => (
              <a
                key={idx}
                href={b.url || '#'}
                target={b.url ? '_blank' : '_self'}
                rel="noreferrer"
                className="p-5 rounded-2xl bg-slate-50/80 hover:bg-purple-50/30 border border-slate-200/70 transition-all flex gap-4 group"
              >
                {b.coverImage && (
                  <img
                    src={b.coverImage}
                    alt={b.title}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                  />
                )}
                <div className="flex-1 min-w-0 space-y-1.5 flex flex-col justify-center">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-2 font-display leading-snug">
                    {b.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{b.readTime || 'Published Article'}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
            <FileText className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800 font-display">Publications & Articles</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {firstName}'s articles and thought leadership pieces will appear here.
            </p>
          </div>
        )}
      </div>

      {activeScreen !== undefined && (
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold mt-auto">
          <button
            type="button"
            onClick={() => onNavigate(6)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-purple-600 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Media Gallery
          </button>
          <button
            type="button"
            onClick={() => onNavigate(8)}
            className="flex items-center gap-1.5 text-purple-600 hover:underline cursor-pointer"
          >
            Contact Diary <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );

  // ────────────────────────────────────────────────────────────────
  // SCREEN 8: CONTACT DIARY
  // ────────────────────────────────────────────────────────────────
  const renderScreen8 = () => (
    <div id="screen-8-contact" className="clean-card bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between animate-fadeIn space-y-6">
      <div className="space-y-6">
        {/* Uniform Screen Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            {activeScreen !== undefined && (
              <button
                type="button"
                onClick={() => onNavigate(1)}
                className="w-10 h-10 rounded-full bg-slate-50 hover:bg-purple-50 hover:text-purple-600 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                title="Back to Overview"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight font-display">
                Contact Diary
              </h3>
              <p className="text-xs text-slate-500">Direct Contact Details, Channels & vCard</p>
            </div>
          </div>
          <span className="px-3.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
            Direct Channels
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
          {profile.connectAndContact?.note || profile.collaborationNote || 'Open for collaboration, speaking opportunities, and high-impact enterprise projects.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {profile.workEmail && (
            <a
              href={`mailto:${profile.workEmail}`}
              className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50/80 hover:bg-purple-50/30 border border-slate-200/70 transition-all text-xs font-semibold text-slate-800"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-2xs shrink-0" style={{ color: primaryColor }}>
                <Mail className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Work Email</div>
                <div className="truncate text-slate-800 text-xs font-bold">{profile.workEmail}</div>
              </div>
            </a>
          )}

          {profile.phone && (
            <a
              href={`tel:${profile.phone}`}
              className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50/80 hover:bg-purple-50/30 border border-slate-200/70 transition-all text-xs font-semibold text-slate-800"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-2xs shrink-0" style={{ color: primaryColor }}>
                <Phone className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Phone</div>
                <div className="truncate text-slate-800 text-xs font-bold">{profile.phone}</div>
              </div>
            </a>
          )}

          {linkedinLink && (
            <a
              href={linkedinLink.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50/80 hover:bg-purple-50/30 border border-slate-200/70 transition-all text-xs font-semibold text-slate-800"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-2xs shrink-0" style={{ color: primaryColor }}>
                <Globe className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">LinkedIn</div>
                <div className="truncate text-slate-800 text-xs font-bold">{linkedinLink.url.replace(/^https?:\/\//, '')}</div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          )}

          {twitterLink && (
            <a
              href={twitterLink.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50/80 hover:bg-purple-50/30 border border-slate-200/70 transition-all text-xs font-semibold text-slate-800"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-2xs shrink-0" style={{ color: primaryColor }}>
                <Globe className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Twitter / X</div>
                <div className="truncate text-slate-800 text-xs font-bold">{twitterLink.url.replace(/^https?:\/\//, '')}</div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          )}

          {otherSocials.map((social, idx) => (
            <a
              key={idx}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50/80 hover:bg-purple-50/30 border border-slate-200/70 transition-all text-xs font-semibold text-slate-800"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-2xs shrink-0" style={{ color: primaryColor }}>
                <Globe className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{social.platform}</div>
                <div className="truncate text-slate-800 text-xs font-bold">{social.url.replace(/^https?:\/\//, '')}</div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          ))}
        </div>

        <div className="space-y-2.5 pt-2">
          <button
            type="button"
            onClick={onConnectClick}
            className="w-full py-3.5 rounded-2xl text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-500/25 hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            style={{ backgroundColor: primaryColor }}
          >
            <Send className="w-4 h-4" />
            <span>Connect With Me</span>
          </button>

          <button
            type="button"
            onClick={onDownloadVCard}
            className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>Download Verified vCard (.vcf)</span>
          </button>
        </div>
      </div>

      {activeScreen !== undefined && (
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold mt-auto">
          <button
            type="button"
            onClick={() => onNavigate(7)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-purple-600 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Blogs / Thoughts
          </button>
          <button
            type="button"
            onClick={() => onNavigate(1)}
            className="flex items-center gap-1.5 text-purple-600 hover:underline cursor-pointer"
          >
            Return to Overview <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );

  // ────────────────────────────────────────────────────────────────
  // SCREEN SELECTOR (When activeScreen is specified: 1 to 8)
  // ────────────────────────────────────────────────────────────────
  if (activeScreen !== undefined && activeScreen !== null && activeScreen !== 'all') {
    switch (Number(activeScreen)) {
      case 1:
        return renderScreen1();
      case 2:
        return renderScreen2();
      case 3:
        return renderScreen3();
      case 4:
        return renderScreen4();
      case 5:
        return renderScreen5();
      case 6:
        return renderScreen6();
      case 7:
        return renderScreen7();
      case 8:
        return renderScreen8();
      default:
        return renderScreen1();
    }
  }

  // ────────────────────────────────────────────────────────────────
  // DEFAULT FULL CONTINUOUS VIEW (Fallback for desktop without activeScreen)
  // ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {renderScreen1()}
      {renderScreen2()}
      {journeyList.length > 0 && renderScreen3()}
      {renderScreen4()}
      {achievementsList.length > 0 && renderScreen5()}
      {allMedia.length > 0 && renderScreen6()}
      {blogsList.length > 0 && renderScreen7()}
      {renderScreen8()}

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

export default IdentityFlowSections;

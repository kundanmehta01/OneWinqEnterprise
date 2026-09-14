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

  // Filter media gallery based on active tab
  const allMedia = profile.mediaGallery || [];
  const filteredMedia = allMedia.filter(item => {
    if (activeMediaTab === 'all') return true;
    const type = (item.type || '').toLowerCase();
    if (activeMediaTab === 'photos') return type === 'photo' || type === 'image';
    if (activeMediaTab === 'videos') return type === 'video';
    if (activeMediaTab === 'events') return type === 'event';
    return true;
  });

  // Extract contact links
  const socialLinks = profile.socialLinks || [];
  const linkedinLink = socialLinks.find(l => l.platform?.toLowerCase().includes('linkedin'));
  const twitterLink = socialLinks.find(l => l.platform?.toLowerCase().includes('twitter') || l.platform?.toLowerCase().includes('x'));
  const otherSocials = socialLinks.filter(l => l !== linkedinLink && l !== twitterLink);

  const projectsList = profile.workAndImpact?.projects || profile.projects || [];
  const rawExperience = (profile.experience && profile.experience.length > 0)
    ? profile.experience
    : (profile.journey && profile.journey.length > 0)
    ? profile.journey
    : (profile.about?.experience || []);

  const experienceList = rawExperience
    .filter(item => (item.company && item.company.trim()) || (item.role && item.role.trim()) || (item.title && item.title.trim()))
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

  // ────────────────────────────────────────────────────────────────
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

      {/* Quick Navigation Cards Hub (Shown in Tab/Screen mode) */}
      {activeScreen !== undefined && !isCompact && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" /> Explore {firstName}'s Profile
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Browse detailed background, track record, skills, deliverables and direct channels.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-slate-400 font-mono">01 / 09</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
            <button
              onClick={() => onNavigate(2)}
              className="p-4 rounded-2xl bg-slate-50/80 hover:bg-purple-50/60 border border-slate-200/70 hover:border-purple-200 text-left transition-all group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700 flex items-center justify-between">
                <span>About & Bio</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                {profile.about?.introduction || profile.bio || profile.headline || 'Professional biography, expertise and key focus areas.'}
              </p>
            </button>

            <button
              onClick={() => onNavigate(3)}
              className="p-4 rounded-2xl bg-slate-50/80 hover:bg-purple-50/60 border border-slate-200/70 hover:border-purple-200 text-left transition-all group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <Briefcase className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700 flex items-center justify-between">
                <span>Work Experience</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                {experienceList.length > 0 ? `${experienceList.length} professional roles & track record.` : 'Professional roles and experience track record.'}
              </p>
            </button>

            <button
              onClick={() => onNavigate(4)}
              className="p-4 rounded-2xl bg-slate-50/80 hover:bg-purple-50/60 border border-slate-200/70 hover:border-purple-200 text-left transition-all group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700 flex items-center justify-between">
                <span>Skills & Tools</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Core domain capabilities, technical proficiencies, and tools.
              </p>
            </button>

            <button
              onClick={() => onNavigate(5)}
              className="p-4 rounded-2xl bg-slate-50/80 hover:bg-purple-50/60 border border-slate-200/70 hover:border-purple-200 text-left transition-all group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <FolderGit2 className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700 flex items-center justify-between">
                <span>Featured Projects</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                {projectsList.length > 0 ? `${projectsList.length} verified projects and portfolio initiatives.` : 'Key enterprise initiatives and delivered work.'}
              </p>
            </button>

            <button
              onClick={() => onNavigate(6)}
              className="p-4 rounded-2xl bg-slate-50/80 hover:bg-purple-50/60 border border-slate-200/70 hover:border-purple-200 text-left transition-all group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <Award className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700 flex items-center justify-between">
                <span>Achievements</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                {achievementsList.length > 0 ? `${achievementsList.length} awards, certifications and recognitions.` : 'Certified credentials and industry honors.'}
              </p>
            </button>

            <button
              onClick={() => onNavigate(7)}
              className="p-4 rounded-2xl bg-slate-50/80 hover:bg-purple-50/60 border border-slate-200/70 hover:border-purple-200 text-left transition-all group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <ImageIcon className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700 flex items-center justify-between">
                <span>Media Gallery</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                {allMedia.length > 0 ? `${allMedia.length} media assets, photos, and highlights.` : 'Visual gallery and photo highlights.'}
              </p>
            </button>

            <button
              onClick={() => onNavigate(8)}
              className="p-4 rounded-2xl bg-slate-50/80 hover:bg-purple-50/60 border border-slate-200/70 hover:border-purple-200 text-left transition-all group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700 flex items-center justify-between">
                <span>Blogs / Thoughts</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                {blogsList.length > 0 ? `${blogsList.length} articles and publications.` : 'Articles and thought leadership.'}
              </p>
            </button>

            <button
              onClick={() => onNavigate(9)}
              className="p-4 rounded-2xl bg-purple-600 text-white shadow-md shadow-purple-500/20 text-left transition-all hover:bg-purple-700 group cursor-pointer sm:col-span-2 md:col-span-2"
            >
              <div className="w-8 h-8 rounded-xl bg-white/20 text-white flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <Mail className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white flex items-center justify-between">
                <span>Contact Diary</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </h4>
              <p className="text-[11px] text-purple-100 mt-1">
                Save vCard, exchange contact details, or email directly.
              </p>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // ────────────────────────────────────────────────────────────────
  // SCREEN 2: ABOUT
  // ────────────────────────────────────────────────────────────────
  const renderScreen2 = () => (
    <section id="screen-2-about" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-fadeIn">
      {/* Top Header with Back Button */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          {activeScreen !== undefined && (
            <button
              type="button"
              onClick={() => onNavigate(1)}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-purple-50 hover:text-purple-600 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
              title="Back to Overview"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2" style={{ color: primaryColor }}>
              <Sparkles className="w-4 h-4 shrink-0" /> {profile.about?.title || `About ${firstName}`}
            </h3>
            <p className="text-[11px] text-slate-400">Professional Summary, Core Expertise & Bio</p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-slate-400 font-mono">02 / 09</span>
      </div>

      {/* 2.1 Introduction */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Introduction</h4>
        <p className="text-sm text-slate-700 leading-relaxed font-sans">
          {profile.about?.introduction || profile.bio || profile.headline || 'Dedicated enterprise professional passionate about driving technology excellence and collaborative growth.'}
        </p>
      </div>

      {/* 2.2 Core Expertise Summary */}
      {((profile.about?.expertise && profile.about.expertise.length > 0) || (profile.skills && profile.skills.length > 0)) && (
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Core Focus Areas</h4>
          <div className="flex flex-wrap gap-2">
            {(profile.about?.expertise || profile.skills || []).map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all"
                style={{
                  backgroundColor: `${primaryColor}10`,
                  borderColor: `${primaryColor}30`,
                  color: primaryColor
                }}
              >
                {skill.name || skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 2.3 Experience Summary */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Experience Overview</h4>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
          {profile.about?.experienceSummary || `${profile.overviewStats?.years || profile.overviewStats?.yearsOfExperience || '5+'} years in ${departmentName} leadership, high-velocity execution, and driving enterprise digital transformation.`}
        </p>
      </div>

      {/* Screen Navigation Footer */}
      {activeScreen !== undefined && (
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
          <button
            onClick={() => onNavigate(1)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-purple-600 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
          </button>
          <button
            onClick={() => onNavigate(3)}
            className="flex items-center gap-1.5 text-purple-600 hover:underline cursor-pointer"
          >
            Work Experience <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </section>
  );

  // ────────────────────────────────────────────────────────────────
  // SCREEN 3: WORK EXPERIENCE
  // ────────────────────────────────────────────────────────────────
  const renderScreen3 = () => (
    <div id="screen-3-experience" className="space-y-6 animate-fadeIn">
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {activeScreen !== undefined && (
              <button
                type="button"
                onClick={() => onNavigate(1)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-purple-50 hover:text-purple-600 flex items-center justify-center text-slate-600 transition-colors cursor-pointer mr-1"
                title="Back to Overview"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            )}
            <div className="w-1.5 h-5 rounded-full bg-purple-600" style={{ backgroundColor: primaryColor }} />
            <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-900">
              Work Experience
            </h3>
          </div>
          {activeScreen !== undefined && (
            <span className="text-[11px] font-semibold text-slate-400 font-mono">03 / 09</span>
          )}
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

        {activeScreen !== undefined && (
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
            <button
              onClick={() => onNavigate(2)}
              className="flex items-center gap-1.5 text-slate-500 hover:text-purple-600 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> About
            </button>
            <button
              onClick={() => onNavigate(4)}
              className="flex items-center gap-1.5 text-purple-600 hover:underline cursor-pointer"
            >
              Skills & Tools <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </section>
    </div>
  );

  // ────────────────────────────────────────────────────────────────
  // SCREEN 4: SKILLS & TECHNICAL CAPABILITIES
  // ────────────────────────────────────────────────────────────────
  const renderScreen4 = () => {
    const skillsList = (profile.skills && profile.skills.length > 0)
      ? profile.skills
      : (profile.about?.expertise && profile.about.expertise.length > 0)
      ? profile.about.expertise
      : (profile.expertise && profile.expertise.length > 0)
      ? profile.expertise
      : [];

    return (
      <section id="screen-4-skills" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            {activeScreen !== undefined && (
              <button
                type="button"
                onClick={() => onNavigate(1)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-purple-50 hover:text-purple-600 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                title="Back to Overview"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2" style={{ color: primaryColor }}>
                <Zap className="w-4 h-4 shrink-0 text-amber-500" /> Skills & Technical Capabilities
              </h3>
              <p className="text-[11px] text-slate-400">Core Capabilities, Technical Proficiencies & Tools</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 font-mono">04 / 09</span>
        </div>

        {skillsList.length > 0 ? (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
              Key technical proficiencies, strategic frameworks, and domain expertise verified across {firstName}'s enterprise deliverables.
            </p>
            <div className="flex flex-wrap gap-2.5 pt-2">
              {skillsList.map((skill, idx) => {
                const name = typeof skill === 'string' ? skill : (skill.name || skill.title || skill.label || 'Capability');
                const level = typeof skill === 'object' ? (skill.level || skill.category) : null;
                return (
                  <div
                    key={idx}
                    className="px-4 py-2.5 rounded-2xl border flex items-center gap-2.5 transition-all shadow-2xs hover:shadow-xs"
                    style={{
                      backgroundColor: `${primaryColor}08`,
                      borderColor: `${primaryColor}25`,
                      color: primaryColor
                    }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                    <span className="text-xs font-bold text-slate-900">{name}</span>
                    {level && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/80 text-purple-700 border border-purple-200/80">
                        {level}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <Zap className="w-8 h-8 text-amber-500 mx-auto" />
            <h4 className="text-xs font-bold text-slate-700">Skills Portfolio</h4>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              {firstName}'s skills and core competencies list is currently being curated.
            </p>
          </div>
        )}

        {activeScreen !== undefined && (
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
            <button
              onClick={() => onNavigate(3)}
              className="flex items-center gap-1.5 text-slate-500 hover:text-purple-600 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Work Experience
            </button>
            <button
              onClick={() => onNavigate(5)}
              className="flex items-center gap-1.5 text-purple-600 hover:underline cursor-pointer"
            >
              Featured Projects <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </section>
    );
  };

  // ────────────────────────────────────────────────────────────────
  // SCREEN 5: FEATURED PROJECTS
  // ────────────────────────────────────────────────────────────────
  const renderScreen5 = () => (
    <section id="screen-5-work" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5 animate-fadeIn">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          {activeScreen !== undefined && (
            <button
              type="button"
              onClick={() => onNavigate(1)}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-purple-50 hover:text-purple-600 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
              title="Back to Overview"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2" style={{ color: primaryColor }}>
              <FolderGit2 className="w-4 h-4 shrink-0" /> {profile.workAndImpact?.title || 'Featured Projects'}
            </h3>
            <p className="text-[11px] text-slate-400">Enterprise Solutions & Key Initiatives</p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-slate-400 font-mono">05 / 09</span>
      </div>

      {projectsList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {projectsList.map((proj, idx) => (
            <div
              key={idx}
              className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2.5 flex flex-col justify-between hover:bg-white hover:shadow-xs transition-all"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
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
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">{proj.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {proj.description}
                </p>
              </div>

              {proj.technologies && proj.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-200/60">
                  {proj.technologies.map((t, tIdx) => (
                    <span key={tIdx} className="px-1.5 py-0.5 rounded bg-white text-[9px] font-medium text-slate-600 border border-slate-200/70">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
          <FolderGit2 className="w-8 h-8 text-slate-300 mx-auto" />
          <h4 className="text-xs font-bold text-slate-700">Projects Portfolio</h4>
          <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
            {firstName}'s featured projects and technical initiatives will appear here once published.
          </p>
        </div>
      )}

      {activeScreen !== undefined && (
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
          <button
            onClick={() => onNavigate(4)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-purple-600 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Work Experience
          </button>
          <button
            onClick={() => onNavigate(6)}
            className="flex items-center gap-1.5 text-purple-600 hover:underline cursor-pointer"
          >
            Achievements <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </section>
  );

  // ────────────────────────────────────────────────────────────────
  // SCREEN 6: ACHIEVEMENTS
  // ────────────────────────────────────────────────────────────────
  const renderScreen6 = () => (
    <section id="screen-6-achievements" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          {activeScreen !== undefined && (
            <button
              type="button"
              onClick={() => onNavigate(1)}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-purple-50 hover:text-purple-600 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
              title="Back to Overview"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2" style={{ color: primaryColor }}>
              <Award className="w-4 h-4 shrink-0 text-amber-500" /> My Achievements
            </h3>
            <p className="text-[11px] text-slate-400">Industry Honors, Certifications & Awards</p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-slate-400 font-mono">06 / 09</span>
      </div>

      {achievementsList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {achievementsList.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 flex items-start gap-3.5 hover:bg-slate-50 transition-all"
            >
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs"
                style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
              >
                <Award className="w-5 h-5 text-amber-500" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">{item.title}</h4>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">{item.subtitle || item.issuer}</p>
                {item.description && (
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
          <Award className="w-8 h-8 text-amber-400 mx-auto" />
          <h4 className="text-xs font-bold text-slate-700">Honors & Certifications</h4>
          <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
            {firstName}'s awards, credentials and industry certifications are maintained here.
          </p>
        </div>
      )}

      {activeScreen !== undefined && (
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
          <button
            onClick={() => onNavigate(5)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-purple-600 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Featured Projects
          </button>
          <button
            onClick={() => onNavigate(7)}
            className="flex items-center gap-1.5 text-purple-600 hover:underline cursor-pointer"
          >
            Media Gallery <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </section>
  );

  // ────────────────────────────────────────────────────────────────
  // SCREEN 7: MEDIA GALLERY
  // ────────────────────────────────────────────────────────────────
  const renderScreen7 = () => (
    <section id="screen-7-media" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          {activeScreen !== undefined && (
            <button
              type="button"
              onClick={() => onNavigate(1)}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-purple-50 hover:text-purple-600 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
              title="Back to Overview"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2" style={{ color: primaryColor }}>
              <ImageIcon className="w-4 h-4 shrink-0" /> Media Gallery
            </h3>
            <p className="text-[11px] text-slate-400">Photos, Videos, Press & Events</p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-slate-400 font-mono">07 / 09</span>
      </div>

      {allMedia.length > 0 ? (
        <>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['all', 'photos', 'videos', 'events'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveMediaTab(tab)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all cursor-pointer ${
                  activeMediaTab === tab
                    ? 'text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                style={activeMediaTab === tab ? { backgroundColor: primaryColor } : {}}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 pt-1">
            {(filteredMedia.length > 0 ? filteredMedia : allMedia).map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xs group hover:shadow-sm transition-all"
              >
                <div className="h-36 bg-slate-200 overflow-hidden relative">
                  <img
                    src={item.thumbnailUrl || item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold capitalize backdrop-blur-xs">
                    {item.type || 'Photo'}
                  </span>
                </div>
                <div className="p-3">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                  {item.description && (
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
          <ImageIcon className="w-8 h-8 text-slate-300 mx-auto" />
          <h4 className="text-xs font-bold text-slate-700">Media Portfolio</h4>
          <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
            {firstName}'s photos, event appearances, and video media will appear here once added.
          </p>
        </div>
      )}

      {activeScreen !== undefined && (
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
          <button
            onClick={() => onNavigate(6)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-purple-600 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Achievements
          </button>
          <button
            onClick={() => onNavigate(8)}
            className="flex items-center gap-1.5 text-purple-600 hover:underline cursor-pointer"
          >
            Blogs & Thoughts <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </section>
  );

  // ────────────────────────────────────────────────────────────────
  // SCREEN 8: BLOGS / THOUGHTS
  // ────────────────────────────────────────────────────────────────
  const renderScreen8 = () => (
    <section id="screen-8-blogs" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          {activeScreen !== undefined && (
            <button
              type="button"
              onClick={() => onNavigate(1)}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-purple-50 hover:text-purple-600 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
              title="Back to Overview"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2" style={{ color: primaryColor }}>
              <FileText className="w-4 h-4 shrink-0" /> Blogs / Thoughts
            </h3>
            <p className="text-[11px] text-slate-400">Publications, Thought Leadership & Articles</p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-slate-400 font-mono">08 / 09</span>
      </div>

      {blogsList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {blogsList.map((b, idx) => (
            <a
              key={idx}
              href={b.url || '#'}
              target={b.url ? '_blank' : '_self'}
              rel="noreferrer"
              className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/70 hover:border-slate-300 transition-all flex gap-3 group"
            >
              {b.coverImage && (
                <img
                  src={b.coverImage}
                  alt={b.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                />
              )}
              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                  {b.title}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                  <Clock className="w-3 h-3" />
                  <span>{b.readTime || 'Published Article'}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
          <FileText className="w-8 h-8 text-slate-300 mx-auto" />
          <h4 className="text-xs font-bold text-slate-700">Publications & Articles</h4>
          <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
            {firstName}'s articles and thought leadership pieces will appear here.
          </p>
        </div>
      )}

      {activeScreen !== undefined && (
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
          <button
            onClick={() => onNavigate(7)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-purple-600 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Media Gallery
          </button>
          <button
            onClick={() => onNavigate(9)}
            className="flex items-center gap-1.5 text-purple-600 hover:underline cursor-pointer"
          >
            Contact Diary <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </section>
  );

  // ────────────────────────────────────────────────────────────────
  // SCREEN 9: CONTACT DIARY
  // ────────────────────────────────────────────────────────────────
  const renderScreen9 = () => (
    <section id="screen-9-contact" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          {activeScreen !== undefined && (
            <button
              type="button"
              onClick={() => onNavigate(1)}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-purple-50 hover:text-purple-600 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
              title="Back to Overview"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2" style={{ color: primaryColor }}>
              <Mail className="w-4 h-4 shrink-0" /> Contact Diary
            </h3>
            <p className="text-[11px] text-slate-400">Direct Contact Details, Channels & vCard</p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-slate-400 font-mono">09 / 09</span>
      </div>

      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
        {profile.connectAndContact?.note || profile.collaborationNote || 'Open for collaboration, speaking opportunities, and high-impact enterprise projects.'}
      </p>

      <div className="space-y-3">
        {profile.workEmail && (
          <a
            href={`mailto:${profile.workEmail}`}
            className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all text-xs font-semibold text-slate-800"
          >
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-xs" style={{ color: primaryColor }}>
              <Mail className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] text-slate-400 font-medium">Email</div>
              <div className="truncate text-slate-800">{profile.workEmail}</div>
            </div>
          </a>
        )}

        {profile.phone && (
          <a
            href={`tel:${profile.phone}`}
            className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all text-xs font-semibold text-slate-800"
          >
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-xs" style={{ color: primaryColor }}>
              <Phone className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] text-slate-400 font-medium">Phone</div>
              <div className="truncate text-slate-800">{profile.phone}</div>
            </div>
          </a>
        )}

        {linkedinLink && (
          <a
            href={linkedinLink.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all text-xs font-semibold text-slate-800"
          >
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-xs" style={{ color: primaryColor }}>
              <Globe className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] text-slate-400 font-medium">LinkedIn</div>
              <div className="truncate text-slate-800">{linkedinLink.url.replace(/^https?:\/\//, '')}</div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        )}

        {twitterLink && (
          <a
            href={twitterLink.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all text-xs font-semibold text-slate-800"
          >
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-xs" style={{ color: primaryColor }}>
              <Globe className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] text-slate-400 font-medium">Twitter / X</div>
              <div className="truncate text-slate-800">{twitterLink.url.replace(/^https?:\/\//, '')}</div>
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
            className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all text-xs font-semibold text-slate-800"
          >
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-xs" style={{ color: primaryColor }}>
              <Globe className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] text-slate-400 font-medium">{social.platform}</div>
              <div className="truncate text-slate-800">{social.url.replace(/^https?:\/\//, '')}</div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        ))}
      </div>

      <div className="space-y-2.5 pt-2">
        <button
          onClick={onConnectClick}
          className="w-full py-3.5 rounded-2xl text-white text-xs sm:text-sm font-bold shadow-md hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          style={{ backgroundColor: primaryColor }}
        >
          <Send className="w-4 h-4" />
          <span>Connect With Me</span>
        </button>

        <button
          onClick={onDownloadVCard}
          className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <UserCheck className="w-4 h-4" />
          <span>Download Verified vCard (.vcf)</span>
        </button>
      </div>

      {activeScreen !== undefined && (
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
          <button
            onClick={() => onNavigate(8)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-purple-600 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Blogs / Thoughts
          </button>
          <button
            onClick={() => onNavigate(1)}
            className="flex items-center gap-1.5 text-purple-600 hover:underline cursor-pointer"
          >
            Return to Overview <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </section>
  );

  // ────────────────────────────────────────────────────────────────
  // SCREEN SELECTOR (When activeScreen is specified: 1 to 9)
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
      case 9:
        return renderScreen9();
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
      {renderScreen5()}
      {achievementsList.length > 0 && renderScreen6()}
      {allMedia.length > 0 && renderScreen7()}
      {blogsList.length > 0 && renderScreen8()}
      {renderScreen9()}

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

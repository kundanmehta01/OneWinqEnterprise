import React, { useState } from 'react';
import {
  Briefcase,
  Layers,
  Sparkles,
  Globe,
  ExternalLink,
  Award,
  TrendingUp,
  FolderGit2,
  Mail,
  Phone,
  Share2,
  Calendar,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Image as ImageIcon,
  Video,
  FileText,
  Clock,
  Send,
  UserCheck
} from 'lucide-react';
import { DigitalHeroCard } from './DigitalHeroCard';

/**
 * Universal 8-Section Identity Flow Component
 * Implements the exact 8 screens/sections from the Founder Identity Flow:
 * 1. Overview (Unified Digital Hero Card)
 * 2. About (Introduction, Expertise, Experience)
 * 3. Journey (My Journey timeline)
 * 4. Work & Impact (My Work projects + Impact block)
 * 5. Achievements (My Achievements with icons + View All)
 * 6. Media & Gallery (Filter tabs: All, Photos, Videos, Events + View All)
 * 7. Blogs & Thoughts (List of articles with dates + View All)
 * 8. Connect & Contact (Let's Connect with contact info + Connect With Me & Share Profile)
 */
export const IdentityFlowSections = ({
  profile,
  onConnectClick,
  onQrClick,
  onDownloadVCard,
  onShareClick,
  isCompact = false,
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

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* ────────────────────────────────────────────────────────────────
          SCREEN 1: OVERVIEW (Unified Digital Hero Card)
          ──────────────────────────────────────────────────────────────── */}
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

      {/* ────────────────────────────────────────────────────────────────
          SCREEN 2: ABOUT (Introduction, Expertise, Experience)
          ──────────────────────────────────────────────────────────────── */}
      <section id="screen-2-about" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2" style={{ color: primaryColor }}>
            <Sparkles className="w-4 h-4 shrink-0" /> {profile.about?.title || `About ${firstName}`}
          </h3>
          <span className="text-[11px] font-semibold text-slate-400 font-mono">02 / 08</span>
        </div>

        {/* 2.1 Introduction */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Introduction</h4>
          <p className="text-sm text-slate-700 leading-relaxed font-sans">
            {profile.about?.introduction || profile.bio || profile.headline || 'Dedicated professional passionate about building impactful technology solutions and fostering collaborative growth.'}
          </p>
        </div>

        {/* 2.2 Expertise */}
        {((profile.about?.expertise && profile.about.expertise.length > 0) || (profile.skills && profile.skills.length > 0)) && (
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expertise</h4>
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
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Experience</h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
            {profile.about?.experienceSummary || `${profile.overviewStats?.years || profile.overviewStats?.yearsOfExperience || '5+'} years in ${departmentName} leadership, high-velocity execution, and driving enterprise digital transformation.`}
          </p>

          {/* Inline past positions if present */}
          {(profile.about?.experience?.length > 0 || profile.experience?.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {(profile.about?.experience || profile.experience || []).slice(0, 2).map((exp, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-left">
                  <div className="text-xs font-bold text-slate-900">{exp.title}</div>
                  <div className="text-[11px] font-medium text-slate-500">{exp.company} • {exp.location || 'Remote'}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────
          SCREEN 3: JOURNEY (Milestone Timeline)
          ──────────────────────────────────────────────────────────────── */}
      {profile.journey && profile.journey.length > 0 && (
        <section id="screen-3-journey" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2" style={{ color: primaryColor }}>
              <Sparkles className="w-4 h-4 shrink-0" /> My Journey
            </h3>
            <span className="text-[11px] font-semibold text-slate-400 font-mono">03 / 08</span>
          </div>

          <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5" style={{ '--tw-before-bg': `${primaryColor}20` }}>
            {profile.journey.map((step, idx) => (
              <div key={idx} className="relative space-y-1">
                {/* Node Dot */}
                <div
                  className="absolute -left-[23px] top-1 w-4 h-4 rounded-full bg-white border-2 flex items-center justify-center shadow-xs"
                  style={{ borderColor: primaryColor }}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                </div>

                <div className="flex items-center gap-2.5">
                  <span
                    className="text-xs font-mono font-bold px-2 py-0.5 rounded-md"
                    style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                  >
                    {step.year}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{step.title}</h4>
                </div>

                {step.description && (
                  <p className="text-xs text-slate-600 leading-relaxed font-sans pt-0.5 pl-0.5">
                    {step.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ────────────────────────────────────────────────────────────────
          SCREEN 4: WORK & IMPACT (Featured Projects + Impact block)
          ──────────────────────────────────────────────────────────────── */}
      <section id="screen-4-work-impact" className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2" style={{ color: primaryColor }}>
            <FolderGit2 className="w-4 h-4 shrink-0" /> {profile.workAndImpact?.title || 'My Work & Impact'}
          </h3>
          <span className="text-[11px] font-semibold text-slate-400 font-mono">04 / 08</span>
        </div>

        {/* 4.1 Featured Projects Grid */}
        {(profile.workAndImpact?.projects || profile.projects) && (profile.workAndImpact?.projects || profile.projects).length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {(profile.workAndImpact?.projects || profile.projects).map((proj, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2.5 flex flex-col justify-between hover:border-slate-300 transition-all"
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
                  <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-100">
                    {proj.technologies.map((t, tIdx) => (
                      <span key={tIdx} className="px-1.5 py-0.5 rounded bg-slate-100 text-[9px] font-medium text-slate-600">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 4.2 Impact Sub-block */}
        {(profile.workAndImpact?.impact || profile.impactMetrics) && (profile.workAndImpact?.impact || profile.impactMetrics).length > 0 && (
          <div
            className="rounded-3xl p-5 sm:p-6 border shadow-xs space-y-3"
            style={{ backgroundColor: `${primaryColor}08`, borderColor: `${primaryColor}25` }}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: primaryColor }}>
                <TrendingUp className="w-3.5 h-3.5" /> Impact Highlights
              </h4>
              <span className="text-[10px] font-medium text-slate-400">Measurable Outcomes</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {(profile.workAndImpact?.impact || profile.impactMetrics).map((m, idx) => (
                <div key={idx} className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-white/60 text-center shadow-2xs">
                  <div className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono">{m.metric}</div>
                  <div className="text-[11px] font-medium text-slate-600 mt-0.5">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ────────────────────────────────────────────────────────────────
          SCREEN 5: ACHIEVEMENTS (Honors & Certifications)
          ──────────────────────────────────────────────────────────────── */}
      {profile.achievements && profile.achievements.length > 0 && (
        <section id="screen-5-achievements" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2" style={{ color: primaryColor }}>
              <Award className="w-4 h-4 shrink-0 text-amber-500" /> My Achievements
            </h3>
            <span className="text-[11px] font-semibold text-slate-400 font-mono">05 / 08</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {profile.achievements.map((item, idx) => (
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

          <div className="pt-2 text-center">
            <button
              onClick={onConnectClick}
              className="text-xs font-bold hover:underline inline-flex items-center gap-1 transition-colors cursor-pointer"
              style={{ color: primaryColor }}
            >
              <span>View All Achievements</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* ────────────────────────────────────────────────────────────────
          SCREEN 6: MEDIA / GALLERY (Photos, Videos, Events tabs)
          ──────────────────────────────────────────────────────────────── */}
      {allMedia.length > 0 && (
        <section id="screen-6-media" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2" style={{ color: primaryColor }}>
              <ImageIcon className="w-4 h-4 shrink-0" /> Media & Gallery
            </h3>
            <span className="text-[11px] font-semibold text-slate-400 font-mono">06 / 08</span>
          </div>

          {/* Filter Tabs matching Screen 6 in Reference Image: All, Photos, Videos, Events */}
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

          {/* Media Items Grid */}
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

          <div className="pt-2 text-center">
            <button
              onClick={onConnectClick}
              className="text-xs font-bold hover:underline inline-flex items-center gap-1 transition-colors cursor-pointer"
              style={{ color: primaryColor }}
            >
              <span>View All Media</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* ────────────────────────────────────────────────────────────────
          SCREEN 7: BLOGS & THOUGHTS (Publications & Articles)
          ──────────────────────────────────────────────────────────────── */}
      {profile.blogs && profile.blogs.length > 0 && (
        <section id="screen-7-blogs" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2" style={{ color: primaryColor }}>
              <FileText className="w-4 h-4 shrink-0" /> Blogs & Thoughts
            </h3>
            <span className="text-[11px] font-semibold text-slate-400 font-mono">07 / 08</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {profile.blogs.map((b, idx) => (
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

          <div className="pt-2 text-center">
            <button
              onClick={onConnectClick}
              className="text-xs font-bold hover:underline inline-flex items-center gap-1 transition-colors cursor-pointer"
              style={{ color: primaryColor }}
            >
              <span>View All Blogs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* ────────────────────────────────────────────────────────────────
          SCREEN 8: CONNECT & CONTACT (Let's Connect card + Buttons)
          ──────────────────────────────────────────────────────────────── */}
      <section id="screen-8-connect" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2" style={{ color: primaryColor }}>
            <Mail className="w-4 h-4 shrink-0" /> {profile.connectAndContact?.title || "Let's Connect"}
          </h3>
          <span className="text-[11px] font-semibold text-slate-400 font-mono">08 / 08</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
          {profile.connectAndContact?.note || profile.collaborationNote || 'Open for collaboration, speaking opportunities, and high-impact enterprise projects.'}
        </p>

        {/* Contact Details List */}
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

        {/* Big Action Buttons from Screen 8 in Reference Image: Connect With Me & Share Profile */}
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
            onClick={onShareClick}
            className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Profile</span>
          </button>
        </div>
      </section>

      {/* Role Quote if configured */}
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

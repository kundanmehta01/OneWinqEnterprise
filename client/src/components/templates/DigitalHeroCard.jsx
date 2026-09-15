import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Building2,
  Mail,
  MapPin,
  Sparkles,
  Share2,
  Download,
  QrCode
} from 'lucide-react';
import { FaLinkedinIn, FaInstagram, FaWhatsapp, FaPhone, FaEnvelope, FaGlobe } from 'react-icons/fa';

/**
 * Standard Digital Hero Card Component
 * Provides a unified, premium digital business card header across all department templates.
 */
export const DigitalHeroCard = ({
  profile,
  onConnectClick,
  onQrClick,
  onDownloadVCard,
  onShareClick,
  isCompact = false
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleDownloadApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      if (onDownloadVCard) onDownloadVCard();
    }
  };

  if (!profile) return null;

  const coverUrl = profile.coverUrl;
  const primaryColor = profile.template?.layoutConfig?.colorPalette?.primary || '#7c3aed';
  const ctaText = profile.ctaButtonText || profile.template?.predefinedDetails?.ctaButtonText || 'Get in Touch';
  const badgeText = profile.badgeLabel || profile.template?.predefinedDetails?.badgeLabel || '';
  const showBadge = profile.template?.layoutConfig?.showBadge !== false;
  const departmentName = profile.department?.name || profile.department || 'Enterprise';

  // Legacy static dummy values to filter out
  const legacyConnections = ['248', '248+', '150', '150+', '500+'];
  const legacyProjects = ['25+', '25', '10+', '10'];
  const legacyYears = ['8+', '8', '5+', '5'];
  const legacyServices = ['5+', '5', '6+', '6'];

  const realProjects = (profile.projects || profile.workAndImpact?.projects || []).length;
  const realServices = (profile.skills || []).length;

  let calculatedYears = 0;
  const experienceList = profile.experience || profile.about?.experience || [];
  if (experienceList.length > 0) {
    experienceList.forEach((exp) => {
      const start = exp.startDate ? new Date(exp.startDate) : null;
      const end = exp.endDate ? new Date(exp.endDate) : (exp.isCurrent ? new Date() : null);
      if (start && end && !isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diff = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24 * 365.25)));
        calculatedYears += diff;
      } else {
        calculatedYears += 1;
      }
    });
  }

  const rawConn = profile.overviewStats?.connections ?? profile.overviewStats?.connectionsCount ?? profile.stats?.connectionsCount;
  const isCustomConn = rawConn && !legacyConnections.includes(String(rawConn).trim());
  const displayConnections = isCustomConn
    ? rawConn
    : (profile.connectionsCount !== undefined && profile.connectionsCount !== null)
    ? (profile.connectionsCount > 0 ? `${profile.connectionsCount}+` : '0')
    : (profile.cardTapCount > 0 ? `${profile.cardTapCount}+` : '0');

  const rawProj = profile.overviewStats?.projects ?? profile.overviewStats?.projectsCount ?? profile.stats?.projectsCount;
  const isCustomProj = rawProj && !legacyProjects.includes(String(rawProj).trim());
  const displayProjects = isCustomProj ? rawProj : (realProjects > 0 ? `${realProjects}+` : '0');

  const rawYears = profile.overviewStats?.years ?? profile.overviewStats?.yearsOfExperience ?? profile.stats?.yearsOfExperience;
  const isCustomYears = rawYears && !legacyYears.includes(String(rawYears).trim());
  const displayYears = isCustomYears ? rawYears : (calculatedYears > 0 ? `${calculatedYears}+` : '1+');

  const rawServ = profile.overviewStats?.services ?? profile.overviewStats?.servicesCount ?? profile.stats?.servicesCount;
  const isCustomServ = rawServ && !legacyServices.includes(String(rawServ).trim());
  const displayServices = isCustomServ ? rawServ : (realServices > 0 ? `${realServices}+` : '0');

  // Dynamic social/contact links from profile data
  const linkedinUrl = profile.linkedin || profile.socialLinks?.linkedin || profile.contact?.linkedin;
  const instagramUrl = profile.instagram || profile.socialLinks?.instagram || profile.contact?.instagram;
  const whatsappNum = profile.whatsapp || profile.contact?.whatsapp || profile.phone || profile.contact?.phone;
  const phoneNum = profile.phone || profile.contact?.phone;
  const emailAddr = profile.email || profile.contact?.email || profile.workEmail;
  const websiteUrl = profile.website || profile.socialLinks?.website || profile.contact?.website;

  // Build social icon list dynamically (only present items)
  const socialIcons = [
    linkedinUrl && {
      key: 'linkedin',
      href: linkedinUrl,
      Icon: FaLinkedinIn,
      label: 'LinkedIn',
      color: '#0A66C2'
    },
    instagramUrl && {
      key: 'instagram',
      href: instagramUrl,
      Icon: FaInstagram,
      label: 'Instagram',
      color: '#E1306C'
    },
    whatsappNum && {
      key: 'whatsapp',
      href: `https://wa.me/${String(whatsappNum).replace(/\D/g, '')}`,
      Icon: FaWhatsapp,
      label: 'WhatsApp',
      color: '#25D366'
    },
    emailAddr && {
      key: 'email',
      href: `mailto:${emailAddr}`,
      Icon: FaEnvelope,
      label: 'Email',
      color: '#7c3aed'
    },
    phoneNum && {
      key: 'phone',
      href: `tel:${phoneNum}`,
      Icon: FaPhone,
      label: 'Call',
      color: '#0ea5e9'
    },
    websiteUrl && {
      key: 'website',
      href: websiteUrl,
      Icon: FaGlobe,
      label: 'Website',
      color: '#64748b'
    }
  ].filter(Boolean);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-500/5 overflow-hidden">
      {/* 1. Cover Banner */}
      <div
        className={`relative w-full overflow-hidden ${isCompact ? 'h-36 sm:h-44' : 'h-44 sm:h-64'}`}
        style={{
          background: coverUrl
            ? undefined
            : 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #6366f1 100%)'
        }}
      >
        {coverUrl ? (
          <img
            src={coverUrl}
            alt="Organization Banner"
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 opacity-90 flex items-center justify-end p-8">
            <div className="w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* 2. Profile Card Body */}
      <div className="px-4 sm:px-10 pb-6 sm:pb-8 pt-0 text-center space-y-4 sm:space-y-5 relative">
        {/* Overlapping Centered Avatar */}
        <div className={`flex justify-center relative z-10 ${isCompact ? '-mt-14' : '-mt-16 sm:-mt-20'}`}>
          <div className="relative group">
            <div className={`${isCompact ? 'w-24 h-24 sm:w-28 sm:h-28' : 'w-28 h-28 sm:w-36 sm:h-36'} aspect-square rounded-3xl bg-white p-1.5 shadow-xl ring-4 ring-white flex items-center justify-center overflow-hidden`}>
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover object-center rounded-2xl"
                />
              ) : (
                <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex flex-col items-center justify-center">
                  <Sparkles className="w-10 h-10 text-white" />
                  <span className="text-[10px] font-black uppercase tracking-wider mt-1 text-purple-100">
                    {profile.name?.slice(0, 6) || 'OWQ'}
                  </span>
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-purple-600 text-white p-1.5 rounded-full ring-4 ring-white shadow-md" title="OneWinq Verified Employee">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Identity Block */}
        <div className="space-y-1.5 max-w-2xl mx-auto min-w-0">
          {showBadge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold max-w-full">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span className="truncate">{badgeText || 'OneWinq Verified Member'} • {departmentName}</span>
            </div>
          )}

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display break-words leading-tight">
            {profile.name}
          </h1>

          <p className="text-sm sm:text-base font-semibold text-purple-600">
            {(!profile.designation || profile.designation.toLowerCase() === 'team member') && profile.role?.name && profile.role.name !== 'Employee'
              ? profile.role.name
              : profile.designation || 'Team Member'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-y-1 gap-x-4 text-xs text-slate-500 pt-1">
            {profile.companyName && (
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <Building2 className="w-3.5 h-3.5 text-purple-500" />
                {profile.companyName}
              </span>
            )}
            {(profile.location?.city || profile.location?.country) && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {[profile.location?.city, profile.location?.country].filter(Boolean).join(', ')}
              </span>
            )}
          </div>
        </div>

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-4 gap-2 py-2.5 px-4 max-w-md mx-auto bg-slate-50/80 rounded-2xl border border-slate-100 text-center">
          <div>
            <div className="text-xs sm:text-sm font-extrabold text-slate-900">{displayConnections}</div>
            <div className="text-[10px] text-slate-400 font-medium">Connections</div>
          </div>
          <div>
            <div className="text-xs sm:text-sm font-extrabold text-slate-900">{displayProjects}</div>
            <div className="text-[10px] text-slate-400 font-medium">Projects</div>
          </div>
          <div>
            <div className="text-xs sm:text-sm font-extrabold text-slate-900">{displayYears}</div>
            <div className="text-[10px] text-slate-400 font-medium">Years</div>
          </div>
          <div>
            <div className="text-xs sm:text-sm font-extrabold text-slate-900">{displayServices}</div>
            <div className="text-[10px] text-slate-400 font-medium">Skills</div>
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <button
            onClick={onConnectClick}
            className="px-6 py-2.5 rounded-2xl text-white text-xs font-bold shadow-md transition-all hover:scale-105 cursor-pointer flex items-center gap-1.5"
            style={{ backgroundColor: primaryColor || '#7c3aed' }}
          >
            <Mail className="w-4 h-4" /> {ctaText}
          </button>

          <button
            onClick={handleDownloadApp}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-black text-white text-xs font-semibold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Download Profile
          </button>

          <button
            onClick={onQrClick}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
            title="Show QR Code"
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

        {/* Social & Contact Icons Row */}
        {socialIcons.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1 pb-1">
            {socialIcons.map(({ key, href, Icon, label, color }) => (
              <a
                key={key}
                href={href}
                target={key !== 'phone' && key !== 'email' ? '_blank' : undefined}
                rel={key !== 'phone' && key !== 'email' ? 'noopener noreferrer' : undefined}
                title={label}
                className="w-11 h-11 rounded-full border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 hover:shadow-md flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                style={{ color }}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DigitalHeroCard;

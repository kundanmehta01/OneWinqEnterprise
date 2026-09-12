import React from 'react';
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

/**
 * Standard Digital Hero Card Component
 * Provides a unified, premium digital business card header across all department templates,
 * exactly matching the verified employee digital card design (as in Customer Support & Finance).
 */
export const DigitalHeroCard = ({
  profile,
  onConnectClick,
  onQrClick,
  onDownloadVCard,
  onShareClick,
  isCompact = false
}) => {
  if (!profile) return null;

  const coverUrl = profile.coverUrl;
  const primaryColor = profile.template?.layoutConfig?.colorPalette?.primary || '#059669';
  const ctaText = profile.ctaButtonText || profile.template?.predefinedDetails?.ctaButtonText || 'Get in Touch';
  const badgeText = profile.badgeLabel || profile.template?.predefinedDetails?.badgeLabel || '';
  const showBadge = profile.template?.layoutConfig?.showBadge !== false;

  const departmentName = profile.department?.name || profile.department || 'Enterprise';

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-500/5 overflow-hidden">
      {/* 1. Cover Banner */}
      <div
        className={`relative w-full overflow-hidden ${isCompact ? 'h-36 sm:h-44' : 'h-44 sm:h-64'}`}
        style={{
          background: coverUrl
            ? undefined
            : 'linear-gradient(135deg, #ec4899 0%, #c084fc 45%, #38bdf8 100%)'
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
        <div className="absolute inset-0 bg-black/5" />
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

        {/* Identity Block: Department Badge, Name, Designation, Company & Location */}
        <div className="space-y-1.5 max-w-2xl mx-auto min-w-0">
          {showBadge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold max-w-full">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span className="truncate">{badgeText || 'OneWinq Verified Employee'} • {departmentName}</span>
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

        {/* Overview Stats Bar (Founder & Employee Identity) */}
        {profile.overviewStats && (
          <div className="grid grid-cols-4 gap-2 py-2.5 px-4 max-w-md mx-auto bg-slate-50/80 rounded-2xl border border-slate-100 text-center">
            <div>
              <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                {(profile.overviewStats.connections !== undefined && profile.overviewStats.connections !== null && profile.overviewStats.connections !== '')
                  ? profile.overviewStats.connections
                  : (profile.overviewStats.connectionsCount ?? 0)}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Connections</div>
            </div>
            <div>
              <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                {(profile.overviewStats.projects !== undefined && profile.overviewStats.projects !== null && profile.overviewStats.projects !== '')
                  ? profile.overviewStats.projects
                  : (profile.overviewStats.projectsCount ?? 0)}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Projects</div>
            </div>
            <div>
              <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                {(profile.overviewStats.years !== undefined && profile.overviewStats.years !== null && profile.overviewStats.years !== '')
                  ? profile.overviewStats.years
                  : (profile.overviewStats.yearsOfExperience ?? 0)}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Years</div>
            </div>
            <div>
              <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                {(profile.overviewStats.services !== undefined && profile.overviewStats.services !== null && profile.overviewStats.services !== '')
                  ? profile.overviewStats.services
                  : (profile.overviewStats.servicesCount ?? 0)}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Services</div>
            </div>
          </div>
        )}

        {/* Action Controls: Get in Touch, Save Contact (.vcf), QR Code, Share */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onConnectClick}
            className="px-6 py-2.5 rounded-2xl text-white text-xs font-bold shadow-md transition-all hover:scale-105 cursor-pointer flex items-center gap-1.5"
            style={{ backgroundColor: primaryColor || '#059669' }}
          >
            <Mail className="w-4 h-4" /> {ctaText}
          </button>

          <button
            onClick={onDownloadVCard}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Save Contact (.vcf)
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
      </div>
    </div>
  );
};

export default DigitalHeroCard;

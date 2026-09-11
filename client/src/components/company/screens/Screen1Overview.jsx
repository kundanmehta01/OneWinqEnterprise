import React, { useState } from 'react';
import {
  ShieldCheck,
  Phone,
  Mail,
  Globe,
  Navigation as NavigationIcon,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Sparkles,
  ArrowRight,
  Send,
  Layers,
  Image as ImageIcon,
  Camera,
  Edit3,
  Plus,
  Trash2,
  Check,
  UploadCloud,
  X
} from 'lucide-react';
import { ImageUploadInput } from '../../common/ImageUploadInput';

export const Screen1Overview = ({ profile, onNavigate, isEditable = false, onUpdateField = () => {} }) => {
  const data = profile || {};
  const stats = data.overviewStats || {};
  const contact = data.contact || {};
  const branding = data.branding || {};
  const socialLinks = data.socialLinks || [];

  const [editCoverModal, setEditCoverModal] = useState(false);
  const [editLogoModal, setEditLogoModal] = useState(false);
  const [editSocialModal, setEditSocialModal] = useState(false);

  const getSocialIcon = (platform) => {
    const p = (platform || '').toLowerCase();
    if (p.includes('linkedin')) return <Linkedin className="w-4 h-4" />;
    if (p.includes('facebook')) return <Facebook className="w-4 h-4" />;
    if (p.includes('instagram')) return <Instagram className="w-4 h-4" />;
    if (p.includes('youtube')) return <Youtube className="w-4 h-4" />;
    if (p.includes('twitter') || p.includes('x')) return <Twitter className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6 pb-6 animate-fadeIn">
      {/* 1. Main Identity Hero Card with Background Cover & Profile Photo */}
      <div className="clean-card overflow-hidden bg-white border border-slate-100 shadow-sm rounded-3xl relative">
        {/* Background Cover Image Banner */}
        <div className="relative w-full h-44 sm:h-56 md:h-64 bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-900 overflow-hidden group">
          {branding.coverUrl ? (
            <img
              src={branding.coverUrl}
              alt="Company Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-90 flex items-center justify-end p-8">
              <div className="w-72 h-72 rounded-full bg-white/10 blur-3xl" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/10" />

          {/* Inline Cover Image Edit Trigger */}
          {isEditable && (
            <div className="absolute top-4 right-4 z-20">
              <button
                type="button"
                onClick={() => setEditCoverModal(true)}
                className="px-3.5 py-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer border border-white/20"
              >
                <Camera className="w-3.5 h-3.5 text-purple-300" />
                <span>Change Banner</span>
              </button>
            </div>
          )}
        </div>

        {/* Profile Card Body with Overlapping Profile Photo */}
        <div className="px-6 sm:px-10 pb-8 sm:pb-10 pt-0 text-center space-y-5 relative">
          {/* Overlapping Profile Photo / Logo */}
          <div className="flex justify-center -mt-16 sm:-mt-20 relative z-10">
            <div className="relative group">
              <div className="w-28 h-28 sm:w-36 sm:h-36 aspect-square rounded-3xl bg-white p-1.5 shadow-xl ring-4 ring-white flex items-center justify-center overflow-hidden">
                {branding.logoUrl ? (
                  <img
                    src={branding.logoUrl}
                    alt={data.name || 'Company Profile'}
                    className="w-full h-full object-cover object-center rounded-2xl"
                  />
                ) : (
                  <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex flex-col items-center justify-center">
                    <Sparkles className="w-10 h-10 text-white" />
                    <span className="text-[10px] font-black uppercase tracking-wider mt-1 text-purple-100">
                      {data.name?.slice(0, 6) || 'OneWinq'}
                    </span>
                  </div>
                )}
              </div>

              {isEditable ? (
                <button
                  type="button"
                  onClick={() => setEditLogoModal(true)}
                  className="absolute -bottom-1 -right-1 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full ring-4 ring-white shadow-md cursor-pointer transition-all hover:scale-110"
                  title="Change Logo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="absolute -bottom-1 -right-1 bg-purple-600 text-white p-1.5 rounded-full ring-4 ring-white shadow-md">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>

          {/* Company Name & Industry */}
          <div className="space-y-2 max-w-2xl mx-auto px-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[11px] sm:text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Verified Enterprise Profile</span>
            </div>

            {isEditable ? (
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={data.name || ''}
                  onChange={(e) => onUpdateField('name', e.target.value)}
                  placeholder="Enter Company Name"
                  className="w-full text-center text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight font-display bg-purple-50/30 hover:bg-purple-50/60 focus:bg-white border border-transparent focus:border-purple-300 rounded-xl px-3 py-1 outline-none transition-all"
                />
                <input
                  type="text"
                  value={data.industry || ''}
                  onChange={(e) => onUpdateField('industry', e.target.value)}
                  placeholder="Enter Industry / Domain"
                  className="w-full text-center text-xs sm:text-sm text-slate-500 font-medium bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-transparent focus:border-purple-300 rounded-lg px-3 py-0.5 outline-none transition-all"
                />
              </div>
            ) : (
              <>
                <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight font-display">
                  {data.name || 'OneWinq Technologies'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl mx-auto">
                  {data.industry || 'Technology & Digital Identity Solutions'}
                </p>
              </>
            )}
          </div>

          {/* Tagline Quote */}
          {isEditable ? (
            <div className="max-w-xl mx-auto">
              <input
                type="text"
                value={data.tagline || ''}
                onChange={(e) => onUpdateField('tagline', e.target.value)}
                placeholder='Enter Company Tagline (e.g. "Empowering seamless enterprise connections")'
                className="w-full text-center text-xs sm:text-sm italic text-slate-600 font-medium bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-transparent focus:border-purple-300 rounded-lg px-3 py-1 outline-none transition-all"
              />
            </div>
          ) : (
            data.tagline && (
              <p className="text-xs sm:text-sm italic text-slate-600 font-medium px-2 max-w-xl mx-auto leading-relaxed">
                "{data.tagline}"
              </p>
            )
          )}

          {/* Overview Stats 3-Col Box */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-xl mx-auto pt-1 items-stretch">
            {/* Stat 1: Founded */}
            <div className="bg-slate-50/80 border border-slate-100/90 rounded-2xl p-2.5 sm:p-3.5 flex flex-col items-center justify-center text-center transition-all hover:bg-purple-50/50 hover:border-purple-200 min-h-[72px] sm:min-h-[84px]">
              {isEditable ? (
                <input
                  type="text"
                  value={stats.foundedYear || ''}
                  onChange={(e) => onUpdateField('overviewStats.foundedYear', e.target.value)}
                  placeholder="2024"
                  className="w-full text-center text-sm sm:text-lg font-bold text-slate-900 tracking-tight bg-transparent border-b border-dashed border-purple-200 focus:border-purple-600 outline-none"
                />
              ) : (
                <p className="text-sm sm:text-lg font-bold text-slate-900 tracking-tight leading-tight line-clamp-2 max-w-full break-words">
                  {stats.foundedYear || '2024'}
                </p>
              )}
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-1 uppercase tracking-wider">
                Founded
              </p>
            </div>

            {/* Stat 2: Location */}
            <div className="bg-slate-50/80 border border-slate-100/90 rounded-2xl p-2.5 sm:p-3.5 flex flex-col items-center justify-center text-center transition-all hover:bg-purple-50/50 hover:border-purple-200 min-h-[72px] sm:min-h-[84px]">
              {isEditable ? (
                <input
                  type="text"
                  value={stats.locationShort || data.location?.city || ''}
                  onChange={(e) => onUpdateField('overviewStats.locationShort', e.target.value)}
                  placeholder="Indore"
                  className="w-full text-center text-xs sm:text-base font-bold text-slate-900 tracking-tight bg-transparent border-b border-dashed border-purple-200 focus:border-purple-600 outline-none"
                />
              ) : (
                <p className="text-xs sm:text-base font-bold text-slate-900 tracking-tight leading-tight line-clamp-2 max-w-full break-words">
                  {stats.locationShort || data.location?.city || 'Indore'}
                </p>
              )}
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-1 uppercase tracking-wider">
                Location
              </p>
            </div>

            {/* Stat 3: Team Size */}
            <div className="bg-slate-50/80 border border-slate-100/90 rounded-2xl p-2.5 sm:p-3.5 flex flex-col items-center justify-center text-center transition-all hover:bg-purple-50/50 hover:border-purple-200 min-h-[72px] sm:min-h-[84px]">
              {isEditable ? (
                <input
                  type="text"
                  value={stats.teamSize || ''}
                  onChange={(e) => onUpdateField('overviewStats.teamSize', e.target.value)}
                  placeholder="50+"
                  className="w-full text-center text-xs sm:text-base font-bold text-purple-600 tracking-tight bg-transparent border-b border-dashed border-purple-200 focus:border-purple-600 outline-none"
                />
              ) : (
                <p className="text-xs sm:text-base font-bold text-purple-600 tracking-tight leading-tight line-clamp-2 max-w-full break-words">
                  {stats.teamSize || '25+'}
                </p>
              )}
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-1 uppercase tracking-wider">
                Team Size
              </p>
            </div>
          </div>

          {/* Action Buttons: Explore Products & Contact Us */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 max-w-md mx-auto pt-2">
            <button
              type="button"
              onClick={() => onNavigate(3)}
              className="flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-3 sm:px-5 rounded-full btn-purple text-xs sm:text-sm font-bold shadow-md shadow-purple-500/25 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span className="truncate">Our Offerings</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate(8)}
              className="flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-3 sm:px-5 rounded-full bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 text-xs sm:text-sm font-bold transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Send className="w-4 h-4 shrink-0" />
              <span className="truncate">Get in Touch</span>
            </button>
          </div>

          {/* Quick Contact Icons */}
          <div className="grid grid-cols-4 gap-2 pt-5 border-t border-slate-100 max-w-lg mx-auto">
            <a
              href={`tel:${contact.phone || ''}`}
              className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-purple-50/50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-2xs">
                <Phone className="w-4 h-4" />
              </div>
              <span className="text-xs text-slate-600 font-medium">Call</span>
            </a>
            <a
              href={`mailto:${contact.email || ''}`}
              className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-purple-50/50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-2xs">
                <Mail className="w-4 h-4" />
              </div>
              <span className="text-xs text-slate-600 font-medium">Email</span>
            </a>
            <a
              href={data.website || '#'}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-purple-50/50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-2xs">
                <Globe className="w-4 h-4" />
              </div>
              <span className="text-xs text-slate-600 font-medium">Website</span>
            </a>
            <a
              href={contact.directionsUrl || `https://maps.google.com/?q=${encodeURIComponent(data.location?.city || 'Indore')}`}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-purple-50/50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-2xs">
                <NavigationIcon className="w-4 h-4" />
              </div>
              <span className="text-xs text-slate-600 font-medium">Direction</span>
            </a>
          </div>

          {/* Social Links */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <div className="flex items-center justify-center gap-2 mb-2.5">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                Official Channels
              </p>
              {isEditable && (
                <button
                  type="button"
                  onClick={() => setEditSocialModal(true)}
                  className="text-[10px] text-purple-600 font-bold hover:underline cursor-pointer"
                >
                  (Edit Links)
                </button>
              )}
            </div>

            <div className="flex items-center justify-center gap-2.5 flex-wrap">
              {socialLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 flex items-center justify-center text-slate-700 hover:text-purple-600 transition-all hover:scale-110 shadow-2xs"
                  title={link.platform}
                >
                  {getSocialIcon(link.platform)}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick Section Jump Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Company Sections
          </span>
          <span className="text-xs text-purple-600 font-semibold">Explore All Categories</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { id: 2, name: 'About Company', subtitle: 'Vision, Mission & Core Values' },
            { id: 3, name: 'Products & Services', subtitle: 'Smart NFC Cards & AI Solutions' },
            { id: 4, name: 'Team Directory', subtitle: 'Verified Leadership & Staff' },
            { id: 5, name: 'Projects & Platforms', subtitle: 'Ongoing & Delivered Systems' },
            { id: 6, name: 'Achievements', subtitle: 'Awards, ISO Trust & Milestones' },
            { id: 7, name: 'Media & Updates', subtitle: 'Photo Gallery, Videos & News' },
          ].map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => onNavigate(sec.id)}
              className="clean-card clean-card-hover p-5 text-left flex items-center justify-between group border border-slate-100 bg-white rounded-3xl shadow-2xs cursor-pointer"
            >
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                  {sec.name}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{sec.subtitle}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Cover Modal */}
      {editCoverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-purple-600" />
                Update Organization Cover Banner
              </h3>
              <button
                type="button"
                onClick={() => setEditCoverModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <ImageUploadInput
              label="Cover Banner Media"
              description="Choose a photo from your computer/device or enter an image URL."
              value={branding.coverUrl || ''}
              onChange={(val) => onUpdateField('branding.coverUrl', val)}
              aspectRatio="banner"
              entityType="company_cover"
              placeholder="https://images.unsplash.com/..."
            />
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditCoverModal(false)}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logo Modal */}
      {editLogoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-purple-600" />
                Update Organization Brand Logo
              </h3>
              <button
                type="button"
                onClick={() => setEditLogoModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <ImageUploadInput
              label="Brand Profile Logo"
              description="Choose a high-resolution logo from your computer/device or enter an image URL."
              value={branding.logoUrl || ''}
              onChange={(val) => onUpdateField('branding.logoUrl', val)}
              aspectRatio="square"
              entityType="company_logo"
              placeholder="https://example.com/logo.png"
            />
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditLogoModal(false)}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Social Links Modal */}
      {editSocialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-slate-900">Configure Social Channels</h3>
            <div className="space-y-2.5">
              {['linkedin', 'twitter', 'facebook', 'instagram', 'youtube'].map((platform) => {
                const existing = socialLinks.find(
                  (s) => s.platform?.toLowerCase() === platform
                );
                return (
                  <div key={platform} className="flex items-center gap-2">
                    <span className="w-20 text-xs font-bold capitalize text-slate-700">{platform}:</span>
                    <input
                      type="url"
                      placeholder={`https://${platform}.com/...`}
                      value={existing?.url || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        const copy = [...socialLinks];
                        const idx = copy.findIndex((s) => s.platform?.toLowerCase() === platform);
                        if (idx >= 0) {
                          if (val) copy[idx].url = val;
                          else copy.splice(idx, 1);
                        } else if (val) {
                          copy.push({ platform, url: val });
                        }
                        onUpdateField('socialLinks', copy);
                      }}
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-purple-600"
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditSocialModal(false)}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
              >
                Save Channels
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


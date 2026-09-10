import React from 'react';
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
} from 'lucide-react';

export const Screen1Overview = ({ profile, onNavigate }) => {
  const data = profile || {};
  const stats = data.overviewStats || {};
  const contact = data.contact || {};
  const branding = data.branding || {};
  const socialLinks = data.socialLinks || [];

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
      <div className="clean-card overflow-hidden bg-white border border-slate-100 shadow-sm rounded-3xl">
        {/* Background Cover Image Banner */}
        <div className="relative w-full h-44 sm:h-56 md:h-64 bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-900 overflow-hidden">
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
              <div className="absolute -bottom-1 -right-1 bg-purple-600 text-white p-1.5 rounded-full ring-4 ring-white shadow-md">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Company Name & Industry */}
          <div className="space-y-1.5 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Verified Enterprise Profile</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight font-display">
              {data.name || 'OneWinq Technologies'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl mx-auto">
              {data.industry || 'Technology & Digital Identity Solutions'}
            </p>
          </div>

          {/* Tagline Quote */}
          {data.tagline && (
            <p className="text-xs sm:text-sm italic text-slate-600 font-medium px-4 max-w-xl mx-auto">
              "{data.tagline}"
            </p>
          )}

          {/* Overview Stats 3-Col Box */}
          <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto pt-1">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center transition-all hover:bg-purple-50/50 hover:border-purple-200">
              <p className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {stats.foundedYear || '2024'}
              </p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Founded</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center transition-all hover:bg-purple-50/50 hover:border-purple-200">
              <p className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {stats.locationShort || data.location?.city || 'Indore'}
              </p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Location</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center transition-all hover:bg-purple-50/50 hover:border-purple-200">
              <p className="text-lg sm:text-xl font-bold text-purple-600 tracking-tight">
                {stats.teamSize || '25+'}
              </p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Team Size</p>
            </div>
          </div>

          {/* Action Buttons: Explore Products & Contact Us */}
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto pt-2">
            <button
              onClick={() => onNavigate(3)}
              className="flex items-center justify-center gap-2 py-3 px-5 rounded-full btn-purple text-xs sm:text-sm font-bold shadow-md shadow-purple-500/25 transition-all hover:scale-[1.02]"
            >
              <Layers className="w-4 h-4" />
              <span>Our Offerings</span>
            </button>
            <button
              onClick={() => onNavigate(8)}
              className="flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 text-xs sm:text-sm font-bold transition-all hover:scale-[1.02]"
            >
              <Send className="w-4 h-4" />
              <span>Get in Touch</span>
            </button>
          </div>

          {/* Quick Contact Icons */}
          <div className="grid grid-cols-4 gap-2 pt-5 border-t border-slate-100 max-w-lg mx-auto">
            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-purple-50/50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-2xs">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-xs text-slate-600 font-medium">Call</span>
              </a>
            )}
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-purple-50/50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-2xs">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-xs text-slate-600 font-medium">Email</span>
              </a>
            )}
            {data.website && (
              <a
                href={data.website}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-purple-50/50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-2xs">
                  <Globe className="w-4 h-4" />
                </div>
                <span className="text-xs text-slate-600 font-medium">Website</span>
              </a>
            )}
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
          {socialLinks.length > 0 && (
            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2.5">
                Official Channels
              </p>
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
          )}
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
              onClick={() => onNavigate(sec.id)}
              className="clean-card clean-card-hover p-5 text-left flex items-center justify-between group border border-slate-100 bg-white rounded-3xl shadow-2xs"
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
    </div>
  );
};

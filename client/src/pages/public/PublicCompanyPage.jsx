import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { publicProfileService } from '../../services/publicProfileService';
import { companyProfileService } from '../../services/companyProfileService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  Globe, MapPin, Mail, Phone, Users, Briefcase, ExternalLink
} from 'lucide-react';

export const PublicCompanyPage = () => {
  const [companyProfile, setCompanyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await companyProfileService.getPublicProfile();
        setCompanyProfile(data);
      } catch (err) {
        setError('Company profile not found or not publicly available.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading company profile..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">🏢</div>
          <h2 className="text-xl font-bold text-slate-900">Profile Not Available</h2>
          <p className="text-sm text-slate-500 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const cp = companyProfile || {};
  const primaryColor = cp.branding?.primaryColor || '#6366F1';
  const sections = cp.dynamicSections || [];
  const sectionTitles = {
    overview: 'Company Overview',
    about: 'About Company',
    services: 'Products & Services',
    team: 'Team',
    projects: 'Projects / Work',
    achievements: 'Achievements',
    updates: 'Media / Updates',
    contact: 'Contact / Connect'
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <div
        className="h-48 sm:h-64 w-full relative"
        style={{
          backgroundImage: cp.branding?.bannerUrl ? `url(${cp.branding.bannerUrl})` : '',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: primaryColor
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Card Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-16 relative">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Logo + Name Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 p-6 sm:p-8 border-b border-slate-100">
            <div
              className="w-20 h-20 rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-white text-2xl font-extrabold -mt-12 sm:-mt-14 flex-shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              {cp.branding?.logoUrl ? (
                <img src={cp.branding.logoUrl} alt={cp.name} className="w-full h-full rounded-2xl object-cover" />
              ) : (
                (cp.name || 'C').charAt(0)
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-extrabold text-slate-900">{cp.name || 'Company'}</h1>
              {cp.tagline && <p className="text-sm text-slate-500 mt-1">{cp.tagline}</p>}
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
                {cp.industry && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" /> {cp.industry}
                  </span>
                )}
                {cp.location?.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {cp.location.city}, {cp.location.country}
                  </span>
                )}
                {cp.website && (
                  <a
                    href={cp.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-indigo-600 hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" /> {cp.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 border-b border-slate-100">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Company Overview</h2>
            <p className="text-sm text-slate-700 leading-relaxed">{cp.description || cp.tagline || 'Company overview coming soon.'}</p>
          </div>

          {cp.about?.aboutCompany && (
            <div className="p-6 sm:p-8 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">About Company</h2>
              <p className="text-sm text-slate-700 leading-relaxed">{cp.about.aboutCompany}</p>
            </div>
          )}

          {sections.map((section) => {
            if (!section.isVisible) return null;
            const content = section.content;
            const text = typeof content === 'string' ? content : content?.description || content?.text;
            return (
              <div key={section.sectionId} className="p-6 sm:p-8 border-b border-slate-100">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  {sectionTitles[section.type] || section.title}
                </h2>
                {text && <p className="text-sm text-slate-700 leading-relaxed">{text}</p>}
                {Array.isArray(content?.items) && (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {content.items.map((item, index) => (
                      <div key={index} className="rounded-xl bg-slate-50 p-3">
                        <p className="text-sm font-semibold text-slate-800">{item.title || item.name}</p>
                        {item.description && <p className="text-xs text-slate-500 mt-1">{item.description}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Contact Info */}
          {(cp.contact?.email || cp.contact?.phone) && (
            <div className="p-6 sm:p-8">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Contact / Connect</h2>
              <div className="flex flex-wrap gap-4">
                {cp.contact?.email && (
                  <a
                    href={`mailto:${cp.contact.email}`}
                    className="flex items-center gap-2 text-sm text-indigo-700 font-medium hover:underline"
                  >
                    <Mail className="w-4 h-4" /> {cp.contact.email}
                  </a>
                )}
                {cp.contact?.phone && (
                  <a
                    href={`tel:${cp.contact.phone}`}
                    className="flex items-center gap-2 text-sm text-slate-700 font-medium hover:underline"
                  >
                    <Phone className="w-4 h-4" /> {cp.contact.phone}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-slate-400 py-6">
          Powered by <span className="font-bold text-indigo-600">OneWinq Enterprise</span>
        </p>
      </div>
    </div>
  );
};

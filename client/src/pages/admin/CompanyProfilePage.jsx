import React, { useState, useEffect } from 'react';
import { useCompanyProfile } from '../../hooks/useCompanyProfile';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Building2, Globe, MapPin, Mail, Phone, Palette, Save, ExternalLink } from 'lucide-react';
import { companyProfileService } from '../../services/companyProfileService';
import { useNotification } from '../../hooks/useNotification';

const requiredSections = [
  { type: 'overview', title: 'Company Overview' },
  { type: 'about', title: 'About Company' },
  { type: 'services', title: 'Products & Services' },
  { type: 'team', title: 'Team' },
  { type: 'projects', title: 'Projects / Work' },
  { type: 'achievements', title: 'Achievements' },
  { type: 'updates', title: 'Media / Updates' },
  { type: 'contact', title: 'Contact / Connect' }
];

export const CompanyProfilePage = () => {
  const { profile, loading, error, refetch } = useCompanyProfile();
  const { success, error: notifyError } = useNotification();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    industry: '',
    website: '',
    location: {
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    contact: {
      email: '',
      phone: '',
      supportEmail: ''
    },
    branding: {
      primaryColor: '#6366F1',
      accentColor: '#4F46E5',
      logoUrl: '',
      bannerUrl: ''
    },
    about: {
      aboutCompany: '',
      mission: '',
      vision: ''
    },
    dynamicSections: []
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        tagline: profile.tagline || '',
        description: profile.description || '',
        industry: profile.industry || '',
        website: profile.website || '',
        location: {
          address: profile.location?.address || '',
          city: profile.location?.city || '',
          state: profile.location?.state || '',
          country: profile.location?.country || '',
          zipCode: profile.location?.zipCode || ''
        },
        contact: {
          email: profile.contact?.email || '',
          phone: profile.contact?.phone || '',
          supportEmail: profile.contact?.supportEmail || ''
        },
        branding: {
          primaryColor: profile.branding?.primaryColor || '#6366F1',
          accentColor: profile.branding?.accentColor || '#4F46E5',
          logoUrl: profile.branding?.logoUrl || '',
          bannerUrl: profile.branding?.bannerUrl || profile.branding?.coverUrl || ''
        },
        about: {
          aboutCompany: profile.about?.aboutCompany || '',
          mission: profile.about?.mission || '',
          vision: profile.about?.vision || ''
        },
        dynamicSections: Array.isArray(profile.dynamicSections) ? profile.dynamicSections : []
      });
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await companyProfileService.updateAdminProfile(formData);
      success('Company profile updated successfully');
      refetch();
    } catch (err) {
      notifyError(err.message || 'Failed to update company profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="py-24">
        <LoadingSpinner message="Loading company profile details..." />
      </div>
    );
  }

  if (error && !profile) {
    return <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6 text-sm text-rose-700">{error}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Company Profile</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage organization branding, public gateway identity, and contact information.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            icon={ExternalLink}
            onClick={() => window.open('/p/company', '_blank')}
          >
            View Public Profile
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Save}
            isLoading={saving}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Basic Organization Info */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <span>General Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <Input
                label="Industry"
                placeholder="e.g. Enterprise Software & AI"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              />
            </div>

            <Input
              label="Tagline"
              placeholder="e.g. Next-Generation Enterprise Identity & Platform"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                About Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide an overview of your organization mission and goals..."
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <Input
              label="Official Website"
              icon={Globe}
              placeholder="https://onewinq.com"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>

          {/* Location & Address */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <span>Office Location</span>
            </h3>

            <Input
              label="Street Address"
              placeholder="e.g. 100 Innovation Boulevard, Suite 500"
              value={formData.location.address}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  location: { ...formData.location, address: e.target.value }
                })
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Input
                label="City"
                placeholder="San Francisco"
                value={formData.location.city}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location, city: e.target.value }
                  })
                }
              />
              <Input
                label="State / Region"
                placeholder="California"
                value={formData.location.state}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location, state: e.target.value }
                  })
                }
              />
              <Input
                label="Country"
                placeholder="USA"
                value={formData.location.country}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location, country: e.target.value }
                  })
                }
              />
              <Input
                label="Postal Code"
                placeholder="94107"
                value={formData.location.zipCode || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location, zipCode: e.target.value }
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Contact & Branding Sidepane */}
        <div className="lg:col-span-4 space-y-6">
          {/* Branding Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Palette className="w-5 h-5 text-indigo-600" />
              <span>Branding & Colors</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Primary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.branding.primaryColor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        branding: { ...formData.branding, primaryColor: e.target.value }
                      })
                    }
                    className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                  />
                  <span className="text-xs font-mono text-slate-700 uppercase">
                    {formData.branding.primaryColor}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.branding.accentColor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        branding: { ...formData.branding, accentColor: e.target.value }
                      })
                    }
                    className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                  />
                  <span className="text-xs font-mono text-slate-700 uppercase">
                    {formData.branding.accentColor}
                  </span>
                </div>
              </div>
            </div>

            <Input
              label="Logo Image URL"
              placeholder="https://.../logo.png"
              value={formData.branding.logoUrl}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  branding: { ...formData.branding, logoUrl: e.target.value }
                })
              }
            />

            <Input
              label="Banner Image URL"
              placeholder="https://.../banner.jpg"
              value={formData.branding.bannerUrl}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  branding: { ...formData.branding, bannerUrl: e.target.value }
                })
              }
            />
          </div>

          {/* Contact Details Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-600" />
              <span>Contact Channels</span>
            </h3>

            <Input
              label="Company Email"
              type="email"
              icon={Mail}
              placeholder="contact@onewinq.com"
              value={formData.contact.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: { ...formData.contact, email: e.target.value }
                })
              }
            />

            <Input
              label="Support Email"
              type="email"
              icon={Mail}
              placeholder="support@onewinq.com"
              value={formData.contact.supportEmail}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: { ...formData.contact, supportEmail: e.target.value }
                })
              }
            />

            <Input
              label="Phone Number"
              icon={Phone}
              placeholder="+1 (555) 019-2834"
              value={formData.contact.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: { ...formData.contact, phone: e.target.value }
                })
              }
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card space-y-4">
          <h3 className="text-base font-bold text-slate-900">About Company</h3>
          {['aboutCompany', 'mission', 'vision'].map((field) => (
            <div key={field}>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                {field === 'aboutCompany' ? 'About company' : field}
              </label>
              <textarea
                rows={field === 'aboutCompany' ? 4 : 3}
                value={formData.about[field]}
                onChange={(event) => setFormData({
                  ...formData,
                  about: { ...formData.about, [field]: event.target.value }
                })}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card">
          <h3 className="text-base font-bold text-slate-900">Company Profile Sections</h3>
          <p className="mt-1 text-xs text-slate-500">These sections are rendered from the backend dynamic section configuration.</p>
          <div className="mt-4 space-y-3">
            {requiredSections.map((required) => {
              const section = formData.dynamicSections.find(
                (item) => item.type === required.type || item.sectionId === required.type
              );
              return (
                <div key={required.type} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-slate-800">{section?.title || required.title}</span>
                    <span className="text-xs text-slate-500">
                      {section ? (section.isVisible ? 'Visible' : 'Hidden') : 'Not configured'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {section
                      ? (typeof section.content === 'string'
                        ? section.content
                        : section.content?.description || section.content?.text || 'No content provided.')
                      : 'No content configured for this section.'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {error && <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-sm text-amber-700">{error}</div>}
    </form>
  );
};

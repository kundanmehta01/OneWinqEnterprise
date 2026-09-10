import React from 'react';
import { Palette, Globe, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { useCompanyProfileStore } from '../../../stores/companyProfileStore';
import { ImageUploadInput } from '../../common/ImageUploadInput';

export const BrandingTab = () => {
  const { draft, updateField, addArrayItem, removeArrayItem, updateArrayItem } = useCompanyProfileStore();
  if (!draft) return null;

  const branding = draft.branding || {};
  const socialLinks = draft.socialLinks || [];

  const handleAddSocial = () => {
    addArrayItem('socialLinks', {
      platform: 'LinkedIn',
      url: 'https://linkedin.com/company/',
      order: socialLinks.length + 1,
      isVisible: true,
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Branding & Social Presence</h3>
        <p className="text-xs text-slate-500">Configure brand logos, background covers, color accents, and official social media handles.</p>
      </div>

      {/* Brand Assets Uploaders */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5" /> Brand Assets & Colors
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
            <ImageUploadInput
              label="Company Logo (Square 1:1)"
              description="PNG, SVG, or WEBP (transparent recommended)"
              value={branding.logoUrl || ''}
              onChange={(url) => updateField('branding.logoUrl', url)}
              aspectRatio="square"
              entityType="company"
              placeholder="https://.../logo.png"
            />
          </div>

          <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
            <ImageUploadInput
              label="Brand Cover Banner"
              description="High-resolution wide banner image"
              value={branding.coverUrl || ''}
              onChange={(url) => updateField('branding.coverUrl', url)}
              aspectRatio="banner"
              entityType="company"
              placeholder="https://.../cover.jpg"
            />
          </div>
        </div>

        {/* Color Scheme Picker */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-600">Primary Brand Color</label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2">
              <input
                type="color"
                value={branding.primaryColor || '#2563eb'}
                onChange={(e) => updateField('branding.primaryColor', e.target.value)}
                className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
              />
              <span className="text-xs font-mono text-slate-900">{branding.primaryColor || '#2563eb'}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-600">Secondary / Dark Accent</label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2">
              <input
                type="color"
                value={branding.secondaryColor || '#0f172a'}
                onChange={(e) => updateField('branding.secondaryColor', e.target.value)}
                className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
              />
              <span className="text-xs font-mono text-slate-900">{branding.secondaryColor || '#0f172a'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="pt-3 border-t border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Official Social Channels
            </h4>
            <p className="text-[11px] text-slate-500">Rendered in the 'Follow Us' bar on Screen 1</p>
          </div>
          <button
            type="button"
            onClick={handleAddSocial}
            className="px-2.5 py-1 rounded-lg btn-blue text-white text-[11px] font-semibold flex items-center gap-1 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Social Link
          </button>
        </div>

        <div className="space-y-2.5">
          {socialLinks.map((link, idx) => (
            <div key={idx} className="clean-card p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-3 shadow-sm">
              <div className="w-32">
                <select
                  value={link.platform || 'LinkedIn'}
                  onChange={(e) => updateArrayItem('socialLinks', idx, { platform: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                >
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Twitter">Twitter / X</option>
                  <option value="GitHub">GitHub</option>
                </select>
              </div>

              <div className="flex-1">
                <input
                  type="url"
                  value={link.url || ''}
                  onChange={(e) => updateArrayItem('socialLinks', idx, { url: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => updateArrayItem('socialLinks', idx, { isVisible: !link.isVisible })}
                  className={`p-1.5 rounded-lg transition-colors ${
                    link.isVisible !== false ? 'text-blue-600 hover:bg-blue-50' : 'text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {link.isVisible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => removeArrayItem('socialLinks', idx)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

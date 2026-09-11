import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Palette,
  Sliders,
  Type,
  Sparkles,
  Plus,
  X,
  Check,
  RotateCcw,
  Layout,
  Eye,
  Loader2,
  Tag,
  MessageSquare,
  Bookmark,
  Building2,
  ChevronRight,
  ShieldCheck,
  QrCode,
  ToggleLeft,
  ToggleRight,
  Quote
} from 'lucide-react';
import { templateApi } from '../../api/templateApi';
import { TemplateRenderer } from './TemplateRenderer';

const PRESET_PALETTES = [
  { name: 'Teal Enterprise', primary: '#0d9488', secondary: '#134e4a', accent: '#2dd4bf' },
  { name: 'Royal Indigo', primary: '#4f46e5', secondary: '#312e81', accent: '#818cf8' },
  { name: 'Sky Tech', primary: '#0284c7', secondary: '#0c4a6e', accent: '#38bdf8' },
  { name: 'Luxury Amber', primary: '#d97706', secondary: '#78350f', accent: '#fcd34d' },
  { name: 'Modern Violet', primary: '#7c3aed', secondary: '#4c1d95', accent: '#c084fc' },
  { name: 'Emerald Growth', primary: '#059669', secondary: '#064e3b', accent: '#34d399' },
  { name: 'Rose Executive', primary: '#e11d48', secondary: '#881337', accent: '#fb7185' },
  { name: 'Midnight Corporate', primary: '#1e293b', secondary: '#0f172a', accent: '#64748b' }
];

export const TemplateCustomizerModal = ({ isOpen, onClose, template, mockProfile }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('theme'); // 'theme' | 'details'
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Local Form State initialized from template
  const [themeState, setThemeState] = useState({
    headerStyle: 'centered',
    primaryColor: '#4f46e5',
    secondaryColor: '#1e293b',
    accentColor: '#818cf8',
    fontHeading: 'Inter',
    fontBody: 'Inter',
    showBadges: true,
    showBadge: true,
    showQuote: true,
    showQrCode: true
  });

  const [detailsState, setDetailsState] = useState({
    badgeLabel: '',
    quote: ''
  });

  useEffect(() => {
    if (template) {
      const cfg = template.layoutConfig || {};
      const pal = cfg.colorPalette || {};
      const pre = template.predefinedDetails || {};

      setThemeState({
        headerStyle: cfg.headerStyle || 'centered',
        primaryColor: pal.primary || '#4f46e5',
        secondaryColor: pal.secondary || '#1e293b',
        accentColor: pal.accent || '#818cf8',
        fontHeading: cfg.fontHeading || 'Inter',
        fontBody: cfg.fontBody || 'Inter',
        showBadges: cfg.showBadges !== false,
        showBadge: cfg.showBadge !== false,
        showQuote: cfg.showQuote !== false,
        showQrCode: cfg.showQrCode !== false
      });

      setDetailsState({
        badgeLabel: pre.badgeLabel || '',
        quote: pre.quote || ''
      });

      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [template, isOpen]);

  const updateMutation = useMutation({
    mutationFn: async (payload) => {
      setErrorMessage('');
      return await templateApi.update(template._id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-templates'] });
      setSuccessMessage('Template theme & predefined details saved successfully!');
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1500);
    },
    onError: (err) => {
      setErrorMessage(err?.message || 'Failed to update template customizations.');
    }
  });

  const handleApplyPreset = (preset) => {
    setThemeState((prev) => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      layoutConfig: {
        headerStyle: themeState.headerStyle,
        colorPalette: {
          primary: themeState.primaryColor,
          secondary: themeState.secondaryColor,
          accent: themeState.accentColor
        },
        fontHeading: themeState.fontHeading,
        fontBody: themeState.fontBody,
        showBadges: themeState.showBadges,
        showBadge: themeState.showBadge,
        showQuote: themeState.showQuote,
        showQrCode: themeState.showQrCode
      },
      predefinedDetails: {
        badgeLabel: detailsState.badgeLabel.trim(),
        quote: detailsState.quote.trim()
      },
      changeSummary: 'Admin customized theme, department badge and role quote'
    };
    updateMutation.mutate(payload);
  };

  if (!isOpen || !template) return null;

  // Real-time composed preview profile reflecting live edits
  const livePreviewProfile = {
    ...(mockProfile || {}),
    badgeLabel: detailsState.badgeLabel || mockProfile?.badgeLabel,
    templateQuote: detailsState.quote || mockProfile?.templateQuote,
    template: {
      id: template.category || template.slug,
      key: template.category || template.slug,
      name: template.name,
      layoutConfig: {
        headerStyle: themeState.headerStyle,
        colorPalette: {
          primary: themeState.primaryColor,
          secondary: themeState.secondaryColor,
          accent: themeState.accentColor
        },
        fontHeading: themeState.fontHeading,
        fontBody: themeState.fontBody,
        showBadge: themeState.showBadge,
        showQuote: themeState.showQuote
      },
      predefinedDetails: {
        badgeLabel: detailsState.badgeLabel,
        quote: detailsState.quote
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
              style={{ backgroundColor: themeState.primaryColor }}
            >
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 font-display">
                  Customize Template: {template.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                  {template.category}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Modify visual palette, layout styles, and department badge branding for this template.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {successMessage && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-600" /> {successMessage}
              </span>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Split 2-Column (Controls on Left, Live Preview on Right) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left Column: Customization Forms (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-100 overflow-y-auto max-h-[75vh] p-6 space-y-6">
            {/* Tab Navigation */}
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200/60">
              <button
                type="button"
                onClick={() => setActiveTab('theme')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'theme'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>Visual Theme & Colors</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'details'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Tag className="w-4 h-4" />
                <span>Department Badge</span>
              </button>
            </div>

            {/* TAB 1: VISUAL THEME */}
            {activeTab === 'theme' && (
              <div className="space-y-6 animate-fadeIn">
                {/* 1. Quick Presets */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Quick Preset Color Palettes
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_PALETTES.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplyPreset(p)}
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 transition-all text-left flex items-center gap-2.5 cursor-pointer group"
                      >
                        <div className="flex items-center -space-x-1 shrink-0">
                          <span
                            className="w-3.5 h-3.5 rounded-full ring-2 ring-white"
                            style={{ backgroundColor: p.primary }}
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full ring-2 ring-white"
                            style={{ backgroundColor: p.accent }}
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-700 truncate group-hover:text-slate-900">
                          {p.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Individual Color Pickers */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Custom Color Palette
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Primary Color */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                        Primary (Brand)
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={themeState.primaryColor}
                          onChange={(e) =>
                            setThemeState({ ...themeState, primaryColor: e.target.value })
                          }
                          className="w-8 h-8 rounded-xl cursor-pointer border border-slate-300 p-0.5 bg-white"
                        />
                        <input
                          type="text"
                          value={themeState.primaryColor}
                          onChange={(e) =>
                            setThemeState({ ...themeState, primaryColor: e.target.value })
                          }
                          className="w-full px-2 py-1 text-xs font-mono bg-white border border-slate-200 rounded-lg text-slate-800"
                        />
                      </div>
                    </div>

                    {/* Secondary Color */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                        Secondary (Dark)
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={themeState.secondaryColor}
                          onChange={(e) =>
                            setThemeState({ ...themeState, secondaryColor: e.target.value })
                          }
                          className="w-8 h-8 rounded-xl cursor-pointer border border-slate-300 p-0.5 bg-white"
                        />
                        <input
                          type="text"
                          value={themeState.secondaryColor}
                          onChange={(e) =>
                            setThemeState({ ...themeState, secondaryColor: e.target.value })
                          }
                          className="w-full px-2 py-1 text-xs font-mono bg-white border border-slate-200 rounded-lg text-slate-800"
                        />
                      </div>
                    </div>

                    {/* Accent Color */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                        Accent (Highlight)
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={themeState.accentColor}
                          onChange={(e) =>
                            setThemeState({ ...themeState, accentColor: e.target.value })
                          }
                          className="w-8 h-8 rounded-xl cursor-pointer border border-slate-300 p-0.5 bg-white"
                        />
                        <input
                          type="text"
                          value={themeState.accentColor}
                          onChange={(e) =>
                            setThemeState({ ...themeState, accentColor: e.target.value })
                          }
                          className="w-full px-2 py-1 text-xs font-mono bg-white border border-slate-200 rounded-lg text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Header Layout Style */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Header & Hero Layout Style
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'centered', label: 'Centered Hero', desc: 'Symmetrical luxury' },
                      { id: 'cover_left', label: 'Cover Left', desc: 'Executive avatar overlay' },
                      { id: 'banner_minimal', label: 'Banner Minimal', desc: 'Clean modern look' },
                      { id: 'compact', label: 'Compact Split', desc: 'Dense corporate card' }
                    ].map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setThemeState({ ...themeState, headerStyle: style.id })}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          themeState.headerStyle === style.id
                            ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/10'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-xs font-bold text-slate-900 block">{style.label}</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">{style.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Typography & Display Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Heading Typography
                    </label>
                    <select
                      value={themeState.fontHeading}
                      onChange={(e) =>
                        setThemeState({ ...themeState, fontHeading: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 text-slate-900"
                    >
                      <option value="Inter">Inter (Clean Modern)</option>
                      <option value="Outfit">Outfit (Geometric & Tech)</option>
                      <option value="Plus Jakarta Sans">Plus Jakarta Sans (Executive)</option>
                      <option value="Roboto">Roboto (Corporate Crisp)</option>
                      <option value="Poppins">Poppins (Friendly Bold)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Body Typography
                    </label>
                    <select
                      value={themeState.fontBody}
                      onChange={(e) =>
                        setThemeState({ ...themeState, fontBody: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 text-slate-900"
                    >
                      <option value="Inter">Inter (Balanced Readable)</option>
                      <option value="Roboto">Roboto (Crisp Geometry)</option>
                      <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: DEPARTMENT BADGE & QUOTE */}
            {activeTab === 'details' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100/90 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-indigo-950 space-y-1">
                    <p className="font-bold text-slate-900">Member-Driven Profile Content</p>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      Personal attributes such as headline, biography, skills, contact buttons, and collaboration notes are managed individually by each team member. Templates define visual themes, the department badge, and a role-specific quote shown at the bottom of each profile.
                    </p>
                  </div>
                </div>

                {/* Department Badge Label */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Department Badge Label Prefix
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. People & Culture / Engineering & DevOps / Executive Leadership"
                    value={detailsState.badgeLabel}
                    onChange={(e) =>
                      setDetailsState({ ...detailsState, badgeLabel: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:bg-white text-slate-900"
                  />
                  <p className="text-[11px] text-slate-400">
                    This badge label appears on the member's profile card to highlight their department or division.
                  </p>
                </div>

                {/* Role Quote */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-2">
                    <Quote className="w-3.5 h-3.5 text-indigo-500" /> Role Quote
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Empowering talent, building culture, and accelerating organizational growth."
                    value={detailsState.quote}
                    onChange={(e) =>
                      setDetailsState({ ...detailsState, quote: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:bg-white text-slate-900 resize-none leading-relaxed"
                  />
                  <p className="text-[11px] text-slate-400">
                    A short motivational or role-relevant quote displayed at the bottom of every profile in this template — after the member's details.
                  </p>
                </div>

                {/* Visibility Toggles */}
                <div className="space-y-3 pt-1">
                  <p className="text-xs font-bold text-slate-700">Profile Card Visibility</p>

                  {/* Show Department Badge Toggle */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-slate-800">Show Department Badge</p>
                      <p className="text-[11px] text-slate-500">Display the department label badge on profile cards</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setThemeState((p) => ({ ...p, showBadge: !p.showBadge }))}
                      className="shrink-0 cursor-pointer transition-colors"
                      style={{ color: themeState.showBadge ? themeState.primaryColor : '#94a3b8' }}
                    >
                      {themeState.showBadge
                        ? <ToggleRight className="w-8 h-8" />
                        : <ToggleLeft className="w-8 h-8" />
                      }
                    </button>
                  </div>

                  {/* Show Quote Toggle */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-slate-800">Show Role Quote</p>
                      <p className="text-[11px] text-slate-500">Display the role quote at the bottom of profile cards</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setThemeState((p) => ({ ...p, showQuote: !p.showQuote }))}
                      className="shrink-0 cursor-pointer transition-colors"
                      style={{ color: themeState.showQuote ? themeState.primaryColor : '#94a3b8' }}
                    >
                      {themeState.showQuote
                        ? <ToggleRight className="w-8 h-8" />
                        : <ToggleLeft className="w-8 h-8" />
                      }
                    </button>
                  </div>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium animate-fadeIn">
                {errorMessage}
              </div>
            )}
          </div>

          {/* Right Column: Interactive Real-Time Simulator Preview (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-100/70 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto max-h-[75vh]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-indigo-600" /> Live Interactive Preview
                </span>
                <span className="text-[10px] text-slate-500 font-mono bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  Real-Time Updates
                </span>
              </div>

              {/* Clean Elegant Interactive Preview Container */}
              <div className="w-full max-w-[380px] mx-auto rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="h-[460px] overflow-y-auto p-2 sm:p-3 scrollbar-thin scrollbar-thumb-slate-300">
                  <TemplateRenderer
                    templateKey={template.category || template.slug?.replace('-profile', '') || 'default'}
                    profile={livePreviewProfile}
                    isCompact={true}
                    onConnectClick={() => {}}
                    onQrClick={() => {}}
                    onDownloadVCard={() => {}}
                    onShareClick={() => {}}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between gap-3 bg-slate-100/80">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={updateMutation.isPending}
                className="px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                style={{ backgroundColor: themeState.primaryColor }}
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save & Apply Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateCustomizerModal;

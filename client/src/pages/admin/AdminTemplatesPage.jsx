import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  FileText,
  CheckCircle2,
  PauseCircle,
  Search,
  SlidersHorizontal,
  Eye,
  Layers,
  Sparkles,
  Loader2,
  Smartphone,
  Monitor,
  Tablet,
  Maximize2,
  Copy,
  Check,
  ExternalLink,
  Palette,
  LayoutGrid,
  Columns,
  X,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Building2,
  Briefcase
} from 'lucide-react';
import { templateApi } from '../../api/templateApi';
import { KpiCard } from '../../components/common/KpiCard';
import { StatusBadge } from '../../components/common/BadgePill';
import { TemplateRenderer } from '../../components/templates/TemplateRenderer';
import { TemplateCustomizerModal } from '../../components/templates/TemplateCustomizerModal';

export const AdminTemplatesPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('gallery'); // 'gallery' | 'split'
  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  // Simulator controls
  const [simulatorDevice, setSimulatorDevice] = useState('mobile'); // 'mobile' | 'tablet' | 'fluid'
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);
  const [fullscreenDevice, setFullscreenDevice] = useState('mobile'); // 'mobile' | 'tablet' | 'desktop'
  const [copiedSlug, setCopiedSlug] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [customizingTemplate, setCustomizingTemplate] = useState(null);

  const { data: templatesResponse, isLoading } = useQuery({
    queryKey: ['admin-templates'],
    queryFn: async () => {
      const res = await templateApi.getAll();
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.data)) return res.data;
      return [];
    }
  });

  const templatesList = templatesResponse || [];

  useEffect(() => {
    if (templatesList.length > 0 && !selectedTemplateId) {
      setSelectedTemplateId(templatesList[0]._id);
    }
  }, [templatesList, selectedTemplateId]);

  const selectedTemplate = templatesList.find((t) => t._id === selectedTemplateId) || templatesList[0];

  const categories = ['all', ...Array.from(new Set(templatesList.map((t) => t.category).filter(Boolean)))];

  const filteredTemplates = templatesList.filter((t) => {
    const matchesSearch =
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase()) ||
      t.category?.toLowerCase().includes(search.toLowerCase()) ||
      t.slug?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || t.category?.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const activeCount = templatesList.filter((t) => t.isActive !== false).length;
  const inactiveCount = templatesList.filter((t) => t.isActive === false).length;

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleCopySlug = (slug) => {
    if (!slug) return;
    navigator.clipboard.writeText(slug);
    setCopiedSlug(true);
    setTimeout(() => setCopiedSlug(false), 2000);
  };

  // Authentic realistic profiles tailored to each category
  const getMockProfileForTemplate = (template) => {
    if (!template) return null;
    const cat = (template.category || '').toLowerCase();

    if (cat === 'engineering' || cat === 'developer' || cat === 'tech') {
      return {
        name: 'Alex Rivera',
        designation: 'Staff Cloud Architect & Tech Lead',
        companyName: 'OneWinq Enterprise',
        workEmail: 'alex.rivera@onewinq.com',
        phone: '+1 (555) 342-9102',
        headline: 'Distributed Systems & Cloud-Native Security Architect',
        bio: 'Architecting resilient multi-region architectures, Kubernetes operators, and high-throughput zero-trust enterprise pipelines.',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        location: { city: 'Seattle, WA' },
        department: { name: 'Engineering & DevOps' },
        skills: ['Golang & Rust', 'Kubernetes & Terraform', 'Zero-Trust Architecture', 'GraphQL & gRPC', 'High-Availability Systems'],
        experience: [
          { role: 'Staff Systems Architect', company: 'OneWinq Global', duration: '2022 - Present' },
          { role: 'Senior Platform Engineer', company: 'HyperScale Cloud', duration: '2019 - 2022' }
        ],
        projects: [
          { title: 'Global Identity Mesh', role: 'Architect & Lead', description: 'Sub-10ms identity federation platform processing 50M daily events.' },
          { title: 'Enterprise Secret Vault', role: 'Maintainer', description: 'Hardware-backed KMS security envelope module.' }
        ],
        socialLinks: [
          { platform: 'github', url: 'https://github.com' },
          { platform: 'linkedin', url: 'https://linkedin.com' }
        ]
      };
    }

    if (cat === 'hr' || cat === 'people' || cat === 'human-resources') {
      return {
        name: 'Sarah Chen',
        designation: 'VP of People & Culture',
        companyName: 'OneWinq Enterprise',
        workEmail: 'sarah.chen@onewinq.com',
        phone: '+1 (555) 481-9023',
        headline: 'Empowering Talent, Workplace Culture & High-Performance Teams',
        bio: 'Championing globally inclusive workforces, career acceleration frameworks, and employee-centric growth systems.',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        location: { city: 'New York, NY' },
        department: { name: 'People Operations & HR' },
        skills: ['Executive Talent Acquisition', 'Workplace Culture', 'Performance Optimization', 'Employee Experience'],
        experience: [
          { role: 'VP of People Operations', company: 'OneWinq Enterprise', duration: '2021 - Present' },
          { role: 'Director of Talent Success', company: 'Global Innovate Inc', duration: '2017 - 2021' }
        ],
        projects: [
          { title: 'Global Hybrid Workplace Blueprint', role: 'Initiator', description: 'Distributed onboarding program achieving 96% employee satisfaction.' }
        ],
        socialLinks: [
          { platform: 'linkedin', url: 'https://linkedin.com' },
          { platform: 'twitter', url: 'https://twitter.com' }
        ]
      };
    }

    if (cat === 'sales' || cat === 'business-development' || cat === 'bd') {
      return {
        name: 'Marcus Vance',
        designation: 'Senior Enterprise Account Executive',
        companyName: 'OneWinq Enterprise',
        workEmail: 'marcus.vance@onewinq.com',
        phone: '+1 (555) 892-3041',
        headline: 'Closing Fortune 500 Enterprise Digital Transformation Deals',
        bio: 'Strategic dealmaker driving multi-million ARR partnerships, global customer expansions, and ecosystem alliances.',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        location: { city: 'Chicago, IL' },
        department: { name: 'Global Sales & Alliances' },
        skills: ['Strategic Account Planning', 'Fortune 500 Negotiations', 'SaaS ARR Growth', 'Executive Pitching'],
        experience: [
          { role: 'Senior Enterprise Account Executive', company: 'OneWinq Enterprise', duration: '2022 - Present' },
          { role: 'Strategic Sales Lead', company: 'CloudCorp Global', duration: '2018 - 2022' }
        ],
        projects: [
          { title: 'Tier-1 Banking Modernization Alliance', role: 'Lead AE', description: 'Structured $12M multi-year zero-trust digital card rollout.' }
        ],
        socialLinks: [
          { platform: 'linkedin', url: 'https://linkedin.com' },
          { platform: 'calendar', url: 'https://cal.com' }
        ]
      };
    }

    if (cat === 'marketing' || cat === 'creative' || cat === 'design') {
      return {
        name: 'Elena Rostova',
        designation: 'Principal Brand & Product Design Lead',
        companyName: 'OneWinq Enterprise',
        workEmail: 'elena.rostova@onewinq.com',
        phone: '+1 (555) 671-8842',
        headline: 'Crafting Iconic Digital Identities & Product Narratives',
        bio: 'Bridging high-impact aesthetics with functional design systems and viral brand positioning for modern enterprises.',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
        location: { city: 'Austin, TX' },
        department: { name: 'Brand Strategy & Design' },
        skills: ['Design Systems', 'Brand Positioning', 'Creative Direction', 'Growth Storytelling', 'Product UI/UX'],
        experience: [
          { role: 'Principal Brand & Design Lead', company: 'OneWinq Enterprise', duration: '2023 - Present' }
        ],
        projects: [
          { title: 'OneWinq Brand Evolution 3.0', role: 'Creative Director', description: 'Award-winning rebranding and interactive design library.' }
        ],
        socialLinks: [
          { platform: 'linkedin', url: 'https://linkedin.com' },
          { platform: 'dribbble', url: 'https://dribbble.com' }
        ]
      };
    }

    // Default / Executive fallback
    return {
      name: 'Alex Morgan',
      designation: template.name?.replace(' Profile', '') || 'Executive Leader',
      companyName: 'OneWinq Enterprise',
      workEmail: 'alex.morgan@onewinq.com',
      phone: '+1 (555) 019-2834',
      headline: `${template.name} Specialist & Enterprise Leader`,
      bio: `Demonstration of the ${template.name} layout with verified credentials, skills, and corporate touchpoints.`,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      location: { city: 'San Francisco, CA' },
      department: { name: template.category?.toUpperCase() || 'General' },
      skills: ['Enterprise Strategy', 'Cross-Functional Leadership', 'Digital Identity', 'Innovation'],
      experience: [
        { role: 'Executive Lead', company: 'OneWinq Global', duration: '2022 - Present' }
      ],
      projects: [
        { title: 'Global Identity Initiative', role: 'Project Lead', description: 'Enterprise rollouts across global hubs.' }
      ],
      socialLinks: [
        { platform: 'linkedin', url: 'https://linkedin.com' },
        { platform: 'twitter', url: 'https://twitter.com' }
      ]
    };
  };

  const previewProfile = getMockProfileForTemplate(selectedTemplate);
  const colorPalette = selectedTemplate?.layoutConfig?.colorPalette || {
    primary: '#5046e5',
    secondary: '#312e81',
    accent: '#818cf8',
    background: '#ffffff',
    text: '#0f172a'
  };

  const getCategoryBadgeClass = (category) => {
    switch ((category || '').toLowerCase()) {
      case 'engineering':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'hr':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200/80';
      case 'sales':
        return 'bg-blue-50 text-blue-700 border-blue-200/80';
      case 'marketing':
        return 'bg-pink-50 text-pink-700 border-pink-200/80';
      case 'executive':
      case 'founder':
      case 'management':
        return 'bg-purple-50 text-purple-700 border-purple-200/80';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 px-2 sm:px-4">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Templates Studio</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {templatesList.length} Layouts
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse, inspect, and preview role-tailored digital business card templates with live responsive simulators.
          </p>
        </div>

        {/* View Mode Switcher (Gallery vs Split Studio) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/60 shadow-2xs">
            <button
              onClick={() => setViewMode('gallery')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'gallery'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Gallery Grid</span>
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'split'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Studio Split</span>
            </button>
          </div>

          {selectedTemplate && (
            <button
              onClick={() => setIsFullscreenModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-xs"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Fullscreen Test</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={FileText}
          iconBg="bg-indigo-50 text-indigo-600"
          title="Total Templates"
          value={templatesList.length}
          trend=""
          trendType="neutral"
          trendLabel="All system & custom templates"
        />
        <KpiCard
          icon={CheckCircle2}
          iconBg="bg-emerald-50 text-emerald-600"
          title="Active Templates"
          value={activeCount}
          trend=""
          trendType="neutral"
          trendLabel="Available for assignment"
        />
        <KpiCard
          icon={PauseCircle}
          iconBg="bg-amber-50 text-amber-600"
          title="Inactive / Draft"
          value={inactiveCount}
          trend=""
          trendType="neutral"
          trendLabel="Archived templates"
        />
        <KpiCard
          icon={Layers}
          iconBg="bg-purple-50 text-purple-600"
          title="Categories"
          value={new Set(templatesList.map((t) => t.category)).size}
          trend=""
          trendType="neutral"
          trendLabel="Specialized designs"
        />
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search templates by role, category or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Quick Counter */}
          <span className="text-xs text-slate-400 font-medium">
            Showing {filteredTemplates.length} of {templatesList.length} templates
          </span>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 font-medium text-[11px] mr-1 shrink-0">Filter:</span>
          {categories.map((cat) => {
            const isSelected = categoryFilter.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-full font-semibold capitalize whitespace-nowrap transition-all text-[11px] ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Roles & Types' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. VIEW MODE 1: GALLERY GRID VIEW (Responsive Card Grid) */}
      {viewMode === 'gallery' && (
        <div>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white rounded-3xl border border-slate-100">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-xs text-slate-400 font-semibold">Loading template gallery...</p>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-24 text-xs text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
              No templates found matching your search or filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTemplates.map((t) => {
                const primaryColor = t.layoutConfig?.colorPalette?.primary || '#5046e5';
                const secondaryColor = t.layoutConfig?.colorPalette?.secondary || '#1e293b';
                const accentColor = t.layoutConfig?.colorPalette?.accent || '#818cf8';
                const isSelected = selectedTemplate?._id === t._id;
                const mockProfile = getMockProfileForTemplate(t);

                return (
                  <div
                    key={t._id}
                    className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between hover:shadow-xl group ${
                      isSelected
                        ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                        : 'border-slate-100 shadow-sm hover:border-slate-200'
                    }`}
                  >
                    <div>
                      {/* Top Visual Miniature Canvas */}
                      <div
                        className="h-28 sm:h-32 w-full p-4 relative flex flex-col justify-between overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]"
                        style={{
                          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                        }}
                      >
                        {/* Background decorative accent blur */}
                        <div
                          className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-2xl opacity-40"
                          style={{ backgroundColor: accentColor }}
                        />

                        {/* Top Badges */}
                        <div className="flex items-center justify-between relative z-10">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs uppercase tracking-wider ${getCategoryBadgeClass(
                              t.category
                            )}`}
                          >
                            {t.category || 'standard'}
                          </span>
                          <StatusBadge status={t.isActive === false ? 'inactive' : 'active'} />
                        </div>

                        {/* Avatar & Title preview in banner */}
                        <div className="flex items-center gap-3 relative z-10">
                          <div className="w-10 h-10 rounded-2xl border-2 border-white/80 bg-white/20 backdrop-blur-md overflow-hidden shrink-0 shadow-sm">
                            <img
                              src={mockProfile?.avatarUrl}
                              alt={mockProfile?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 text-white">
                            <p className="text-xs font-bold truncate drop-shadow-xs">{mockProfile?.name}</p>
                            <p className="text-[10px] opacity-80 truncate">{mockProfile?.designation}</p>
                          </div>
                        </div>
                      </div>

                      {/* Card Content & Metadata */}
                      <div className="p-5 space-y-4">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {t.name}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {t.description || 'Verified enterprise digital identity card layout.'}
                          </p>
                        </div>

                        {/* Color Swatches & Header Style */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-semibold text-slate-400">Palette</span>
                            <div className="flex items-center gap-1">
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                                style={{ backgroundColor: primaryColor }}
                                title={`Primary: ${primaryColor}`}
                              />
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                                style={{ backgroundColor: secondaryColor }}
                                title={`Secondary: ${secondaryColor}`}
                              />
                              {accentColor && (
                                <span
                                  className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                                  style={{ backgroundColor: accentColor }}
                                  title={`Accent: ${accentColor}`}
                                />
                              )}
                            </div>
                          </div>

                          <div className="text-[11px] text-slate-500 font-mono font-medium">
                            {t.layoutConfig?.headerStyle?.replace('_', ' ') || 'Cover Left'}
                          </div>
                        </div>

                        {/* Section Pills */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                            Included Sections
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {(
                              t.sectionOrder || ['experience', 'skills', 'projects', 'socialLinks']
                            ).slice(0, 4).map((sec) => (
                              <span
                                key={sec}
                                className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 text-[10px] font-medium capitalize border border-slate-100"
                              >
                                {sec}
                              </span>
                            ))}
                            {(t.sectionOrder || []).length > 4 && (
                              <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-semibold">
                                +{(t.sectionOrder || []).length - 4}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="p-4 sm:px-5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setSelectedTemplateId(t._id);
                          setIsFullscreenModalOpen(true);
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-600 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Interactive Card</span>
                      </button>

                      <button
                        onClick={() => {
                          setCustomizingTemplate(t);
                          setIsCustomizerOpen(true);
                        }}
                        className="py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        title="Customize Theme & Predefined Details"
                      >
                        <Palette className="w-3.5 h-3.5" />
                        <span>Customize</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedTemplateId(t._id);
                          setViewMode('split');
                        }}
                        className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        title="Open in Studio Split View"
                      >
                        <span>Studio</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. VIEW MODE 2: STUDIO SPLIT VIEW (Directory on Left, Interactive Simulator on Right) */}
      {viewMode === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Responsive Template List */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Template Directory</h2>
                <p className="text-[11px] text-slate-400">Click any card below to load into the live simulator</p>
              </div>
              <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                {filteredTemplates.length} Templates
              </span>
            </div>

            {/* List of Templates as Responsive Cards (NEVER raw unformatted table rows) */}
            <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                  <p className="text-xs text-slate-400 font-semibold">Loading templates...</p>
                </div>
              ) : filteredTemplates.length === 0 ? (
                <div className="text-center py-20 text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  No templates found.
                </div>
              ) : (
                filteredTemplates.map((t) => {
                  const isSelected = selectedTemplate?._id === t._id;
                  const primaryColor = t.layoutConfig?.colorPalette?.primary || '#5046e5';

                  return (
                    <div
                      key={t._id}
                      onClick={() => setSelectedTemplateId(t._id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-500/10 shadow-sm'
                          : 'bg-white hover:bg-slate-50/80 border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Mini Color Indicator Icon */}
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs font-bold text-xs"
                          style={{ backgroundColor: primaryColor }}
                        >
                          {t.name.charAt(0)}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900 truncate">{t.name}</h4>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase ${getCategoryBadgeClass(
                                t.category
                              )}`}
                            >
                              {t.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate max-w-[280px] sm:max-w-xs mt-0.5">
                            {t.description || 'Enterprise layout'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <StatusBadge status={t.isActive === false ? 'inactive' : 'active'} />
                        <span
                          className={`p-1 rounded-lg ${
                            isSelected ? 'bg-indigo-600 text-white' : 'text-slate-400'
                          }`}
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Live Simulator & Specifications (Sticky on desktop) */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm space-y-5 lg:sticky lg:top-6 self-start">
            {selectedTemplate ? (
              <>
                {/* Simulator Header & Device Switcher */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-slate-900">Live Simulator</h2>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${getCategoryBadgeClass(
                          selectedTemplate.category
                        )}`}
                      >
                        {selectedTemplate.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{selectedTemplate.name}</p>
                  </div>

                  {/* Device Toggles */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
                    <button
                      onClick={() => setSimulatorDevice('mobile')}
                      title="Mobile Card (375px)"
                      className={`p-1.5 rounded-lg transition-all ${
                        simulatorDevice === 'mobile'
                          ? 'bg-white text-indigo-600 shadow-xs'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSimulatorDevice('tablet')}
                      title="Tablet View (540px)"
                      className={`p-1.5 rounded-lg transition-all ${
                        simulatorDevice === 'tablet'
                          ? 'bg-white text-indigo-600 shadow-xs'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <Tablet className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSimulatorDevice('fluid')}
                      title="Full Width Responsive"
                      className={`p-1.5 rounded-lg transition-all ${
                        simulatorDevice === 'fluid'
                          ? 'bg-white text-indigo-600 shadow-xs'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <Monitor className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setCustomizingTemplate(selectedTemplate);
                        setIsCustomizerOpen(true);
                      }}
                      title="Customize Theme & Predefined Details"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <Palette className="w-3.5 h-3.5" />
                      <span>Customize</span>
                    </button>
                    <button
                      onClick={() => setIsFullscreenModalOpen(true)}
                      title="Fullscreen Test"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-white transition-all cursor-pointer"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Simulator Canvas Frame */}
                <div className="flex justify-center bg-slate-100/70 p-3 sm:p-5 rounded-2xl border border-slate-200/80 overflow-hidden">
                  <div
                    className={`transition-all duration-300 w-full overflow-hidden ${
                      simulatorDevice === 'mobile'
                        ? 'max-w-[380px] rounded-2xl border border-slate-200 bg-white shadow-md'
                        : simulatorDevice === 'tablet'
                        ? 'max-w-[540px] rounded-2xl border border-slate-200 bg-white shadow-md'
                        : 'w-full rounded-2xl border border-slate-200 bg-white shadow-sm'
                    }`}
                  >
                    {/* Scrollable Template Viewport */}
                    <div className="h-[460px] sm:h-[520px] overflow-y-auto p-2 sm:p-3 scrollbar-thin scrollbar-thumb-slate-300">
                      {previewProfile && (
                        <TemplateRenderer
                          templateKey={selectedTemplate.category || selectedTemplate.slug?.replace('-profile', '') || 'default'}
                          profile={previewProfile}
                          isCompact={simulatorDevice === 'mobile'}
                          onConnectClick={() => {}}
                          onQrClick={() => setQrModalOpen(true)}
                          onDownloadVCard={() => {}}
                          onShareClick={() => handleCopySlug(selectedTemplate.slug)}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Slug Identifier & Fullscreen Trigger */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="text-[11px] text-slate-400">Template Key:</span>
                    <code className="px-2 py-0.5 bg-slate-100 text-slate-800 font-mono text-[11px] rounded-md">
                      {selectedTemplate.slug}
                    </code>
                    <button
                      onClick={() => handleCopySlug(selectedTemplate.slug)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
                      title="Copy Key"
                    >
                      {copiedSlug ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <button
                    onClick={() => setIsFullscreenModalOpen(true)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <span>Fullscreen Test</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {/* Detailed Specifications */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Template Blueprint Specs</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">Category</span>
                      <span className="font-bold text-slate-800 capitalize mt-0.5 block">{selectedTemplate.category}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">Status</span>
                      <div className="mt-0.5">
                        <StatusBadge status={selectedTemplate.isActive === false ? 'inactive' : 'active'} />
                      </div>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">Header Style</span>
                      <span className="font-bold text-slate-800 capitalize mt-0.5 block">
                        {selectedTemplate.layoutConfig?.headerStyle?.replace('_', ' ') || 'Cover Left'}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">Created On</span>
                      <span className="font-bold text-slate-800 mt-0.5 block">{formatDate(selectedTemplate.createdAt)}</span>
                    </div>
                  </div>

                  {/* Palette Swatches */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1">
                      <Palette className="w-3 h-3 text-slate-400" />
                      <span>Theme Color Palette</span>
                    </span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                          style={{ backgroundColor: colorPalette.primary }}
                        />
                        <span className="text-[11px] font-mono text-slate-600">{colorPalette.primary}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                          style={{ backgroundColor: colorPalette.secondary }}
                        />
                        <span className="text-[11px] font-mono text-slate-600">{colorPalette.secondary}</span>
                      </div>
                      {colorPalette.accent && (
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                            style={{ backgroundColor: colorPalette.accent }}
                          />
                          <span className="text-[11px] font-mono text-slate-600">{colorPalette.accent}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-24 text-xs text-slate-400">
                Select a template on the left to inspect its live simulator.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. IMMERSIVE FULLSCREEN INTERACTIVE SIMULATOR MODAL */}
      {isFullscreenModalOpen && selectedTemplate && previewProfile && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 animate-fadeIn">
          <div className="bg-slate-100 rounded-3xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden border border-slate-700/40 shadow-2xl">
            {/* Modal Header */}
            <div className="bg-white px-5 py-3.5 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs"
                  style={{ backgroundColor: colorPalette.primary }}
                >
                  {selectedTemplate.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{selectedTemplate.name}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${getCategoryBadgeClass(
                        selectedTemplate.category
                      )}`}
                    >
                      {selectedTemplate.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Live Interactive Digital Identity Simulator</p>
                </div>
              </div>

              {/* Device Toggle */}
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setFullscreenDevice('mobile')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                      fullscreenDevice === 'mobile'
                        ? 'bg-white text-indigo-600 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile (375px)</span>
                  </button>
                  <button
                    onClick={() => setFullscreenDevice('tablet')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                      fullscreenDevice === 'tablet'
                        ? 'bg-white text-indigo-600 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Tablet className="w-3.5 h-3.5" />
                    <span>Tablet (640px)</span>
                  </button>
                  <button
                    onClick={() => setFullscreenDevice('desktop')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                      fullscreenDevice === 'desktop'
                        ? 'bg-white text-indigo-600 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Desktop (Wide)</span>
                  </button>
                </div>

                <button
                  onClick={() => setIsFullscreenModalOpen(false)}
                  className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
              {fullscreenDevice === 'mobile' ? (
                <div className="w-full max-w-[390px] bg-white rounded-[36px] border-8 border-slate-900 shadow-2xl p-4 overflow-hidden my-auto">
                  <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto mb-3" />
                  <TemplateRenderer
                    templateKey={selectedTemplate.category || selectedTemplate.slug?.replace('-profile', '') || 'default'}
                    profile={previewProfile}
                    onConnectClick={() => {}}
                    onQrClick={() => setQrModalOpen(true)}
                    onDownloadVCard={() => {}}
                    onShareClick={() => handleCopySlug(selectedTemplate.slug)}
                  />
                </div>
              ) : fullscreenDevice === 'tablet' ? (
                <div className="w-full max-w-[640px] bg-white rounded-3xl border-4 border-slate-300 shadow-xl p-6 overflow-hidden my-auto">
                  <TemplateRenderer
                    templateKey={selectedTemplate.category || selectedTemplate.slug?.replace('-profile', '') || 'default'}
                    profile={previewProfile}
                    onConnectClick={() => {}}
                    onQrClick={() => setQrModalOpen(true)}
                    onDownloadVCard={() => {}}
                    onShareClick={() => handleCopySlug(selectedTemplate.slug)}
                  />
                </div>
              ) : (
                <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10">
                  <TemplateRenderer
                    templateKey={selectedTemplate.category || selectedTemplate.slug?.replace('-profile', '') || 'default'}
                    profile={previewProfile}
                    onConnectClick={() => {}}
                    onQrClick={() => setQrModalOpen(true)}
                    onDownloadVCard={() => {}}
                    onShareClick={() => handleCopySlug(selectedTemplate.slug)}
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-white px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
              <span>Layout Slug: <code className="font-mono text-slate-800 font-bold">{selectedTemplate.slug}</code></span>
              <button
                onClick={() => setIsFullscreenModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
              >
                Close Simulator
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. TEMPLATE CUSTOMIZER MODAL */}
      {isCustomizerOpen && (
        <TemplateCustomizerModal
          isOpen={isCustomizerOpen}
          onClose={() => {
            setIsCustomizerOpen(false);
            setCustomizingTemplate(null);
          }}
          template={customizingTemplate || selectedTemplate}
          mockProfile={previewProfile}
        />
      )}
    </div>
  );
};

export default AdminTemplatesPage;

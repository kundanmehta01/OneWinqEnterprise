import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import {
  Sparkles,
  Building2,
  Layers,
  Users,
  Trophy,
  Image,
  PhoneCall,
  Palette,
  FolderGit2,
  Save,
  RotateCcw,
  Check,
  AlertCircle,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { companyApi } from '../../api/companyApi';
import { useCompanyProfileStore } from '../../stores/companyProfileStore';
import { MediaLightboxModal } from '../../components/company/MediaLightboxModal';
import { OverviewTab } from '../../components/admin/tabs/OverviewTab';
import { AboutTab } from '../../components/admin/tabs/AboutTab';
import { ProductsTab } from '../../components/admin/tabs/ProductsTab';
import { TeamTab } from '../../components/admin/tabs/TeamTab';
import { ProjectsTab } from '../../components/admin/tabs/ProjectsTab';
import { AchievementsTab } from '../../components/admin/tabs/AchievementsTab';
import { MediaTab } from '../../components/admin/tabs/MediaTab';
import { ContactTab } from '../../components/admin/tabs/ContactTab';
import { BrandingTab } from '../../components/admin/tabs/BrandingTab';

export const CompanyProfileStudioPage = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const { draft, setDraft, isDirty, resetDraft, markSaved } = useCompanyProfileStore();

  const [activeTab, setActiveTab] = useState(location.state?.tab || 'overview');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Fetch Admin Company Profile
  const { data: serverProfile, isLoading } = useQuery({
    queryKey: ['adminCompanyProfile'],
    queryFn: companyApi.getAdminCompanyProfile,
  });

  useEffect(() => {
    if (serverProfile) {
      setDraft(serverProfile);
    }
  }, [serverProfile, setDraft]);

  // Mutation to Save
  const saveMutation = useMutation({
    mutationFn: (updateData) => companyApi.updateAdminCompanyProfile(updateData),
    onSuccess: (savedData) => {
      markSaved(savedData);
      queryClient.invalidateQueries({ queryKey: ['adminCompanyProfile'] });
      queryClient.invalidateQueries({ queryKey: ['publicCompanyProfile'] });
      setSaveSuccess(true);
      setSaveError('');
      setTimeout(() => setSaveSuccess(false), 3000);
    },
    onError: (err) => {
      setSaveError(err.message || 'Failed to save changes');
    },
  });

  const handleSave = () => {
    if (!draft) return;
    setSaveError('');
    saveMutation.mutate(draft);
  };

  const tabs = [
    { id: 'overview', label: 'Overview & Stats', icon: Sparkles },
    { id: 'about', label: 'About & Vision', icon: Building2 },
    { id: 'products', label: 'Products & Services', icon: Layers },
    { id: 'team', label: 'Leadership & Team', icon: Users },
    { id: 'projects', label: 'Projects & Work', icon: FolderGit2 },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'media', label: 'Media & Gallery', icon: Image },
    { id: 'contact', label: 'Contact & Location', icon: PhoneCall },
    { id: 'branding', label: 'Branding & Theme', icon: Palette },
  ];

  if (isLoading || !draft) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <p className="text-xs text-slate-500 font-semibold">Loading Company Profile Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fadeIn">
      {/* 1. Studio Top Action Bar */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 font-bold shrink-0 shadow-xs">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight font-display">
                Company Profile Studio
              </h1>
              {isDirty ? (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold animate-pulse">
                  Unsaved Changes
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                  All Changes Saved
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure enterprise branding, overview, products, leadership, and digital presence.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {saveSuccess && (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 animate-fadeIn">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> Saved Successfully!
            </span>
          )}

          {saveError && (
            <span className="inline-flex items-center gap-1 text-xs text-rose-700 font-bold bg-rose-50 px-3 py-2 rounded-xl border border-rose-200 animate-fadeIn">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> {saveError}
            </span>
          )}

          <a
            href="/company/onewinq"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>View Public Page</span>
          </a>

          <button
            type="button"
            onClick={resetDraft}
            disabled={!isDirty || saveMutation.isPending}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-200 transition-all hover:scale-[1.01] disabled:opacity-50 cursor-pointer"
          >
            {saveMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save & Update Profile</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Studio Navigation Pills */}
      <div className="flex bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 overflow-x-auto gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Full-Width Active Tab Form Container */}
      <div className="bg-white p-6 sm:p-8 border border-slate-200/80 rounded-3xl shadow-sm min-h-[560px] space-y-8">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'about' && <AboutTab />}
        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'team' && <TeamTab />}
        {activeTab === 'projects' && <ProjectsTab />}
        {activeTab === 'achievements' && <AchievementsTab />}
        {activeTab === 'media' && <MediaTab />}
        {activeTab === 'contact' && <ContactTab />}
        {activeTab === 'branding' && <BrandingTab />}

        {/* Bottom Publishing Footer */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-slate-800">Ready to publish changes?</p>
            <p className="text-[11px] text-slate-400">Updates will immediately reflect across all digital touchpoints and cards.</p>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="/company/onewinq"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>Preview Live</span>
            </a>

            <button
              type="button"
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="px-6 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-200 transition-all hover:scale-[1.01] disabled:opacity-50 cursor-pointer"
            >
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Company Profile</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Global Modals for Media Interaction */}
      <MediaLightboxModal />
    </div>
  );
};

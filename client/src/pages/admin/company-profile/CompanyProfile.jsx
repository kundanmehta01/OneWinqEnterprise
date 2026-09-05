import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { companyProfileService, teamMemberService, analyticsService, mediaService } from '../../../services';
import { companyData, fallbackContent } from './companyData';
import CompanyHeader from './components/CompanyHeader';
import CompanyStats from './components/CompanyStats';
import CompanyTabs from './components/CompanyTabs';
import EditSectionModal from './common/EditSectionModal';
import CompanyOverview from './sections/CompanyOverview';
import AboutCompany from './sections/AboutCompany';
import ProductsServices from './sections/ProductsServices';
import CompanyTeam from './sections/CompanyTeam';
import ProjectsWork from './sections/ProjectsWork';
import Achievements from './sections/Achievements';
import MediaUpdates from './sections/MediaUpdates';
import ContactConnect from './sections/ContactConnect';

const tabs = [
  ['overview', 'Company Overview'], ['about', 'About Company'], ['services', 'Products / Services'],
  ['team', 'Team'], ['projects', 'Projects / Work'], ['achievements', 'Achievements'],
  ['media', 'Media / Updates'], ['contact', 'Contact / Connect']
].map(([id, label]) => ({ id, label }));

const byType = (sections, type) => sections.find((section) => section.type === type && section.isVisible !== false);
const unwrapList = (value) => Array.isArray(value) ? value : value?.data || value?.members || value?.assets || [];
export default function CompanyProfile() {
  const [company, setCompany] = useState(null);
  const [members, setMembers] = useState([]);
  const [assets, setAssets] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editOpen, setEditOpen] = useState(false);

  const load = async () => {
    setLoading(true); setError('');
    const results = await Promise.allSettled([companyProfileService.get(), teamMemberService.getAll({ limit: 100 }), analyticsService.getOverview(), mediaService.getAll({ limit: 20 })]);
    const [companyResult, membersResult, analyticsResult, mediaResult] = results;
    if (companyResult.status === 'fulfilled') setCompany(companyResult.value);
    else setError(companyResult.reason?.response?.data?.message || 'Unable to load company profile.');
    if (membersResult.status === 'fulfilled') setMembers(unwrapList(membersResult.value));
    if (analyticsResult.status === 'fulfilled') setAnalytics(analyticsResult.value);
    if (mediaResult.status === 'fulfilled') setAssets(unwrapList(mediaResult.value));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const sections = company?.sections || company?.dynamicSections || [];
  const contentSections = (type) => byType(sections, type);
  const stats = useMemo(() => ({
    members: members.length,
    projects: (contentSections('projects')?.content?.items || contentSections('projects')?.content || []).length || 0,
    achievements: (contentSections('achievements')?.content?.items || contentSections('achievements')?.content || []).length || 0,
    views: analytics?.kpis?.profileViews || analytics?.profileViews || 0,
    profiles: members.filter((member) => member.profileId || member.profile).length
  }), [members, sections, analytics]);
  const save = async (data) => { setSaving(true); try { const updated = await companyProfileService.update(data); setCompany(updated); setEditOpen(false); } catch (saveError) { setError(saveError.response?.data?.message || 'Unable to save company profile.'); } finally { setSaving(false); } };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveTab(visible.target.id);
    }, { rootMargin: '-20% 0px -65% 0px', threshold: [0.1, 0.4, 0.8] });
    tabs.forEach((tab) => { const node = document.getElementById(tab.id); if (node) observer.observe(node); });
    return () => observer.disconnect();
  }, [loading]);
  if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-indigo-600" /></div>;
  if (!company && error) return <div className="m-6 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"><AlertCircle className="mr-2 inline h-4 w-4" />{error}</div>;
  return <div className="space-y-5 p-4 md:p-6">
    {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
    <CompanyHeader company={{ ...company, name: company?.name || 'OneWinq Technologies Pvt. Ltd.', tagline: company?.tagline || 'Building trusted digital identities for people and organizations.', location: { ...company?.location, country: company?.location?.country || 'India' } }} data={companyData} onEdit={() => setEditOpen(true)} />
    <CompanyStats stats={stats} />
    <CompanyTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
    <div className="grid gap-5 xl:grid-cols-2">
      <CompanyOverview company={company} />
      <AboutCompany company={company} />
      <ProductsServices section={contentSections('services') || { content: { items: fallbackContent.products.map(([title, description]) => ({ title, description })) } }} />
      <CompanyTeam members={members} />
      <ProjectsWork section={contentSections('projects') || { content: { items: fallbackContent.projects.map(([title, description, status]) => ({ title, description, status })) } }} />
      <Achievements section={contentSections('achievements') || { content: { items: fallbackContent.achievements.map((title) => ({ title })) } }} />
      <MediaUpdates assets={assets} />
      <ContactConnect company={company} />
    </div>
    <EditSectionModal open={editOpen} company={company} onClose={() => setEditOpen(false)} onSave={save} saving={saving} />
  </div>;
}

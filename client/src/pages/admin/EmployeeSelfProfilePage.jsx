import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  User,
  Sparkles,
  ShieldCheck,
  Eye,
  Send,
  Save,
  QrCode,
  Share2,
  Copy,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Layers,
  Globe,
  Plus,
  Trash2,
  ExternalLink,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Award,
  TrendingUp,
  X,
  Loader2,
  FileText,
  Clock,
  Check
} from 'lucide-react';
import { userProfileApi } from '../../api/userProfileApi';
import { ImageUploadInput } from '../../components/common/ImageUploadInput';
import { useAuthStore } from '../../stores/authStore';
import { Building2 } from 'lucide-react';

export const EmployeeSelfProfilePage = () => {
  const { isSuperAdmin } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('identity'); // 'identity', 'experience', 'skills', 'projects', 'social', 'impact'
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitNote, setSubmitNote] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // 1. Fetch Profile Data (for team members)
  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ['my-profile'],
    queryFn: async () => {
      const res = await userProfileApi.getMyProfile();
      return res?.data || res;
    },
    enabled: !isSuperAdmin
  });

  // 2. Fetch Approval Status
  const { data: approvalStatus } = useQuery({
    queryKey: ['my-approval-status'],
    queryFn: async () => {
      const res = await userProfileApi.getMyApprovalStatus();
      return res?.data || res;
    },
    enabled: !isSuperAdmin
  });

  if (isSuperAdmin) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center animate-fadeIn">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Building2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">OneWinq Enterprise Account</h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
            You are logged in as the Supreme Enterprise Administrator. Individual digital profiles belong to team members. To configure the company brand, products, and organization presence, please use the Company Profile Studio.
          </p>
          <div className="pt-3">
            <a
              href="/admin/company-profile"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-purple-200 transition-all hover:scale-[1.02]"
            >
              <Building2 className="w-4 h-4" /> Go to Company Profile Studio
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Local state for draft editing
  const [formData, setFormData] = useState({
    headline: '',
    bio: '',
    phone: '',
    workEmail: '',
    location: '',
    avatarUrl: '',
    coverUrl: '',
    collaborationNote: '',
    skills: [],
    experience: [],
    projects: [],
    socialLinks: [],
    impactMetrics: [],
    achievements: []
  });

  // Initialize draft formData from profileData
  useEffect(() => {
    if (profileData) {
      const draft = profileData.draft || {};
      const published = profileData.published || {};
      const member = profileData.memberId || {};

      setFormData({
        headline: draft.headline ?? published.headline ?? member.designation ?? '',
        bio: draft.bio ?? published.bio ?? '',
        phone: draft.phone ?? published.phone ?? '',
        workEmail: draft.workEmail ?? published.workEmail ?? '',
        location: draft.location ?? published.location ?? '',
        avatarUrl: draft.avatarUrl ?? published.avatarUrl ?? '',
        coverUrl: draft.coverUrl ?? published.coverUrl ?? '',
        collaborationNote: draft.collaborationNote ?? published.collaborationNote ?? '',
        skills: draft.skills?.length ? draft.skills : published.skills || [],
        experience: draft.experience?.length ? draft.experience : published.experience || [],
        projects: draft.projects?.length ? draft.projects : published.projects || [],
        socialLinks: draft.socialLinks?.length ? draft.socialLinks : published.socialLinks || [],
        impactMetrics: draft.impactMetrics?.length ? draft.impactMetrics : published.impactMetrics || [],
        achievements: draft.achievements?.length ? draft.achievements : published.achievements || []
      });
    }
  }, [profileData]);

  // QR Code query
  const slug = profileData?.slug;
  const { data: qrData } = useQuery({
    queryKey: ['my-profile-qr', slug],
    queryFn: () => userProfileApi.getProfileQrCode(slug),
    enabled: Boolean(slug) && isQrModalOpen
  });

  // Save Draft Mutation
  const saveDraftMutation = useMutation({
    mutationFn: async (payload) => {
      return await userProfileApi.updateMyDraft(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
      setToastMessage({ type: 'success', text: 'Draft profile saved successfully!' });
      setTimeout(() => setToastMessage(null), 3500);
    },
    onError: (err) => {
      setToastMessage({
        type: 'error',
        text: err?.response?.data?.message || 'Failed to save draft changes.'
      });
      setTimeout(() => setToastMessage(null), 4000);
    }
  });

  // Submit for Approval Mutation
  const submitApprovalMutation = useMutation({
    mutationFn: async (note) => {
      return await userProfileApi.submitForApproval(note);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
      queryClient.invalidateQueries({ queryKey: ['my-approval-status'] });
      setIsSubmitModalOpen(false);
      setSubmitNote('');
      setToastMessage({
        type: 'success',
        text: 'Profile changes submitted to HR & Admin for review!'
      });
      setTimeout(() => setToastMessage(null), 4500);
    },
    onError: (err) => {
      setToastMessage({
        type: 'error',
        text: err?.response?.data?.message || 'Submission failed. Please check your changes.'
      });
      setTimeout(() => setToastMessage(null), 4000);
    }
  });

  const handleSaveDraft = (e) => {
    if (e) e.preventDefault();
    saveDraftMutation.mutate(formData);
  };

  const handleCopyPublicLink = () => {
    const url = `${window.location.origin}/p/${profileData?.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadVCard = () => {
    if (!profileData) return;
    const name = profileData.memberId?.name || 'Employee';
    const vcardContent = `BEGIN:VCARD
VERSION:3.0
FN:${name}
ORG:OneWinq Technologies
TITLE:${formData.headline || profileData.memberId?.designation || ''}
EMAIL;TYPE=WORK:${formData.workEmail || ''}
TEL;TYPE=WORK,VOICE:${formData.phone || ''}
URL:${window.location.origin}/p/${profileData.slug}
NOTE:${formData.bio || ''}
END:VCARD`;

    const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${profileData.slug || 'contact'}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper functions for dynamic arrays
  const addSkill = () => {
    setFormData({
      ...formData,
      skills: [...formData.skills, { name: '', category: 'General', proficiencyLevel: 'Intermediate' }]
    });
  };

  const updateSkill = (index, field, value) => {
    const next = [...formData.skills];
    next[index] = { ...next[index], [field]: value };
    setFormData({ ...formData, skills: next });
  };

  const removeSkill = (index) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index)
    });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        {
          title: '',
          company: '',
          location: '',
          startDate: null,
          endDate: null,
          isCurrent: true,
          description: ''
        }
      ]
    });
  };

  const updateExperience = (index, field, value) => {
    const next = [...formData.experience];
    next[index] = { ...next[index], [field]: value };
    setFormData({ ...formData, experience: next });
  };

  const removeExperience = (index) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((_, i) => i !== index)
    });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [
        ...formData.projects,
        {
          title: '',
          description: '',
          role: '',
          url: '',
          technologies: []
        }
      ]
    });
  };

  const updateProject = (index, field, value) => {
    const next = [...formData.projects];
    next[index] = { ...next[index], [field]: value };
    setFormData({ ...formData, projects: next });
  };

  const removeProject = (index) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter((_, i) => i !== index)
    });
  };

  const addSocialLink = () => {
    setFormData({
      ...formData,
      socialLinks: [...formData.socialLinks, { platform: 'LinkedIn', url: '' }]
    });
  };

  const updateSocialLink = (index, field, value) => {
    const next = [...formData.socialLinks];
    next[index] = { ...next[index], [field]: value };
    setFormData({ ...formData, socialLinks: next });
  };

  const removeSocialLink = (index) => {
    setFormData({
      ...formData,
      socialLinks: formData.socialLinks.filter((_, i) => i !== index)
    });
  };

  const addMetric = () => {
    setFormData({
      ...formData,
      impactMetrics: [...formData.impactMetrics, { metric: '', label: '' }]
    });
  };

  const updateMetric = (index, field, value) => {
    const next = [...formData.impactMetrics];
    next[index] = { ...next[index], [field]: value };
    setFormData({ ...formData, impactMetrics: next });
  };

  const removeMetric = (index) => {
    setFormData({
      ...formData,
      impactMetrics: formData.impactMetrics.filter((_, i) => i !== index)
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <p className="text-xs text-slate-500 font-medium">Loading your profile workspace...</p>
      </div>
    );
  }

  const memberName = profileData?.memberId?.name || 'Employee';
  const designation = formData.headline || profileData?.memberId?.designation || 'Team Member';
  const status = profileData?.approvalStatus || 'draft';
  const isLocked = profileData?.isLocked;
  const completionScore = profileData?.completionScore || 75;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-xl border flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="text-xs font-semibold">{toastMessage.text}</span>
        </div>
      )}

      {/* 1. Header Banner & Profile Status */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-100/50 via-indigo-50/30 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none blur-2xl"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-purple-200 shrink-0 overflow-hidden">
              {formData.avatarUrl ? (
                <img
                  src={formData.avatarUrl}
                  alt={memberName}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <span>{memberName.substring(0, 2).toUpperCase()}</span>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{memberName}</h1>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize border ${
                    status === 'approved'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : status === 'pending_review'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : status === 'changes_requested'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {status === 'pending_review' ? 'Pending Review' : status}
                </span>
                {profileData?.slug && (
                  <span className="text-[11px] text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md font-mono">
                    /p/{profileData.slug}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                <span>{designation}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span>OneWinq Enterprise</span>
              </p>

              {/* Completion Bar */}
              <div className="flex items-center gap-3 mt-3 max-w-xs">
                <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${completionScore}%` }}
                  ></div>
                </div>
                <span className="text-[11px] font-bold text-slate-700">{completionScore}% Complete</span>
              </div>
            </div>
          </div>

          {/* Action Button Group */}
          <div className="flex flex-wrap items-center gap-2.5">
            {profileData?.slug && (
              <a
                href={`/p/${profileData.slug}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-purple-600" />
                <span>View Live</span>
              </a>
            )}

            <button
              onClick={() => setIsQrModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold border border-purple-200 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Share & QR</span>
            </button>

            <button
              onClick={handleSaveDraft}
              disabled={saveDraftMutation.isPending || isLocked}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saveDraftMutation.isPending ? 'Saving...' : 'Save Draft'}</span>
            </button>

            <button
              onClick={() => setIsSubmitModalOpen(true)}
              disabled={isLocked || status === 'pending_review'}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-md shadow-purple-200 transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{status === 'pending_review' ? 'In Review' : 'Submit for Approval'}</span>
            </button>
          </div>
        </div>

        {/* NFC Smart Card Banner */}
        {profileData?.nfcCard && (
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center font-mono font-bold text-xs">
                NFC
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-slate-900 font-mono">{profileData.nfcCard.cardUid}</p>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      profileData.nfcCard.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        profileData.nfcCard.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                    {profileData.nfcCard.status === 'active' ? 'Active NFC Card' : 'Activation Pending'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Tap-to-share physical smart hardware linked to your profile
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 text-[11px]">
                <strong>{profileData.nfcCard.tapCount || 0}</strong> physical card taps recorded
              </span>
            </div>
          </div>
        )}

        {/* Pending Review Notice */}
        {isLocked && (
          <div className="mt-6 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
            <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Profile Under Review</p>
              <p className="text-amber-800 mt-0.5">
                Your recent changes have been submitted to HR/Admin. Editing is locked until reviewed.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Form Sections (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section Tabs */}
          <div className="bg-white rounded-2xl p-2 border border-slate-100 shadow-sm flex items-center gap-1 overflow-x-auto">
            {[
              { id: 'identity', label: 'Identity & Bio', icon: User },
              { id: 'experience', label: 'Experience', icon: Briefcase },
              { id: 'skills', label: 'Skills & Badges', icon: Layers },
              { id: 'projects', label: 'Projects', icon: Sparkles },
              { id: 'social', label: 'Links & Social', icon: Globe },
              { id: 'impact', label: 'Impact & Awards', icon: Award }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-sm shadow-purple-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: IDENTITY & BIO */}
          {activeTab === 'identity' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6 animate-in fade-in">
              <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Profile Identity & Media
              </h2>

              {/* Avatar Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Profile Photo (Avatar)
                </label>
                <ImageUploadInput
                  value={formData.avatarUrl}
                  onChange={(val) => setFormData({ ...formData, avatarUrl: val })}
                  folder="avatars"
                  placeholder="https://... or upload local image"
                />
                <p className="text-[11px] text-slate-400">
                  Recommended: Square portrait image (500x500px). Auto-centered and fitted.
                </p>
              </div>

              {/* Cover Banner Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Profile Cover Banner
                </label>
                <ImageUploadInput
                  value={formData.coverUrl}
                  onChange={(val) => setFormData({ ...formData, coverUrl: val })}
                  folder="covers"
                  placeholder="https://... or upload local cover image"
                />
                <p className="text-[11px] text-slate-400">
                  Recommended: 1200x400px panoramic enterprise banner.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Headline / Role</label>
                  <input
                    type="text"
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    placeholder="e.g. Senior Full-Stack Engineer"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Work Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Bangalore, India (Hybrid)"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email</label>
                  <input
                    type="email"
                    value={formData.workEmail}
                    onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                    placeholder="name@onewinq.com"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Direct Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bio / Executive Summary</label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Share your expertise, key focus areas, and leadership journey..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Collaboration Note (Callout Banner)
                </label>
                <input
                  type="text"
                  value={formData.collaborationNote}
                  onChange={(e) => setFormData({ ...formData, collaborationNote: e.target.value })}
                  placeholder="e.g. Open for tech mentorship, cross-team architecture reviews, and AI initiatives."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
          )}

          {/* TAB 2: EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Career Experience</h2>
                  <p className="text-[11px] text-slate-400">Highlight your career timeline and past achievements.</p>
                </div>
                <button
                  type="button"
                  onClick={addExperience}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Role</span>
                </button>
              </div>

              {formData.experience.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl">
                  <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-medium text-slate-600">No experience items added yet.</p>
                  <button
                    type="button"
                    onClick={addExperience}
                    className="mt-3 text-xs text-purple-600 font-semibold hover:underline"
                  >
                    + Add your current role
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.experience.map((exp, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/40 space-y-3 relative group"
                    >
                      <button
                        type="button"
                        onClick={() => removeExperience(idx)}
                        className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Job Title</label>
                          <input
                            type="text"
                            value={exp.title}
                            onChange={(e) => updateExperience(idx, 'title', e.target.value)}
                            placeholder="e.g. Lead Engineer"
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                            placeholder="e.g. OneWinq Enterprise"
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Location</label>
                          <input
                            type="text"
                            value={exp.location}
                            onChange={(e) => updateExperience(idx, 'location', e.target.value)}
                            placeholder="e.g. Bengaluru, India"
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                        <div className="flex items-center gap-2 pt-6">
                          <input
                            type="checkbox"
                            id={`curr-${idx}`}
                            checked={exp.isCurrent}
                            onChange={(e) => updateExperience(idx, 'isCurrent', e.target.checked)}
                            className="rounded text-purple-600"
                          />
                          <label htmlFor={`curr-${idx}`} className="text-xs font-medium text-slate-700">
                            Currently working here
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={exp.description}
                          onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                          placeholder="Brief description of responsibilities and achievements..."
                          className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SKILLS */}
          {activeTab === 'skills' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Skills & Competencies</h2>
                  <p className="text-[11px] text-slate-400">Add technical and functional skills to your profile.</p>
                </div>
                <button
                  type="button"
                  onClick={addSkill}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Skill</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {formData.skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/40 flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => updateSkill(idx, 'name', e.target.value)}
                      placeholder="e.g. React.js, Node.js"
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                    <select
                      value={skill.proficiencyLevel}
                      onChange={(e) => updateSkill(idx, 'proficiencyLevel', e.target.value)}
                      className="px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeSkill(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Featured Projects</h2>
                  <p className="text-[11px] text-slate-400">Showcase high-impact initiatives you have delivered.</p>
                </div>
                <button
                  type="button"
                  onClick={addProject}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              {formData.projects.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl">
                  <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-medium text-slate-600">No projects added yet.</p>
                  <button
                    type="button"
                    onClick={addProject}
                    className="mt-3 text-xs text-purple-600 font-semibold hover:underline"
                  >
                    + Add your first project
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.projects.map((proj, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/40 space-y-3 relative group"
                    >
                      <button
                        type="button"
                        onClick={() => removeProject(idx)}
                        className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Project Title</label>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => updateProject(idx, 'title', e.target.value)}
                            placeholder="e.g. Enterprise Cloud Migration"
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Project URL</label>
                          <input
                            type="text"
                            value={proj.url}
                            onChange={(e) => updateProject(idx, 'url', e.target.value)}
                            placeholder="https://..."
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={proj.description}
                          onChange={(e) => updateProject(idx, 'description', e.target.value)}
                          placeholder="Project scope, metrics, and business outcome..."
                          className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SOCIAL & LINKS */}
          {activeTab === 'social' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Social & Professional Links</h2>
                  <p className="text-[11px] text-slate-400">Connect your verified professional profiles.</p>
                </div>
                <button
                  type="button"
                  onClick={addSocialLink}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Link</span>
                </button>
              </div>

              <div className="space-y-3">
                {formData.socialLinks.map((link, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/40 flex items-center gap-3">
                    <select
                      value={link.platform}
                      onChange={(e) => updateSocialLink(idx, 'platform', e.target.value)}
                      className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg font-medium"
                    >
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="GitHub">GitHub</option>
                      <option value="Twitter">Twitter / X</option>
                      <option value="Portfolio">Portfolio</option>
                      <option value="Instagram">Instagram</option>
                      <option value="YouTube">YouTube</option>
                    </select>
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => updateSocialLink(idx, 'url', e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeSocialLink(idx)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: IMPACT & AWARDS */}
          {activeTab === 'impact' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Impact Metrics</h2>
                  <p className="text-[11px] text-slate-400">Key enterprise figures highlighting your track record.</p>
                </div>
                <button
                  type="button"
                  onClick={addMetric}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Metric</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {formData.impactMetrics.map((met, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/40 flex items-center gap-2">
                    <input
                      type="text"
                      value={met.metric}
                      onChange={(e) => updateMetric(idx, 'metric', e.target.value)}
                      placeholder="Value (e.g. 50+)"
                      className="w-28 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg font-bold text-purple-600"
                    />
                    <input
                      type="text"
                      value={met.label}
                      onChange={(e) => updateMetric(idx, 'label', e.target.value)}
                      placeholder="Label (e.g. Enterprise Clients)"
                      className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeMetric(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Digital Card Preview (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 sticky top-24">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Live Card Preview</span>
              <span className="text-[10px] text-purple-600 font-semibold bg-purple-50 px-2 py-0.5 rounded-full">
                Interactive
              </span>
            </div>

            {/* Digital Business Card Simulator */}
            <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-md shadow-slate-100">
              {/* Cover */}
              <div className="h-28 bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-800 relative overflow-hidden">
                {formData.coverUrl && (
                  <img
                    src={formData.coverUrl}
                    alt="Cover"
                    className="w-full h-full object-cover object-center opacity-90"
                  />
                )}
              </div>

              {/* Avatar & Content */}
              <div className="px-5 pb-5 -mt-10 relative">
                <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-lg shadow-purple-900/10 mb-3">
                  <div className="w-full h-full rounded-xl bg-purple-100 overflow-hidden flex items-center justify-center font-bold text-purple-700">
                    {formData.avatarUrl ? (
                      <img
                        src={formData.avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <span>{memberName.substring(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{memberName}</h3>
                <p className="text-xs text-purple-600 font-medium line-clamp-1">{designation}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">OneWinq Enterprise</p>

                {formData.bio && (
                  <p className="text-[11px] text-slate-600 mt-2.5 line-clamp-3 bg-slate-50 p-2 rounded-xl">
                    {formData.bio}
                  </p>
                )}

                {/* Quick Contact Buttons */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button
                    onClick={handleDownloadVCard}
                    className="py-2 px-3 rounded-xl bg-purple-600 text-white text-[11px] font-semibold text-center hover:bg-purple-700 transition-colors"
                  >
                    Save Contact
                  </button>
                  <button
                    onClick={() => setIsQrModalOpen(true)}
                    className="py-2 px-3 rounded-xl bg-slate-100 text-slate-700 text-[11px] font-semibold text-center hover:bg-slate-200 transition-colors"
                  >
                    Share Profile
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 text-xs text-purple-900 space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                Dynamic NFC Smart Tap
              </p>
              <p className="text-[11px] text-purple-800">
                Any tap on your OneWinq NFC Card or QR code instantly opens this verified profile for clients & partners.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SUBMIT FOR APPROVAL MODAL */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Submit Profile for Review</h3>
              <button onClick={() => setIsSubmitModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Your profile updates will be sent to the enterprise HR and Admin team for verification before going live.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Note for Reviewer (Optional)
              </label>
              <textarea
                rows={3}
                value={submitNote}
                onChange={(e) => setSubmitNote(e.target.value)}
                placeholder="e.g. Updated recent project deliveries, skills certifications, and phone number..."
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => submitApprovalMutation.mutate(submitNote)}
                disabled={submitApprovalMutation.isPending}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm"
              >
                {submitApprovalMutation.isPending ? 'Submitting...' : 'Confirm Submission'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. SHARE & QR CODE MODAL */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-sm p-6 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Share Digital Profile</h3>
              <button onClick={() => setIsQrModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* QR Code Container */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 inline-block mx-auto">
              {qrData?.qrCodeUrl ? (
                <img src={qrData.qrCodeUrl} alt="QR Code" className="w-48 h-48 mx-auto rounded-lg" />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                </div>
              )}
            </div>

            <p className="text-xs text-slate-600 font-medium">Scan with any mobile camera to view live profile.</p>

            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/p/${profileData?.slug || ''}`}
                className="bg-transparent flex-1 text-slate-700 text-[11px] outline-none truncate"
              />
              <button
                onClick={handleCopyPublicLink}
                className="p-1.5 bg-white rounded-lg border border-slate-200 text-slate-600 hover:text-purple-600 shrink-0 flex items-center gap-1 text-[11px] font-semibold"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <button
              onClick={handleDownloadVCard}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              Download vCard (.vcf)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

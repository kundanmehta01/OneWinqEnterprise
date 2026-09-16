import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  User,
  Sparkles,
  Eye,
  Send,
  Save,
  QrCode,
  Copy,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Layers,
  Globe,
  Plus,
  Trash2,
  Phone,
  Award,
  X,
  Loader2,
  Clock,
  Check,
  Building2
} from 'lucide-react';
import { userProfileApi } from '../../api/userProfileApi';
import { useAuthStore } from '../../stores/authStore';
import { TemplateRenderer } from '../../components/templates/TemplateRenderer';
import { useSwipeGesture } from '../../hooks/useSwipeGesture';
import { MonthYearCalendarPicker } from '../../components/common/MonthYearCalendarPicker';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const EmployeeSelfProfilePage = () => {
  const { isSuperAdmin } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('identity'); // 'identity', 'experience', 'skills', 'projects', 'social', 'impact', 'blogs'
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitNote, setSubmitNote] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const PROFILE_TABS = [
    { id: 'identity', label: 'About', icon: User },
    { id: 'experience', label: 'Work Experience', icon: Briefcase },
    { id: 'skills', label: 'Skills & Tools', icon: Layers },
    { id: 'projects', label: 'Projects', icon: Sparkles },
    { id: 'impact', label: 'Achievements', icon: Award },
    { id: 'blogs', label: 'Blogs & Thoughts', icon: Globe },
    { id: 'social', label: 'Contact Diary', icon: Phone }
  ];

  const handleNextTab = () => {
    const currentIdx = PROFILE_TABS.findIndex((t) => t.id === activeTab);
    const nextIdx = (currentIdx + 1) % PROFILE_TABS.length;
    setActiveTab(PROFILE_TABS[nextIdx].id);
  };

  const handlePrevTab = () => {
    const currentIdx = PROFILE_TABS.findIndex((t) => t.id === activeTab);
    const prevIdx = (currentIdx - 1 + PROFILE_TABS.length) % PROFILE_TABS.length;
    setActiveTab(PROFILE_TABS[prevIdx].id);
  };

  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: handleNextTab,
    onSwipeRight: handlePrevTab,
    minDistance: 45
  });

  useEffect(() => {
    const el = document.getElementById(`profile-tab-${activeTab}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeTab]);

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
    overviewStats: {
      connectionsCount: '',
      projectsCount: '',
      yearsOfExperience: '',
      servicesCount: ''
    },
    skills: [],
    experience: [],
    journey: [],
    projects: [],
    mediaGallery: [],
    blogs: [],
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

      const cleanStat = (val, legacy) => {
        if (!val || val === legacy || (legacy === '248+' && val === '248')) return '';
        return val;
      };
      const formatLocationInput = (location) => {
        if (!location) return '';
        if (typeof location === 'string') return location === '[object Object]' ? '' : location;
        if (typeof location === 'object') return [location.city, location.country].filter(Boolean).join(', ') || location.address || '';
        return '';
      };

      const mappedExperience = (draft.experience?.length ? draft.experience : published.experience || []).map(exp => {
        let fromMonth = exp.fromMonth || '';
        let fromYear = exp.fromYear || '';
        let toMonth = exp.toMonth || '';
        let toYear = exp.toYear || '';
        let from = exp.from || '';
        let to = exp.to || '';
        const isPresent = Boolean(
          exp.isCurrent ||
          (exp.to && /present|current/i.test(exp.to)) ||
          (exp.period && /present|current/i.test(exp.period)) ||
          (exp.year && /present|current/i.test(exp.year))
        );

        if (!fromYear && from) {
          const parts = from.trim().split(/\s+/);
          if (parts.length >= 2 && MONTHS.includes(parts[0])) {
            fromMonth = parts[0];
            fromYear = parts.slice(1).join(' ');
          } else {
            fromYear = from.trim();
          }
        }
        if (!toYear && to && !isPresent) {
          const parts = to.trim().split(/\s+/);
          if (parts.length >= 2 && MONTHS.includes(parts[0])) {
            toMonth = parts[0];
            toYear = parts.slice(1).join(' ');
          } else {
            toYear = to.trim();
          }
        }
        if (isPresent) {
          to = 'PRESENT';
          toYear = 'PRESENT';
          toMonth = '';
        }

        const fromFormatted = fromMonth && fromYear ? `${fromMonth} ${fromYear}` : (fromYear || from);
        const toFormatted = isPresent ? 'PRESENT' : (toMonth && toYear ? `${toMonth} ${toYear}` : (toYear || to));
        const period = fromFormatted && toFormatted ? (isPresent ? `${fromFormatted}- PRESENT` : `${fromFormatted}- ${toFormatted}`) : (fromFormatted || toFormatted || exp.period || '');

        return {
          ...exp,
          company: exp.company || exp.title || '',
          role: exp.role || exp.title || '',
          title: exp.title || exp.role || '',
          fromMonth,
          fromYear,
          from: fromFormatted,
          toMonth,
          toYear,
          to: toFormatted,
          isCurrent: isPresent,
          period
        };
      });

      setFormData({
        headline: draft.headline ?? published.headline ?? member.designation ?? '',
        bio: draft.bio ?? published.bio ?? '',
        phone: draft.phone ?? published.phone ?? '',
        workEmail: draft.workEmail ?? published.workEmail ?? '',
        location: formatLocationInput(draft.location ?? published.location ?? ''),
        avatarUrl: draft.avatarUrl ?? published.avatarUrl ?? '',
        coverUrl: draft.coverUrl ?? published.coverUrl ?? profileData.coverUrl ?? '',
        collaborationNote: draft.collaborationNote ?? published.collaborationNote ?? '',
        overviewStats: {
          connectionsCount: cleanStat(draft.overviewStats?.connectionsCount ?? published.overviewStats?.connectionsCount ?? draft.overviewStats?.connections, '248+'),
          projectsCount: cleanStat(draft.overviewStats?.projectsCount ?? published.overviewStats?.projectsCount ?? draft.overviewStats?.projects, '25+'),
          yearsOfExperience: cleanStat(draft.overviewStats?.yearsOfExperience ?? published.overviewStats?.yearsOfExperience ?? draft.overviewStats?.years, '8+'),
          servicesCount: cleanStat(draft.overviewStats?.servicesCount ?? published.overviewStats?.servicesCount ?? draft.overviewStats?.services, '5+')
        },
        skills: draft.skills?.length ? draft.skills : published.skills || [],
        experience: mappedExperience,
        journey: mappedExperience,
        projects: draft.projects?.length ? draft.projects : published.projects || [],
        mediaGallery: draft.mediaGallery?.length ? draft.mediaGallery : published.mediaGallery || [],
        blogs: draft.blogs?.length ? draft.blogs : published.blogs || [],
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
      const cleanPayload = {
        ...payload,
        journey: payload.experience || []
      };
      return await userProfileApi.updateMyDraft(cleanPayload);
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
      const payload = {
        ...formData,
        journey: formData.experience || []
      };
      // 1. Ensure latest formData is saved to draft first!
      await userProfileApi.updateMyDraft(payload);
      // 2. Submit for review with formData payload
      return await userProfileApi.submitForApproval(note, payload);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
      queryClient.invalidateQueries({ queryKey: ['my-approval-status'] });
      setIsSubmitModalOpen(false);
      setSubmitNote('');
      setToastMessage({
        type: 'success',
        text: res?.message || 'Profile changes submitted successfully!'
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
    const newItem = {
      company: '',
      title: '',
      role: '',
      fromMonth: '',
      fromYear: '',
      from: '',
      toMonth: '',
      toYear: 'PRESENT',
      to: 'PRESENT',
      period: 'PRESENT',
      location: '',
      isCurrent: true
    };
    const next = [...formData.experience, newItem];
    setFormData({
      ...formData,
      experience: next,
      journey: next
    });
  };

  const updateExperience = (index, field, value) => {
    const next = [...formData.experience];
    next[index] = { ...next[index], [field]: value };
    setFormData({ ...formData, experience: next, journey: next });
  };

  const updateExperienceFrom = (index, month, year) => {
    const next = [...formData.experience];
    const exp = next[index];
    const fromMonth = month;
    const fromYear = year;
    const fromStr = fromMonth && fromYear ? `${fromMonth} ${fromYear}` : (fromYear || fromMonth || '');
    const toStr = exp.isCurrent ? 'PRESENT' : (exp.toMonth && exp.toYear ? `${exp.toMonth} ${exp.toYear}` : (exp.toYear || exp.toMonth || exp.to || ''));
    const period = fromStr && toStr ? (exp.isCurrent ? `${fromStr}- PRESENT` : `${fromStr}- ${toStr}`) : (fromStr || toStr);
    next[index] = {
      ...exp,
      fromMonth,
      fromYear,
      from: fromStr,
      period
    };
    setFormData({ ...formData, experience: next, journey: next });
  };

  const updateExperienceTo = (index, month, year) => {
    const next = [...formData.experience];
    const exp = next[index];
    const toMonth = month;
    const toYear = year;
    const fromStr = exp.fromMonth && exp.fromYear ? `${exp.fromMonth} ${exp.fromYear}` : (exp.fromYear || exp.fromMonth || exp.from || '');
    const toStr = toMonth && toYear ? `${toMonth} ${toYear}` : (toYear || toMonth || '');
    const period = fromStr && toStr ? `${fromStr}- ${toStr}` : (fromStr || toStr);
    next[index] = {
      ...exp,
      toMonth,
      toYear,
      to: toStr,
      period,
      isCurrent: false
    };
    setFormData({ ...formData, experience: next, journey: next });
  };

  const toggleExperienceCurrent = (index, isCurrent) => {
    const next = [...formData.experience];
    const exp = next[index];
    const fromStr = exp.fromMonth && exp.fromYear ? `${exp.fromMonth} ${exp.fromYear}` : (exp.fromYear || exp.fromMonth || exp.from || '');
    const toStr = isCurrent ? 'PRESENT' : '';
    const period = fromStr && toStr ? `${fromStr}- PRESENT` : (fromStr || toStr);
    next[index] = {
      ...exp,
      isCurrent,
      toMonth: isCurrent ? '' : exp.toMonth,
      toYear: isCurrent ? 'PRESENT' : '',
      to: toStr,
      period
    };
    setFormData({ ...formData, experience: next, journey: next });
  };

  const removeExperience = (index) => {
    const next = formData.experience.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      experience: next,
      journey: next
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

  const addAchievement = () => {
    setFormData({
      ...formData,
      achievements: [
        ...formData.achievements,
        { title: '', subtitle: '', badge: 'Honors', isFeatured: true }
      ]
    });
  };

  const updateAchievement = (index, field, value) => {
    const next = [...formData.achievements];
    next[index] = { ...next[index], [field]: value };
    setFormData({ ...formData, achievements: next });
  };

  const removeAchievement = (index) => {
    setFormData({
      ...formData,
      achievements: formData.achievements.filter((_, i) => i !== index)
    });
  };

  const addJourney = () => {
    setFormData({
      ...formData,
      journey: [
        ...formData.journey,
        { year: '2024', title: '', description: '', icon: 'rocket', isVisible: true }
      ]
    });
  };

  const updateJourney = (index, field, value) => {
    const next = [...formData.journey];
    next[index] = { ...next[index], [field]: value };
    setFormData({ ...formData, journey: next });
  };

  const removeJourney = (index) => {
    setFormData({
      ...formData,
      journey: formData.journey.filter((_, i) => i !== index)
    });
  };

  const addMedia = () => {
    setFormData({
      ...formData,
      mediaGallery: [
        ...formData.mediaGallery,
        { title: '', type: 'event', url: '', thumbnailUrl: '', isVisible: true }
      ]
    });
  };

  const updateMedia = (index, field, value) => {
    const next = [...formData.mediaGallery];
    next[index] = { ...next[index], [field]: value };
    setFormData({ ...formData, mediaGallery: next });
  };

  const removeMedia = (index) => {
    setFormData({
      ...formData,
      mediaGallery: formData.mediaGallery.filter((_, i) => i !== index)
    });
  };

  const addBlog = () => {
    setFormData({
      ...formData,
      blogs: [
        ...formData.blogs,
        { title: '', excerpt: '', url: '', coverImage: '', readTime: '5 min read', isVisible: true }
      ]
    });
  };

  const updateBlog = (index, field, value) => {
    const next = [...formData.blogs];
    next[index] = { ...next[index], [field]: value };
    setFormData({ ...formData, blogs: next });
  };

  const removeBlog = (index) => {
    setFormData({
      ...formData,
      blogs: formData.blogs.filter((_, i) => i !== index)
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
    <div className="space-y-3.5 max-w-[1440px] mx-auto pb-8">
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
      <div className="bg-white rounded-2xl p-4 lg:p-5 border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-100/50 via-indigo-50/30 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none blur-2xl"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-base font-bold shadow-md shadow-purple-200 shrink-0 overflow-hidden">
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
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">{memberName}</h1>
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
              <div className="flex items-center gap-3 mt-2 max-w-xs">
                <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
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
          <div className="flex flex-wrap items-center gap-2">
            {profileData?.slug && (
              <a
                href={`/p/${profileData.slug}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-purple-600" />
                <span>View Live</span>
              </a>
            )}

            <button
              onClick={() => setIsQrModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-semibold border border-purple-200 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Share & QR</span>
            </button>

            <button
              onClick={handleSaveDraft}
              disabled={saveDraftMutation.isPending || isLocked}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold shadow-sm transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saveDraftMutation.isPending ? 'Saving...' : 'Save Draft'}</span>
            </button>

            <button
              onClick={() => setIsSubmitModalOpen(true)}
              disabled={isLocked || status === 'pending_review'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-[11px] font-semibold shadow-md shadow-purple-200 transition-all disabled:opacity-50"
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

      {/* 2. Profile editor section navigation */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-100 shadow-sm flex items-center gap-1 overflow-x-auto scrollbar-none">
        {PROFILE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`profile-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
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

      {/* 3. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Interactive Form Sections with Mobile Swipe Gesture (8 Cols) */}
        <div className="lg:col-span-8 space-y-4 touch-pan-y" {...swipeHandlers}>
          {/* Mobile Swipe Indicator Hint */}
          <div className="lg:hidden flex items-center justify-between text-[11px] text-slate-400 px-2 select-none">
            <span>← Swipe right</span>
            <span className="font-semibold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
              {PROFILE_TABS.findIndex((t) => t.id === activeTab) + 1} of {PROFILE_TABS.length}
            </span>
            <span>Swipe left →</span>
          </div>

          {/* TAB 1: IDENTITY & BIO */}
          {activeTab === 'identity' && (
            <div className="bg-white rounded-2xl p-5 lg:p-6 border border-slate-100 shadow-sm space-y-5 animate-in fade-in">
              <div>
                <h2 className="text-base font-bold text-slate-900">Basic Information</h2>
                <p className="mt-1 text-xs text-slate-400">Update your personal and professional details</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={memberName}
                    readOnly
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-600 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Designation</label>
                  <input
                    type="text"
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    placeholder="e.g. Team Member"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Company</label>
                  <input
                    type="text"
                    value="OneWinq Enterprise"
                    readOnly
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-600 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Work Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Indore, India"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Bio</label>
                <textarea
                  rows={5}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Passionate about building modern web applications and creating user-friendly digital experiences."
                  className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  About Me
                </label>
                <input
                  type="text"
                  value={formData.collaborationNote}
                  onChange={(e) => setFormData({ ...formData, collaborationNote: e.target.value })}
                  placeholder="Tell colleagues what you focus on and how you contribute."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
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
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Company</label>
                          <input
                            type="text"
                            value={exp.company || ''}
                            onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                            placeholder="e.g. NexisparkX Technologies, Onewinq"
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Role / Job Title</label>
                          <input
                            type="text"
                            value={exp.role || exp.title || ''}
                            onChange={(e) => {
                              updateExperience(idx, 'role', e.target.value);
                              updateExperience(idx, 'title', e.target.value);
                            }}
                            placeholder="e.g. Full Stack developer, Founder"
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                        {/* From Section: Month & Year Calendar */}
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">From</label>
                          <MonthYearCalendarPicker
                            month={exp.fromMonth}
                            year={exp.fromYear}
                            onChange={({ month, year }) => updateExperienceFrom(idx, month, year)}
                            placeholder="Select start date"
                          />
                        </div>

                        {/* To Section: Month & Year Calendar */}
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">To</label>
                          <MonthYearCalendarPicker
                            month={exp.toMonth}
                            year={exp.toYear}
                            disabled={exp.isCurrent}
                            disabledText="PRESENT"
                            onChange={({ month, year }) => updateExperienceTo(idx, month, year)}
                            placeholder="Select end date"
                          />
                        </div>

                        {/* Currently working here checkbox */}
                        <div className="sm:col-span-2 flex items-center gap-2 pt-1 pb-1">
                          <input
                            type="checkbox"
                            id={`curr-${idx}`}
                            checked={Boolean(exp.isCurrent || exp.to === 'PRESENT')}
                            onChange={(e) => toggleExperienceCurrent(idx, e.target.checked)}
                            className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
                          />
                          <label htmlFor={`curr-${idx}`} className="text-xs font-semibold text-purple-700 cursor-pointer flex items-center gap-1.5">
                            <span>Currently working here (PRESENT)</span>
                            {exp.isCurrent && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-700 border border-purple-200 font-bold">
                                Active
                              </span>
                            )}
                          </label>
                        </div>
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

              {/* Media & Press Gallery */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Media & Press Gallery
                    </h3>
                    <p className="text-[11px] text-slate-400">Add keynotes, panel discussions, and event media.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addMedia}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Media</span>
                  </button>
                </div>

                {formData.mediaGallery.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No custom media added yet.</p>
                ) : (
                  <div className="space-y-3">
                    {formData.mediaGallery.map((m, mIdx) => (
                      <div key={mIdx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 relative group">
                        <button
                          type="button"
                          onClick={() => removeMedia(mIdx)}
                          className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pr-6">
                          <div className="sm:col-span-2">
                            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Media Title</label>
                            <input
                              type="text"
                              value={m.title}
                              onChange={(e) => updateMedia(mIdx, 'title', e.target.value)}
                              placeholder="e.g. Global Tech Keynote"
                              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Type</label>
                            <select
                              value={m.type || 'event'}
                              onChange={(e) => updateMedia(mIdx, 'type', e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-medium"
                            >
                              <option value="event">Event</option>
                              <option value="photo">Photo</option>
                              <option value="video">Video</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Media / Image URL</label>
                          <input
                            type="text"
                            value={m.url}
                            onChange={(e) => updateMedia(mIdx, 'url', e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: BLOGS & THOUGHTS */}
          {activeTab === 'blogs' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Articles & Thought Leadership</h2>
                  <p className="text-[11px] text-slate-400">Publish articles, tech guides, and leadership perspectives.</p>
                </div>
                <button
                  type="button"
                  onClick={addBlog}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Article</span>
                </button>
              </div>

              {formData.blogs.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl">
                  <Globe className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-medium text-slate-600">No articles added yet.</p>
                  <button
                    type="button"
                    onClick={addBlog}
                    className="mt-3 text-xs text-purple-600 font-semibold hover:underline cursor-pointer"
                  >
                    + Add your first article
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.blogs.map((b, bIdx) => (
                    <div key={bIdx} className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/40 space-y-3 relative group">
                      <button
                        type="button"
                        onClick={() => removeBlog(bIdx)}
                        className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Article Title</label>
                          <input
                            type="text"
                            value={b.title}
                            onChange={(e) => updateBlog(bIdx, 'title', e.target.value)}
                            placeholder="e.g. The Future of Digital Identity"
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Read Time</label>
                          <input
                            type="text"
                            value={b.readTime || ''}
                            onChange={(e) => updateBlog(bIdx, 'readTime', e.target.value)}
                            placeholder="4 min read"
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Article URL / Link</label>
                          <input
                            type="text"
                            value={b.url || ''}
                            onChange={(e) => updateBlog(bIdx, 'url', e.target.value)}
                            placeholder="https://medium.com/... or https://..."
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Cover Image URL</label>
                          <input
                            type="text"
                            value={b.coverImage || ''}
                            onChange={(e) => updateBlog(bIdx, 'coverImage', e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Excerpt / Summary</label>
                        <textarea
                          rows={2}
                          value={b.excerpt || ''}
                          onChange={(e) => updateBlog(bIdx, 'excerpt', e.target.value)}
                          placeholder="Brief summary of the article..."
                          className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: SOCIAL & LINKS */}
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

          {/* TAB: HONORS & AWARDS */}
          {activeTab === 'impact' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6 animate-in fade-in">
              {/* Achievements & Honors Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500" /> Honors & Recognitions
                    </h3>
                    <p className="text-[11px] text-slate-400">Awards, keynote honors, and verified enterprise badges.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addAchievement}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Honor</span>
                  </button>
                </div>

                {formData.achievements.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No custom honors added yet.</p>
                ) : (
                  <div className="space-y-3">
                    {formData.achievements.map((ach, achIdx) => (
                      <div key={achIdx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 relative group">
                        <button
                          type="button"
                          onClick={() => removeAchievement(achIdx)}
                          className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pr-6">
                          <div className="sm:col-span-2">
                            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Honor / Award Title</label>
                            <input
                              type="text"
                              value={ach.title}
                              onChange={(e) => updateAchievement(achIdx, 'title', e.target.value)}
                              placeholder="e.g. Verified Organization Identity"
                              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Badge / Category</label>
                            <input
                              type="text"
                              value={ach.badge || ''}
                              onChange={(e) => updateAchievement(achIdx, 'badge', e.target.value)}
                              placeholder="Verified"
                              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Subtitle / Issuer</label>
                          <input
                            type="text"
                            value={ach.subtitle || ''}
                            onChange={(e) => updateAchievement(achIdx, 'subtitle', e.target.value)}
                            placeholder="Issued by OneWinq Enterprise"
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Digital Card Preview (4 Cols) */}
        <div className="lg:col-span-4 mt-1 lg:mt-0">
          <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl p-3 sm:p-4 border border-slate-100 shadow-sm space-y-3 lg:sticky lg:top-24 lg:max-w-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">Profile Preview</span>
              </div>
              <span className="text-[10px] text-purple-600 font-semibold bg-purple-50 px-2 py-0.5 rounded-full">
                Live Preview
              </span>
            </div>

            {/* Live Template Renderer Clean Container */}
            <div className="w-full rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
              {/* Scrollable Viewport */}
              <div className="max-h-[58vh] sm:max-h-[620px] lg:max-h-[calc(100vh-11rem)] overflow-y-auto p-1.5 sm:p-2 md:p-3 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent overscroll-contain">
                <TemplateRenderer
                  templateKey={profileData?.template?.key}
                  isCompact={true}
                  profile={{
                    ...profileData,
                    name: memberName,
                    designation,
                    headline: formData.headline || profileData?.headline,
                    bio: formData.bio || profileData?.bio,
                    avatarUrl: formData.avatarUrl || profileData?.avatarUrl,
                    coverUrl: formData.coverUrl || profileData?.coverUrl,
                    workEmail: formData.workEmail || profileData?.workEmail,
                    phone: formData.phone || profileData?.phone,
                    location: formData.location || profileData?.location || '',
                    overviewStats: profileData?.overviewStats || formData.overviewStats,
                    skills: formData.skills || profileData?.skills || [],
                    experience: formData.experience || profileData?.experience || [],
                    journey: (formData.experience && formData.experience.length > 0) ? formData.experience : (profileData?.experience || profileData?.journey || []),
                    projects: formData.projects || profileData?.projects || [],
                    impactMetrics: formData.impactMetrics || profileData?.impactMetrics || [],
                    achievements: formData.achievements || profileData?.achievements || [],
                    mediaGallery: formData.mediaGallery || profileData?.mediaGallery || [],
                    blogs: formData.blogs || profileData?.blogs || [],
                    socialLinks: formData.socialLinks || profileData?.socialLinks || [],
                    template: profileData?.template || { key: 'default' },
                    department: profileData?.memberId?.departmentId || profileData?.department || { name: 'Enterprise' }
                  }}
                  onConnectClick={() => {}}
                  onQrClick={() => setIsQrModalOpen(true)}
                  onDownloadVCard={handleDownloadVCard}
                  onShareClick={handleCopyPublicLink}
                />
              </div>
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

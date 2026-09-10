import React, { useState, useEffect } from 'react';
import { useEmployeeProfile } from '../../hooks/useEmployeeProfile';
import { useAuth } from '../../hooks/useAuth';
import { employeeProfileService } from '../../services/employeeProfileService';
import { publicProfileService } from '../../services/publicProfileService';
import { useNotification } from '../../hooks/useNotification';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  User, Briefcase, BookOpen, Award, Code2, FolderOpen, Link2,
  Save, Send, Plus, Trash2, ChevronDown, ChevronUp,
  CheckCircle2, AlertCircle, Clock, ExternalLink, QrCode,
  Copy, Download, Building2, Hash, Shield, Info
} from 'lucide-react';

/* ─── Accordion Section ─── */
const SectionBlock = ({ title, icon: Icon, children, open, onToggle }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between p-5 text-left cursor-pointer hover:bg-slate-50/50 transition"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-sm font-bold text-slate-900">{title}</span>
      </div>
      {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
    </button>
    {open && <div className="px-5 pb-5 space-y-4 border-t border-slate-50">{children}</div>}
  </div>
);

/* ─── Read-only field ─── */
const ReadOnlyField = ({ label, value, icon: Icon }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
      {Icon && <Icon className="w-3 h-3" />} {label}
    </label>
    <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
      {value || <span className="text-slate-400 font-normal italic">Not set by admin</span>}
    </div>
  </div>
);

/* ─── Approval Status Banner ─── */
const ApprovalBanner = ({ status, notes }) => {
  if (status === 'approved') return (
    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-4">
      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
      <div>
        <p className="text-sm font-bold text-emerald-800">Profile Published & Live</p>
        <p className="text-xs text-emerald-600 mt-0.5">Your profile is publicly visible. Keep it updated!</p>
      </div>
    </div>
  );
  if (status === 'pending') return (
    <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4">
      <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
      <div>
        <p className="text-sm font-bold text-amber-800">Under Admin Review</p>
        <p className="text-xs text-amber-600 mt-0.5">Editing is locked while review is pending. Check back soon.</p>
      </div>
    </div>
  );
  if (status === 'changes_requested') return (
    <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-2xl px-5 py-4">
      <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-bold text-rose-800">Changes Requested by Admin</p>
        {notes && <p className="text-xs text-rose-600 mt-1 leading-relaxed">"{notes}"</p>}
        <p className="text-[11px] text-rose-500 mt-1">Update your profile and re-submit for review.</p>
      </div>
    </div>
  );
  return null;
};

export const MyProfilePage = () => {
  const { member } = useAuth();
  const { profile, approvalStatus, loading, refetch } = useEmployeeProfile();
  const { success, error: notifyError } = useNotification();
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const [openSections, setOpenSections] = useState({
    bio: true, skills: false, experience: false,
    education: false, certifications: false, projects: false, social: false
  });

  const [form, setForm] = useState({
    headline: '', bio: '', skills: [], experience: [],
    education: [], certifications: [], projects: [], socialLinks: {}
  });

  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (profile) {
      setForm({
        headline: profile.headline || '',
        bio: profile.bio || '',
        skills: profile.skills || [],
        experience: profile.experience || [],
        education: profile.education || [],
        certifications: profile.certifications || [],
        projects: profile.projects || [],
        socialLinks: Array.isArray(profile.socialLinks)
          ? Object.fromEntries(profile.socialLinks.map((l) => [l.platform, l.url]))
          : profile.socialLinks || {}
      });
    }
  }, [profile]);

  const toggleSection = (key) => setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await employeeProfileService.updateDraftProfile(form);
      success('Profile draft saved successfully');
      refetch();
    } catch (err) {
      notifyError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!window.confirm('Submit your profile for admin review and publication?')) return;
    setSubmitting(true);
    try {
      await employeeProfileService.submitForApproval();
      success('Profile submitted for review');
      refetch();
    } catch (err) {
      notifyError(err.message || 'Failed to submit profile');
    } finally {
      setSubmitting(false);
    }
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    setForm((prev) => ({
      ...prev,
      skills: [...prev.skills, { name: newSkill.trim(), proficiency: 'Intermediate' }]
    }));
    setNewSkill('');
  };

  const removeSkill = (idx) =>
    setForm((prev) => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }));

  const copyProfileLink = async () => {
    const slug = member?.profileId?.slug;
    const url = slug ? `${window.location.origin}/p/${slug}` : window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  };

  if (loading && !profile) {
    return <div className="py-24"><LoadingSpinner message="Loading your profile..." /></div>;
  }

  const status = profile?.approvalStatus || 'draft';
  const isPending = status === 'pending';
  const slug = member?.profileId?.slug;
  const qrUrl = slug ? publicProfileService.getQrCodeUrl(slug) : null;
  const completionPct = profile?.completionPercentage ?? 0;
  const reviewerNotes = approvalStatus?.reviewerNotes || '';

  return (
    <div className="space-y-5 max-w-3xl mx-auto">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Profile</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-slate-500">Status:</p>
            <Badge
              variant={
                status === 'approved' ? 'green'
                  : status === 'pending' ? 'amber'
                    : status === 'changes_requested' ? 'red'
                      : 'default'
              }
              dot
            >
              {status === 'approved' ? 'Published'
                : status === 'pending' ? 'Under Review'
                  : status === 'changes_requested' ? 'Changes Requested'
                    : 'Draft'}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Button variant="outline" size="md" icon={Save} onClick={handleSave} isLoading={saving} disabled={isPending}>
            Save Draft
          </Button>
          {status !== 'pending' && (
            <Button variant="primary" size="md" icon={Send} onClick={handleSubmit} isLoading={submitting}>
              Submit for Review
            </Button>
          )}
        </div>
      </div>

      {/* ── Approval Banner ── */}
      <ApprovalBanner status={status} notes={reviewerNotes} />

      {/* ── Profile Header Card ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 relative">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-500 flex items-center justify-center text-white text-2xl font-extrabold overflow-hidden">
              {profile?.avatarUrl || member?.avatarUrl ? (
                <img src={profile?.avatarUrl || member?.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                member?.name?.charAt(0) || 'U'
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              {slug && (
                <a
                  href={`/p/${slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View Public Card
                </a>
              )}
              <button
                onClick={copyProfileLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
              >
                <Copy className="w-3.5 h-3.5" /> {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-extrabold text-slate-900">{member?.name || 'Your Name'}</h2>
            {status === 'approved' && (
              <CheckCircle2 className="w-4 h-4 text-indigo-600 fill-indigo-600 text-white flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-slate-500 font-medium">{member?.designation || 'Team Member'}</p>
          {form.headline && (
            <p className="text-xs text-slate-400 mt-1 italic">"{form.headline}"</p>
          )}
        </div>
      </div>

      {/* ── Completion Bar ── */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-slate-700">Profile Completion</p>
          <span className="text-xs font-bold text-indigo-600">{completionPct}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-700"
            style={{ width: `${completionPct}%` }}
          />
        </div>
        {completionPct < 70 && (
          <p className="text-[11px] text-slate-400 mt-2">
            Fill in more sections to increase your profile score.
          </p>
        )}
      </div>

      {/* ── Admin-Controlled Fields (Read-only) ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 p-5 border-b border-slate-50">
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-bold text-slate-900">Organization Information</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Managed by your administrator — read only</p>
          </div>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ReadOnlyField label="Company" value={member?.companyId?.name} icon={Building2} />
          <ReadOnlyField label="Department" value={member?.departmentId?.name} icon={Building2} />
          <ReadOnlyField label="Designation / Title" value={member?.designation} icon={Briefcase} />
          <ReadOnlyField label="Employee ID" value={member?.employeeId} icon={Hash} />
          <ReadOnlyField label="Work Email" value={member?.email} icon={User} />
          <ReadOnlyField label="Role" value={member?.roleId?.name} icon={Shield} />
        </div>
      </div>

      {/* ── Digital Card & QR ── */}
      {slug ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 p-5 border-b border-slate-50">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-slate-900">Digital Identity Card & QR</span>
          </div>
          <div className="p-5 flex flex-col sm:flex-row items-center gap-6">
            {qrUrl && (
              <div className="w-32 h-32 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src={qrUrl} alt="Profile QR Code" className="w-full h-full object-contain" />
              </div>
            )}
            <div className="flex-1 space-y-3">
              <p className="text-xs text-slate-600">
                Share your professional identity instantly. Anyone who scans this QR code will land on your public profile.
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href={`/p/${slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View Public Profile
                </a>
                {qrUrl && (
                  <a
                    href={qrUrl}
                    download={`${slug}-qr.png`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition"
                  >
                    <Download className="w-3.5 h-3.5" /> Download QR
                  </a>
                )}
                <button
                  onClick={copyProfileLink}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition"
                >
                  <Copy className="w-3.5 h-3.5" /> {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 font-mono break-all">
                {window.location.origin}/p/{slug}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 border-dashed rounded-2xl px-5 py-4">
          <Info className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <p className="text-xs text-slate-500">
            Your QR code and public profile link will appear here once your profile is approved and published by an admin.
          </p>
        </div>
      )}

      {/* ─────── EDITABLE SECTIONS ─────── */}

      {/* Headline & Bio */}
      <SectionBlock title="Headline & Bio" icon={User} open={openSections.bio} onToggle={() => toggleSection('bio')}>
        <div className="pt-4">
          <Input
            label="Professional Headline"
            placeholder="e.g. Senior Software Engineer · React & Node.js · 8+ Years"
            value={form.headline}
            onChange={(e) => setForm({ ...form, headline: e.target.value })}
            disabled={isPending}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            About / Bio
          </label>
          <textarea
            rows={5}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Describe your background, expertise, and what you're passionate about..."
            disabled={isPending}
            className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>
      </SectionBlock>

      {/* Skills */}
      <SectionBlock title="Skills" icon={Code2} open={openSections.skills} onToggle={() => toggleSection('skills')}>
        <div className="pt-4">
          <div className="flex items-center gap-2 mb-3">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              placeholder="Add a skill (e.g. React, Python, AWS)"
              disabled={isPending}
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
            />
            <Button size="sm" variant="outline" icon={Plus} onClick={addSkill} disabled={isPending}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.skills.map((skill, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1.5 rounded-full text-[11px] font-semibold"
              >
                {skill.name || skill}
                {!isPending && (
                  <button
                    type="button"
                    onClick={() => removeSkill(idx)}
                    className="text-indigo-400 hover:text-rose-500 transition cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
            {form.skills.length === 0 && (
              <p className="text-xs text-slate-400 py-2">No skills added yet. Press Enter or click Add.</p>
            )}
          </div>
        </div>
      </SectionBlock>

      {/* Experience */}
      <SectionBlock title="Experience" icon={Briefcase} open={openSections.experience} onToggle={() => toggleSection('experience')}>
        <div className="pt-4 space-y-4">
          {form.experience.length === 0 && (
            <p className="text-xs text-slate-400">No experience entries. Add your work history below.</p>
          )}
          {form.experience.map((exp, idx) => (
            <div key={idx} className="p-3 border border-slate-200 rounded-xl space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input label="Job Title" value={exp.title || ''} disabled={isPending}
                  onChange={(e) => { const u = [...form.experience]; u[idx] = { ...u[idx], title: e.target.value }; setForm({ ...form, experience: u }); }} />
                <Input label="Company" value={exp.company || ''} disabled={isPending}
                  onChange={(e) => { const u = [...form.experience]; u[idx] = { ...u[idx], company: e.target.value }; setForm({ ...form, experience: u }); }} />
                <Input label="Start Date" placeholder="e.g. Jan 2020" value={exp.startDate || ''} disabled={isPending}
                  onChange={(e) => { const u = [...form.experience]; u[idx] = { ...u[idx], startDate: e.target.value }; setForm({ ...form, experience: u }); }} />
                <Input label="End Date" placeholder="e.g. Present" value={exp.endDate || ''} disabled={isPending}
                  onChange={(e) => { const u = [...form.experience]; u[idx] = { ...u[idx], endDate: e.target.value }; setForm({ ...form, experience: u }); }} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">Description</label>
                <textarea rows={2} value={exp.description || ''} disabled={isPending}
                  onChange={(e) => { const u = [...form.experience]; u[idx] = { ...u[idx], description: e.target.value }; setForm({ ...form, experience: u }); }}
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 disabled:opacity-60" />
              </div>
              {!isPending && (
                <button type="button"
                  onClick={() => setForm({ ...form, experience: form.experience.filter((_, i) => i !== idx) })}
                  className="text-[11px] text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer">
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
              )}
            </div>
          ))}
          {!isPending && (
            <Button size="sm" variant="outline" icon={Plus}
              onClick={() => setForm({ ...form, experience: [...form.experience, { title: '', company: '', startDate: '', endDate: '', description: '' }] })}>
              Add Experience
            </Button>
          )}
        </div>
      </SectionBlock>

      {/* Education */}
      <SectionBlock title="Education" icon={BookOpen} open={openSections.education} onToggle={() => toggleSection('education')}>
        <div className="pt-4 space-y-4">
          {form.education.length === 0 && (
            <p className="text-xs text-slate-400">No education entries. Add your education history below.</p>
          )}
          {form.education.map((edu, idx) => (
            <div key={idx} className="p-3 border border-slate-200 rounded-xl space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input label="Degree / Course" value={edu.degree || ''} disabled={isPending}
                  onChange={(e) => { const u = [...form.education]; u[idx] = { ...u[idx], degree: e.target.value }; setForm({ ...form, education: u }); }} />
                <Input label="Institution" value={edu.institution || ''} disabled={isPending}
                  onChange={(e) => { const u = [...form.education]; u[idx] = { ...u[idx], institution: e.target.value }; setForm({ ...form, education: u }); }} />
                <Input label="Year" placeholder="e.g. 2018" value={edu.year || ''} disabled={isPending}
                  onChange={(e) => { const u = [...form.education]; u[idx] = { ...u[idx], year: e.target.value }; setForm({ ...form, education: u }); }} />
              </div>
              {!isPending && (
                <button type="button"
                  onClick={() => setForm({ ...form, education: form.education.filter((_, i) => i !== idx) })}
                  className="text-[11px] text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer">
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
              )}
            </div>
          ))}
          {!isPending && (
            <Button size="sm" variant="outline" icon={Plus}
              onClick={() => setForm({ ...form, education: [...form.education, { degree: '', institution: '', year: '' }] })}>
              Add Education
            </Button>
          )}
        </div>
      </SectionBlock>

      {/* Certifications */}
      <SectionBlock title="Certifications" icon={Award} open={openSections.certifications} onToggle={() => toggleSection('certifications')}>
        <div className="pt-4 space-y-4">
          {form.certifications.length === 0 && (
            <p className="text-xs text-slate-400">No certifications added yet.</p>
          )}
          {form.certifications.map((cert, idx) => (
            <div key={idx} className="p-3 border border-slate-200 rounded-xl space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input label="Certification Name" value={cert.name || ''} disabled={isPending}
                  onChange={(e) => { const u = [...form.certifications]; u[idx] = { ...u[idx], name: e.target.value }; setForm({ ...form, certifications: u }); }} />
                <Input label="Issuing Organization" value={cert.organization || ''} disabled={isPending}
                  onChange={(e) => { const u = [...form.certifications]; u[idx] = { ...u[idx], organization: e.target.value }; setForm({ ...form, certifications: u }); }} />
                <Input label="Year / Date" placeholder="e.g. 2023" value={cert.date || ''} disabled={isPending}
                  onChange={(e) => { const u = [...form.certifications]; u[idx] = { ...u[idx], date: e.target.value }; setForm({ ...form, certifications: u }); }} />
              </div>
              {!isPending && (
                <button type="button"
                  onClick={() => setForm({ ...form, certifications: form.certifications.filter((_, i) => i !== idx) })}
                  className="text-[11px] text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer">
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
              )}
            </div>
          ))}
          {!isPending && (
            <Button size="sm" variant="outline" icon={Plus}
              onClick={() => setForm({ ...form, certifications: [...form.certifications, { name: '', organization: '', date: '' }] })}>
              Add Certification
            </Button>
          )}
        </div>
      </SectionBlock>

      {/* Projects */}
      <SectionBlock title="Projects" icon={FolderOpen} open={openSections.projects} onToggle={() => toggleSection('projects')}>
        <div className="pt-4 space-y-4">
          {form.projects.length === 0 && (
            <p className="text-xs text-slate-400">No projects added. Showcase your work below.</p>
          )}
          {form.projects.map((proj, idx) => (
            <div key={idx} className="p-3 border border-slate-200 rounded-xl space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input label="Project Title" value={proj.title || ''} disabled={isPending}
                  onChange={(e) => { const u = [...form.projects]; u[idx] = { ...u[idx], title: e.target.value }; setForm({ ...form, projects: u }); }} />
                <Input label="Project Link" placeholder="https://..." value={proj.url || ''} disabled={isPending}
                  onChange={(e) => { const u = [...form.projects]; u[idx] = { ...u[idx], url: e.target.value }; setForm({ ...form, projects: u }); }} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">Description</label>
                <textarea rows={2} value={proj.description || ''} disabled={isPending}
                  onChange={(e) => { const u = [...form.projects]; u[idx] = { ...u[idx], description: e.target.value }; setForm({ ...form, projects: u }); }}
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 disabled:opacity-60" />
              </div>
              {!isPending && (
                <button type="button"
                  onClick={() => setForm({ ...form, projects: form.projects.filter((_, i) => i !== idx) })}
                  className="text-[11px] text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer">
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
              )}
            </div>
          ))}
          {!isPending && (
            <Button size="sm" variant="outline" icon={Plus}
              onClick={() => setForm({ ...form, projects: [...form.projects, { title: '', url: '', description: '' }] })}>
              Add Project
            </Button>
          )}
        </div>
      </SectionBlock>

      {/* Social Links */}
      <SectionBlock title="Social & Contact Links" icon={Link2} open={openSections.social} onToggle={() => toggleSection('social')}>
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {['linkedin', 'github', 'twitter', 'website'].map((key) => (
            <Input
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              placeholder={key === 'website' ? 'https://yoursite.com' : `https://${key}.com/yourprofile`}
              value={form.socialLinks?.[key] || ''}
              disabled={isPending}
              onChange={(e) =>
                setForm({ ...form, socialLinks: { ...form.socialLinks, [key]: e.target.value } })
              }
            />
          ))}
        </div>
      </SectionBlock>

      {/* Sticky Bottom Save Bar */}
      <div className="sticky bottom-4 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl px-5 py-4 flex items-center justify-between shadow-lg">
        <p className="text-xs text-slate-500 hidden sm:block">
          {isPending
            ? 'Profile is under review — editing is disabled.'
            : 'Save your changes, then submit for admin review.'}
        </p>
        <div className="flex items-center gap-3 ml-auto">
          <Button variant="outline" size="md" icon={Save} onClick={handleSave} isLoading={saving} disabled={isPending}>
            Save Draft
          </Button>
          {status !== 'pending' && (
            <Button variant="primary" size="md" icon={Send} onClick={handleSubmit} isLoading={submitting}>
              Submit for Review
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

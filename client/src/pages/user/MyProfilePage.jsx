import React, { useState, useEffect } from 'react';
import { useEmployeeProfile } from '../../hooks/useEmployeeProfile';
import { employeeProfileService } from '../../services/employeeProfileService';
import { useNotification } from '../../hooks/useNotification';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  User, Briefcase, BookOpen, Award, Code2, FolderOpen,
  Save, Send, Plus, Trash2, ChevronDown, ChevronUp
} from 'lucide-react';

const SectionBlock = ({ title, icon: Icon, children, open, onToggle }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
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

export const MyProfilePage = () => {
  const { profile, loading, refetch } = useEmployeeProfile();
  const { success, error: notifyError } = useNotification();
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [openSections, setOpenSections] = useState({ basic: true, bio: false, experience: false, skills: false });

  const [form, setForm] = useState({
    headline: '',
    bio: '',
    skills: [],
    experience: [],
    education: [],
    certifications: [],
    projects: [],
    socialLinks: {}
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
        socialLinks: profile.socialLinks || {}
      });
    }
  }, [profile]);

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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

  const removeSkill = (idx) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== idx)
    }));
  };

  if (loading && !profile) {
    return (
      <div className="py-24">
        <LoadingSpinner message="Loading your profile..." />
      </div>
    );
  }

  const approvalStatus = profile?.approvalStatus || 'draft';

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Profile</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-slate-500">Profile status:</p>
            <Badge variant={approvalStatus === 'approved' ? 'green' : approvalStatus === 'pending' ? 'amber' : 'default'} dot>
              {approvalStatus === 'approved' ? 'Published' : approvalStatus === 'pending' ? 'Under Review' : 'Draft'}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Button
            variant="outline"
            size="md"
            icon={Save}
            onClick={handleSave}
            isLoading={saving}
          >
            Save Draft
          </Button>
          {approvalStatus !== 'pending' && (
            <Button
              variant="primary"
              size="md"
              icon={Send}
              onClick={handleSubmit}
              isLoading={submitting}
            >
              Submit for Review
            </Button>
          )}
        </div>
      </div>

      {/* Profile Completeness */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-slate-700">Profile Completion</p>
          <span className="text-xs font-bold text-indigo-600">
            {profile?.completionPercentage ?? 0}%
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-700"
            style={{ width: `${profile?.completionPercentage ?? 0}%` }}
          />
        </div>
      </div>

      {/* Sections */}
      <SectionBlock title="Headline & Bio" icon={User} open={openSections.bio} onToggle={() => toggleSection('bio')}>
        <div className="pt-4">
          <Input
            label="Professional Headline"
            placeholder="e.g. Senior Software Engineer · React & Node.js · 8+ Years"
            value={form.headline}
            onChange={(e) => setForm({ ...form, headline: e.target.value })}
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
            className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </SectionBlock>

      <SectionBlock title="Skills" icon={Code2} open={openSections.skills} onToggle={() => toggleSection('skills')}>
        <div className="pt-4">
          <div className="flex items-center gap-2 mb-3">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              placeholder="Add a skill (e.g. React, Python, AWS)"
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button size="sm" variant="outline" icon={Plus} onClick={addSkill}>
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
                <button
                  type="button"
                  onClick={() => removeSkill(idx)}
                  className="text-indigo-400 hover:text-rose-500 transition cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
            {form.skills.length === 0 && (
              <p className="text-xs text-slate-400 py-2">No skills added yet. Press Enter or click Add.</p>
            )}
          </div>
        </div>
      </SectionBlock>

      <SectionBlock title="Experience" icon={Briefcase} open={openSections.experience} onToggle={() => toggleSection('experience')}>
        <div className="pt-4 space-y-4">
          {form.experience.length === 0 && (
            <p className="text-xs text-slate-400">No experience entries. Add your work history below.</p>
          )}
          {form.experience.map((exp, idx) => (
            <div key={idx} className="p-3 border border-slate-200 rounded-xl space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Job Title"
                  value={exp.title || ''}
                  onChange={(e) => {
                    const updated = [...form.experience];
                    updated[idx] = { ...updated[idx], title: e.target.value };
                    setForm({ ...form, experience: updated });
                  }}
                />
                <Input
                  label="Company"
                  value={exp.company || ''}
                  onChange={(e) => {
                    const updated = [...form.experience];
                    updated[idx] = { ...updated[idx], company: e.target.value };
                    setForm({ ...form, experience: updated });
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, experience: form.experience.filter((_, i) => i !== idx) })}
                className="text-[11px] text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" /> Remove
              </button>
            </div>
          ))}
          <Button
            size="sm"
            variant="outline"
            icon={Plus}
            onClick={() =>
              setForm({
                ...form,
                experience: [...form.experience, { title: '', company: '', startDate: '', endDate: '', description: '' }]
              })
            }
          >
            Add Experience
          </Button>
        </div>
      </SectionBlock>

      {/* Social Links */}
      <SectionBlock title="Social & Contact Links" icon={Award} open={openSections.basic} onToggle={() => toggleSection('basic')}>
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {['linkedin', 'github', 'twitter', 'website'].map((key) => (
            <Input
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              placeholder={`https://${key}.com/yourprofile`}
              value={form.socialLinks?.[key] || ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  socialLinks: { ...form.socialLinks, [key]: e.target.value }
                })
              }
            />
          ))}
        </div>
      </SectionBlock>
    </div>
  );
};

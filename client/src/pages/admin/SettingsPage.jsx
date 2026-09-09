import React, { useState } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { settingsService } from '../../services/settingsService';
import { useNotification } from '../../hooks/useNotification';
import {
  Settings,
  Shield,
  Bell,
  Building2,
  Globe,
  Save,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

const Section = ({ icon: Icon, title, description, children }) => (
  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card space-y-5">
    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
      <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
    </div>
    {children}
  </div>
);

const ToggleSetting = ({ label, description, value, onChange }) => (
  <div className="flex items-center justify-between gap-4">
    <div>
      <p className="text-xs font-semibold text-slate-800">{label}</p>
      {description && <p className="text-[11px] text-slate-400 mt-0.5">{description}</p>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex-shrink-0 cursor-pointer"
    >
      {value ? (
        <ToggleRight className="w-8 h-8 text-indigo-600" />
      ) : (
        <ToggleLeft className="w-8 h-8 text-slate-400" />
      )}
    </button>
  </div>
);

export const SettingsPage = () => {
  const { settings, loading, refetch } = useSettings();
  const { success, error: notifyError } = useNotification();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    profileApprovalRequired: settings?.profileApprovalRequired ?? true,
    allowPublicProfiles: settings?.allowPublicProfiles ?? true,
    allowQrCodeGeneration: settings?.allowQrCodeGeneration ?? true,
    allowVCardDownload: settings?.allowVCardDownload ?? true,
    emailNotificationsEnabled: settings?.emailNotificationsEnabled ?? true,
    invitationExpiryDays: settings?.invitationExpiryDays ?? 7,
    maxProfileSections: settings?.maxProfileSections ?? 10,
    sessionTimeoutMinutes: settings?.sessionTimeoutMinutes ?? 60,
    defaultTimezone: settings?.defaultTimezone ?? 'Asia/Kolkata',
    defaultLanguage: settings?.defaultLanguage ?? 'en'
  });

  // Sync form when settings load
  React.useEffect(() => {
    if (settings) {
      setForm({
        profileApprovalRequired: settings.profileApprovalRequired ?? true,
        allowPublicProfiles: settings.allowPublicProfiles ?? true,
        allowQrCodeGeneration: settings.allowQrCodeGeneration ?? true,
        allowVCardDownload: settings.allowVCardDownload ?? true,
        emailNotificationsEnabled: settings.emailNotificationsEnabled ?? true,
        invitationExpiryDays: settings.invitationExpiryDays ?? 7,
        maxProfileSections: settings.maxProfileSections ?? 10,
        sessionTimeoutMinutes: settings.sessionTimeoutMinutes ?? 60,
        defaultTimezone: settings.defaultTimezone ?? 'Asia/Kolkata',
        defaultLanguage: settings.defaultLanguage ?? 'en'
      });
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsService.update(form);
      success('Settings saved successfully');
      refetch();
    } catch (err) {
      notifyError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !settings) {
    return (
      <div className="py-24">
        <LoadingSpinner message="Loading organization settings..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure organization-wide platform behavior, security, and notification policies.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Save} onClick={handleSave} isLoading={saving}>
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile & Approval Settings */}
        <Section
          icon={Shield}
          title="Profile & Approval Policy"
          description="Control how employee profiles are created and reviewed."
        >
          <ToggleSetting
            label="Require Profile Approval"
            description="Newly submitted profiles require admin review before publishing."
            value={form.profileApprovalRequired}
            onChange={(v) => setForm({ ...form, profileApprovalRequired: v })}
          />
          <ToggleSetting
            label="Allow Public Profiles"
            description="Enable publicly accessible digital business card pages."
            value={form.allowPublicProfiles}
            onChange={(v) => setForm({ ...form, allowPublicProfiles: v })}
          />
          <ToggleSetting
            label="Allow QR Code Generation"
            description="Members can generate QR codes for their profile links."
            value={form.allowQrCodeGeneration}
            onChange={(v) => setForm({ ...form, allowQrCodeGeneration: v })}
          />
          <ToggleSetting
            label="Allow vCard Download"
            description="Visitors can download contact as .vcf file from public profiles."
            value={form.allowVCardDownload}
            onChange={(v) => setForm({ ...form, allowVCardDownload: v })}
          />
        </Section>

        {/* Notification Settings */}
        <Section
          icon={Bell}
          title="Notification Settings"
          description="Configure platform notification preferences."
        >
          <ToggleSetting
            label="Email Notifications"
            description="Send email alerts for approvals, invitations, and profile events."
            value={form.emailNotificationsEnabled}
            onChange={(v) => setForm({ ...form, emailNotificationsEnabled: v })}
          />
        </Section>

        {/* Platform Configuration */}
        <Section
          icon={Settings}
          title="Platform Configuration"
          description="Manage platform-wide operational settings."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Invitation Expiry (Days)"
              type="number"
              min={1}
              max={30}
              value={form.invitationExpiryDays}
              onChange={(e) =>
                setForm({ ...form, invitationExpiryDays: parseInt(e.target.value) || 7 })
              }
            />

            <Input
              label="Max Profile Sections"
              type="number"
              min={1}
              max={20}
              value={form.maxProfileSections}
              onChange={(e) =>
                setForm({ ...form, maxProfileSections: parseInt(e.target.value) || 10 })
              }
            />

            <Input
              label="Session Timeout (Minutes)"
              type="number"
              min={15}
              max={1440}
              value={form.sessionTimeoutMinutes}
              onChange={(e) =>
                setForm({ ...form, sessionTimeoutMinutes: parseInt(e.target.value) || 60 })
              }
            />
          </div>
        </Section>

        {/* Localization */}
        <Section
          icon={Globe}
          title="Localization & Region"
          description="Set default language and timezone for the platform."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                Default Timezone
              </label>
              <select
                value={form.defaultTimezone}
                onChange={(e) => setForm({ ...form, defaultTimezone: e.target.value })}
                className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Asia/Kolkata">IST – India (UTC +05:30)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">EST – New York (UTC -05:00)</option>
                <option value="America/Los_Angeles">PST – Los Angeles (UTC -08:00)</option>
                <option value="Europe/London">GMT – London (UTC +00:00)</option>
                <option value="Asia/Dubai">GST – Dubai (UTC +04:00)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                Default Language
              </label>
              <select
                value={form.defaultLanguage}
                onChange={(e) => setForm({ ...form, defaultLanguage: e.target.value })}
                className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="ar">Arabic</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
};

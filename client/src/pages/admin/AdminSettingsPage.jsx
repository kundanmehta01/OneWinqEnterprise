import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Settings,
  Shield,
  Lock,
  Globe,
  CheckCircle2,
  Save
} from 'lucide-react';
import { settingsApi } from '../../api/settingsApi';

export const AdminSettingsPage = () => {
  const queryClient = useQueryClient();
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [settings, setSettings] = useState({
    organizationName: 'OneWing Enterprise',
    timezone: 'Asia/Kolkata (IST +05:30)',
    language: 'English (US)',
    requireApproval: true,
    allowCustomThemes: true,
    defaultVisibility: 'public',
    passwordMinLength: 8,
    sessionTimeoutMinutes: 60,
    maxFailedLogins: 5,
    twoFactorEnabled: true,
    ssoEnabled: false
  });

  const { data: initialSettings } = useQuery({
    queryKey: ['admin-settings-data'],
    queryFn: async () => {
      const res = await settingsApi.getSettings();
      if (res.data?.data) {
        setSettings((prev) => ({ ...prev, ...res.data.data }));
      }
      return res.data?.data;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      return await settingsApi.updateSettings(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings-data'] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  });

  const handleSave = (e) => {
    e.preventDefault();
    saveMutation.mutate(settings);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">General Settings</h1>
          <p className="text-xs text-slate-500 mt-1">Configure organization profile, security policies, and approval workflows.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
        >
          {saveSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Saved Successfully</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{saveMutation.isPending ? 'Saving...' : 'Save Changes'}</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* 2. Regional & Platform Preferences */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">Regional & Platform Preferences</h2>
            </div>
            <a
              href="/admin/organization"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1"
            >
              <span>Manage Organization Studio →</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Default Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none bg-white"
              >
                <option value="Asia/Kolkata (IST +05:30)">Asia/Kolkata (IST +05:30)</option>
                <option value="America/New_York (EST)">America/New_York (EST)</option>
                <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Platform Language</label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none bg-white"
              >
                <option value="English (US)">English (US)</option>
                <option value="English (UK)">English (UK)</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Profile & Approval Workflow */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Shield className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">Profile Workflow & Policies</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <p className="font-bold text-slate-800">Require Super Admin approval for profile edits</p>
                <p className="text-[11px] text-slate-400">
                  When enabled, member edits to contact details and designation go to the Profile Approval queue before publishing.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.requireApproval}
                onChange={(e) => setSettings({ ...settings, requireApproval: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <p className="font-bold text-slate-800">Allow team members to customize card themes</p>
                <p className="text-[11px] text-slate-400">
                  Allow individuals to choose background gradients within company approved palette.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.allowCustomThemes}
                onChange={(e) => setSettings({ ...settings, allowCustomThemes: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* 4. Security & Access Control */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Lock className="w-4 h-4 text-purple-600" />
            <h2 className="text-sm font-bold text-slate-900">Security & Authentication</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Minimum Password Length</label>
              <input
                type="number"
                min={8}
                max={32}
                value={settings.passwordMinLength}
                onChange={(e) => setSettings({ ...settings, passwordMinLength: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Session Timeout (minutes)</label>
              <input
                type="number"
                min={15}
                max={1440}
                value={settings.sessionTimeoutMinutes}
                onChange={(e) => setSettings({ ...settings, sessionTimeoutMinutes: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Max Failed Logins Lockout</label>
              <input
                type="number"
                min={3}
                max={10}
                value={settings.maxFailedLogins}
                onChange={(e) => setSettings({ ...settings, maxFailedLogins: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <p className="font-bold text-slate-800">Enforce Two-Factor Authentication (2FA)</p>
                <p className="text-[11px] text-slate-400">Mandate OTP / Authenticator app verification for all administrators.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.twoFactorEnabled}
                onChange={(e) => setSettings({ ...settings, twoFactorEnabled: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

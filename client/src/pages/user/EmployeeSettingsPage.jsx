import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Bell,
  Shield,
  Smartphone,
  Key,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LogOut,
  Lock,
  Eye,
  Check
} from 'lucide-react';
import { userSettingsApi } from '../../api/userSettingsApi';
import { authApi } from '../../api/authApi';
import { useAuthStore } from '../../stores/authStore';

export const EmployeeSettingsPage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const [toastMessage, setToastMessage] = useState(null);

  // Form states
  const [notifications, setNotifications] = useState({
    emailOnEventInvite: true,
    emailOnConnectionRequest: true,
    emailOnCardScan: false,
    weeklyDigest: true
  });

  const [privacy, setPrivacy] = useState({
    directorySearchable: true,
    showEmailOnPublicCard: true,
    showPhoneOnPublicCard: false
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch Settings
  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['user-personal-settings'],
    queryFn: async () => {
      const res = await userSettingsApi.getSettings();
      return res?.data || res;
    }
  });

  // Fetch Active Sessions
  const { data: sessionsData } = useQuery({
    queryKey: ['user-active-sessions'],
    queryFn: async () => {
      const res = await userSettingsApi.getActiveSessions();
      return res?.data || res || [];
    }
  });

  useEffect(() => {
    if (settingsData) {
      if (settingsData.notifications) {
        setNotifications((prev) => ({ ...prev, ...settingsData.notifications }));
      }
      if (settingsData.privacy) {
        setPrivacy((prev) => ({ ...prev, ...settingsData.privacy }));
      }
    }
  }, [settingsData]);

  const showToast = (type, text) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Mutations
  const updateSettingsMutation = useMutation({
    mutationFn: (data) => userSettingsApi.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-personal-settings'] });
      showToast('success', 'Preferences saved successfully.');
    },
    onError: (err) => {
      showToast('error', err?.response?.data?.message || 'Failed to save settings.');
    }
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data) => authApi.changePassword(data),
    onSuccess: () => {
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showToast('success', 'Password updated successfully!');
    },
    onError: (err) => {
      showToast('error', err?.response?.data?.message || 'Failed to update password.');
    }
  });

  const logoutOtherSessionsMutation = useMutation({
    mutationFn: () => userSettingsApi.logoutAllOtherSessions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-active-sessions'] });
      showToast('success', 'All other active sessions terminated.');
    },
    onError: (err) => {
      showToast('error', err?.response?.data?.message || 'Failed to terminate other sessions.');
    }
  });

  const handleToggleNotification = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    updateSettingsMutation.mutate({ notifications: updated });
  };

  const handleTogglePrivacy = (key) => {
    const updated = { ...privacy, [key]: !privacy[key] };
    setPrivacy(updated);
    updateSettingsMutation.mutate({ privacy: updated });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('error', 'New passwords do not match.');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showToast('error', 'Password must be at least 6 characters long.');
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-xs text-slate-400">Loading settings...</p>
      </div>
    );
  }

  const sessionsList = Array.isArray(sessionsData)
    ? sessionsData
    : sessionsData?.sessions || [];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 animate-in fade-in duration-300">
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

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account & Preferences</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your notification alerts, profile privacy, active device sessions, and security credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* 1. Notification Preferences */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Notification Alerts</h2>
              <p className="text-[11px] text-slate-400">Configure what updates you receive via email</p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {[
              {
                key: 'emailOnEventInvite',
                label: 'Event Invitations & Updates',
                desc: 'Get notified when new company events or workshops are scheduled.'
              },
              {
                key: 'emailOnConnectionRequest',
                label: 'Connection Requests',
                desc: 'Alert when a colleague sends you a request to connect.'
              },
              {
                key: 'emailOnCardScan',
                label: 'Digital Card Scans & Views',
                desc: 'Receive alerts when someone views or saves your digital card.'
              },
              {
                key: 'weeklyDigest',
                label: 'Weekly Enterprise Digest',
                desc: 'A weekly summary of highlights, birthdays, and new colleagues.'
              }
            ].map((item) => (
              <div key={item.key} className="flex items-start justify-between gap-4 py-2 border-b border-slate-50 last:border-0">
                <div className="space-y-0.5 pr-2">
                  <p className="text-xs font-semibold text-slate-800">{item.label}</p>
                  <p className="text-[11px] text-slate-400">{item.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotification(item.key)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    notifications[item.key] ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      notifications[item.key] ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Privacy & Card Visibility */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Privacy & Directory</h2>
              <p className="text-[11px] text-slate-400">Control your visibility to colleagues and public card visitors</p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {[
              {
                key: 'directorySearchable',
                label: 'Searchable in Colleague Directory',
                desc: 'Allow colleagues in the enterprise to find your profile in Network search.'
              },
              {
                key: 'showEmailOnPublicCard',
                label: 'Show Work Email on Digital Card',
                desc: 'Display your official email address on your public smart card page.'
              },
              {
                key: 'showPhoneOnPublicCard',
                label: 'Show Contact Number on Digital Card',
                desc: 'Make your phone number visible on your public smart card page.'
              }
            ].map((item) => (
              <div key={item.key} className="flex items-start justify-between gap-4 py-2 border-b border-slate-50 last:border-0">
                <div className="space-y-0.5 pr-2">
                  <p className="text-xs font-semibold text-slate-800">{item.label}</p>
                  <p className="text-[11px] text-slate-400">{item.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleTogglePrivacy(item.key)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    privacy[item.key] ? 'bg-emerald-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      privacy[item.key] ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Change Password */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-xs">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Change Password</h2>
              <p className="text-[11px] text-slate-400">Update your login security credentials</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                {changePasswordMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* 4. Active Sessions */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Active Sessions</h2>
                <p className="text-[11px] text-slate-400">Devices currently logged into your account</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-900">Current Web Session</p>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">Active Now</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{user?.email || 'Logged in user'}</p>
                </div>
              </div>
            </div>

            {sessionsList.filter((s) => !s.isCurrent).map((s, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{s.device || 'Other Browser Session'}</p>
                    <p className="text-[10px] text-slate-400">{s.ipAddress || 'IP: Active'}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-2">
              <button
                type="button"
                onClick={() => logoutOtherSessionsMutation.mutate()}
                disabled={logoutOtherSessionsMutation.isPending}
                className="w-full py-2 px-3.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out All Other Devices</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Key,
  Smartphone,
  Eye,
  Bell,
  LogOut,
  CheckCircle2,
  Lock,
  Laptop,
  Check,
  Globe
} from 'lucide-react';
import { userSettingsService } from '../services/userSettingsService';
import { useAuth } from '../../hooks/useAuth';

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Account & Security');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Privacy toggles
  const [privacy, setPrivacy] = useState({
    cardPublic: true,
    showEmailOnCard: true,
    showPhoneOnCard: false,
    showLocationOnCard: true
  });

  // Password fields
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Sessions list
  const [sessions, setSessions] = useState([
    {
      id: 1,
      device: 'Windows 11 • Chrome 128',
      ip: '103.24.52.12',
      location: 'Indore, India',
      current: true,
      lastActive: 'Just now'
    },
    {
      id: 2,
      device: 'iPhone 15 • Safari Mobile',
      ip: '103.24.52.14',
      location: 'Indore, India',
      current: false,
      lastActive: 'Yesterday at 8:30 PM'
    }
  ]);

  const handleTogglePrivacy = (key) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
    setSuccessMsg('Privacy preference updated.');
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg('Password updated successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 600);
  };

  const handleRevokeSession = (sessionId) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    setSuccessMsg('Session terminated.');
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your account security, card privacy, and preferences.</p>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-emerald-800 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-0.5 scrollbar-none">
        {['Account & Security', 'Card Privacy & Visibility', 'Active Sessions'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 -mb-[2px] whitespace-nowrap ${
              activeTab === tab
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab: Account & Security */}
      {activeTab === 'Account & Security' && (
        <div className="space-y-6">
          {/* Change Password Card */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-gray-900">Change Password</h2>
            </div>
            <p className="text-xs text-gray-500">
              Ensure your account uses a strong password with at least 8 characters including numbers and symbols.
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwords.currentPassword}
                  onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Two-Factor Authentication Info */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-gray-900">Two-Factor Authentication (2FA)</h3>
              </div>
              <p className="text-xs text-gray-500">
                Managed centrally by OneWinq SSO & Enterprise identity directory.
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
              Active
            </span>
          </div>
        </div>
      )}

      {/* Tab: Card Privacy & Visibility */}
      {activeTab === 'Card Privacy & Visibility' && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Public Digital Card Settings</h2>
            <p className="text-xs text-gray-500 mt-0.5">Control which information appears when external users scan your QR code.</p>
          </div>

          <div className="space-y-4 divide-y divide-gray-100">
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-xs font-bold text-gray-900">Enable Public Card</p>
                <p className="text-[11px] text-gray-500">Allow scanning QR code to open your verified profile page.</p>
              </div>
              <button
                onClick={() => handleTogglePrivacy('cardPublic')}
                className={`w-10 h-6 rounded-full p-0.5 transition-colors ${
                  privacy.cardPublic ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    privacy.cardPublic ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <p className="text-xs font-bold text-gray-900">Display Email on Card</p>
                <p className="text-[11px] text-gray-500">Include your official work email on the public digital card.</p>
              </div>
              <button
                onClick={() => handleTogglePrivacy('showEmailOnCard')}
                className={`w-10 h-6 rounded-full p-0.5 transition-colors ${
                  privacy.showEmailOnCard ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    privacy.showEmailOnCard ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <p className="text-xs font-bold text-gray-900">Display Phone Number</p>
                <p className="text-[11px] text-gray-500">Show your phone number on the public card.</p>
              </div>
              <button
                onClick={() => handleTogglePrivacy('showPhoneOnCard')}
                className={`w-10 h-6 rounded-full p-0.5 transition-colors ${
                  privacy.showPhoneOnCard ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    privacy.showPhoneOnCard ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Active Sessions */}
      {activeTab === 'Active Sessions' && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-5">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Current Logged-in Devices</h2>
            <p className="text-xs text-gray-500 mt-0.5">These devices are currently authenticated to your OneWinq account.</p>
          </div>

          <div className="space-y-3">
            {sessions.map(s => (
              <div
                key={s.id}
                className="p-4 rounded-2xl border border-gray-100 bg-gray-50/60 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600">
                    <Laptop className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-gray-900">{s.device}</h4>
                      {s.current && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          This Device
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">{s.location} • {s.ip}</p>
                    <p className="text-[10px] text-gray-400">Last active: {s.lastActive}</p>
                  </div>
                </div>

                {!s.current && (
                  <button
                    onClick={() => handleRevokeSession(s.id)}
                    className="px-3 py-1.5 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { Select } from '../common/Select';

export const SecuritySettings = ({ settings = {}, onChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Security &amp; Access</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Session Timeout"
          value={settings.security?.sessionTimeoutMinutes || 60}
          onChange={(e) => onChange('security', { ...settings.security, sessionTimeoutMinutes: Number(e.target.value) })}
          options={[
            { label: '15 Minutes', value: 15 },
            { label: '30 Minutes', value: 30 },
            { label: '1 Hour', value: 60 },
            { label: '8 Hours', value: 480 },
            { label: '24 Hours', value: 1440 }
          ]}
        />
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
          <div>
            <h4 className="text-xs font-bold text-slate-800">Two-Factor Authentication</h4>
            <p className="text-[11px] text-slate-400">Enforce 2FA for all administrator roles</p>
          </div>
          <input
            type="checkbox"
            checked={Boolean(settings.security?.requireTwoFactor)}
            onChange={(e) => onChange('security', { ...settings.security, requireTwoFactor: e.target.checked })}
            className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
          />
        </div>
      </div>
    </div>
  );
};

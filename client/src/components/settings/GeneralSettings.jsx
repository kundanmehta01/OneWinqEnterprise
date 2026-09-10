import React from 'react';
import { Input } from '../common/Input';
import { Select } from '../common/Select';

export const GeneralSettings = ({ settings = {}, onChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">General Preferences</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Default Language"
          value={settings.general?.defaultLanguage || 'en'}
          onChange={(e) => onChange('general', { ...settings.general, defaultLanguage: e.target.value })}
          options={[
            { label: 'English (US)', value: 'en' },
            { label: 'Spanish', value: 'es' },
            { label: 'French', value: 'fr' }
          ]}
        />
        <Select
          label="Timezone"
          value={settings.general?.timezone || 'UTC'}
          onChange={(e) => onChange('general', { ...settings.general, timezone: e.target.value })}
          options={[
            { label: 'UTC (Coordinated Universal Time)', value: 'UTC' },
            { label: 'EST (Eastern Standard Time)', value: 'America/New_York' },
            { label: 'PST (Pacific Standard Time)', value: 'America/Los_Angeles' }
          ]}
        />
      </div>
    </div>
  );
};

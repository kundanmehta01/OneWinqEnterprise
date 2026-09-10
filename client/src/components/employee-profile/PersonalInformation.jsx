import React from 'react';
import { Input } from '../common/Input';

export const PersonalInformation = ({ form, onChange }) => {
  return (
    <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-100">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Headline & Bio</h3>
      <Input
        label="Professional Headline"
        value={form.headline || ''}
        onChange={(e) => onChange('headline', e.target.value)}
        placeholder="e.g. Senior Software Engineer"
      />
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">About / Bio</label>
        <textarea
          rows={3}
          value={form.bio || ''}
          onChange={(e) => onChange('bio', e.target.value)}
          placeholder="Professional summary..."
          className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-700"
        />
      </div>
    </div>
  );
};

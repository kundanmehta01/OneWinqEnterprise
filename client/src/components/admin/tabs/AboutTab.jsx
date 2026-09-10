import React from 'react';
import { Eye, Compass, BookOpen, Plus, Trash2 } from 'lucide-react';
import { useCompanyProfileStore } from '../../../stores/companyProfileStore';

export const AboutTab = () => {
  const { draft, updateField } = useCompanyProfileStore();
  if (!draft) return null;

  const about = draft.about || {};
  const values = about.values || [];

  const handleAddValue = () => {
    const newValues = [
      ...values,
      { title: 'New Core Value', description: 'Brief description of value.', icon: 'sparkles' },
    ];
    updateField('about.values', newValues);
  };

  const handleRemoveValue = (idx) => {
    const newValues = values.filter((_, i) => i !== idx);
    updateField('about.values', newValues);
  };

  const handleUpdateValue = (idx, field, val) => {
    const newValues = [...values];
    newValues[idx][field] = val;
    updateField('about.values', newValues);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">About Company, Vision & Values</h3>
        <p className="text-xs text-slate-500">Manage Vision, Mission, Story narrative, and Core Values.</p>
      </div>

      {/* Vision, Mission, Story Narrative Fields */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            Company Vision
          </label>
          <textarea
            rows={2}
            value={about.vision || ''}
            onChange={(e) => updateField('about.vision', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white resize-none"
            placeholder="To become the world's most trusted identity and networking platform..."
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            Company Mission
          </label>
          <textarea
            rows={2}
            value={about.mission || ''}
            onChange={(e) => updateField('about.mission', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white resize-none"
            placeholder="To empower every individual and organization with a digital identity..."
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            Founding Story
          </label>
          <textarea
            rows={2}
            value={about.story || ''}
            onChange={(e) => updateField('about.story', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white resize-none"
            placeholder="OneWing was founded with a vision to unify identity, network and business..."
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Detailed Company Bio</label>
          <textarea
            rows={3}
            value={about.aboutCompany || ''}
            onChange={(e) => updateField('about.aboutCompany', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white resize-none"
            placeholder="OneWing Technologies is on a mission to revolutionize digital presence..."
          />
        </div>
      </div>

      {/* Guiding Principles & Values List */}
      <div className="pt-3 border-t border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider">Core Values & Principles</h4>
            <p className="text-[11px] text-slate-500">Rendered in the Values section of Screen 2</p>
          </div>
          <button
            type="button"
            onClick={handleAddValue}
            className="px-2.5 py-1 rounded-lg btn-blue text-white text-[11px] font-semibold flex items-center gap-1 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Value
          </button>
        </div>

        <div className="space-y-3">
          {values.map((val, idx) => (
            <div key={idx} className="clean-card p-3 bg-white border border-slate-200 rounded-xl flex items-start gap-3 shadow-sm">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={val.title}
                  onChange={(e) => handleUpdateValue(idx, 'title', e.target.value)}
                  placeholder="Value Title (e.g. Trust & Verification)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
                <input
                  type="text"
                  value={val.description}
                  onChange={(e) => handleUpdateValue(idx, 'description', e.target.value)}
                  placeholder="Value Description"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveValue(idx)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 flex items-center justify-center shrink-0 mt-0.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

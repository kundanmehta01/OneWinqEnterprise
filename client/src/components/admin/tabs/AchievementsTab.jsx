import React from 'react';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { useCompanyProfileStore } from '../../../stores/companyProfileStore';

export const AchievementsTab = () => {
  const { draft, addArrayItem, removeArrayItem, updateArrayItem } = useCompanyProfileStore();
  if (!draft) return null;

  const achievements = draft.achievements || [];

  const handleAddAchievement = () => {
    addArrayItem('achievements', {
      title: 'New Enterprise Award / Milestone',
      subtitle: 'Award Category / Subtitle',
      description: 'Accreditation or recognition details.',
      badge: 'Award',
      year: '2024',
      metric: 'Milestone',
      icon: 'trophy',
      order: achievements.length + 1,
      isVisible: true,
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Achievements & Awards (Screen 6)</h3>
          <p className="text-xs text-slate-500">Manage certificates, ISO compliance, and startup recognition milestones.</p>
        </div>
        <button
          type="button"
          onClick={handleAddAchievement}
          className="btn-blue px-3 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Achievement
        </button>
      </div>

      <div className="space-y-3.5">
        {achievements.map((item, idx) => (
          <div key={idx} className="clean-card p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {idx + 1}
                </span>
                <span className="text-xs font-bold text-slate-900">{item.title || 'Untitled Achievement'}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                    {item.badge}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateArrayItem('achievements', idx, { isVisible: !item.isVisible })}
                  className={`p-1.5 rounded-lg transition-colors ${
                    item.isVisible !== false ? 'text-blue-600 hover:bg-blue-50' : 'text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {item.isVisible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => removeArrayItem('achievements', idx)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-600">Award / Milestone Title</label>
                <input
                  type="text"
                  value={item.title || ''}
                  onChange={(e) => updateArrayItem('achievements', idx, { title: e.target.value })}
                  placeholder="e.g. Best Startup Award 2024"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Subtitle</label>
                <input
                  type="text"
                  value={item.subtitle || ''}
                  onChange={(e) => updateArrayItem('achievements', idx, { subtitle: e.target.value })}
                  placeholder="Technology Excellence"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="space-y-1 sm:col-span-3">
                <label className="text-[11px] font-semibold text-slate-600">Description</label>
                <textarea
                  rows={2}
                  value={item.description || ''}
                  onChange={(e) => updateArrayItem('achievements', idx, { description: e.target.value })}
                  placeholder="Awarded for groundbreaking work in digital identity..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Badge Label</label>
                <input
                  type="text"
                  value={item.badge || ''}
                  onChange={(e) => updateArrayItem('achievements', idx, { badge: e.target.value })}
                  placeholder="Winner / Security"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Year</label>
                <input
                  type="text"
                  value={item.year || ''}
                  onChange={(e) => updateArrayItem('achievements', idx, { year: e.target.value })}
                  placeholder="2024"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Metric Tag</label>
                <input
                  type="text"
                  value={item.metric || ''}
                  onChange={(e) => updateArrayItem('achievements', idx, { metric: e.target.value })}
                  placeholder="Top Innovator"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

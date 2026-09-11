import React from 'react';
import { Trophy, ShieldCheck, Building2, Users2, ArrowLeft, ArrowRight, Award, Plus, Trash2 } from 'lucide-react';

export const Screen6Achievements = ({
  profile,
  onBack,
  onNavigate,
  isEditable = false,
  onAddArrayItem = () => {},
  onUpdateArrayItem = () => {},
  onRemoveArrayItem = () => {}
}) => {
  const items = profile?.achievements || [];

  const getAchievementIcon = (title = '', iconStr = '') => {
    const t = (title + iconStr).toLowerCase();
    if (t.includes('startup') || t.includes('award') || t.includes('trophy'))
      return <Trophy className="w-5 h-5 text-amber-500" />;
    if (t.includes('iso') || t.includes('security') || t.includes('shield'))
      return <ShieldCheck className="w-5 h-5 text-purple-600" />;
    if (t.includes('business') || t.includes('enterprises') || t.includes('client'))
      return <Building2 className="w-5 h-5 text-purple-600" />;
    return <Users2 className="w-5 h-5 text-purple-600" />;
  };

  const handleInquire = () => {
    if (onNavigate) {
      onNavigate(8);
    }
  };

  const handleAddAchievement = () => {
    onAddArrayItem('achievements', {
      title: 'ISO 27001 Certified Security',
      subtitle: 'Global Trust & Data Compliance',
      description: 'Enterprise grade encryption and identity protection protocols verified by global auditors.',
      badge: '2026 Milestone',
      metric: '99.99% Trust Score',
      icon: 'shield'
    });
  };

  return (
    <div className="space-y-6 pb-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-slate-50 hover:bg-purple-50 hover:text-purple-600 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight font-display">Achievements & Certifications</h3>
            <p className="text-xs text-slate-500">Corporate Milestones, Security Standards & Recognition</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditable && (
            <button
              type="button"
              onClick={handleAddAchievement}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Achievement</span>
            </button>
          )}
          <span className="px-3.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
            {items.length} {items.length === 1 ? 'Milestone' : 'Milestones'}
          </span>
        </div>
      </div>

      {/* Achievement Cards Grid */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, idx) => (
            <div
              key={item._id || idx}
              className="clean-card p-6 bg-white border border-slate-100 rounded-3xl flex items-start gap-4 group shadow-2xs relative"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 shadow-inner">
                {getAchievementIcon(item.title, item.icon)}
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  {isEditable ? (
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => onUpdateArrayItem('achievements', idx, { title: e.target.value })}
                      placeholder="Achievement Title"
                      className="w-full text-base font-bold text-slate-900 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200 focus:border-purple-500 outline-none"
                    />
                  ) : (
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors truncate">
                      {item.title}
                    </h4>
                  )}

                  {isEditable && (
                    <button
                      type="button"
                      onClick={() => onRemoveArrayItem('achievements', idx)}
                      className="text-slate-300 hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Remove Achievement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {isEditable ? (
                  <div className="space-y-1.5 pt-1">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={item.subtitle || ''}
                        onChange={(e) => onUpdateArrayItem('achievements', idx, { subtitle: e.target.value })}
                        placeholder="Subtitle / Issuer"
                        className="w-full text-xs text-purple-600 font-semibold bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 outline-none"
                      />
                      <input
                        type="text"
                        value={item.badge || ''}
                        onChange={(e) => onUpdateArrayItem('achievements', idx, { badge: e.target.value })}
                        placeholder="Badge (e.g. 2026 Award)"
                        className="w-full text-xs text-slate-700 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 outline-none"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={item.description || ''}
                      onChange={(e) => onUpdateArrayItem('achievements', idx, { description: e.target.value })}
                      placeholder="Achievement Description..."
                      className="w-full text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 outline-none resize-none"
                    />
                    <input
                      type="text"
                      value={item.metric || ''}
                      onChange={(e) => onUpdateArrayItem('achievements', idx, { metric: e.target.value })}
                      placeholder="Metric / Stat (e.g. Top 10 FinTech)"
                      className="w-full text-xs font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 outline-none"
                    />
                  </div>
                ) : (
                  <>
                    {item.subtitle && (
                      <p className="text-xs text-purple-600 font-semibold">{item.subtitle}</p>
                    )}
                    {item.description && (
                      <p className="text-xs text-slate-600 leading-relaxed pt-0.5 line-clamp-3">{item.description}</p>
                    )}
                    {item.metric && (
                      <div className="pt-1">
                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                          {item.metric}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="clean-card p-12 bg-white border border-slate-100 rounded-3xl text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-700">No achievements listed yet.</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click "+ Add Achievement" above to showcase certifications and milestones.
          </p>
        </div>
      )}

      {/* Action CTA */}
      {items.length > 0 && (
        <div className="pt-2">
          <button
            type="button"
            onClick={handleInquire}
            className="w-full py-3.5 px-6 rounded-full btn-outline-purple text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-2xs group cursor-pointer"
          >
            <span>Verify Credentials & Security Compliance</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};


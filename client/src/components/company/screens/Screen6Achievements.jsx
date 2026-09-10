import React from 'react';
import { Trophy, ShieldCheck, Building2, Users2, ArrowLeft, ArrowRight, Award } from 'lucide-react';

export const Screen6Achievements = ({ profile, onBack, onNavigate }) => {
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

  return (
    <div className="space-y-6 pb-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-slate-50 hover:bg-purple-50 hover:text-purple-600 flex items-center justify-center text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight font-display">Achievements & Certifications</h3>
            <p className="text-xs text-slate-500">Corporate Milestones, Security Standards & Recognition</p>
          </div>
        </div>
        <span className="px-3.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
          {items.length} {items.length === 1 ? 'Milestone' : 'Milestones'}
        </span>
      </div>

      {/* Achievement Cards Grid */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, idx) => (
            <div
              key={item._id || idx}
              className="clean-card clean-card-hover p-6 bg-white border border-slate-100 rounded-3xl flex items-start gap-4 group cursor-pointer shadow-2xs"
              onClick={handleInquire}
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                {getAchievementIcon(item.title, item.icon)}
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors truncate">
                    {item.title}
                  </h4>
                  {item.badge && (
                    <span className="px-3 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold shrink-0">
                      {item.badge}
                    </span>
                  )}
                </div>
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
            ISO certifications, awards, and enterprise growth milestones will appear here.
          </p>
        </div>
      )}

      {/* Action CTA */}
      {items.length > 0 && (
        <div className="pt-2">
          <button
            onClick={handleInquire}
            className="w-full py-3.5 px-6 rounded-full btn-outline-purple text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-2xs group"
          >
            <span>Verify Credentials & Security Compliance</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};

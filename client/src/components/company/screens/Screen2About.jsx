import React from 'react';
import { Eye, Compass, BookOpen, CheckCircle2, ArrowLeft } from 'lucide-react';
import { usePreviewStore } from '../../../stores/previewStore';

export const Screen2About = ({ profile, onBack }) => {
  const { aboutTab, setAboutTab } = usePreviewStore();
  const about = profile?.about || {};

  const tabs = [
    { id: 'vision', label: 'Vision', icon: Eye },
    { id: 'mission', label: 'Mission', icon: Compass },
    { id: 'story', label: 'Story', icon: BookOpen },
  ];

  const values = about.values || [];

  return (
    <div className="space-y-6 pb-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-slate-50 hover:bg-purple-50 hover:text-purple-600 flex items-center justify-center text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight font-display">
            About {profile?.name || 'Company'}
          </h3>
          <p className="text-xs text-slate-500">Corporate Identity, Mission & Principles</p>
        </div>
      </div>

      {/* Vision / Mission / Story Sub-Tabs */}
      <div className="flex bg-slate-100/80 p-1.5 rounded-full border border-slate-200/80 gap-1 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = aboutTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAboutTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content Card */}
      <div className="clean-card p-6 sm:p-8 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-3">
        {aboutTab === 'vision' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-600 text-xs font-bold uppercase tracking-wider">
              <Eye className="w-4 h-4" />
              <span>Our Vision</span>
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {about.vision || 'No vision statement configured yet.'}
            </p>
          </div>
        )}

        {aboutTab === 'mission' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-600 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Our Mission</span>
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {about.mission || 'No mission statement configured yet.'}
            </p>
          </div>
        )}

        {aboutTab === 'story' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-600 text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Our Story</span>
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {about.story || 'No corporate story configured yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Company Summary Bio */}
      {about.aboutCompany && (
        <div className="clean-card p-6 bg-white border border-slate-100 rounded-3xl space-y-1.5 shadow-2xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company Background</p>
          <p className="text-sm text-slate-700 leading-relaxed">{about.aboutCompany}</p>
        </div>
      )}

      {/* Core Values */}
      {values.length > 0 && (
        <div className="space-y-3 pt-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            Core Principles & Values
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {values.map((val, idx) => (
              <div
                key={idx}
                className="clean-card p-5 bg-white border border-slate-100 rounded-3xl flex items-start gap-4 shadow-2xs"
              >
                <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">{val.title}</h4>
                  <p className="text-xs text-slate-500 leading-snug">{val.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

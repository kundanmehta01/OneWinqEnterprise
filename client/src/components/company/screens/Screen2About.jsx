import React from 'react';
import { Eye, Compass, BookOpen, CheckCircle2, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { usePreviewStore } from '../../../stores/previewStore';

export const Screen2About = ({
  profile,
  onBack,
  isEditable = false,
  onUpdateField = () => {},
  onAddArrayItem = () => {},
  onUpdateArrayItem = () => {},
  onRemoveArrayItem = () => {}
}) => {
  const { aboutTab, setAboutTab } = usePreviewStore();
  const about = profile?.about || {};

  const tabs = [
    { id: 'vision', label: 'Vision', icon: Eye },
    { id: 'mission', label: 'Mission', icon: Compass },
    { id: 'story', label: 'Story', icon: BookOpen },
  ];

  const values = about.values || [];

  const handleAddValue = () => {
    onAddArrayItem('about.values', {
      title: 'New Value',
      description: 'Describe this principle...',
      icon: 'sparkles'
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
            <h3 className="text-xl font-bold text-slate-900 tracking-tight font-display">
              About {profile?.name || 'Company'}
            </h3>
            <p className="text-xs text-slate-500">Corporate Identity, Mission & Principles</p>
          </div>
        </div>

        {isEditable && (
          <span className="text-[10px] text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full font-bold">
            Directly Editable
          </span>
        )}
      </div>

      {/* Vision / Mission / Story Sub-Tabs */}
      <div className="flex bg-slate-100/80 p-1.5 rounded-full border border-slate-200/80 gap-1 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = aboutTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setAboutTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
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
            {isEditable ? (
              <textarea
                rows={4}
                value={about.vision || ''}
                onChange={(e) => onUpdateField('about.vision', e.target.value)}
                placeholder="State your organization's forward-looking vision statement..."
                className="w-full text-sm sm:text-base text-slate-800 leading-relaxed bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-purple-500 rounded-2xl p-4 outline-none resize-none transition-all"
              />
            ) : (
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {about.vision || 'No vision statement configured yet.'}
              </p>
            )}
          </div>
        )}

        {aboutTab === 'mission' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-600 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Our Mission</span>
            </div>
            {isEditable ? (
              <textarea
                rows={4}
                value={about.mission || ''}
                onChange={(e) => onUpdateField('about.mission', e.target.value)}
                placeholder="State your organization's core mission & everyday purpose..."
                className="w-full text-sm sm:text-base text-slate-800 leading-relaxed bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-purple-500 rounded-2xl p-4 outline-none resize-none transition-all"
              />
            ) : (
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {about.mission || 'No mission statement configured yet.'}
              </p>
            )}
          </div>
        )}

        {aboutTab === 'story' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-600 text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Our Story</span>
            </div>
            {isEditable ? (
              <textarea
                rows={4}
                value={about.story || ''}
                onChange={(e) => onUpdateField('about.story', e.target.value)}
                placeholder="Describe the founding origin story, journey, and breakthroughs..."
                className="w-full text-sm sm:text-base text-slate-800 leading-relaxed bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-purple-500 rounded-2xl p-4 outline-none resize-none transition-all"
              />
            ) : (
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {about.story || 'No corporate story configured yet.'}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Company Summary Bio */}
      <div className="clean-card p-6 bg-white border border-slate-100 rounded-3xl space-y-2 shadow-2xs">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company Background</p>
        {isEditable ? (
          <textarea
            rows={3}
            value={about.aboutCompany || ''}
            onChange={(e) => onUpdateField('about.aboutCompany', e.target.value)}
            placeholder="Comprehensive description of the enterprise..."
            className="w-full text-sm text-slate-800 leading-relaxed bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-purple-500 rounded-xl p-3 outline-none resize-none transition-all"
          />
        ) : (
          <p className="text-sm text-slate-700 leading-relaxed">{about.aboutCompany || 'No background description added.'}</p>
        )}
      </div>

      {/* Core Values */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Core Principles & Values
          </p>
          {isEditable && (
            <button
              type="button"
              onClick={handleAddValue}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Value</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {values.map((val, idx) => (
            <div
              key={idx}
              className="clean-card p-5 bg-white border border-slate-100 rounded-3xl flex items-start gap-4 shadow-2xs relative group"
            >
              <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                {isEditable ? (
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      value={val.title || ''}
                      onChange={(e) => onUpdateArrayItem('about.values', idx, { title: e.target.value })}
                      placeholder="Value Title (e.g. Integrity & Transparency)"
                      className="w-full text-sm font-bold text-slate-900 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 focus:border-purple-500 outline-none"
                    />
                    <textarea
                      rows={2}
                      value={val.description || ''}
                      onChange={(e) => onUpdateArrayItem('about.values', idx, { description: e.target.value })}
                      placeholder="Brief description of this principle..."
                      className="w-full text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 focus:border-purple-500 outline-none resize-none"
                    />
                  </div>
                ) : (
                  <>
                    <h4 className="text-sm font-bold text-slate-900">{val.title}</h4>
                    <p className="text-xs text-slate-500 leading-snug">{val.description}</p>
                  </>
                )}
              </div>

              {isEditable && (
                <button
                  type="button"
                  onClick={() => onRemoveArrayItem('about.values', idx)}
                  className="text-slate-300 hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                  title="Remove Value"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


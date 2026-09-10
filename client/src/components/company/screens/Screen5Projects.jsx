import React from 'react';
import { ArrowLeft, ArrowRight, Layers, CheckCircle2, Clock, FolderGit2 } from 'lucide-react';
import { usePreviewStore } from '../../../stores/previewStore';

export const Screen5Projects = ({ profile, onBack, onNavigate }) => {
  const { projectFilter, setProjectFilter } = usePreviewStore();
  const list = profile?.projects || [];

  const filterTabs = [
    { id: 'all', label: 'All Projects' },
    { id: 'ongoing', label: 'Active & Ongoing' },
    { id: 'completed', label: 'Delivered / Completed' },
  ];

  const filteredProjects =
    projectFilter === 'all'
      ? list
      : list.filter((p) => (p.status || 'ongoing').toLowerCase() === projectFilter);

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
            <h3 className="text-xl font-bold text-slate-900 tracking-tight font-display">Projects & Platforms</h3>
            <p className="text-xs text-slate-500">Live Deployments, Architecture & Key Milestones</p>
          </div>
        </div>
        <span className="px-3.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
          {list.length} {list.length === 1 ? 'Project' : 'Projects'}
        </span>
      </div>

      {/* Filter Tabs */}
      {list.length > 0 && (
        <div className="flex bg-slate-100/80 p-1.5 rounded-full border border-slate-200/80 gap-1 max-w-md mx-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setProjectFilter(tab.id)}
              className={`flex-1 py-2 px-4 rounded-full text-xs font-semibold transition-all ${
                projectFilter === tab.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((proj, idx) => {
            const isOngoing = (proj.status || 'ongoing').toLowerCase() === 'ongoing';
            return (
              <div
                key={proj._id || idx}
                className="clean-card clean-card-hover p-6 bg-white border border-slate-100 rounded-3xl space-y-4 group cursor-pointer shadow-2xs flex flex-col justify-between"
                onClick={handleInquire}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-purple-600 shadow-2xs overflow-hidden">
                      {proj.imageUrl ? (
                        <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                        <Layers className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                        isOngoing
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {isOngoing ? <Clock className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      <span>{isOngoing ? 'In Progress' : 'Completed'}</span>
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                      {proj.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <span>Category: <strong className="text-slate-800 font-semibold">{proj.category || 'Platform'}</strong></span>
                  <span className="text-purple-600 font-bold flex items-center gap-1 group-hover:underline">
                    Inquire Details <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="clean-card p-12 bg-white border border-slate-100 rounded-3xl text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-700">No projects listed in this category.</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Active and delivered platforms will be showcased here.
          </p>
        </div>
      )}

      {/* Action CTA */}
      {list.length > 0 && (
        <div className="pt-2">
          <button
            onClick={handleInquire}
            className="w-full py-3.5 px-6 rounded-full btn-outline-purple text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-2xs group"
          >
            <span>Discuss Custom Implementation</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};

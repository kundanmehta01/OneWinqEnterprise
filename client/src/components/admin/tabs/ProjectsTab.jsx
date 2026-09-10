import React from 'react';
import { Plus, Trash2, Eye, EyeOff, FolderGit2, ExternalLink } from 'lucide-react';
import { useCompanyProfileStore } from '../../../stores/companyProfileStore';
import { ImageUploadInput } from '../../common/ImageUploadInput';

export const ProjectsTab = () => {
  const { draft, addArrayItem, removeArrayItem, updateArrayItem } = useCompanyProfileStore();
  if (!draft) return null;

  const projects = draft.projects || [];

  const handleAddProject = () => {
    addArrayItem('projects', {
      title: 'New Enterprise Project',
      description: 'Project overview, technical architecture, and milestone accomplishments.',
      category: 'Cloud Infrastructure',
      status: 'ongoing',
      imageUrl: '',
      projectUrl: '',
      order: projects.length + 1,
      isVisible: true,
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-purple-600" /> Key Engineering Projects & Initiatives
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Showcase core platform milestones, cloud migrations, cryptography protocols, and case studies.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddProject}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 flex items-center gap-1.5 shadow-sm shadow-purple-200 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
          <FolderGit2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700">No projects added yet</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Click "Add Project" to showcase engineering initiatives.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((proj, idx) => (
            <div key={idx} className="p-5 bg-white border border-slate-200/90 rounded-2xl space-y-4 shadow-xs">
              {/* Card Header */}
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {proj.title || 'Untitled Project'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${
                      (proj.status || 'ongoing') === 'ongoing'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {(proj.status || 'ongoing').toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => updateArrayItem('projects', idx, { isVisible: !proj.isVisible })}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      proj.isVisible !== false ? 'text-purple-600 hover:bg-purple-50' : 'text-slate-400 hover:bg-slate-100'
                    }`}
                    title={proj.isVisible !== false ? 'Visible on Public Page' : 'Hidden'}
                  >
                    {proj.isVisible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeArrayItem('projects', idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-semibold text-slate-700">Project Title *</label>
                  <input
                    type="text"
                    value={proj.title || ''}
                    onChange={(e) => updateArrayItem('projects', idx, { title: e.target.value })}
                    placeholder="e.g. Distributed Microservices Migration"
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Status</label>
                  <select
                    value={proj.status || 'ongoing'}
                    onChange={(e) => updateArrayItem('projects', idx, { status: e.target.value })}
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white transition-all"
                  >
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-3">
                  <label className="text-[11px] font-semibold text-slate-700">Description</label>
                  <textarea
                    rows={2}
                    value={proj.description || ''}
                    onChange={(e) => updateArrayItem('projects', idx, { description: e.target.value })}
                    placeholder="Describe the technical architecture, problem statement, and delivered business impact."
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white resize-none transition-all"
                  />
                </div>

                <div className="space-y-1 sm:col-span-1">
                  <label className="text-[11px] font-semibold text-slate-700">Category Tag</label>
                  <input
                    type="text"
                    value={proj.category || ''}
                    onChange={(e) => updateArrayItem('projects', idx, { category: e.target.value })}
                    placeholder="e.g. Cloud Infrastructure / IoT"
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-semibold text-slate-700">Project / Case Study Link</label>
                  <input
                    type="url"
                    value={proj.projectUrl || ''}
                    onChange={(e) => updateArrayItem('projects', idx, { projectUrl: e.target.value })}
                    placeholder="https://github.com/onewinq/architecture-specs"
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white transition-all"
                  />
                </div>

                {/* Project Image Upload Input */}
                <div className="sm:col-span-3 pt-2 border-t border-slate-100">
                  <ImageUploadInput
                    label="Project Architecture Diagram or Cover Image"
                    description="Upload a high-resolution preview screenshot, architecture topology, or cover photo."
                    value={proj.imageUrl || ''}
                    onChange={(url) => updateArrayItem('projects', idx, { imageUrl: url })}
                    aspectRatio="banner"
                    entityType="company"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

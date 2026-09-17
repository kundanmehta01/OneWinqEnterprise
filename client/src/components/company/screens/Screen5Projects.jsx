import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Camera,
  X,
  UploadCloud
} from 'lucide-react';
import { usePreviewStore } from '../../../stores/previewStore';
import { ImageUploadInput } from '../../common/ImageUploadInput';

const DEFAULT_CLIENTS = [
  {
    title: 'PIMR-UG campus, Indore',
    description: 'Prestige Institute of Management and Research (UG Campus), Indore. Deployed smart digital campus identity cards, contactless NFC student verification, and unified academic event networking infrastructure.',
    category: 'Higher Education & Campus ID',
    status: 'ongoing',
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&fit=crop',
    projectUrl: '',
    order: 1,
    isVisible: true
  }
];

export const Screen5Projects = ({
  profile,
  onBack,
  onNavigate,
  isEditable = false,
  onAddArrayItem = () => {},
  onUpdateArrayItem = () => {},
  onRemoveArrayItem = () => {}
}) => {
  const { projectFilter, setProjectFilter } = usePreviewStore();
  const rawList = (profile?.projects && profile.projects.length > 0) ? profile.projects : DEFAULT_CLIENTS;
  // Keep only Prestige campus client, removing all other projects/clients
  const prestigeList = rawList.filter((p) => {
    const t = (p?.title || '').toLowerCase();
    const d = (p?.description || '').toLowerCase();
    return t.includes('prestige') || t.includes('pimr') || d.includes('prestige') || d.includes('pimr');
  });
  const list = prestigeList.length > 0 ? prestigeList : DEFAULT_CLIENTS;
  const [modalItemIdx, setModalItemIdx] = useState(null);

  const filterTabs = [
    { id: 'all', label: 'All Clients' },
    { id: 'ongoing', label: 'Active Partnerships' },
    { id: 'completed', label: 'Delivered Deployments' },
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

  const handleAddClient = () => {
    onAddArrayItem('projects', {
      title: 'New Client Partner',
      description: 'Overview of client partnership, deployment scope, and solutions delivered...',
      category: 'Enterprise Client',
      status: 'ongoing',
      imageUrl: ''
    });
  };

  const getClientIcon = (client) => {
    const text = `${client?.title || ''} ${client?.category || ''}`.toLowerCase();
    if (text.includes('campus') || text.includes('pimr') || text.includes('education') || text.includes('university') || text.includes('college')) {
      return <GraduationCap className="w-5 h-5" />;
    }
    if (text.includes('logistics') || text.includes('tech') || text.includes('health')) {
      return <Building2 className="w-5 h-5" />;
    }
    return <Briefcase className="w-5 h-5" />;
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
            <h3 className="text-xl font-bold text-slate-900 tracking-tight font-display">Our Clients</h3>
            <p className="text-xs text-slate-500">Trusted Enterprise Partners & Academic Institutions</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditable && (
            <button
              type="button"
              onClick={handleAddClient}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Client</span>
            </button>
          )}
          <span className="px-3.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
            {list.length} {list.length === 1 ? 'Client' : 'Clients'}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      {list.length > 1 && (
        <div className="flex bg-slate-100/80 p-1.5 rounded-full border border-slate-200/80 gap-1 max-w-md mx-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setProjectFilter(tab.id)}
              className={`flex-1 py-2 px-4 rounded-full text-xs font-semibold transition-all cursor-pointer ${
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

      {/* Clients Grid */}
      {filteredProjects.length > 0 ? (
        <div className={filteredProjects.length === 1 ? "grid grid-cols-1 max-w-2xl mx-auto gap-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
          {filteredProjects.map((client, idx) => {
            const isOngoing = (client.status || 'ongoing').toLowerCase() === 'ongoing';
            return (
              <div
                key={client._id || idx}
                className="clean-card p-6 bg-white border border-slate-100 rounded-3xl space-y-4 group shadow-2xs flex flex-col justify-between relative hover:border-purple-200 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="relative group/img shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 text-purple-600 shadow-2xs overflow-hidden">
                        {client.imageUrl ? (
                          <img src={client.imageUrl} alt={client.title} className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                          getClientIcon(client)
                        )}
                      </div>
                      {isEditable && (
                        <button
                          type="button"
                          onClick={() => setModalItemIdx(idx)}
                          className="absolute -bottom-1 -right-1 bg-purple-600 hover:bg-purple-700 text-white p-1 rounded-full shadow-md cursor-pointer transition-all hover:scale-110"
                          title="Upload client logo"
                        >
                          <Camera className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {isEditable ? (
                        <select
                          value={client.status || 'ongoing'}
                          onChange={(e) => onUpdateArrayItem('projects', idx, { status: e.target.value })}
                          className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 outline-none"
                        >
                          <option value="ongoing">Active Partner</option>
                          <option value="completed">Completed</option>
                        </select>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                            isOngoing
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {isOngoing ? <Clock className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                          <span>{isOngoing ? 'Active Partner' : 'Completed'}</span>
                        </span>
                      )}

                      {isEditable && (
                        <button
                          type="button"
                          onClick={() => onRemoveArrayItem('projects', idx)}
                          className="text-slate-300 hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                          title="Remove Client"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {isEditable ? (
                      <>
                        <input
                          type="text"
                          value={client.title || ''}
                          onChange={(e) => onUpdateArrayItem('projects', idx, { title: e.target.value })}
                          placeholder="Client / Institution Name"
                          className="w-full text-base font-bold text-slate-900 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200 focus:border-purple-500 outline-none"
                        />
                        <textarea
                          rows={2}
                          value={client.description || ''}
                          onChange={(e) => onUpdateArrayItem('projects', idx, { description: e.target.value })}
                          placeholder="Client Partnership Details & Scope..."
                          className="w-full text-xs text-slate-600 leading-relaxed bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200 focus:border-purple-500 outline-none resize-none"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          <input
                            type="text"
                            value={client.category || ''}
                            onChange={(e) => onUpdateArrayItem('projects', idx, { category: e.target.value })}
                            placeholder="Sector (e.g. Higher Education / Cloud)"
                            className="w-full text-[11px] text-slate-700 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 focus:border-purple-500 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setModalItemIdx(idx)}
                            className="w-full py-1 px-2.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-semibold flex items-center justify-center gap-1.5 border border-purple-200 transition-colors cursor-pointer truncate"
                          >
                            <UploadCloud className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{client.imageUrl ? 'Change Logo' : 'Upload Logo / URL'}</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h4 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                          {client.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                          {client.description}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <span>Sector: <strong className="text-slate-800 font-semibold">{client.category || 'Enterprise'}</strong></span>
                  <span
                    onClick={handleInquire}
                    className="text-purple-600 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    Partner With Us <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="clean-card p-12 bg-white border border-slate-100 rounded-3xl text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-700">No clients listed in this category.</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click "+ Add Client" above to showcase enterprise clients and institutional partners.
          </p>
        </div>
      )}

      {/* Action CTA */}
      {list.length > 0 && (
        <div className="pt-2">
          <button
            type="button"
            onClick={handleInquire}
            className="w-full py-3.5 px-6 rounded-full btn-outline-purple text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-2xs group cursor-pointer"
          >
            <span>Discuss Institutional Partnership</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* Client Photo Upload Modal */}
      {modalItemIdx !== null && list[modalItemIdx] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-purple-600" />
                Upload Client Logo / Campus Asset
              </h3>
              <button
                type="button"
                onClick={() => setModalItemIdx(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <ImageUploadInput
              label={list[modalItemIdx].title || 'Client Logo'}
              description="Choose an image from your computer/device or enter an image URL."
              value={list[modalItemIdx].imageUrl || ''}
              onChange={(val) => onUpdateArrayItem('projects', modalItemIdx, { imageUrl: val })}
              aspectRatio="square"
              entityType="company_project"
              placeholder="https://images.unsplash.com/..."
            />
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalItemIdx(null)}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



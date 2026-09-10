import React from 'react';
import { ArrowLeft, Play, Image as ImageIcon, Video, Calendar, Newspaper } from 'lucide-react';
import { usePreviewStore } from '../../../stores/previewStore';

export const Screen7Media = ({ profile, onBack }) => {
  const { mediaFilter, setMediaFilter, openMediaModal } = usePreviewStore();
  const list = profile?.mediaGallery || [];

  const filterTabs = [
    { id: 'all', label: 'All Media' },
    { id: 'photo', label: 'Photos' },
    { id: 'video', label: 'Videos' },
    { id: 'news', label: 'News & Press' },
  ];

  const filteredList =
    mediaFilter === 'all'
      ? list
      : list.filter((m) => (m.type || 'photo').toLowerCase() === mediaFilter);

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
            <h3 className="text-xl font-bold text-slate-900 tracking-tight font-display">Media & Press Gallery</h3>
            <p className="text-xs text-slate-500">Corporate Events, Product Keynotes & Press Releases</p>
          </div>
        </div>
        <span className="px-3.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
          {list.length} {list.length === 1 ? 'Asset' : 'Assets'}
        </span>
      </div>

      {/* Filter Tabs */}
      {list.length > 0 && (
        <div className="flex bg-slate-100/80 p-1.5 rounded-full border border-slate-200/80 gap-1 max-w-md mx-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMediaFilter(tab.id)}
              className={`flex-1 py-2 px-4 rounded-full text-xs font-semibold transition-all ${
                mediaFilter === tab.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Media Grid */}
      {filteredList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredList.map((item, idx) => {
            const isVideo = item.type === 'video';
            return (
              <div
                key={item._id || idx}
                onClick={() => openMediaModal(item)}
                className="clean-card clean-card-hover rounded-3xl overflow-hidden bg-white border border-slate-100 cursor-pointer flex flex-col justify-between group shadow-2xs"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.thumbnailUrl || item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>
                  )}

                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                    {isVideo ? <Video className="w-3 h-3 text-red-400" /> : <ImageIcon className="w-3 h-3 text-purple-300" />}
                    <span>{item.type}</span>
                  </span>
                </div>

                <div className="p-5 space-y-1.5">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                  )}
                  {item.date && (
                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="clean-card p-12 bg-white border border-slate-100 rounded-3xl text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Newspaper className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-700">No media found in this category.</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Event photos, keynote videos, and press releases will be shown here.
          </p>
        </div>
      )}
    </div>
  );
};

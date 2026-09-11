import React, { useState } from 'react';
import { ArrowLeft, Play, Image as ImageIcon, Video, Calendar, Newspaper, Plus, Trash2, Camera, X, UploadCloud } from 'lucide-react';
import { usePreviewStore } from '../../../stores/previewStore';
import { ImageUploadInput } from '../../common/ImageUploadInput';

export const Screen7Media = ({
  profile,
  onBack,
  isEditable = false,
  onAddArrayItem = () => {},
  onUpdateArrayItem = () => {},
  onRemoveArrayItem = () => {}
}) => {
  const { mediaFilter, setMediaFilter, openMediaModal } = usePreviewStore();
  const list = profile?.mediaGallery || [];
  const [modalItemIdx, setModalItemIdx] = useState(null);

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

  const handleAddMedia = () => {
    onAddArrayItem('mediaGallery', {
      title: 'New Media Asset',
      description: 'Keynote presentation, press release or event capture...',
      type: 'photo',
      url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
      thumbnailUrl: '',
      date: new Date().toISOString()
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
            <h3 className="text-xl font-bold text-slate-900 tracking-tight font-display">Media & Press Gallery</h3>
            <p className="text-xs text-slate-500">Corporate Events, Product Keynotes & Press Releases</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditable && (
            <button
              type="button"
              onClick={handleAddMedia}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Media</span>
            </button>
          )}
          <span className="px-3.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
            {list.length} {list.length === 1 ? 'Asset' : 'Assets'}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      {list.length > 0 && (
        <div className="flex bg-slate-100/80 p-1.5 rounded-full border border-slate-200/80 gap-1 max-w-md mx-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMediaFilter(tab.id)}
              className={`flex-1 py-2 px-4 rounded-full text-xs font-semibold transition-all cursor-pointer ${
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
                className="clean-card rounded-3xl overflow-hidden bg-white border border-slate-100 flex flex-col justify-between group shadow-2xs relative"
              >
                <div
                  onClick={() => !isEditable && openMediaModal(item)}
                  className={`relative aspect-[16/10] w-full overflow-hidden bg-slate-100 ${!isEditable ? 'cursor-pointer' : ''}`}
                >
                  <img
                    src={item.thumbnailUrl || item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {isVideo && !isEditable && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>
                  )}

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                      {isVideo ? <Video className="w-3 h-3 text-red-400" /> : <ImageIcon className="w-3 h-3 text-purple-300" />}
                      <span>{item.type}</span>
                    </span>

                    {isEditable && (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setModalItemIdx(idx)}
                          className="bg-black/70 hover:bg-purple-600 text-white p-1.5 rounded-full transition-colors cursor-pointer shadow-md"
                          title="Upload / Change Media File"
                        >
                          <Camera className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveArrayItem('mediaGallery', idx)}
                          className="bg-black/70 hover:bg-rose-600 text-white p-1.5 rounded-full transition-colors cursor-pointer shadow-md"
                          title="Remove Media"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  {isEditable ? (
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        value={item.title || ''}
                        onChange={(e) => onUpdateArrayItem('mediaGallery', idx, { title: e.target.value })}
                        placeholder="Media Title"
                        className="w-full text-sm font-bold text-slate-900 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200 outline-none"
                      />
                      <textarea
                        rows={2}
                        value={item.description || ''}
                        onChange={(e) => onUpdateArrayItem('mediaGallery', idx, { description: e.target.value })}
                        placeholder="Description / Caption..."
                        className="w-full text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200 outline-none resize-none"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <select
                          value={item.type || 'photo'}
                          onChange={(e) => onUpdateArrayItem('mediaGallery', idx, { type: e.target.value })}
                          className="w-full text-xs bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 outline-none"
                        >
                          <option value="photo">Photo</option>
                          <option value="video">Video</option>
                          <option value="news">News / Press</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => setModalItemIdx(idx)}
                          className="w-full py-1 px-2.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-semibold flex items-center justify-center gap-1.5 border border-purple-200 transition-colors cursor-pointer truncate"
                        >
                          <UploadCloud className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{item.url ? 'Change File' : 'Upload File / URL'}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
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
                    </>
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
            Click "+ Add Media" above to upload photos and keynotes to the gallery.
          </p>
        </div>
      )}

      {/* Media Upload Modal */}
      {modalItemIdx !== null && list[modalItemIdx] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-purple-600" />
                Upload Media Asset
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
              label={list[modalItemIdx].title || 'Media Asset'}
              description="Choose a photo or graphic from your computer/device or enter a URL."
              value={list[modalItemIdx].url || ''}
              onChange={(val) => onUpdateArrayItem('mediaGallery', modalItemIdx, { url: val, thumbnailUrl: val })}
              aspectRatio="banner"
              entityType="company_media"
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


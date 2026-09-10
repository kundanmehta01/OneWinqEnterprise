import React from 'react';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { useCompanyProfileStore } from '../../../stores/companyProfileStore';

export const MediaTab = () => {
  const { draft, addArrayItem, removeArrayItem, updateArrayItem } = useCompanyProfileStore();
  if (!draft) return null;

  const media = draft.mediaGallery || [];

  const handleAddMedia = () => {
    addArrayItem('mediaGallery', {
      title: 'New Media Feature / Event',
      type: 'photo',
      url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&fit=crop',
      date: new Date().toISOString().split('T')[0],
      description: 'Event or press highlight description.',
      order: media.length + 1,
      isVisible: true,
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Media & Updates Gallery (Screen 7)</h3>
          <p className="text-xs text-slate-500">Manage photos, event keynotes, videos, and press releases.</p>
        </div>
        <button
          type="button"
          onClick={handleAddMedia}
          className="btn-blue px-3 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Media Asset
        </button>
      </div>

      <div className="space-y-3.5">
        {media.map((item, idx) => (
          <div key={idx} className="clean-card p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {idx + 1}
                </span>
                <span className="text-xs font-bold text-slate-900">{item.title || 'Untitled Media'}</span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase border border-blue-200">
                  {item.type || 'photo'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateArrayItem('mediaGallery', idx, { isVisible: !item.isVisible })}
                  className={`p-1.5 rounded-lg transition-colors ${
                    item.isVisible !== false ? 'text-blue-600 hover:bg-blue-50' : 'text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {item.isVisible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => removeArrayItem('mediaGallery', idx)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-600">Media Title</label>
                <input
                  type="text"
                  value={item.title || ''}
                  onChange={(e) => updateArrayItem('mediaGallery', idx, { title: e.target.value })}
                  placeholder="e.g. OneWing Annual Tech Summit 2024"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Media Type</label>
                <select
                  value={item.type || 'photo'}
                  onChange={(e) => updateArrayItem('mediaGallery', idx, { type: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                >
                  <option value="photo">Photo / Gallery</option>
                  <option value="video">Video</option>
                  <option value="news">News / Press</option>
                  <option value="event">Event</option>
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-600">Asset URL</label>
                <input
                  type="url"
                  value={item.url || ''}
                  onChange={(e) => updateArrayItem('mediaGallery', idx, { url: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Thumbnail URL (Optional)</label>
                <input
                  type="url"
                  value={item.thumbnailUrl || ''}
                  onChange={(e) => updateArrayItem('mediaGallery', idx, { thumbnailUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="space-y-1 sm:col-span-3">
                <label className="text-[11px] font-semibold text-slate-600">Caption / Description</label>
                <textarea
                  rows={2}
                  value={item.description || ''}
                  onChange={(e) => updateArrayItem('mediaGallery', idx, { description: e.target.value })}
                  placeholder="Keynote presentation revealing next-gen identity verification hardware..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white resize-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import { X, Calendar } from 'lucide-react';
import { usePreviewStore } from '../../stores/previewStore';

export const MediaLightboxModal = () => {
  const { activeMediaModal, closeMediaModal } = usePreviewStore();

  if (!activeMediaModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xl space-y-0">
        {/* Close Button */}
        <button
          onClick={closeMediaModal}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Preview */}
        <div className="relative w-full aspect-video bg-slate-100 flex items-center justify-center overflow-hidden">
          <img
            src={activeMediaModal.url || activeMediaModal.thumbnailUrl}
            alt={activeMediaModal.title}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Info */}
        <div className="p-5 space-y-2 bg-white">
          <div className="flex items-center justify-between gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-200">
              {activeMediaModal.type}
            </span>
            {activeMediaModal.date && (
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {new Date(activeMediaModal.date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-slate-900 tracking-tight">{activeMediaModal.title}</h3>
          {activeMediaModal.description && (
            <p className="text-xs text-slate-600 leading-relaxed">{activeMediaModal.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

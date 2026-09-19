import React from 'react';
import { X, Calendar, Film, Image as ImageIcon } from 'lucide-react';
import { usePreviewStore } from '../../stores/previewStore';
import { getEmbedInfo } from '../../utils/mediaUtils';

export const MediaLightboxModal = () => {
  const { activeMediaModal, closeMediaModal } = usePreviewStore();

  if (!activeMediaModal) return null;

  const url = (activeMediaModal.url || '').trim();
  const embed = getEmbedInfo(url);
  const isVideo = activeMediaModal.type === 'video' || Boolean(embed);

  return (
    <div
      onClick={closeMediaModal}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-slate-900 rounded-3xl border border-slate-700/60 overflow-hidden shadow-2xl space-y-0 text-white"
      >
        {/* Close Button */}
        <button
          onClick={closeMediaModal}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Preview / Video Player */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
          {isVideo ? (
            embed?.type === 'youtube' || embed?.type === 'vimeo' ? (
              <iframe
                src={embed.embedUrl}
                title={activeMediaModal.title || 'Video Player'}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <video
                src={url}
                poster={activeMediaModal.thumbnailUrl || undefined}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            )
          ) : (
            <img
              src={url || activeMediaModal.thumbnailUrl}
              alt={activeMediaModal.title}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&fit=crop';
              }}
            />
          )}
        </div>

        {/* Info */}
        <div className="p-5 space-y-2 bg-slate-900 border-t border-slate-800">
          <div className="flex items-center justify-between gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider border border-purple-500/30 flex items-center gap-1.5">
              {isVideo ? <Film className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
              <span>{activeMediaModal.type || (isVideo ? 'video' : 'photo')}</span>
            </span>
            {activeMediaModal.date && (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {new Date(activeMediaModal.date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-white tracking-tight">{activeMediaModal.title}</h3>
          {activeMediaModal.description && (
            <p className="text-xs text-slate-300 leading-relaxed">{activeMediaModal.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};


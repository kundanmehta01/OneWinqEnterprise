import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Link as LinkIcon,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Film,
  Image as ImageIcon,
  Play
} from 'lucide-react';
import api from '../../api/axios';
import { getEmbedInfo, normalizeMediaUrl } from '../../utils/mediaUtils';

export { getEmbedInfo, normalizeMediaUrl };

export const MediaUploadInput = ({
  mediaType = 'photo', // 'photo' | 'video'
  forcedMode = null,   // 'upload' | 'url' | null
  label,
  description,
  value,
  onChange,
  entityType = 'profile',
  placeholder
}) => {
  const fileInputRef = useRef(null);
  
  // Detect if current value is an uploaded file or direct web URL
  const isUploaded = (val) => Boolean(val && (val.includes('/uploads/') || val.startsWith('blob:')));
  const [internalMode, setInternalMode] = useState(() => (isUploaded(value) ? 'upload' : (value ? 'url' : 'upload')));
  const mode = forcedMode || internalMode;
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const isVideo = mediaType === 'video';

  const defaultPlaceholder = isVideo
    ? 'https://youtube.com/watch?v=... or https://.../video.mp4'
    : 'https://images.unsplash.com/... or https://.../photo.png';

  const handleSwitchMode = (newMode) => {
    if (newMode === internalMode) return;
    setInternalMode(newMode);
    setUploadError('');
    // Strictly clear previous input so you cannot have both upload and URL
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    if (isVideo) {
      // 50MB max for video
      if (file.size > 50 * 1024 * 1024) {
        setUploadError('Video file size exceeds 50MB limit.');
        return;
      }
      const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
      if (!validVideoTypes.includes(file.type)) {
        setUploadError('Unsupported video format. Please upload MP4, WEBM, OGG, or MOV.');
        return;
      }
    } else {
      // 10MB max for photo
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('Image file size exceeds 10MB limit.');
        return;
      }
      const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
      if (!validImageTypes.includes(file.type)) {
        setUploadError('Unsupported image format. Please upload JPG, PNG, WEBP, or SVG.');
        return;
      }
    }

    setUploadError('');
    setIsUploading(true);
    setUploadProgress(20);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('entityType', entityType);

      setUploadProgress(50);
      const res = await api.post('/admin/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadProgress(90);

      const uploadedUrl = res?.data?.data?.url || res?.data?.url || res?.url || (typeof res === 'string' ? res : null);
      if (uploadedUrl) {
        onChange(uploadedUrl);
        setUploadProgress(100);
      } else {
        setUploadError('Server did not return a valid media URL.');
      }
    } catch (err) {
      setUploadError(err?.response?.data?.message || err?.message || 'Media upload failed.');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const embedInfo = isVideo ? getEmbedInfo(value) : null;

  return (
    <div className="space-y-2.5">
      {/* Label and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
        <div>
          {label && <label className="text-xs font-bold text-slate-800">{label}</label>}
          {description && <p className="text-[11px] text-slate-400">{description}</p>}
        </div>
        {!forcedMode && (
          <div className="inline-flex rounded-xl bg-slate-200/80 p-1 border border-slate-300/80 shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => handleSwitchMode('upload')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                mode === 'upload'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload from Device</span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('url')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                mode === 'url'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Provide Web URL</span>
            </button>
          </div>
        )}
      </div>

      {/* Validation / Helper Badge */}
      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200/60">
        <CheckCircle2 className="w-3 h-3 text-purple-600 shrink-0" />
        <span>
          {mode === 'upload'
            ? (isVideo
                ? 'Only local upload selected: Choose an MP4/WebM video from your device (up to 50MB).'
                : 'Only local upload selected: Choose an image from your device (up to 10MB).')
            : (isVideo
                ? 'Only direct URL selected: Paste a link from YouTube, Vimeo, or a direct video URL.'
                : 'Only direct URL selected: Paste an external image URL.')}
        </span>
      </div>

      {/* Mode 1: Local Upload */}
      {mode === 'upload' && (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={
              isVideo
                ? 'video/mp4,video/webm,video/ogg,video/quicktime'
                : 'image/png,image/jpeg,image/webp,image/svg+xml,image/gif'
            }
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />

          {value ? (
            /* Media Preview Card */
            <div className="relative overflow-hidden rounded-2xl border border-purple-200 bg-purple-50/40 p-3 flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
              {/* Preview Box */}
              <div className="relative overflow-hidden rounded-xl bg-slate-900 border border-slate-200 shrink-0 w-full sm:w-28 h-24 flex items-center justify-center">
                {isVideo ? (
                  embedInfo ? (
                    <iframe
                      src={embedInfo.embedUrl}
                      title="Video preview"
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  ) : (
                    <video
                      src={value}
                      className="w-full h-full object-cover"
                      muted
                      preload="metadata"
                    />
                  )
                ) : (
                  <img
                    src={value}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&fit=crop';
                    }}
                  />
                )}
                <div className="absolute top-1 right-1 bg-black/70 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                  {isVideo ? <Film className="w-2.5 h-2.5" /> : <ImageIcon className="w-2.5 h-2.5" />}
                  <span>{isVideo ? 'Video' : 'Photo'}</span>
                </div>
              </div>

              {/* Info & Action */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{isVideo ? 'Video uploaded / ready' : 'Photo uploaded / ready'}</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5" title={value}>
                  {value}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 text-[11px] font-semibold text-purple-700 bg-white hover:bg-purple-50 border border-purple-200 rounded-lg cursor-pointer"
                  >
                    Change File
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-2.5 py-1 text-[11px] font-semibold text-rose-600 bg-white hover:bg-rose-50 border border-rose-200 rounded-lg cursor-pointer flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Upload Dropzone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
                isDragging
                  ? 'border-purple-600 bg-purple-50/60 scale-[0.99]'
                  : 'border-slate-200 hover:border-purple-400 bg-slate-50/60 hover:bg-purple-50/20'
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center justify-center gap-2 py-2">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                  <p className="text-xs font-semibold text-slate-700">
                    Uploading {isVideo ? 'video asset' : 'photo asset'} to enterprise storage...
                  </p>
                  <div className="w-40 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                    {isVideo ? <Film className="w-5 h-5" /> : <UploadCloud className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Click to choose {isVideo ? 'video (MP4/WebM)' : 'photo'} from device{' '}
                      <span className="text-purple-600">or drag & drop</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {isVideo ? 'Supports MP4, WEBM, MOV up to 50MB' : 'Supports PNG, JPG, WEBP, SVG up to 10MB'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Direct Link */}
      {mode === 'url' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || defaultPlaceholder}
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 cursor-pointer"
                title="Clear"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {isVideo && (
            <p className="text-[10px] text-slate-400">
              Supports direct video URLs (.mp4/.webm) as well as YouTube or Vimeo links.
            </p>
          )}

          {/* Mini preview for URL mode */}
          {value && (
            <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 max-w-sm h-32 relative flex items-center justify-center">
              {isVideo ? (
                embedInfo ? (
                  <iframe
                    src={embedInfo.embedUrl}
                    title="Video Preview"
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <video src={value} controls className="w-full h-full object-contain" />
                )
              ) : (
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&fit=crop';
                  }}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded-xl">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
};

import React, { useState, useRef } from 'react';
import { useMedia } from '../../hooks/useMedia';
import { useNotification } from '../../hooks/useNotification';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { Pagination } from '../../components/common/Pagination';
import {
  Upload,
  Image as ImageIcon,
  FileText,
  Trash2,
  Copy,
  Check,
  Search,
  Download,
  FolderOpen,
  Filter,
  File,
  HardDrive
} from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

export const MediaPage = () => {
  const {
    assets,
    pagination,
    loading,
    uploading,
    uploadFile,
    deleteAsset,
    params,
    updateFilters,
    changePage
  } = useMedia();

  const { success, error: notifyError } = useNotification();

  const [copiedId, setCopiedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(params.search || '');
  const [selectedType, setSelectedType] = useState(params.type || '');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleCopyUrl = (id, url) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    success('Asset URL copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadFile(file);
      success(`"${file.name}" uploaded successfully`);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      notifyError(err.response?.data?.message || err.message || 'File upload failed');
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    try {
      await uploadFile(file);
      success(`"${file.name}" uploaded successfully`);
    } catch (err) {
      notifyError(err.response?.data?.message || err.message || 'File upload failed');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteAsset(id);
      success('Asset deleted successfully');
    } catch (err) {
      notifyError(err.response?.data?.message || err.message || 'Failed to delete asset');
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const filteredAssets = assets.filter((asset) => {
    if (selectedType === 'image') return asset.mimeType?.startsWith('image/');
    if (selectedType === 'document') return !asset.mimeType?.startsWith('image/');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Media Library
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Manage company logos, profile banners, avatars, and digital brand assets
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Upload}
          isLoading={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          Upload Asset
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Assets</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FolderOpen className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-2">
            {pagination.totalItems || assets.length}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Stored cloud files</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Images &amp; Badges</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-emerald-700 mt-2">
            {assets.filter((a) => a.mimeType?.startsWith('image/')).length}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, SVG, WebP</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cloud Storage</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-700 mt-2">
            {formatFileSize(assets.reduce((acc, curr) => acc + (curr.size || 0), 0))}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Enterprise CDN storage</p>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          dragActive
            ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
            : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50/50'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-2xs">
          <Upload className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-800">
          Drop files here to upload, or <span className="text-indigo-600">browse</span>
        </h4>
        <p className="text-xs text-slate-400 mt-1">
          Supports JPG, PNG, SVG, GIF, PDF, WebP up to 10MB
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search assets by filename..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200/80 bg-slate-50/50 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 mr-1" />
          {[
            { key: '', label: 'All Assets' },
            { key: 'image', label: 'Images' },
            { key: 'document', label: 'Documents' }
          ].map((type) => (
            <button
              key={type.key}
              onClick={() => setSelectedType(type.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition cursor-pointer ${
                selectedType === type.key
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-50 border border-slate-200/80 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Assets Grid */}
      {loading ? (
        <div className="py-24">
          <LoadingSpinner message="Loading media assets..." />
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 shadow-card">
          <EmptyState
            icon={FolderOpen}
            title="No media assets found"
            description="Upload images, branding assets, or documents to store them in your enterprise library."
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredAssets.map((asset) => {
            const isImage = asset.mimeType?.startsWith('image/');
            const isCopied = copiedId === asset._id;

            return (
              <div
                key={asset._id}
                className="bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group"
              >
                {/* Preview Box */}
                <div className="h-32 bg-slate-50 flex items-center justify-center p-2 relative overflow-hidden border-b border-slate-100">
                  {isImage ? (
                    <img
                      src={asset.url}
                      alt={asset.filename}
                      className="max-h-full max-w-full object-contain rounded-lg"
                    />
                  ) : (
                    <FileText className="w-10 h-10 text-slate-400" />
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleCopyUrl(asset._id, asset.url)}
                      title="Copy URL"
                      className="p-2 rounded-xl bg-white/20 text-white hover:bg-white/40 transition cursor-pointer"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noreferrer"
                      title="View file"
                      className="p-2 rounded-xl bg-white/20 text-white hover:bg-white/40 transition"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDelete(asset._id, asset.filename)}
                      title="Delete asset"
                      className="p-2 rounded-xl bg-rose-500/80 text-white hover:bg-rose-600 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <h4 className="text-xs font-bold text-slate-800 truncate" title={asset.filename}>
                    {asset.filename || 'Asset'}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                    <span>{formatFileSize(asset.size)}</span>
                    <span>{formatDate(asset.createdAt)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-end">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={changePage}
          />
        </div>
      )}
    </div>
  );
};

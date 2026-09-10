import React from 'react';
import { Upload } from 'lucide-react';

export default function MediaHeader({ file, onFileChange, onUpload, uploading }) {
  return <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
    <div><h1 className="text-2xl font-extrabold text-slate-900">Media Management</h1><p className="mt-1 text-sm text-slate-500">Manage company images and documents used across profile experiences.</p></div>
    <div className="flex flex-wrap gap-2">
      <label className="cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><input type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif,application/pdf" className="hidden" onChange={(event) => onFileChange(event.target.files?.[0] || null)} />{file?.name || 'Choose file'}</label>
      <button type="button" onClick={onUpload} disabled={!file || uploading} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"><Upload className="h-4 w-4" />{uploading ? 'Uploading...' : 'Upload media'}</button>
    </div>
  </div>;
}

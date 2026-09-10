import React from 'react';

export default function UploadMediaModal({ open, file, onFileChange, onClose, onUpload, uploading }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
      <h2 className="text-lg font-bold text-slate-900">Upload media</h2>
      <p className="mt-1 text-sm text-slate-500">Images and PDF files up to 10 MB are supported.</p>
      <input type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif,application/pdf" onChange={(event) => onFileChange(event.target.files?.[0] || null)} className="mt-5 w-full rounded-lg border border-slate-200 p-2 text-sm" />
      {file && <p className="mt-2 truncate text-xs text-slate-500">{file.name}</p>}
      <div className="mt-5 flex justify-end gap-2">
        <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
        <button type="button" onClick={onUpload} disabled={!file || uploading} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{uploading ? 'Uploading...' : 'Upload'}</button>
      </div>
    </div>
  </div>;
}

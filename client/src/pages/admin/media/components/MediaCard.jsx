import React from 'react';
import { FileText, Trash2 } from 'lucide-react';

export default function MediaCard({ asset, onDelete }) {
  const image = asset.mimeType?.startsWith('image/');
  return <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <a href={asset.url} target="_blank" rel="noreferrer" className="flex h-48 items-center justify-center bg-slate-100">
      {image ? <img src={asset.url} alt={asset.originalName || 'Media asset'} className="h-full w-full object-cover" /> : <FileText className="h-12 w-12 text-slate-400" />}
    </a>
    <div className="space-y-3 p-4"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><h3 className="truncate text-sm font-semibold text-slate-800">{asset.originalName || 'Untitled asset'}</h3><p className="mt-1 text-xs text-slate-500">{asset.mimeType || 'Unknown type'}</p></div><button type="button" onClick={() => onDelete(asset)} className="rounded-lg p-2 text-red-500 hover:bg-red-50" aria-label={`Delete ${asset.originalName || 'asset'}`}><Trash2 className="h-4 w-4" /></button></div><div className="flex justify-between text-[11px] text-slate-400"><span>{asset.entityType || 'General'}</span><span>{(Number(asset.size || 0) / 1024).toFixed(1)} KB</span></div></div>
  </article>;
}

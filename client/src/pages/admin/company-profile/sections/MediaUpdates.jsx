import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import CompanySectionCard from '../common/CompanySectionCard';

export default function MediaUpdates({ assets = [] }) {
  return <CompanySectionCard title="Media / Updates" icon={ImageIcon}>
    {assets.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{assets.slice(0, 8).map((asset) => <a key={asset._id} href={asset.url} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-xl border border-slate-200"><div className="h-24 bg-slate-100">{asset.mimeType?.startsWith('image/') ? <img src={asset.url} alt={asset.originalName} className="h-full w-full object-cover transition group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-xs font-semibold text-slate-500">Document</div>}</div><div className="truncate p-2 text-[11px] text-slate-600">{asset.originalName}</div></a>)}</div> : <p className="text-sm text-slate-500">No media updates are available. Upload assets from the Media module.</p>}
  </CompanySectionCard>;
}

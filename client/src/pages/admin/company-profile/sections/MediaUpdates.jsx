import React, { useState } from 'react';
import { CalendarDays, Image as ImageIcon } from 'lucide-react';
import CompanySectionCard from '../common/CompanySectionCard';
import { companyData } from '../companyData';

export default function MediaUpdates({ assets = [] }) {
  const [expanded, setExpanded] = useState(false);
  const items = assets.length ? assets.slice(0, 8) : ['Company event', 'Product launch', 'Team update', 'Workspace update'].map((originalName, index) => ({ _id: originalName, originalName, createdAt: new Date(Date.now() - index * 86400000).toISOString() }));
  return <CompanySectionCard id="media" title="Media / Updates" icon={ImageIcon}>
    <div className="grid grid-cols-2 gap-3">{items.slice(0, expanded ? items.length : 4).map((asset, index) => { const mediaImage = companyData.mediaImages[index % companyData.mediaImages.length]; return <div key={asset._id} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-700 bg-cover bg-center" style={{ backgroundImage: `url(${mediaImage})` }}><ImageIcon className="h-4 w-4" /></span><p className="mt-3 truncate text-xs font-semibold text-slate-800">{asset.originalName || 'Media update'}</p><p className="mt-1 flex items-center gap-1 text-[10px] text-slate-400"><CalendarDays className="h-3 w-3" />{asset.createdAt ? new Date(asset.createdAt).toLocaleDateString() : 'Recent'}</p></div>; })}</div>
    {items.length > 4 && <button type="button" onClick={() => setExpanded((value) => !value)} className="mt-4 text-xs font-bold text-indigo-600">{expanded ? 'Show less' : 'View all media'} →</button>}
  </CompanySectionCard>;
}

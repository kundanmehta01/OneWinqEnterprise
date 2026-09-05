import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import CompanySectionCard from '../common/CompanySectionCard';
import { companyData } from '../companyData';

export default function MediaUpdates({ assets = [] }) {
  const items = assets.length ? assets.slice(0, 8) : companyData.mediaImages.map((url, index) => ({ _id: url, url, originalName: ['Company event', 'Product launch', 'Team moments', 'OneWinq workspace'][index] }));
  return <CompanySectionCard id="media" title="Media / Updates" icon={ImageIcon}>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{items.map((asset) => <a key={asset._id} href={asset.url} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-xl border border-slate-200"><div className="h-24 bg-slate-100"><img src={asset.url} alt={asset.originalName} className="h-full w-full object-cover transition group-hover:scale-105" /></div><div className="truncate p-2 text-[11px] text-slate-600">{asset.originalName}</div></a>)}</div>
  </CompanySectionCard>;
}

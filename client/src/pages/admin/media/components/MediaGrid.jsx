import React from 'react';
import MediaCard from './MediaCard';

export default function MediaGrid({ assets, onDelete }) {
  if (!assets.length) return <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">No media assets match this filter.</div>;
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{assets.map((asset) => <MediaCard key={asset._id} asset={asset} onDelete={onDelete} />)}</div>;
}

import React from 'react';

export default function SectionHeader({ eyebrow, title, description }) {
  return (
    <div>
      {eyebrow && <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">{eyebrow}</div>}
      <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">{title}</h1>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
  );
}

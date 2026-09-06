import React from 'react'
import { Layers3, ShieldCheck, Sparkles } from 'lucide-react'
import CardTitle from '../common/CardTitle'

const icons = { layers: Layers3, shield: ShieldCheck, sparkles: Sparkles }

export default function Overview({ profile, data, editing, onChange }) {
  return (
    <section id="overview" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <CardTitle eyebrow={data.eyebrow} title={data.title} description={editing ? undefined : profile.description || data.description} />
      {editing ? (
        <label className="mt-5 block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Company description</span>
          <textarea
            value={profile.description || ''}
            onChange={(event) => onChange('description', event.target.value)}
            rows={4}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none ring-indigo-200 focus:border-indigo-400 focus:ring-4"
          />
        </label>
      ) : null}
      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {data.highlights.map((highlight) => {
          const Icon = icons[highlight.icon] || Sparkles
          return (
            <div key={highlight.title} className="rounded-xl bg-slate-50 p-4">
              <span className="mb-4 inline-flex rounded-lg bg-white p-2.5 text-indigo-600 shadow-sm"><Icon size={19} /></span>
              <h3 className="font-semibold text-slate-900">{highlight.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{highlight.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

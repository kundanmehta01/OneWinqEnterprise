import React from 'react'
import { Eye, Heart, ShieldCheck } from 'lucide-react'
import CardTitle from '../common/CardTitle'

const icons = { heart: Heart, shield: ShieldCheck, eye: Eye }

export default function About({ profile, data, editing, onChange }) {
  const about = profile.about || {}
  const updateAbout = (field, value) => onChange('about', { ...about, [field]: value })

  return (
    <section id="about" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <CardTitle eyebrow={data.eyebrow} title={data.title} />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_.85fr]">
        <div className="space-y-4 text-sm leading-7 text-slate-600">
          <p>{about.aboutCompany || data.paragraphs[0]}</p>
          <p>{data.paragraphs[1]}</p>
          {editing && (
            <div className="grid gap-4 pt-2">
              <label>
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">About company</span>
                <textarea value={about.aboutCompany || ''} onChange={(event) => updateAbout('aboutCompany', event.target.value)} rows={3} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none ring-indigo-200 focus:border-indigo-400 focus:ring-4" />
              </label>
            </div>
          )}
        </div>
        {data.images?.[0] && (
          <img src={data.images[0]} alt="OneWinq identity workspace" className="h-full min-h-52 w-full rounded-xl object-cover" />
        )}
        <div className="space-y-4 rounded-xl bg-indigo-50/70 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">Mission</p>
            {editing ? (
              <textarea value={about.mission || ''} onChange={(event) => updateAbout('mission', event.target.value)} rows={3} className="mt-2 w-full rounded-lg border border-indigo-100 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4" />
            ) : <p className="mt-2 text-sm leading-6 text-slate-700">{about.mission || data.mission}</p>}
          </div>
          <div className="border-t border-indigo-100 pt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">Vision</p>
            {editing ? (
              <textarea value={about.vision || ''} onChange={(event) => updateAbout('vision', event.target.value)} rows={3} className="mt-2 w-full rounded-lg border border-indigo-100 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-4" />
            ) : <p className="mt-2 text-sm leading-6 text-slate-700">{about.vision || data.vision}</p>}
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-slate-100 pt-7">
        <h3 className="font-semibold text-slate-900">What guides us</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {data.values.map((value) => {
            const Icon = icons[value.icon] || Heart
            return (
              <div key={value.title} className="flex gap-3 rounded-xl border border-slate-100 p-4">
                <span className="mt-0.5 text-indigo-600"><Icon size={19} /></span>
                <div><h4 className="text-sm font-semibold text-slate-900">{value.title}</h4><p className="mt-1 text-xs leading-5 text-slate-500">{value.description}</p></div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

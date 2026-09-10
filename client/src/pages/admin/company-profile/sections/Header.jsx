import React from 'react'
import { Check, Globe2, MapPin, Pencil, X } from 'lucide-react'

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <input
        type={type}
        value={value || ''}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-200 transition focus:border-indigo-400 focus:ring-4"
      />
    </label>
  )
}

export default function Header({
  profile,
  header,
  editing,
  saving,
  onEdit,
  onCancel,
  onSave,
  onChange,
}) {
  const website = profile.website || ''

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative h-44 overflow-hidden sm:h-56">
        <img src={header.coverImage} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />
        <div className="absolute right-5 top-5 flex gap-2">
          {!editing ? (
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-2 rounded-lg bg-white/95 px-3.5 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-white"
            >
              <Pencil size={15} />
              Edit profile
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onCancel}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-white/90 px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X size={15} />
                Cancel
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Check size={15} />
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="relative px-5 pb-6 sm:px-8">
        <img
          src={header.logo}
          alt={`${profile.name || 'Company'} logo`}
          className="-mt-12 h-24 w-24 rounded-2xl border-4 border-white bg-white shadow-md"
        />
        {!editing ? (
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{profile.name || 'OneWinq'}</h1>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{header.badge}</span>
              </div>
              <p className="mt-1 text-base text-slate-500">{profile.tagline || 'The enterprise digital identity platform'}</p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1.5"><MapPin size={15} />{profile.location?.city || 'San Francisco'}, {profile.location?.country || 'United States'}</span>
                <span className="inline-flex items-center gap-1.5"><Globe2 size={15} />{profile.industry || header.category}</span>
              </div>
            </div>
            {website && (
              <a href={website} target="_blank" rel="noreferrer" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">
                {website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </a>
            )}
          </div>
        ) : (
          <div className="mt-5 grid gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
            <Field label="Company name" value={profile.name} onChange={(value) => onChange('name', value)} />
            <Field label="Tagline" value={profile.tagline} onChange={(value) => onChange('tagline', value)} />
            <Field label="Industry" value={profile.industry} onChange={(value) => onChange('industry', value)} />
            <Field label="Website" value={profile.website} onChange={(value) => onChange('website', value)} type="url" />
          </div>
        )}
      </div>
    </section>
  )
}

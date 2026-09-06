import React from 'react'
import { AtSign, Clock3, Globe2, Mail, MapPin, Phone } from 'lucide-react'
import CardTitle from '../common/CardTitle'

function ContactField({ label, value, icon: Icon, onChange, editing, type = 'text' }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 rounded-lg bg-indigo-50 p-2 text-indigo-600"><Icon size={17} /></span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        {editing ? (
          <input type={type} value={value || ''} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm outline-none ring-indigo-200 focus:border-indigo-400 focus:ring-4" />
        ) : <p className="mt-1 truncate text-sm font-medium text-slate-700">{value || 'Not provided'}</p>}
      </div>
    </div>
  )
}

export default function ContactConnect({ profile, data, editing, onChange }) {
  const contact = profile.contact || {}
  const location = profile.location || {}
  const updateContact = (field, value) => onChange('contact', { ...contact, [field]: value })
  const updateLocation = (field, value) => onChange('location', { ...location, [field]: value })

  return (
    <section id="contact" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <CardTitle eyebrow={data.eyebrow} title={data.title} description={data.description} />
      <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-5">
          <ContactField label="Email" value={contact.email} icon={Mail} onChange={(value) => updateContact('email', value)} editing={editing} type="email" />
          <ContactField label="Phone" value={contact.phone} icon={Phone} onChange={(value) => updateContact('phone', value)} editing={editing} />
          <ContactField label="Support email" value={contact.supportEmail} icon={AtSign} onChange={(value) => updateContact('supportEmail', value)} editing={editing} type="email" />
          <div className="flex gap-3"><span className="mt-0.5 rounded-lg bg-indigo-50 p-2 text-indigo-600"><Clock3 size={17} /></span><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Office hours</p><p className="mt-1 text-sm font-medium text-slate-700">{data.officeHours}</p></div></div>
        </div>
        <div className="rounded-xl bg-slate-50 p-5">
          <div className="flex gap-3">
            <span className="mt-0.5 rounded-lg bg-white p-2 text-indigo-600 shadow-sm"><MapPin size={17} /></span>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Office</p>
              {editing ? (
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <input placeholder="Address" value={location.address || ''} onChange={(event) => updateLocation('address', event.target.value)} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-indigo-400" />
                  <input placeholder="City" value={location.city || ''} onChange={(event) => updateLocation('city', event.target.value)} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-indigo-400" />
                  <input placeholder="State" value={location.state || ''} onChange={(event) => updateLocation('state', event.target.value)} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-indigo-400" />
                  <input placeholder="Country" value={location.country || ''} onChange={(event) => updateLocation('country', event.target.value)} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-indigo-400" />
                </div>
              ) : <p className="mt-1 text-sm leading-6 text-slate-700">{[location.address, location.city, location.state, location.zipCode, location.country].filter(Boolean).join(', ') || 'Address not provided'}</p>}
            </div>
          </div>
          <div className="mt-5 border-t border-slate-200 pt-4"><a href={profile.website || '#'} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800"><Globe2 size={16} />Visit website</a></div>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-2 border-t border-slate-100 pt-6">
        {data.socialLinks.map((social) => <a key={social.label} href={social.href} target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">{social.label}</a>)}
      </div>
    </section>
  )
}

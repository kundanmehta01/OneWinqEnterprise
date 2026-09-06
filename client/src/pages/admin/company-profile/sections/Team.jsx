import React from 'react'
import { MapPin } from 'lucide-react'
import CardTitle from '../common/CardTitle'

export default function Team({ data }) {
  return (
    <section id="team" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <CardTitle eyebrow={data.eyebrow} title={data.title} />
      <div className="mt-7 grid gap-5 md:grid-cols-3">
        {data.members.map((member) => (
          <article key={member.name} className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50/60">
            <img src={member.image} alt={member.name} className="aspect-[1.35] w-full object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-slate-900">{member.name}</h3>
              <p className="mt-1 text-sm text-indigo-600">{member.role}</p>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500"><MapPin size={13} />{member.location}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

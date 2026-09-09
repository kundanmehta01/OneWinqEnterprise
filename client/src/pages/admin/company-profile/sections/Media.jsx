import React from 'react'
import { CalendarDays, Play } from 'lucide-react'
import CardTitle from '../common/CardTitle'

export default function Media({ data }) {
  return (
    <section id="media" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <CardTitle eyebrow={data.eyebrow} title={data.title} />
      <div className="mt-7 grid gap-5 md:grid-cols-3">
        {data.items.map((item) => (
          <article key={item.title} className="group overflow-hidden rounded-xl border border-slate-100">
            <div className="relative overflow-hidden">
              <img src={item.image} alt="" className="aspect-[1.55] w-full object-cover transition duration-300 group-hover:scale-105" />
              <span className="absolute bottom-3 left-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-indigo-600"><Play size={14} fill="currentColor" /></span>
            </div>
            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">{item.source}</p>
              <h3 className="mt-2 font-semibold leading-5 text-slate-900">{item.title}</h3>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500"><CalendarDays size={13} />{item.date}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

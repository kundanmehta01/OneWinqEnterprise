import React from 'react'
import { BadgeCheck, Grid2X2, Layers3, Palette } from 'lucide-react'
import CardTitle from '../common/CardTitle'

const icons = { scan: Layers3, grid: Grid2X2, badge: BadgeCheck, palette: Palette }

export default function Services({ data }) {
  return (
    <section id="services" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <CardTitle eyebrow={data.eyebrow} title={data.title} description={data.description} />
      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        {data.items.map((item, index) => {
          const Icon = icons[item.icon] || Layers3
          return (
            <div key={item.title} className="group rounded-xl border border-slate-100 p-5 transition hover:-translate-y-0.5 hover:border-indigo-100 hover:shadow-sm">
              <div className="flex items-start justify-between">
                <span className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600"><Icon size={20} /></span>
                <span className="text-xs font-semibold text-slate-300">0{index + 1}</span>
              </div>
              {item.image && <img src={item.image} alt="" className="mt-4 aspect-[2.2] w-full rounded-lg object-cover" />}
              <h3 className="mt-5 font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

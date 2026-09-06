import React from 'react'
import { Award, Rocket, Trophy, Users } from 'lucide-react'
import CardTitle from '../common/CardTitle'

const icons = { rocket: Rocket, users: Users, award: Award }

export default function Achievements({ data }) {
  return (
    <section id="achievements" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <CardTitle eyebrow={data.eyebrow} title={data.title} />
      <div className="relative mt-8 space-y-7 before:absolute before:bottom-2 before:left-[19px] before:top-2 before:w-px before:bg-indigo-100">
        {data.items.map((item) => {
          const Icon = icons[item.icon] || Trophy
          return (
            <article key={item.year} className="relative flex gap-5">
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm"><Icon size={18} /></span>
              <div className="pt-0.5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-500">{item.year}</p>
                <h3 className="mt-1 font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">{item.description}</p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

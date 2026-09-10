import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import CardTitle from '../common/CardTitle'

export default function Projects({ data }) {
  return (
    <section id="projects" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <CardTitle eyebrow={data.eyebrow} title={data.title} />
      <div className="mt-7 grid gap-5 md:grid-cols-3">
        {data.items.map((project) => (
          <article key={project.title} className="group overflow-hidden rounded-xl border border-slate-100 bg-white">
            <div className="relative overflow-hidden">
              <img src={project.image} alt="" className="aspect-[1.45] w-full object-cover transition duration-300 group-hover:scale-105" />
              <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-600">{project.year}</span>
            </div>
            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">{project.category}</p>
              <div className="mt-2 flex items-start justify-between gap-2">
                <h3 className="font-semibold text-slate-900">{project.title}</h3>
                <ArrowUpRight size={17} className="shrink-0 text-slate-400 transition group-hover:text-indigo-600" />
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-500">{project.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

import React from 'react'
import { ArrowUpRight, Briefcase, Globe2, Users } from 'lucide-react'

const icons = [Users, Briefcase, Globe2, ArrowUpRight]

export default function Stats({ stats }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = icons[index] || ArrowUpRight
        return (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <span className="rounded-lg bg-indigo-50 p-2 text-indigo-600"><Icon size={17} /></span>
              <span className="text-xs font-medium text-emerald-600">{stat.detail}</span>
            </div>
            <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{stat.value}</p>
            <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
          </div>
        )
      })}
    </div>
  )
}

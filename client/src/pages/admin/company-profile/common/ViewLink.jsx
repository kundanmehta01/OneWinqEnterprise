import React from 'react'
import { ArrowUpRight } from 'lucide-react'

export default function ViewLink({ href = '#', children = 'View all' }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
    >
      {children}
      <ArrowUpRight size={15} strokeWidth={2.2} />
    </a>
  )
}

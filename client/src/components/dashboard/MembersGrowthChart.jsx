import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function MembersGrowthChart({ trends }){
  // trends expected to be array of { date: 'YYYY-MM-DD', value: number }
  const data = Array.isArray(trends) ? trends : []

  if(!data.length) return (
    <div className="text-sm text-gray-500">No trend data available</div>
  )

  return (
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={3} dot={{ r:3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

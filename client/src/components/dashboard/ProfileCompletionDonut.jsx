import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const COLORS = ['#7c3aed', '#f59e0b', '#ef4444']

export default function ProfileCompletionDonut({ completion }){
  const completed = completion?.completed ?? 0
  const inProgress = completion?.inProgress ?? 0
  const pending = completion?.pending ?? 0
  const total = completed + inProgress + pending || 1

  const data = [
    { name: 'Completed', value: completed },
    { name: 'In Progress', value: inProgress },
    { name: 'Pending Approval', value: pending }
  ]

  return (
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={60} outerRadius={80} paddingAngle={2}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center mt-2">
        <div className="text-2xl font-semibold">{completed}</div>
        <div className="text-sm text-gray-500">Completed</div>
      </div>
    </div>
  )
}

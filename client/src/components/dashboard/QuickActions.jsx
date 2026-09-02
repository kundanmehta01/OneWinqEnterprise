import React from 'react'

export default function QuickActions(){
  const actions = ['Company Profile','Team Members','Departments','Templates','Profile Approval','Invitations']
  return (
    <div className="grid grid-cols-2 gap-2">
      {actions.map(a=> (
        <button key={a} className="p-3 bg-white rounded-md border text-left">{a}</button>
      ))}
    </div>
  )
}

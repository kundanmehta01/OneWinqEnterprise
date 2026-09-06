import React from 'react'
import Header from './sections/Header'
import Stats from './sections/Stats'

export default function Dashboard({ profile, header, stats, editing, saving, onEdit, onCancel, onSave, onChange }) {
  return (
    <div className="space-y-4">
      <Header
        profile={profile}
        header={header}
        editing={editing}
        saving={saving}
        onEdit={onEdit}
        onCancel={onCancel}
        onSave={onSave}
        onChange={onChange}
      />
      <Stats stats={stats} />
    </div>
  )
}

import React, { useState } from 'react'
import { companyProfileService } from '../../services'
import { useEffect } from 'react'

export default function CompanyProfile(){
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await companyProfileService.get()
        setCompany(data)
        setForm(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const handleSave = async () => {
    try {
      await companyProfileService.update(form)
      setCompany(form)
      setEditing(false)
    } catch (err) {
      console.error(err)
    }
  }

  if(loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="header-title">Company Profile</h1>
          <p className="text-gray-600">Manage your company information and branding.</p>
        </div>
        {!editing && <button onClick={() => setEditing(true)} className="px-4 py-2 bg-purple-600 text-white rounded-lg">Edit Profile</button>}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Company Name</label>
                <input type="text" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} disabled={!editing} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Industry</label>
                <input type="text" value={form.industry || ''} onChange={e => setForm({...form, industry: e.target.value})} disabled={!editing} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Website</label>
                <input type="text" value={form.website || ''} onChange={e => setForm({...form, website: e.target.value})} disabled={!editing} className="w-full border rounded px-3 py-2" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Members</span>
                <span className="font-semibold">126</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-600">Active</span>
                <span className="font-semibold">118</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-600">Departments</span>
                <span className="font-semibold">9</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {editing && (
        <div className="flex gap-3 justify-end">
          <button onClick={() => setEditing(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-purple-600 text-white rounded-lg">Save Changes</button>
        </div>
      )}
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { invitationService } from '../../services'

export default function Invitations(){
  const [invitations, setInvitations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await invitationService.getAll({ limit: 50 })
        setInvitations(data.invitations || data.items || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if(loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="header-title">Invitations</h1>
          <p className="text-gray-600">Invite new members to join your organization.</p>
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg">Invite Members</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border">
          <div className="text-sm text-gray-500">Pending</div>
          <div className="text-2xl font-semibold">{invitations?.filter(i => i.status === 'pending').length || 0}</div>
        </div>
        <div className="p-4 bg-white rounded-xl border">
          <div className="text-sm text-gray-500">Accepted</div>
          <div className="text-2xl font-semibold">{invitations?.filter(i => i.status === 'accepted').length || 0}</div>
        </div>
        <div className="p-4 bg-white rounded-xl border">
          <div className="text-sm text-gray-500">Expired</div>
          <div className="text-2xl font-semibold">{invitations?.filter(i => i.status === 'expired').length || 0}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Email</th>
              <th className="text-left py-3">Role</th>
              <th className="text-left py-3">Sent On</th>
              <th className="text-left py-3">Expires At</th>
              <th className="text-left py-3">Status</th>
              <th className="text-left py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invitations.map(i => (
              <tr key={i._id} className="border-b hover:bg-gray-50">
                <td className="py-3">{i.email}</td>
                <td className="py-3"><span className="px-2 py-1 bg-gray-100 text-xs rounded">{i.role}</span></td>
                <td className="py-3">{new Date(i.sentAt || i.createdAt).toLocaleDateString()}</td>
                <td className="py-3">{new Date(i.expiresAt).toLocaleDateString()}</td>
                <td className="py-3"><span className={`text-sm ${i.status === 'pending' ? 'text-yellow-600' : i.status === 'accepted' ? 'text-green-600' : 'text-gray-500'}`}>{i.status}</span></td>
                <td className="py-3"><button className="text-blue-600">Resend</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

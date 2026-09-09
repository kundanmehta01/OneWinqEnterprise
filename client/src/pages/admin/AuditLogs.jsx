import React from 'react'
import { auditLogService } from '../../services'
import { useState, useEffect } from 'react'

export default function AuditLogs(){
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await auditLogService.getAll({ limit: 50 })
        setLogs(data.items || [])
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
      <div>
        <h1 className="header-title">Audit Logs</h1>
        <p className="text-gray-600">Track all administrative and user activities in your organization.</p>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">User</th>
              <th className="text-left py-3">Action</th>
              <th className="text-left py-3">Resource</th>
              <th className="text-left py-3">Change</th>
              <th className="text-left py-3">Timestamp</th>
              <th className="text-left py-3">IP Address</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="py-3">{log.actorId?.email || 'System'}</td>
                <td className="py-3"><span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{log.action}</span></td>
                <td className="py-3">{log.resource}</td>
                <td className="py-3 text-xs text-gray-500">{log.changes?.length ?? 0} fields</td>
                <td className="py-3">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="py-3 text-xs text-gray-500">{log.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

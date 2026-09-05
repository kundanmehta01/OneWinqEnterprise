import React, { useEffect, useMemo, useState } from 'react'
import { permissionService, roleService } from '../../services'

export default function RolesPermissions() {
  const [roles, setRoles] = useState([])
  const [permissionGroups, setPermissionGroups] = useState({})
  const [selectedRoleId, setSelectedRoleId] = useState('')
  const [rolePermissions, setRolePermissions] = useState([])
  const [showPermissionPicker, setShowPermissionPicker] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = async () => {
    try {
      setLoading(true)
      const [roleData, permissions] = await Promise.all([
        roleService.getAll({ limit: 100, includeInactive: true }),
        permissionService.getByModule(),
      ])

      const mappedRoles = Array.isArray(roleData) ? roleData : roleData?.roles || []
      setRoles(mappedRoles)
      setPermissionGroups(permissions || {})
      if (!selectedRoleId && mappedRoles.length > 0) {
        setSelectedRoleId(mappedRoles[0]._id)
      }
      setError('')
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Unable to load permissions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const selectedRole = useMemo(
    () => roles.find((role) => role._id === selectedRoleId) || roles[0] || null,
    [roles, selectedRoleId]
  )

  useEffect(() => {
    if (selectedRole) {
      setRolePermissions(selectedRole.permissions || [])
    }
  }, [selectedRole])

  const togglePermission = (code) => {
    setRolePermissions((current) =>
      current.includes(code) ? current.filter((item) => item !== code) : [...current, code]
    )
  }

  const handleSave = async () => {
    if (!selectedRole) return

    try {
      setSaving(true)
      await roleService.update(selectedRole._id, { permissions: rolePermissions })
      await fetchData()
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Unable to save role permissions.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="rounded-xl border bg-white p-8 text-slate-600">Loading roles and policies...</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Roles & Permissions</h1>
          <p className="text-sm text-slate-600">Super Admin can assign and update permissions for every role in the organization.</p>
        </div>
        <button type="button" className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">
          Create Role
        </button>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-white p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Total roles</div><div className="mt-2 text-3xl font-semibold text-slate-900">{roles.length}</div></div>
        <div className="rounded-xl border bg-white p-4"><div className="text-xs uppercase tracking-wide text-slate-500">System roles</div><div className="mt-2 text-3xl font-semibold text-slate-900">{roles.filter((role) => role.isSystem).length}</div></div>
        <div className="rounded-xl border bg-white p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Custom roles</div><div className="mt-2 text-3xl font-semibold text-slate-900">{roles.filter((role) => !role.isSystem).length}</div></div>
        <div className="rounded-xl border bg-white p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Assigned permissions</div><div className="mt-2 text-3xl font-semibold text-slate-900">{rolePermissions.length}</div></div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
        <div className="rounded-2xl border bg-white p-4">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Roles</h3>
          <div className="space-y-2">
            {roles.map((role) => (
              <button
                key={role._id}
                type="button"
                onClick={() => setSelectedRoleId(role._id)}
                className={`w-full rounded-xl border p-3 text-left transition ${selectedRole?._id === role._id ? 'border-violet-500 bg-violet-50' : 'border-slate-200 hover:bg-slate-50'}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-slate-900">{role.name}</span>
                  {role.isSystem && <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-600">System</span>}
                </div>
                <div className="mt-1 text-xs text-slate-500">{role.permissions?.length || 0} permissions</div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-4 sm:p-6">
          {selectedRole ? (
            <>
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{selectedRole.name}</h3>
                  <p className="text-sm text-slate-500">{selectedRole.description || 'Role configuration'}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPermissionPicker((current) => !current)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Select Permission
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60"
                  >
                    {saving ? 'Saving...' : 'Save permissions'}
                  </button>
                </div>
              </div>

              {showPermissionPicker && (
                <div className="mb-5 rounded-xl border border-violet-200 bg-violet-50 p-4">
                  <div className="mb-3 text-sm font-medium text-violet-900">Available permissions</div>
                  <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    {Object.entries(permissionGroups).flatMap(([moduleName, permissions]) =>
                      permissions.map((permission) => (
                        <label key={permission.code} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            checked={rolePermissions.includes(permission.code)}
                            onChange={() => togglePermission(permission.code)}
                          />
                          <span>{permission.name || permission.code}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-5">
                {Object.entries(permissionGroups).map(([moduleName, permissions]) => (
                  <div key={moduleName} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-700">{moduleName}</h4>
                      <button
                        type="button"
                        onClick={() => {
                          const moduleCodes = permissions.map((permission) => permission.code)
                          setRolePermissions((current) => {
                            const final = new Set(current)
                            moduleCodes.forEach((code) => final.add(code))
                            return [...final]
                          })
                        }}
                        className="text-xs font-medium text-violet-600"
                      >
                        Enable all
                      </button>
                    </div>

                    <div className="space-y-2">
                      {permissions.map((permission) => (
                        <label key={permission.code} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
                          <span>{permission.name || permission.code}</span>
                          <input
                            type="checkbox"
                            checked={rolePermissions.includes(permission.code)}
                            onChange={() => togglePermission(permission.code)}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-sm text-slate-500">Select a role to begin managing permissions.</div>
          )}
        </div>
      </div>
    </div>
  )
}

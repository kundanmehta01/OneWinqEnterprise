import { useEffect, useState, useCallback } from 'react'
import { roleService } from '../services'

export function useRoles(page = 1, limit = 10, filters = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const res = await roleService.getAll({ page, limit, ...filters })
      setData(res)
      setError(null)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [page, limit, filters])

  useEffect(() => { fetch() }, [fetch])
  return { data, loading, error, refetch: fetch }
}

import { useEffect, useState, useCallback } from 'react'
import { dashboardService } from '../services/dashboardService'

export default function useDashboard(){
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async ()=>{
    setLoading(true)
    try{
      const res = await dashboardService.getExecutiveDashboard()
      setData(res)
      setError(null)
    }catch(err){
      setError(err)
      setData(null)
    }finally{
      setLoading(false)
    }
  },[])

  useEffect(()=>{ fetch() },[fetch])

  return { data, loading, error, refetch: fetch }
}

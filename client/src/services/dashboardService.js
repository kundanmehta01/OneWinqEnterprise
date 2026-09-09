import axios from 'axios'

export const dashboardService = {
  getExecutiveDashboard: () => axios.get('/api/v1/admin/dashboard').then((res) => res.data.data)
}

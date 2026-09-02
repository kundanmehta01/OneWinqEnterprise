import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminLayout from '../../layouts/AdminLayout'
import Dashboard from '../../pages/admin/Dashboard'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  )
}

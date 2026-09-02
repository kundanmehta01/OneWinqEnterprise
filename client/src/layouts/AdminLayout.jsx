import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/common/Sidebar'
import Header from '../components/common/Header'

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r">
        <Sidebar />
      </aside>
      <div className="flex-1 p-6">
        <Header />
        <main className="mt-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

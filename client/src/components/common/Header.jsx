import React from 'react'

export default function Header(){
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-md hover:bg-gray-100">☰</button>
        <div className="relative">
          <input className="border rounded-md px-4 py-2 w-80" placeholder="Search anything..." />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full bg-purple-600 text-white">SA</button>
      </div>
    </header>
  )
}

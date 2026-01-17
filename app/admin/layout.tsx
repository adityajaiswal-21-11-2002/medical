"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-64" : "w-20"} bg-slate-900 text-white transition-all duration-300`}>
        <div className="p-4 border-b border-slate-700">
          <h1 className={`font-bold ${sidebarOpen ? "text-xl" : "text-xs text-center"}`}>
            {sidebarOpen ? "MIS Admin" : "MIS"}
          </h1>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            href="/admin/dashboard"
            className="flex items-center space-x-3 px-4 py-2 rounded hover:bg-slate-800 transition"
          >
            <span>📊</span>
            {sidebarOpen && <span>Dashboard</span>}
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center space-x-3 px-4 py-2 rounded hover:bg-slate-800 transition"
          >
            <span>👥</span>
            {sidebarOpen && <span>Users</span>}
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center space-x-3 px-4 py-2 rounded hover:bg-slate-800 transition"
          >
            <span>💊</span>
            {sidebarOpen && <span>Products</span>}
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center space-x-3 px-4 py-2 rounded hover:bg-slate-800 transition"
          >
            <span>📦</span>
            {sidebarOpen && <span>Orders</span>}
          </Link>
          <Link
            href="/admin/reports"
            className="flex items-center space-x-3 px-4 py-2 rounded hover:bg-slate-800 transition"
          >
            <span>📈</span>
            {sidebarOpen && <span>Reports</span>}
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-600 hover:text-slate-900">
            ☰
          </button>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  )
}

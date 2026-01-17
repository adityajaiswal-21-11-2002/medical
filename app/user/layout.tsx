"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function UserLayout({ children }: { children: React.ReactNode }) {
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
            {sidebarOpen ? "MIS User" : "MIS"}
          </h1>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            href="/user/dashboard"
            className="flex items-center space-x-3 px-4 py-2 rounded hover:bg-slate-800 transition"
          >
            <span>📊</span>
            {sidebarOpen && <span>Dashboard</span>}
          </Link>
          <Link
            href="/user/products"
            className="flex items-center space-x-3 px-4 py-2 rounded hover:bg-slate-800 transition"
          >
            <span>💊</span>
            {sidebarOpen && <span>Products</span>}
          </Link>
          <Link
            href="/user/orders/create"
            className="flex items-center space-x-3 px-4 py-2 rounded hover:bg-slate-800 transition"
          >
            <span>📝</span>
            {sidebarOpen && <span>Create Order</span>}
          </Link>
          <Link
            href="/user/orders"
            className="flex items-center space-x-3 px-4 py-2 rounded hover:bg-slate-800 transition"
          >
            <span>📦</span>
            {sidebarOpen && <span>My Orders</span>}
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

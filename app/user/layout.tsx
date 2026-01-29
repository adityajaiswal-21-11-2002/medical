"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { usePathname, useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { ClipboardPlus, LayoutDashboard, Package, Pill, User } from "lucide-react"

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  const navItems = useMemo(
    () => [
      { href: "/user/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/user/products", label: "Products", icon: Pill },
      { href: "/user/orders/create", label: "Create Order", icon: ClipboardPlus },
      { href: "/user/orders", label: "My Orders", icon: Package },
    ],
    []
  )
  const activeItem =
    navItems
      .filter((item) => pathname?.startsWith(item.href))
      .sort((a, b) => b.href.length - a.href.length)[0] ?? null
  const activeLabel = activeItem?.label ?? "User"

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside
        className={cn(
          "sticky top-0 flex h-screen flex-col border-r border-slate-800/60 bg-linear-to-b from-slate-950 to-slate-900 text-white transition-all duration-300",
          sidebarOpen ? "w-64" : "w-18"
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-800/60 px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <User className="h-5 w-5 text-emerald-300" />
            </div>
            {sidebarOpen && (
              <div>
                <p className="text-sm font-semibold">Medical Inventory</p>
                <p className="text-xs text-slate-400">User Workspace</p>
              </div>
            )}
          </div>
          <Badge variant="secondary" className={cn("bg-white/10 text-xs text-white", sidebarOpen ? "" : "hidden")}>
            User
          </Badge>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = activeItem?.href === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                  isActive ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-emerald-300" : "text-slate-400")} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-slate-800/60 px-4 py-4">
          {sidebarOpen && (
            <div className="rounded-lg bg-white/5 px-3 py-3">
              <p className="text-xs text-slate-400">Signed in as</p>
              <p className="text-sm font-medium text-white">Employee</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-slate-600 shadow-sm transition hover:text-slate-900"
            >
              ☰
            </button>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">User</p>
              <h1 className="text-lg font-semibold text-slate-900">{activeLabel}</h1>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="mx-auto w-full max-w-6xl px-6 py-6 lg:px-8">{children}</div>
        </div>
      </div>
    </div>
  )
}

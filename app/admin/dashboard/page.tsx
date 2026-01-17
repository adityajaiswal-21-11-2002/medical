"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface KPIs {
  totalProducts: number
  lowStockItems: number
  expiredProducts: number
  totalOrders: number
  totalSalesAmount: number
}

export default function AdminDashboard() {
  const [kpis, setKpis] = useState<KPIs | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchKPIs()
  }, [])

  const fetchKPIs = async () => {
    try {
      const response = await fetch("/api/dashboard/kpis")
      if (response.ok) {
        const data = await response.json()
        setKpis(data)
      }
    } catch (error) {
      console.error("Error fetching KPIs:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4 bg-blue-50">
          <p className="text-slate-600 text-sm">Total Products</p>
          <p className="text-3xl font-bold text-blue-600">{kpis?.totalProducts}</p>
        </Card>

        <Card className="p-4 bg-orange-50">
          <p className="text-slate-600 text-sm">Low Stock Items</p>
          <p className="text-3xl font-bold text-orange-600">{kpis?.lowStockItems}</p>
        </Card>

        <Card className="p-4 bg-red-50">
          <p className="text-slate-600 text-sm">Expired/Near Expiry</p>
          <p className="text-3xl font-bold text-red-600">{kpis?.expiredProducts}</p>
        </Card>

        <Card className="p-4 bg-green-50">
          <p className="text-slate-600 text-sm">Total Orders</p>
          <p className="text-3xl font-bold text-green-600">{kpis?.totalOrders}</p>
        </Card>

        <Card className="p-4 bg-purple-50">
          <p className="text-slate-600 text-sm">Total Sales</p>
          <p className="text-3xl font-bold text-purple-600">₹{kpis?.totalSalesAmount?.toLocaleString()}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/users">
          <Button className="w-full">Manage Users</Button>
        </Link>
        <Link href="/admin/products">
          <Button className="w-full">Manage Products</Button>
        </Link>
        <Link href="/admin/orders">
          <Button className="w-full">View Orders</Button>
        </Link>
        <Link href="/admin/reports">
          <Button className="w-full">Reports</Button>
        </Link>
      </div>
    </div>
  )
}

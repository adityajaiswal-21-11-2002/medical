"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function UserDashboard() {
  const [stats, setStats] = useState({ totalOrders: 0 })

  useEffect(() => {
    // Fetch user stats
  }, [])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Employee Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-slate-600 text-sm">My Orders</p>
          <p className="text-3xl font-bold text-blue-600">{stats.totalOrders}</p>
        </Card>

        <Card className="p-4">
          <p className="text-slate-600 text-sm">Quick Actions</p>
          <p className="text-sm">Create new orders</p>
        </Card>

        <Card className="p-4">
          <p className="text-slate-600 text-sm">Recent Products</p>
          <p className="text-sm">View available stock</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/user/orders/create">
          <Button className="w-full">Create Order</Button>
        </Link>
        <Link href="/user/products">
          <Button className="w-full">View Products</Button>
        </Link>
      </div>
    </div>
  )
}

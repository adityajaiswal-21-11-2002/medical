"use client"

import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import Link from "next/link"

interface Order {
  _id: string
  createdAt: string
  netAmount: number
}

export default function UserDashboard() {
  const [stats, setStats] = useState({ totalOrders: 0 })
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders/list")
        if (response.ok) {
          const data = await response.json()
          const list = Array.isArray(data.orders) ? data.orders : []
          setOrders(list)
          setStats({ totalOrders: list.length })
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      }
    }

    fetchOrders()
  }, [])

  const orderTrendData = useMemo(() => {
    const days = 7
    const today = new Date()
    const labels = Array.from({ length: days }).map((_, index) => {
      const date = new Date(today)
      date.setDate(today.getDate() - (days - 1 - index))
      return date.toLocaleDateString()
    })
    const counts = new Map(labels.map((label) => [label, 0]))

    for (const order of orders) {
      const label = new Date(order.createdAt).toLocaleDateString()
      if (counts.has(label)) {
        counts.set(label, (counts.get(label) ?? 0) + 1)
      }
    }

    return labels.map((label) => ({ label, value: counts.get(label) ?? 0 }))
  }, [orders])

  const orderTrendConfig = {
    value: {
      label: "Orders",
      color: "hsl(221.2 83.2% 53.3%)",
    },
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">Employee Dashboard</h1>
        <p className="text-sm text-slate-500">Quick access to daily tasks and recent updates.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-400">My Orders</p>
          <p className="text-2xl font-semibold text-slate-900">{stats.totalOrders}</p>
        </Card>

        <Card className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-400">Quick Actions</p>
          <p className="text-sm text-slate-600">Create new orders in seconds</p>
        </Card>

        <Card className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-400">Recent Products</p>
          <p className="text-sm text-slate-600">Browse the latest stock updates</p>
        </Card>
      </div>

      <Card className="rounded-xl border bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Order Activity</h2>
          <p className="text-sm text-slate-500">Orders placed in the last 7 days.</p>
        </div>
        <div className="mt-4">
          <ChartContainer config={orderTrendConfig} className="h-56 w-full">
            <LineChart data={orderTrendData} margin={{ left: 8, right: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Order {
  _id: string
  orderNumber: string
  customerName: string
  netAmount: number
  status: string
  createdAt: string
}

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders/list")
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">My Orders</h1>
        <p className="text-sm text-slate-500">Review order status and download invoices.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {orders.map((order) => (
          <Card key={order._id} className="rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md">
            <div className="flex flex-wrap justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{order.orderNumber}</h3>
                <p className="text-sm text-slate-600">{order.customerName}</p>
                <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="space-y-2 text-right">
                <p className="text-lg font-semibold">₹{order.netAmount.toFixed(2)}</p>
                <Badge
                  variant="secondary"
                  className={
                    order.status === "DELIVERED"
                      ? "bg-emerald-100 text-emerald-700"
                      : order.status === "CANCELLED"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-blue-100 text-blue-700"
                  }
                >
                  {order.status}
                </Badge>
                <div>
                  <Link href={`/user/orders/${order._id}`}>
                    <Button variant="outline" size="sm">
                      View Invoice
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {orders.length === 0 && <p className="text-center text-slate-500">No orders yet</p>}
    </div>
  )
}

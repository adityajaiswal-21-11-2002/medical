"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Order {
  _id: string
  orderNumber: string
  customerName: string
  netAmount: number
  status: string
  createdAt: string
  bookedBy: { name: string }
}

export default function OrdersPage() {
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
        setOrders(data.orders)
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
        <h1 className="text-2xl font-semibold">Order Management</h1>
        <p className="text-sm text-slate-500">Track, review, and manage customer orders.</p>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left">Order #</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Booked By</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b last:border-b-0 hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-semibold text-slate-900">{order.orderNumber}</td>
                  <td className="px-4 py-3">{order.customerName}</td>
                  <td className="px-4 py-3 text-slate-600">{order.bookedBy?.name || "N/A"}</td>
                  <td className="px-4 py-3 text-right font-medium">₹{order.netAmount.toFixed(2)}</td>
                  <td className="px-4 py-3">
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
                  </td>
                  <td className="px-4 py-3 text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-center">
                    <Link href={`/admin/orders/${order._id}`}>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {orders.length === 0 && <p className="text-center text-slate-500">No orders found</p>}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
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
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Order Management</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-2 text-left">Order #</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Booked By</th>
              <th className="px-4 py-2 text-right">Amount</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-slate-50">
                <td className="px-4 py-2 font-bold">{order.orderNumber}</td>
                <td className="px-4 py-2">{order.customerName}</td>
                <td className="px-4 py-2">{order.bookedBy?.name || "N/A"}</td>
                <td className="px-4 py-2 text-right">₹{order.netAmount.toFixed(2)}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs text-white ${
                      order.status === "DELIVERED"
                        ? "bg-green-600"
                        : order.status === "CANCELLED"
                          ? "bg-red-600"
                          : "bg-blue-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-center">
                  <Link href={`/admin/orders/${order._id}`}>
                    <Button size="sm">View</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && <p className="text-center text-slate-500">No orders found</p>}
    </div>
  )
}

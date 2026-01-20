"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
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
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">My Orders</h1>

      <div className="grid grid-cols-1 gap-4">
        {orders.map((order) => (
          <Card key={order._id} className="p-4 hover:shadow-lg transition">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{order.orderNumber}</h3>
                <p className="text-sm text-slate-600">{order.customerName}</p>
                <p className="text-sm text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right space-y-2">
                <p className="font-bold text-lg">₹{order.netAmount.toFixed(2)}</p>
                <p
                  className={`text-sm px-2 py-1 rounded text-white inline-block ${
                    order.status === "DELIVERED"
                      ? "bg-green-600"
                      : order.status === "CANCELLED"
                        ? "bg-red-600"
                        : "bg-blue-600"
                  }`}
                >
                  {order.status}
                </p>
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

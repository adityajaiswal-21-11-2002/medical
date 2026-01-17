"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Invoice from "./invoice"
import { useRef } from "react"
import { toast } from "sonner"

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState("")
  const invoiceRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchOrder()
  }, [params.id])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data.order)
        setStatus(data.order.status)
      }
    } catch (error) {
      console.error("Error fetching order:", error)
      toast.error("Failed to load order")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        setStatus(newStatus)
        setOrder({ ...order, status: newStatus })
        toast.success("Order status updated")
      }
    } catch (error) {
      toast.error("Failed to update order status")
    }
  }

  const handlePrint = () => {
    if (invoiceRef.current) {
      window.print()
    }
  }

  if (loading) return <div className="p-4">Loading...</div>
  if (!order) return <div className="p-4">Order not found</div>

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-slate-600">Status:</span>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PLACED">Placed</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handlePrint}>Download Invoice (PDF)</Button>
      </div>

      <div ref={invoiceRef} className="bg-white p-4 rounded">
        <Invoice order={order} />
      </div>
    </div>
  )
}

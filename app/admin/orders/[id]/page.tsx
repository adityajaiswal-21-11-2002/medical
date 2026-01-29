"use client"

import { useEffect, useState, use } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Invoice from "./invoice"
import { useRef } from "react"
import { toast } from "sonner"

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState("")
  const invoiceRef = useRef<HTMLDivElement>(null)
  const { id } = use(params)

  useEffect(() => {
    fetchOrder()
  }, [id])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${id}`)
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
    if (invoiceRef.current && order) {
      // Create a new window for printing
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        // Clone the invoice content
        const invoiceContent = invoiceRef.current.innerHTML

        // Create the print document
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Invoice - ${order.orderNumber}</title>
              <style>
                /* Base styles */
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 20px;
                  background: white;
                  color: black;
                  font-size: 12px;
                  line-height: 1.4;
                }

                /* Layout utilities */
                .invoice-container {
                  max-width: 100%;
                  margin: 0 auto;
                  padding: 32px;
                  background: white;
                  color: black;
                  font-size: 12px;
                }

                /* Typography */
                .text-xs { font-size: 12px; }
                .text-sm { font-size: 14px; }
                .text-base { font-size: 16px; }
                .text-lg { font-size: 18px; }
                .font-bold { font-weight: bold; }

                /* Spacing */
                .p-8 { padding: 32px; }
                .p-4 { padding: 16px; }
                .p-2 { padding: 8px; }
                .px-2 { padding-left: 8px; padding-right: 8px; }
                .py-1 { padding-top: 4px; padding-bottom: 4px; }
                .py-2 { padding-top: 8px; padding-bottom: 8px; }
                .pb-4 { padding-bottom: 16px; }
                .mb-4 { margin-bottom: 16px; }
                .mt-6 { margin-top: 24px; }
                .mb-2 { margin-bottom: 8px; }
                .mb-6 { margin-bottom: 24px; }

                /* Flexbox */
                .flex { display: flex; }
                .justify-between { justify-content: space-between; }
                .justify-center { justify-content: center; }
                .items-start { align-items: flex-start; }
                .items-center { align-items: center; }
                .items-end { align-items: flex-end; }
                .text-right { text-align: right; }
                .text-center { text-align: center; }

                /* Grid */
                .grid { display: grid; }
                .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                .gap-4 { gap: 16px; }

                /* Borders */
                .border { border: 1px solid #e5e7eb; }
                .border-b { border-bottom: 1px solid #e5e7eb; }
                .border-t { border-top: 1px solid #e5e7eb; }
                .border-y { border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; }
                .border-collapse { border-collapse: collapse; }

                /* Background */
                .bg-white { background-color: white; }
                .bg-slate-100 { background-color: #f1f5f9; }

                /* Table */
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 4px 8px; text-align: left; }
                th { border-bottom: 1px solid #e5e7eb; }
                td { border-bottom: 1px solid #e5e7eb; }

                /* List */
                .list-decimal { list-style-type: decimal; }
                .ml-4 { margin-left: 16px; }

                /* Print specific styles */
                @media print {
                  body {
                    margin: 0;
                    padding: 0;
                  }
                  .invoice-container {
                    page-break-inside: avoid;
                    padding: 20px;
                  }
                  .no-print {
                    display: none !important;
                  }
                }

                /* Utility classes */
                .w-full { width: 100%; }
                .inline-block { display: inline-block; }
                .rounded { border-radius: 4px; }
                .text-slate-600 { color: #475569; }
                .text-slate-500 { color: #64748b; }
                .text-green-600 { color: #16a34a; }
                .text-red-600 { color: #dc2626; }
                .text-blue-600 { color: #2563eb; }
              </style>
            </head>
            <body>
              <div class="invoice-container">
                ${invoiceContent}
              </div>
            </body>
          </html>
        `)

        printWindow.document.close()

        // Wait for content to load, then print
        printWindow.onload = () => {
          printWindow.print()
          printWindow.close()
        }
      }
    }
  }

  if (loading) return <div className="p-4">Loading...</div>
  if (!order) return <div className="p-4">Order not found</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Order #{order.orderNumber}</h1>
          <p className="text-sm text-slate-500">Update order status and print invoice.</p>
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
        <Button onClick={handlePrint}>Print Invoice</Button>
      </div>

      <div ref={invoiceRef} className="rounded-xl border bg-white p-6 shadow-sm">
        <Invoice order={order} />
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

interface Product {
  _id: string
  name: string
  batch: string
  expiryDate: string
  currentStock: number
  mrp: number
}

interface Order {
  _id: string
  orderNumber: string
  customerName: string
  netAmount: number
  bookedBy: { name: string; email: string }
  createdAt: string
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("expiry")
  const [loading, setLoading] = useState(false)
  const [expiryProducts, setExpiryProducts] = useState<Product[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([])
  const [salesOrders, setSalesOrders] = useState<Order[]>([])
  const [totalSales, setTotalSales] = useState(0)
  const [daysThreshold, setDaysThreshold] = useState("30")
  const [dateRange, setDateRange] = useState({ start: "", end: "" })

  const fetchExpiryReport = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/reports/expiry?days=${daysThreshold}`)
      if (response.ok) {
        const data = await response.json()
        setExpiryProducts(data.products || [])
        toast.success(`Found ${data.products?.length || 0} products nearing expiry`)
      }
    } catch (error) {
      toast.error("Failed to load expiry report")
    } finally {
      setLoading(false)
    }
  }

  const fetchLowStockReport = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/reports/low-stock")
      if (response.ok) {
        const data = await response.json()
        setLowStockProducts(data.products || [])
        toast.success(`Found ${data.products?.length || 0} low stock items`)
      }
    } catch (error) {
      toast.error("Failed to load low stock report")
    } finally {
      setLoading(false)
    }
  }

  const fetchSalesReport = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (dateRange.start) params.append("startDate", dateRange.start)
      if (dateRange.end) params.append("endDate", dateRange.end)

      const response = await fetch(`/api/reports/sales?${params}`)
      if (response.ok) {
        const data = await response.json()
        setSalesOrders(data.orders || [])
        setTotalSales(data.totalSales || 0)
        toast.success(`Found ${data.totalOrders || 0} orders`)
      }
    } catch (error) {
      toast.error("Failed to load sales report")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Reports & Analytics</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="expiry">Expiry Report</TabsTrigger>
          <TabsTrigger value="lowstock">Low Stock</TabsTrigger>
          <TabsTrigger value="sales">Sales Report</TabsTrigger>
        </TabsList>

        <TabsContent value="expiry" className="space-y-4">
          <Card className="p-4">
            <h3 className="font-bold mb-3">Expiry Report - Products Nearing Expiry</h3>
            <div className="flex gap-2 mb-4">
              <Select value={daysThreshold} onValueChange={setDaysThreshold}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={fetchExpiryReport} disabled={loading}>
                {loading ? "Loading..." : "Generate Report"}
              </Button>
            </div>

            {expiryProducts.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-3 py-2 text-left">Product Name</th>
                      <th className="px-3 py-2 text-left">Batch</th>
                      <th className="px-3 py-2 text-left">Expiry Date</th>
                      <th className="px-3 py-2 text-left">Current Stock</th>
                      <th className="px-3 py-2 text-left">MRP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expiryProducts.map((product) => (
                      <tr key={product._id} className="border-b hover:bg-slate-50">
                        <td className="px-3 py-2">{product.name}</td>
                        <td className="px-3 py-2">{product.batch}</td>
                        <td className="px-3 py-2 text-red-600 font-semibold">{product.expiryDate}</td>
                        <td className="px-3 py-2">{product.currentStock}</td>
                        <td className="px-3 py-2">₹{product.mrp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {expiryProducts.length === 0 && <p className="text-slate-500">No data available</p>}
          </Card>
        </TabsContent>

        <TabsContent value="lowstock" className="space-y-4">
          <Card className="p-4">
            <h3 className="font-bold mb-3">Low Stock Report - Below Minimum Stock Level</h3>
            <Button onClick={fetchLowStockReport} disabled={loading} className="mb-4">
              {loading ? "Loading..." : "Generate Report"}
            </Button>

            {lowStockProducts.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-3 py-2 text-left">Product Name</th>
                      <th className="px-3 py-2 text-left">Current Stock</th>
                      <th className="px-3 py-2 text-left">Minimum Alert Level</th>
                      <th className="px-3 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockProducts.map((product) => (
                      <tr key={product._id} className="border-b hover:bg-slate-50">
                        <td className="px-3 py-2">{product.name}</td>
                        <td className="px-3 py-2 font-semibold text-red-600">{product.currentStock}</td>
                        <td className="px-3 py-2">{(product as any).minimumStockAlert}</td>
                        <td className="px-3 py-2">
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">OUT OF STOCK</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {lowStockProducts.length === 0 && <p className="text-slate-500">No data available</p>}
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card className="p-4">
            <h3 className="font-bold mb-3">Sales Report - Order Analysis</h3>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                placeholder="Start Date"
              />
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                placeholder="End Date"
              />
              <Button onClick={fetchSalesReport} disabled={loading}>
                {loading ? "Loading..." : "Generate Report"}
              </Button>
            </div>

            {salesOrders.length > 0 && (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Card className="p-3 bg-blue-50">
                    <p className="text-sm text-slate-600">Total Sales Amount</p>
                    <p className="text-2xl font-bold">₹{totalSales.toFixed(2)}</p>
                  </Card>
                  <Card className="p-3 bg-green-50">
                    <p className="text-sm text-slate-600">Total Orders</p>
                    <p className="text-2xl font-bold">{salesOrders.length}</p>
                  </Card>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="px-3 py-2 text-left">Order Number</th>
                        <th className="px-3 py-2 text-left">Booked By</th>
                        <th className="px-3 py-2 text-left">Customer</th>
                        <th className="px-3 py-2 text-left">Amount</th>
                        <th className="px-3 py-2 text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesOrders.map((order) => (
                        <tr key={order._id} className="border-b hover:bg-slate-50">
                          <td className="px-3 py-2">{order.orderNumber}</td>
                          <td className="px-3 py-2">{order.bookedBy?.name}</td>
                          <td className="px-3 py-2">{order.customerName}</td>
                          <td className="px-3 py-2 font-semibold">₹{order.netAmount.toFixed(2)}</td>
                          <td className="px-3 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            {salesOrders.length === 0 && <p className="text-slate-500">No data available</p>}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

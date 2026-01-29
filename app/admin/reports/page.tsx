"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

interface Product {
  _id: string
  name: string
  shelfLife: string
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

  const salesChartData = useMemo(() => {
    const totals = new Map<string, number>()
    for (const order of salesOrders) {
      const dateKey = new Date(order.createdAt).toLocaleDateString()
      totals.set(dateKey, (totals.get(dateKey) ?? 0) + order.netAmount)
    }
    return Array.from(totals.entries())
      .map(([date, total]) => ({ date, total: Number(total.toFixed(2)) }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [salesOrders])

  const salesChartConfig = {
    total: {
      label: "Sales",
      color: "hsl(221.2 83.2% 53.3%)",
    },
  }

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Reports & Analytics</h1>
        <p className="text-sm text-slate-500">Generate stock, expiry, and sales insights.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 rounded-xl bg-slate-100 p-1">
          <TabsTrigger value="expiry" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Expiry Report
          </TabsTrigger>
          <TabsTrigger value="lowstock" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Low Stock
          </TabsTrigger>
          <TabsTrigger value="sales" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Sales Report
          </TabsTrigger>
        </TabsList>

        <TabsContent value="expiry" className="space-y-4">
          <Card className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="font-bold mb-3">Shelf Life Report - Products Nearing Expiry</h3>
            <div className="flex flex-wrap gap-2 mb-4">
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
              <div className="overflow-hidden rounded-lg border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-3 py-2 text-left">Product Name</th>
                      <th className="px-3 py-2 text-left">Shelf Life</th>
                      <th className="px-3 py-2 text-left">Current Stock</th>
                      <th className="px-3 py-2 text-left">MRP</th>
                    </tr>
                    </thead>
                    <tbody>
                    {expiryProducts.map((product) => (
                      <tr key={product._id} className="border-b last:border-b-0 hover:bg-slate-50/70">
                        <td className="px-3 py-2 font-medium text-slate-900">{product.name}</td>
                        <td className="px-3 py-2 text-rose-600 font-semibold">{product.shelfLife}</td>
                        <td className="px-3 py-2">{product.currentStock}</td>
                        <td className="px-3 py-2">₹{product.mrp}</td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {expiryProducts.length === 0 && <p className="text-slate-500">No data available</p>}
          </Card>
        </TabsContent>

        <TabsContent value="lowstock" className="space-y-4">
          <Card className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="font-bold mb-3">Low Stock Report - Out of Stock Items</h3>
            <Button onClick={fetchLowStockReport} disabled={loading} className="mb-4">
              {loading ? "Loading..." : "Generate Report"}
            </Button>

            {lowStockProducts.length > 0 && (
              <div className="overflow-hidden rounded-lg border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-3 py-2 text-left">Product Name</th>
                      <th className="px-3 py-2 text-left">Current Stock</th>
                      <th className="px-3 py-2 text-left">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {lowStockProducts.map((product) => (
                      <tr key={product._id} className="border-b last:border-b-0 hover:bg-slate-50/70">
                        <td className="px-3 py-2 font-medium text-slate-900">{product.name}</td>
                        <td className="px-3 py-2 font-semibold text-rose-600">{product.currentStock}</td>
                        <td className="px-3 py-2">
                          <span className="bg-rose-100 text-rose-800 px-2 py-1 rounded text-xs">OUT OF STOCK</span>
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {lowStockProducts.length === 0 && <p className="text-slate-500">No data available</p>}
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="font-bold mb-3">Sales Report - Order Analysis</h3>
            <div className="grid grid-cols-1 gap-2 mb-4 md:grid-cols-3">
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
                <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                  <Card className="rounded-lg border border-blue-100 bg-white p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-wide text-slate-400">Total Sales Amount</p>
                    <p className="text-2xl font-semibold">₹{totalSales.toFixed(2)}</p>
                  </Card>
                  <Card className="rounded-lg border border-emerald-100 bg-white p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-wide text-slate-400">Total Orders</p>
                    <p className="text-2xl font-semibold">{salesOrders.length}</p>
                  </Card>
                </div>

                <Card className="rounded-lg border bg-white p-4 shadow-sm">
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold text-slate-900">Sales Trend</h4>
                    <p className="text-xs text-slate-500">Daily sales totals from selected range.</p>
                  </div>
                  <ChartContainer config={salesChartConfig} className="h-56 w-full">
                    <LineChart data={salesChartData} margin={{ left: 8, right: 8 }}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="var(--color-total)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ChartContainer>
                </Card>

                <div className="overflow-hidden rounded-lg border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
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
                        <tr key={order._id} className="border-b last:border-b-0 hover:bg-slate-50/70">
                          <td className="px-3 py-2 font-medium text-slate-900">{order.orderNumber}</td>
                          <td className="px-3 py-2">{order.bookedBy?.name}</td>
                          <td className="px-3 py-2">{order.customerName}</td>
                          <td className="px-3 py-2 font-semibold">₹{order.netAmount.toFixed(2)}</td>
                          <td className="px-3 py-2 text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
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

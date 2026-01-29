"use client"

import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts"
import Link from "next/link"

interface KPIs {
  totalProducts: number
  lowStockItems: number
  expiredProducts: number
  totalOrders: number
  totalSalesAmount: number
}

interface Product {
  category?: string
  currentStock?: number
}

export default function AdminDashboard() {
  const [kpis, setKpis] = useState<KPIs | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    setLoading(true)
    try {
      const [kpiResponse, productResponse] = await Promise.all([
        fetch("/api/dashboard/kpis"),
        fetch("/api/products/list"),
      ])

      if (kpiResponse.ok) {
        const data = await kpiResponse.json()
        setKpis(data)
      }

      if (productResponse.ok) {
        const data = await productResponse.json()
        setProducts(Array.isArray(data.products) ? data.products : [])
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const kpiChartData = [
    { label: "Products", value: kpis?.totalProducts ?? 0 },
    { label: "Low Stock", value: kpis?.lowStockItems ?? 0 },
    { label: "Expiry", value: kpis?.expiredProducts ?? 0 },
    { label: "Orders", value: kpis?.totalOrders ?? 0 },
    { label: "Sales", value: kpis?.totalSalesAmount ?? 0 },
  ]

  const kpiChartConfig = {
    value: {
      label: "Value",
      color: "hsl(221.2 83.2% 53.3%)",
    },
  }

  const stockBucketData = useMemo(() => {
    const buckets = [
      { label: "0", min: 0, max: 0 },
      { label: "1-10", min: 1, max: 10 },
      { label: "11-50", min: 11, max: 50 },
      { label: "51-100", min: 51, max: 100 },
      { label: "100+", min: 101, max: Number.POSITIVE_INFINITY },
    ]
    const counts = buckets.map((bucket) => ({
      label: bucket.label,
      value: 0,
    }))

    for (const product of products) {
      const stock = product.currentStock ?? 0
      const bucketIndex = buckets.findIndex((bucket) => stock >= bucket.min && stock <= bucket.max)
      if (bucketIndex >= 0) counts[bucketIndex].value += 1
    }

    return counts
  }, [products])

  const stockBucketConfig = {
    value: {
      label: "Products",
      color: "hsl(221.2 83.2% 53.3%)",
    },
  }

  const categoryChartData = useMemo(() => {
    const totals = new Map<string, number>()
    for (const product of products) {
      const category = product.category?.trim() || "Uncategorized"
      const stock = product.currentStock ?? 0
      totals.set(category, (totals.get(category) ?? 0) + stock)
    }

    const sorted = Array.from(totals.entries())
      .map(([category, stock]) => ({ category, stock }))
      .sort((a, b) => b.stock - a.stock)

    if (sorted.length <= 6) return sorted

    const top = sorted.slice(0, 5)
    const other = sorted.slice(5).reduce((sum, item) => sum + item.stock, 0)
    return [...top, { category: "Other", stock: other }]
  }, [products])

  const categoryChartConfig = {
    stock: {
      label: "Stock",
      color: "hsl(142.1 76.2% 36.3%)",
    },
  }

  const pieColors = ["#2563eb", "#0ea5e9", "#22c55e", "#f59e0b", "#f97316"]

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">Admin Dashboard</h1>
        <p className="text-sm text-slate-500">Overview of inventory health and order activity.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-400">Total Products</p>
          <p className="text-2xl font-semibold text-slate-900">{kpis?.totalProducts}</p>
        </Card>

        <Card className="rounded-xl border border-amber-100 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-400">Low Stock Items</p>
          <p className="text-2xl font-semibold text-slate-900">{kpis?.lowStockItems}</p>
        </Card>

        <Card className="rounded-xl border border-rose-100 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-400">Expired/Near Expiry</p>
          <p className="text-2xl font-semibold text-slate-900">{kpis?.expiredProducts}</p>
        </Card>

        <Card className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-400">Total Orders</p>
          <p className="text-2xl font-semibold text-slate-900">{kpis?.totalOrders}</p>
        </Card>

        <Card className="rounded-xl border border-indigo-100 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-400">Total Sales</p>
          <p className="text-2xl font-semibold text-slate-900">₹{kpis?.totalSalesAmount?.toLocaleString()}</p>
        </Card>
      </div>

      <Card className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">KPI Snapshot</h2>
            <p className="text-sm text-slate-500">At-a-glance comparison across metrics.</p>
          </div>
        </div>
        <div className="mt-4">
          <ChartContainer config={kpiChartConfig} className="h-64 w-full">
            <BarChart data={kpiChartData} margin={{ left: 8, right: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--color-value)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Product Stock Distribution</h2>
              <p className="text-sm text-slate-500">Count of products by stock range.</p>
            </div>
          </div>
          <div className="mt-4">
            <ChartContainer config={stockBucketConfig} className="h-64 w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="label" labelKey="label" />} />
                <Pie data={stockBucketData} dataKey="value" nameKey="label" innerRadius={60} outerRadius={90} paddingAngle={4}>
                  {stockBucketData.map((entry, index) => (
                    <Cell key={entry.label} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>
        </Card>

        <Card className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Category-wise Inventory</h2>
              <p className="text-sm text-slate-500">Total stock available by category.</p>
            </div>
          </div>
          <div className="mt-4">
            <ChartContainer config={categoryChartConfig} className="h-64 w-full">
              <BarChart data={categoryChartData} margin={{ left: 8, right: 8 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="category" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="stock" fill="var(--color-stock)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/users">
          <Button className="w-full">Manage Users</Button>
        </Link>
        <Link href="/admin/products">
          <Button className="w-full">Manage Products</Button>
        </Link>
        <Link href="/admin/orders">
          <Button className="w-full">View Orders</Button>
        </Link>
        <Link href="/admin/reports">
          <Button className="w-full">Reports</Button>
        </Link>
      </div>
    </div>
  )
}

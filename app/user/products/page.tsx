"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Product {
  _id: string
  name: string
  genericName: string
  packaging: string
  dosageForm: string
  category: string
  currentStock: number
  netMrp: number
  mrp: number
  photoBase64?: string
}

export default function UserProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products/list")
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Available Products</h1>
        <p className="text-sm text-slate-500">Browse stock and pricing before creating orders.</p>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <Card key={product._id} className="rounded-xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            {/* Product Image */}
            <div className="mb-3 w-full overflow-hidden rounded-lg bg-slate-100">
              <img
                src={product.photoBase64 || "/placeholder.jpg"}
                alt={product.name}
                className="h-48 w-full object-cover"
                onError={(e) => {
                  // Fallback to default image if base64 fails or is invalid
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.jpg"
                }}
              />
            </div>
            
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-slate-900">{product.name}</h3>
                <p className="text-sm text-slate-500">Generic: {product.genericName}</p>
              </div>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 flex-shrink-0">
                {product.currentStock} in stock
              </Badge>
            </div>
            <div className="mt-3 space-y-1 text-sm text-slate-600">
              <p>Packaging: {product.packaging}</p>
              <p>Dosage: {product.dosageForm}</p>
              <p>Category: {product.category}</p>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-xs text-slate-400">Net MRP</p>
                <p className="text-base font-semibold text-slate-900">₹{product.netMrp}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">MRP</p>
                <p className="text-sm text-slate-600">₹{product.mrp}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && <p className="text-center text-slate-500">No products found</p>}
    </div>
  )
}

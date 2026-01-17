"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface Product {
  _id: string
  name: string
  manufacturerName: string
  batch: string
  expiryDate: string
  currentStock: number
  mrp: number
  sellingRate: number
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
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Available Products</h1>

      <div className="flex gap-4">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <Card key={product._id} className="p-4 hover:shadow-lg transition">
            <h3 className="font-bold text-lg">{product.name}</h3>
            <p className="text-sm text-slate-600">Manufacturer: {product.manufacturerName}</p>
            <p className="text-sm text-slate-600">Batch: {product.batch}</p>
            <p className="text-sm text-slate-600">Expiry: {product.expiryDate}</p>
            <div className="mt-2 flex justify-between items-end">
              <div>
                <p className="text-xs text-slate-500">Stock Available</p>
                <p className="font-bold">{product.currentStock}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Selling Rate</p>
                <p className="font-bold">₹{product.sellingRate}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && <p className="text-center text-slate-500">No products found</p>}
    </div>
  )
}

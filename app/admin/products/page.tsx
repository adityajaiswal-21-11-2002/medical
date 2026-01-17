"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ProductForm from "@/components/product-form"

interface Product {
  _id: string
  name: string
  manufacturerName: string
  batch: string
  expiryDate: string
  currentStock: number
  minimumStockAlert: number
  mrp: number
  status: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
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

  const handleProductCreated = () => {
    setShowForm(false)
    fetchProducts()
  }

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "Add Product"}</Button>
      </div>

      {showForm && <ProductForm onSuccess={handleProductCreated} />}

      <div className="flex gap-4">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-2 text-left">Product Name</th>
              <th className="px-4 py-2 text-left">Manufacturer</th>
              <th className="px-4 py-2 text-left">Batch</th>
              <th className="px-4 py-2 text-left">Expiry</th>
              <th className="px-4 py-2 text-right">Stock</th>
              <th className="px-4 py-2 text-right">MRP</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b hover:bg-slate-50">
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">{product.manufacturerName}</td>
                <td className="px-4 py-2">{product.batch}</td>
                <td className="px-4 py-2">{product.expiryDate}</td>
                <td className="px-4 py-2 text-right">
                  <span
                    className={`px-2 py-1 rounded text-white text-xs ${
                      product.currentStock <= product.minimumStockAlert ? "bg-red-600" : "bg-green-600"
                    }`}
                  >
                    {product.currentStock}
                  </span>
                </td>
                <td className="px-4 py-2 text-right">₹{product.mrp}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      product.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

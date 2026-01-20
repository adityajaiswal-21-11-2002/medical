"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ProductForm from "@/components/product-form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
  strength?: string
  dosageForm?: string
  category?: string
  hsnCode?: string
  manufacturingDate?: string
  drugLicenseNumber?: string
  scheduleType?: string
  packType?: string
  unitsPerPack?: number
  freeQuantity?: number
  ptr?: number
  sellingRate?: number
  discountPercent?: number
  gstPercent?: number
  openingStock?: number
  stockUnit?: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingLoading, setEditingLoading] = useState(false)
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [formKey, setFormKey] = useState(0)

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
    setEditingProduct(null)
    fetchProducts()
  }

  const handleAddNew = () => {
    setEditingProduct(null)
    setFormKey((k) => k + 1)
    setShowForm(true)
  }

  const handleEdit = async (productId: string) => {
    // Pre-fill immediately from the list data
    const cached = products.find((p) => p._id === productId) || null
    if (cached) {
      setEditingProduct(cached)
      setShowForm(true)
    }

    setFormKey((k) => k + 1)
    setEditingLoading(true)
    try {
      const response = await fetch(`/api/products/${productId}`)
      if (response.ok) {
        const data = await response.json()
        if (data?.product) {
          setEditingProduct(data.product)
          setShowForm(true)
        }
      } else {
        console.error("Failed to fetch product for editing")
      }
    } catch (error) {
      console.error("Error fetching product:", error)
    } finally {
      setEditingLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteProductId) return

    try {
      const response = await fetch(`/api/products/${deleteProductId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete product")
      }

      setDeleteProductId(null)
      fetchProducts()
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Failed to delete product")
    }
  }

  const handleCancelEdit = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Product Management</h1>
        {!showForm && (
          <Button onClick={handleAddNew}>Add Product</Button>
        )}
      </div>

      {showForm && (
        <>
          {editingLoading && (
            <div className="p-2 text-sm text-slate-600">Loading product...</div>
          )}
          <ProductForm
            key={`${formKey}-${editingProduct?._id ?? "new-product"}`}
            onSuccess={handleProductCreated}
            product={editingProduct}
          />
          <div className="mb-4">
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
          </div>
        </>
      )}

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
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products
              .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
              .map((product) => (
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
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product._id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteProductId(product._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <AlertDialog open={deleteProductId !== null} onOpenChange={(open) => !open && setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteProductId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

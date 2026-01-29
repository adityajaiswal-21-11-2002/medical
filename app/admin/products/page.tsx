"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import ProductForm from "@/components/product-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
  genericName: string
  packaging: string
  dosageForm: string
  category: string
  currentStock: number
  mrp: number
  netMrp: number
  pts: number
  ptr: number
  status: string
  hsnCode?: string
  shelfLife?: string
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Product Management</h1>
          <p className="text-sm text-slate-500">Create, edit, and monitor product inventory.</p>
        </div>
        {!showForm && (
          <Button onClick={handleAddNew}>Add Product</Button>
        )}
      </div>

      <Dialog open={showForm} onOpenChange={(open) => !open && handleCancelEdit()}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          {editingLoading && <div className="p-2 text-sm text-slate-600">Loading product...</div>}
          <ProductForm
            key={`${formKey}-${editingProduct?._id ?? "new-product"}`}
            onSuccess={handleProductCreated}
            product={editingProduct}
          />
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleCancelEdit}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex gap-4">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left">Product Name</th>
              <th className="px-4 py-3 text-left">Generic Name</th>
              <th className="px-4 py-3 text-left">Packaging</th>
              <th className="px-4 py-3 text-left">Dosage Form</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-right">Stock</th>
              <th className="px-4 py-3 text-right">Net MRP</th>
              <th className="px-4 py-3 text-right">MRP</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
            </thead>
            <tbody>
            {products
              .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
              .map((product) => (
                <tr key={product._id} className="border-b last:border-b-0 hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-medium text-slate-900">{product.name}</td>
                  <td className="px-4 py-3 text-slate-600">{product.genericName}</td>
                  <td className="px-4 py-3">{product.packaging}</td>
                  <td className="px-4 py-3">{product.dosageForm}</td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3 text-right">
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                      {product.currentStock}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">₹{product.netMrp}</td>
                  <td className="px-4 py-3 text-right">₹{product.mrp}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="secondary"
                      className={
                        product.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                      }
                    >
                      {product.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(product._id)}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => setDeleteProductId(product._id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

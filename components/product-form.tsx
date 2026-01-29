"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface Product {
  _id: string
  name: string
  genericName: string
  packaging: string
  dosageForm: string
  category: string
  pts: number
  ptr: number
  netMrp: number
  mrp: number
  gstPercent: number
  hsnCode: string
  shelfLife: string
  currentStock: number
}

interface ProductFormProps {
  onSuccess: () => void
  product?: Product | null
}

export default function ProductForm({ onSuccess, product }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    name: "",
    genericName: "",
    packaging: "",
    dosageForm: "Tablet",
    category: "",
    pts: "",
    ptr: "",
    netMrp: "",
    mrp: "",
    gstPercent: "5",
    hsnCode: "",
    shelfLife: "",
    currentStock: "",
  })

  useEffect(() => {
    if (product) {
      setFieldErrors({})
      setError("")
      setFormData({
        name: product.name || "",
        genericName: product.genericName || "",
        packaging: product.packaging || "",
        dosageForm: product.dosageForm || "Tablet",
        category: product.category || "",
        pts: product.pts?.toString() || "",
        ptr: product.ptr?.toString() || "",
        netMrp: product.netMrp?.toString() || "",
        mrp: product.mrp?.toString() || "",
        gstPercent: (product.gstPercent ?? 5).toString(),
        hsnCode: product.hsnCode || "",
        shelfLife: product.shelfLife || "",
        currentStock: product.currentStock?.toString() || "",
      })
    }
  }, [product])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFieldErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setFieldErrors({})

    try {
      const url = product ? `/api/products/${product._id}` : "/api/products/create"
      const method = product ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        if (errorData?.details?.fieldErrors) {
          const next: Record<string, string> = {}
          for (const [key, messages] of Object.entries(errorData.details.fieldErrors as Record<string, string[]>)) {
            if (Array.isArray(messages) && messages[0]) next[key] = messages[0]
          }
          setFieldErrors(next)
        }
        throw new Error(errorData.error || `Failed to ${product ? "update" : "create"} product`)
      }

      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const FieldError = ({ name }: { name: string }) => {
    if (!fieldErrors[name]) return null
    return <div className="text-red-600 text-xs mt-1">{fieldErrors[name]}</div>
  }

  return (
    <Card className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-1">{product ? "Edit Product" : "Add New Product"}</h2>
      <p className="text-sm text-slate-500 mb-4">Keep product information accurate and up to date.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">Product Name *</label>
            <Input name="name" value={formData.name} onChange={handleChange} required />
            <FieldError name="name" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Generic Name or Description *</label>
            <Input name="genericName" value={formData.genericName} onChange={handleChange} required />
            <FieldError name="genericName" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Packaging *</label>
            <Input name="packaging" value={formData.packaging} onChange={handleChange} required />
            <FieldError name="packaging" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Dosage Form *</label>
            <Input
              name="dosageForm"
              value={formData.dosageForm}
              onChange={handleChange}
              placeholder="e.g. Tablet, Syrup, Injection"
              required
            />
            <FieldError name="dosageForm" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <Input name="category" value={formData.category} onChange={handleChange} required />
            <FieldError name="category" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">PTS (10% Margin) *</label>
            <Input type="number" name="pts" value={formData.pts} onChange={handleChange} required />
            <FieldError name="pts" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">PTR (20% Margin) *</label>
            <Input type="number" name="ptr" value={formData.ptr} onChange={handleChange} required />
            <FieldError name="ptr" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Net MRP *</label>
            <Input type="number" name="netMrp" value={formData.netMrp} onChange={handleChange} required />
            <FieldError name="netMrp" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">MRP *</label>
            <Input type="number" name="mrp" value={formData.mrp} onChange={handleChange} required />
            <FieldError name="mrp" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">% GST *</label>
            <select
              name="gstPercent"
              value={formData.gstPercent}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none"
              required
            >
              <option value="0">0%</option>
              <option value="5">5%</option>
              <option value="12">12%</option>
            </select>
            <FieldError name="gstPercent" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">HSN Code *</label>
            <Input name="hsnCode" value={formData.hsnCode} onChange={handleChange} required />
            <FieldError name="hsnCode" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Shelf Life (MM/YYYY) *</label>
            <Input name="shelfLife" value={formData.shelfLife} onChange={handleChange} required />
            <FieldError name="shelfLife" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Current Stock *</label>
            <Input type="number" name="currentStock" value={formData.currentStock} onChange={handleChange} required />
            <FieldError name="currentStock" />
          </div>
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={loading}>
          {loading ? (product ? "Updating..." : "Creating...") : product ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </Card>
  )
}

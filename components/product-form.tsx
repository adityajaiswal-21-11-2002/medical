"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface Product {
  _id: string
  name: string
  strength?: string
  dosageForm: string
  category?: string
  hsnCode: string
  manufacturerName: string
  batch: string
  manufacturingDate?: string
  expiryDate: string
  drugLicenseNumber?: string
  scheduleType?: string
  packType?: string
  unitsPerPack?: number
  freeQuantity?: number
  mrp: number
  ptr?: number
  sellingRate: number
  discountPercent?: number
  gstPercent?: number
  openingStock: number
  currentStock?: number
  minimumStockAlert: number
  stockUnit?: string
  photoBase64?: string
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
    strength: "",
    dosageForm: "Tablet",
    category: "",
    hsnCode: "",
    manufacturerName: "",
    batch: "",
    manufacturingDate: "",
    expiryDate: "",
    drugLicenseNumber: "",
    scheduleType: "NON",
    packType: "",
    unitsPerPack: "",
    freeQuantity: 0,
    mrp: "",
    ptr: "",
    sellingRate: "",
    discountPercent: 0,
    gstPercent: "5",
    openingStock: "",
    minimumStockAlert: "",
    stockUnit: "Strip",
    photoBase64: "",
  })

  useEffect(() => {
    if (product) {
      setFieldErrors({})
      setError("")
      setFormData({
        name: product.name || "",
        strength: product.strength || "",
        dosageForm: product.dosageForm || "Tablet",
        category: product.category || "",
        hsnCode: product.hsnCode || "",
        manufacturerName: product.manufacturerName || "",
        batch: product.batch || "",
        manufacturingDate: product.manufacturingDate || "",
        expiryDate: product.expiryDate || "",
        drugLicenseNumber: product.drugLicenseNumber || "",
        scheduleType: product.scheduleType || "NON",
        packType: product.packType || "",
        unitsPerPack: product.unitsPerPack?.toString() || "",
        freeQuantity: product.freeQuantity || 0,
        mrp: product.mrp?.toString() || "",
        ptr: product.ptr?.toString() || "",
        sellingRate: product.sellingRate?.toString() || "",
        discountPercent: product.discountPercent || 0,
        gstPercent: (product.gstPercent ?? 5).toString(),
        openingStock: product.openingStock?.toString() || "",
        minimumStockAlert: product.minimumStockAlert?.toString() || "",
        stockUnit: product.stockUnit || "Strip",
        photoBase64: product.photoBase64 || "",
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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result
      if (typeof result === "string") {
        // result is a data URL (base64-encoded)
        setFormData((prev) => ({
          ...prev,
          photoBase64: result,
        }))
      }
    }
    reader.readAsDataURL(file)
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
    <Card className="p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">{product ? "Edit Product" : "Add New Product"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product Name *</label>
            <Input name="name" value={formData.name} onChange={handleChange} required />
            <FieldError name="name" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Strength</label>
            <Input name="strength" value={formData.strength} onChange={handleChange} />
            <FieldError name="strength" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Dosage Form *</label>
            <Input
              name="dosageForm"
              value={formData.dosageForm}
              onChange={handleChange}
              placeholder="e.g. Tablet, Syrup, Injection, etc."
              required
            />
            <FieldError name="dosageForm" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <Input name="category" value={formData.category} onChange={handleChange} />
            <FieldError name="category" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">HSN Code *</label>
            <Input name="hsnCode" value={formData.hsnCode} onChange={handleChange} required />
            <FieldError name="hsnCode" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Manufacturer *</label>
            <Input name="manufacturerName" value={formData.manufacturerName} onChange={handleChange} required />
            <FieldError name="manufacturerName" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Batch Number *</label>
            <Input name="batch" value={formData.batch} onChange={handleChange} required />
            <FieldError name="batch" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Expiry Date (MM/YYYY) *</label>
            <Input name="expiryDate" value={formData.expiryDate} onChange={handleChange} required />
            <FieldError name="expiryDate" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">MRP *</label>
            <Input type="number" name="mrp" value={formData.mrp} onChange={handleChange} required />
            <FieldError name="mrp" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">PTR *</label>
            <Input type="number" name="ptr" value={formData.ptr} onChange={handleChange} required />
            <FieldError name="ptr" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Selling Rate *</label>
            <Input type="number" name="sellingRate" value={formData.sellingRate} onChange={handleChange} required />
            <FieldError name="sellingRate" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Units Per Pack</label>
            <Input type="number" name="unitsPerPack" value={formData.unitsPerPack} onChange={handleChange} />
            <FieldError name="unitsPerPack" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">GST %</label>
            <select
              name="gstPercent"
              value={formData.gstPercent}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="0">0%</option>
              <option value="5">5%</option>
              <option value="12">12%</option>
            </select>
            <FieldError name="gstPercent" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Opening Stock *</label>
            <Input type="number" name="openingStock" value={formData.openingStock} onChange={handleChange} required />
            <FieldError name="openingStock" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Minimum Stock Alert *</label>
            <Input
              type="number"
              name="minimumStockAlert"
              value={formData.minimumStockAlert}
              onChange={handleChange}
              required
            />
            <FieldError name="minimumStockAlert" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Product Photo</label>
            <Input type="file" accept="image/*" onChange={handlePhotoChange} />
            <FieldError name="photoBase64" />
            {formData.photoBase64 && (
              <div className="mt-2">
                <span className="text-xs text-slate-500">Preview:</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.photoBase64}
                  alt="Product preview"
                  className="mt-1 h-16 w-16 rounded object-cover border"
                />
              </div>
            )}
          </div>
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <Button type="submit" disabled={loading}>
          {loading ? (product ? "Updating..." : "Creating...") : product ? "Update Product" : "Create Product"}
        </Button>
      </form>
    </Card>
  )
}

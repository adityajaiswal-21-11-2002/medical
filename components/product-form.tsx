"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface ProductFormProps {
  onSuccess: () => void
}

export default function ProductForm({ onSuccess }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
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
    gstPercent: 5,
    openingStock: "",
    minimumStockAlert: "",
    stockUnit: "Strip",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/products/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to create product")
      }

      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product Name *</label>
            <Input name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Strength</label>
            <Input name="strength" value={formData.strength} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Dosage Form *</label>
            <select
              name="dosageForm"
              value={formData.dosageForm}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option>Tablet</option>
              <option>Capsule</option>
              <option>Syrup</option>
              <option>Injection</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <Input name="category" value={formData.category} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">HSN Code *</label>
            <Input name="hsnCode" value={formData.hsnCode} onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Manufacturer *</label>
            <Input name="manufacturerName" value={formData.manufacturerName} onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Batch Number *</label>
            <Input name="batch" value={formData.batch} onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Expiry Date (MM/YYYY) *</label>
            <Input name="expiryDate" value={formData.expiryDate} onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">MRP *</label>
            <Input type="number" name="mrp" value={formData.mrp} onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Selling Rate *</label>
            <Input type="number" name="sellingRate" value={formData.sellingRate} onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Opening Stock *</label>
            <Input type="number" name="openingStock" value={formData.openingStock} onChange={handleChange} required />
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
          </div>
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Product"}
        </Button>
      </form>
    </Card>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Product {
  _id: string
  name: string
  batch: string
  expiryDate: string
  currentStock: number
  sellingRate: number
  gstPercent: number
}

export default function CreateOrderPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<any[]>([])
  const [customerName, setCustomerName] = useState("")
  const [customerMobile, setCustomerMobile] = useState("")
  const [customerAddress, setCustomerAddress] = useState("")
  const [gstin, setGstin] = useState("")
  const [doctorName, setDoctorName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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
    } catch (err) {
      console.error("Error fetching products:", err)
    }
  }

  const handleAddProduct = (product: Product) => {
    const existingItem = selectedProducts.find((p) => p.productId === product._id)
    if (existingItem) {
      existingItem.quantity += 1
      setSelectedProducts([...selectedProducts])
    } else {
      setSelectedProducts([
        ...selectedProducts,
        {
          productId: product._id,
          quantity: 1,
          batch: product.batch,
          rate: product.sellingRate,
        },
      ])
    }
  }

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p.productId !== productId))
  }

  const handleQuantityChange = (productId: string, quantity: number) => {
    const item = selectedProducts.find((p) => p.productId === productId)
    if (item) {
      item.quantity = Math.max(1, quantity)
      setSelectedProducts([...selectedProducts])
    }
  }

  const calculateTotal = () => {
    return selectedProducts.reduce((total, item) => {
      const product = products.find((p) => p._id === item.productId)
      if (product) {
        const amount = item.quantity * product.sellingRate
        const gst = (amount * product.gstPercent) / 100
        return total + amount + gst
      }
      return total
    }, 0)
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (selectedProducts.length === 0) {
      setError("Please select at least one product")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerMobile,
          customerAddress,
          gstin,
          doctorName,
          items: selectedProducts,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create order")
      }

      const data = await response.json()
      alert(`Order created successfully! Order #${data.order.orderNumber}`)
      // Reset form
      setSelectedProducts([])
      setCustomerName("")
      setCustomerMobile("")
      setCustomerAddress("")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Create Order</h1>

      <form onSubmit={handleSubmitOrder} className="space-y-4">
        <Card className="p-4">
          <h2 className="font-bold mb-4">Customer Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Customer Name *</label>
              <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mobile *</label>
              <Input value={customerMobile} onChange={(e) => setCustomerMobile(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address *</label>
              <Input value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">GSTIN</label>
              <Input value={gstin} onChange={(e) => setGstin(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Doctor Name</label>
              <Input value={doctorName} onChange={(e) => setDoctorName(e.target.value)} />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="font-bold mb-4">Select Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
            {products.map((product) => (
              <div key={product._id} className="border p-2 rounded">
                <p className="font-medium text-sm">{product.name}</p>
                <p className="text-xs text-slate-600">Batch: {product.batch}</p>
                <p className="text-xs text-slate-600">Stock: {product.currentStock}</p>
                <p className="text-xs font-bold">₹{product.sellingRate}</p>
                <Button type="button" size="sm" onClick={() => handleAddProduct(product)} className="mt-2 w-full">
                  Add to Order
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {selectedProducts.length > 0 && (
          <Card className="p-4">
            <h2 className="font-bold mb-4">Order Items</h2>
            <div className="space-y-2">
              {selectedProducts.map((item) => {
                const product = products.find((p) => p._id === item.productId)
                if (!product) return null

                const amount = item.quantity * product.sellingRate
                const gst = (amount * product.gstPercent) / 100

                return (
                  <div key={item.productId} className="border p-3 rounded">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-slate-600">Batch: {product.batch}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(item.productId)}
                        className="text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div>
                        <label className="text-xs">Qty</label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.productId, Number.parseInt(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="text-xs">Rate</label>
                        <p className="text-sm">₹{product.sellingRate}</p>
                      </div>
                      <div>
                        <label className="text-xs">Total (inc. GST)</label>
                        <p className="text-sm font-bold">₹{(amount + gst).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-lg font-bold">Total Amount: ₹{calculateTotal().toFixed(2)}</p>
            </div>
          </Card>
        )}

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating Order..." : "Create Order"}
        </Button>
      </form>
    </div>
  )
}

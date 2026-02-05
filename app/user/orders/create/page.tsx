"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Product {
  _id: string
  name: string
  currentStock: number
  netMrp: number
  gstPercent: number
}

export default function CreateOrderPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<any[]>([])
  const [customerName, setCustomerName] = useState("")
  const [customerMobile, setCustomerMobile] = useState("")
  const [customerAddress, setCustomerAddress] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [pincode, setPincode] = useState("")
  const [gstin, setGstin] = useState("")
  const [doctorName, setDoctorName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [productSearch, setProductSearch] = useState("")
  const [pickerOpen, setPickerOpen] = useState(false)

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
          rate: product.netMrp,
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
        const amount = item.quantity * product.netMrp
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
    setFieldErrors({})

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
          customerEmail,
          pincode,
          gstin,
          doctorName,
          items: selectedProducts,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        if (data?.details?.fieldErrors) {
          const next: Record<string, string> = {}
          for (const [key, messages] of Object.entries(data.details.fieldErrors as Record<string, string[]>)) {
            if (Array.isArray(messages) && messages[0]) next[key] = messages[0]
          }
          setFieldErrors(next)
        }
        throw new Error(data.error || "Failed to create order")
      }

      const data = await response.json()
      alert(`Order created successfully! Order #${data.order.orderNumber}`)
      // Reset form
      setSelectedProducts([])
      setCustomerName("")
      setCustomerMobile("")
      setCustomerAddress("")
      setCustomerEmail("")
      setPincode("")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const FieldError = ({ name }: { name: string }) => {
    if (!fieldErrors[name]) return null
    return <div className="mt-1 text-xs text-red-600">{fieldErrors[name]}</div>
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Create Order</h1>
        <p className="text-sm text-slate-500">Add customer details and build the order list.</p>
      </div>

      <form onSubmit={handleSubmitOrder} className="space-y-6">
        <Card className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold mb-4">Customer Details</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">Customer Name *</label>
              <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
              <FieldError name="customerName" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mobile *</label>
              <Input value={customerMobile} onChange={(e) => setCustomerMobile(e.target.value)} required />
              <FieldError name="customerMobile" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <Input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
              />
              <FieldError name="customerEmail" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address *</label>
              <Input value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} required />
              <FieldError name="customerAddress" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">PIN Code *</label>
              <Input
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="6-digit PIN code"
                required
              />
              <FieldError name="pincode" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">GSTIN</label>
              <Input value={gstin} onChange={(e) => setGstin(e.target.value)} />
              <FieldError name="gstin" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Doctor Name</label>
              <Input value={doctorName} onChange={(e) => setDoctorName(e.target.value)} />
            </div>
          </div>
        </Card>

        <Card className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">Select Products</h2>
              <p className="text-sm text-slate-500">Add items to the order list.</p>
            </div>
            <Button type="button" onClick={() => setPickerOpen(true)}>
              Add Products
            </Button>
          </div>
        </Card>

        {selectedProducts.length > 0 && (
          <Card className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="font-semibold mb-4">Order Items</h2>
            <div className="space-y-3">
              {selectedProducts.map((item) => {
                const product = products.find((p) => p._id === item.productId)
                if (!product) return null

                const amount = item.quantity * product.netMrp
                const gst = (amount * product.gstPercent) / 100

                return (
                  <div key={item.productId} className="rounded-lg border bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-900">{product.name}</p>
                        <p className="text-xs text-slate-500">Stock: {product.currentStock}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-slate-200 text-slate-700">
                          ₹{product.netMrp}
                        </Badge>
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(item.productId)}
                          className="text-sm font-medium text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3 mt-3 md:grid-cols-3">
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
                        <p className="text-sm font-semibold">₹{product.netMrp}</p>
                      </div>
                      <div>
                        <label className="text-xs">Total (inc. GST)</label>
                        <p className="text-sm font-semibold">₹{(amount + gst).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-lg font-semibold">Total Amount: ₹{calculateTotal().toFixed(2)}</p>
            </div>
          </Card>
        )}

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating Order..." : "Create Order"}
        </Button>
      </form>

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Products</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Search products..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
            />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {filteredProducts.map((product) => (
                <div key={product._id} className="rounded-lg border bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{product.name}</p>
                      <p className="text-xs text-slate-500">Stock: {product.currentStock}</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">₹{product.netMrp}</p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleAddProduct(product)}
                    className="mt-3 w-full"
                  >
                    Add to Order
                  </Button>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="text-sm text-slate-500">No products match your search.</div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

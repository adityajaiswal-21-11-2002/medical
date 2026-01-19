"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface CreateUserFormProps {
  onSuccess: () => void
}

export default function CreateUserForm({ onSuccess }: CreateUserFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "USER",
    status: "ACTIVE",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords must match")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create user")
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
      <h2 className="text-xl font-bold mb-4">Create New User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <Input name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mobile *</label>
            <Input name="mobile" value={formData.mobile} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role *</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password *</label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password *</label>
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create User"}
        </Button>
      </form>
    </Card>
  )
}

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
    photoBase64: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
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
    <Card className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-1">Create New User</h2>
      <p className="text-sm text-slate-500 mb-4">Add a new employee profile and access role.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none"
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
          <div>
            <label className="block text-sm font-medium mb-1">User Photo</label>
            <Input type="file" accept="image/*" onChange={handlePhotoChange} />
            {formData.photoBase64 && (
              <div className="mt-2">
                <span className="text-xs text-slate-500">Preview:</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.photoBase64}
                  alt="User preview"
                  className="mt-1 h-16 w-16 rounded-full object-cover border"
                />
              </div>
            )}
          </div>
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create User"}
          </Button>
        </div>
      </form>
    </Card>
  )
}

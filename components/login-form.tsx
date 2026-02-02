"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Login failed")
      }

      const data = await response.json()
      if (data.user.role === "ADMIN") {
        router.push("/admin/dashboard")
      } else {
        router.push("/user/dashboard")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 px-6 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 lg:flex-row lg:items-stretch">
        <div className="flex w-full max-w-md flex-col justify-center space-y-4">
          <Badge variant="secondary" className="w-fit bg-emerald-100 text-emerald-700">
            Secure Access
          </Badge>
          <h1 className="text-3xl font-semibold text-slate-900">Medical Inventory System</h1>
          <p className="text-sm text-slate-600">
            Sign in to manage inventory, orders, and reports across your distribution network.
          </p>
        </div>

        <Card className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-lg">
          <h2 className="text-xl font-semibold text-slate-900">Welcome back</h2>
          <p className="text-sm text-slate-500">Enter your credentials to continue.</p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        </Card>
      </div>
    </div>
  )
}

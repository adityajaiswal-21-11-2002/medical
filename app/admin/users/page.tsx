"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CreateUserForm from "@/components/create-user-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"

interface User {
  _id: string
  name: string
  email: string
  mobile: string
  role: string
  status: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/users/list?search=${search}`)
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (err) {
      console.error("Error fetching users:", err)
      toast.error("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const handleUserCreated = () => {
    setShowForm(false)
    setSearch("")
    fetchUsers()
    toast.success("User created successfully")
  }

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        toast.success("User status updated")
        fetchUsers()
      }
    } catch (err) {
      toast.error("Failed to update user")
    }
  }

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">User Management</h1>
          <p className="text-sm text-slate-500">Manage employee access and permissions.</p>
        </div>
        <Button onClick={() => setShowForm(true)}>Create User</Button>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
          </DialogHeader>
          <CreateUserForm onSuccess={handleUserCreated} />
        </DialogContent>
      </Dialog>

      <div className="flex gap-2">
        <Input
          placeholder="Search by name, email, or mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        <Button onClick={() => fetchUsers()} variant="outline">
          Search
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Mobile</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
            </thead>
            <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b last:border-b-0 hover:bg-slate-50/70">
                <td className="px-4 py-3 font-medium text-slate-900">{user.name}</td>
                <td className="px-4 py-3 text-slate-600">{user.email}</td>
                <td className="px-4 py-3">{user.mobile}</td>
                <td className="px-4 py-3">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                    {user.role}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant="secondary"
                    className={
                      user.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                    }
                  >
                    {user.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Select value={user.status} onValueChange={(newStatus) => handleStatusChange(user._id, newStatus)}>
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="BLOCKED">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>

      {users.length === 0 && <p className="text-center text-slate-500">No users found</p>}
    </div>
  )
}

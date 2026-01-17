"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CreateUserForm from "@/components/create-user-form"
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
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "Create User"}</Button>
      </div>

      {showForm && <CreateUserForm onSuccess={handleUserCreated} />}

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

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Mobile</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-slate-50">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.mobile}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      user.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <Select value={user.status} onValueChange={(newStatus) => handleStatusChange(user._id, newStatus)}>
                    <SelectTrigger className="w-24">
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

      {users.length === 0 && <p className="text-center text-slate-500">No users found</p>}
    </div>
  )
}

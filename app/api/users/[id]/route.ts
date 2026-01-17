import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import { getSession } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await connectDB()

    const body = await request.json()
    const { name, mobile, status } = body

    const user = await User.findByIdAndUpdate(params.id, { name, mobile, status }, { new: true }).select("-password")

    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

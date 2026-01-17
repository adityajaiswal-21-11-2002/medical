import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import { getSession } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await connectDB()

    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""

    const filter: any = {}
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
      ]
    }

    const users = await User.find(filter).select("-password").sort({ createdAt: -1 })

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

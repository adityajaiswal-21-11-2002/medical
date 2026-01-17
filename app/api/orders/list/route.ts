import { connectDB } from "@/lib/mongodb"
import Order from "@/models/Order"
import { getSession } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await connectDB()

    const searchParams = request.nextUrl.searchParams
    const filter: any = {}

    if (session.role === "USER") {
      filter.bookedBy = session.userId
    }

    if (searchParams.get("user")) {
      filter.bookedBy = searchParams.get("user")
    }

    const orders = await Order.find(filter)
      .populate("bookedBy", "name email")
      .populate("items.product", "name")
      .sort({ createdAt: -1 })

    return NextResponse.json({ orders })
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

import { connectDB } from "@/lib/mongodb"
import Order from "@/models/Order"
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
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const userId = searchParams.get("userId")

    const filter: any = { status: { $ne: "CANCELLED" } }

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    }

    if (userId) {
      filter.bookedBy = userId
    }

    const orders = await Order.find(filter).populate("bookedBy", "name email").sort({ createdAt: -1 })

    const totalSales = orders.reduce((sum, order) => sum + (order.netAmount || 0), 0)
    const totalOrders = orders.length

    return NextResponse.json({ orders, totalSales, totalOrders })
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

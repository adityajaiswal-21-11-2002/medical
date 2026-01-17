import { connectDB } from "@/lib/mongodb"
import Product from "@/models/Product"
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

    const totalProducts = await Product.countDocuments({ status: "ACTIVE" })
    const lowStockItems = await Product.countDocuments({
      status: "ACTIVE",
      $expr: { $lte: ["$currentStock", "$minimumStockAlert"] },
    })

    const now = new Date()
    const expiredProducts = await Product.countDocuments({
      status: "ACTIVE",
      expiryDate: {
        $regex: `^(0[1-9]|1[0-2])/20(2[0-4]|[01][0-9])$`,
      },
    })

    const totalOrders = await Order.countDocuments()
    const totalSalesAmount = await Order.aggregate([{ $group: { _id: null, total: { $sum: "$netAmount" } } }])

    return NextResponse.json({
      totalProducts,
      lowStockItems,
      expiredProducts,
      totalOrders,
      totalSalesAmount: totalSalesAmount[0]?.total || 0,
    })
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

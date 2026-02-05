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
      currentStock: { $lte: 0 },
    })

    // Compute expired products based on parsed shelf life (MM/YYYY)
    const now = new Date()
    const activeProductsWithStock = await Product.find({
      status: "ACTIVE",
      currentStock: { $gt: 0 },
    })

    let expiredProducts = 0
    for (const product of activeProductsWithStock) {
      if (!product.shelfLife) continue
      const match = /^(\d{2})\/(\d{4})$/.exec(product.shelfLife)
      if (!match) continue
      const month = Number.parseInt(match[1], 10)
      const year = Number.parseInt(match[2], 10)
      if (!month || !year) continue
      const expiryDate = new Date(year, month, 0)
      if (expiryDate < now) {
        expiredProducts++
      }
    }

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

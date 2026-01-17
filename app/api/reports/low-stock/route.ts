import { connectDB } from "@/lib/mongodb"
import Product from "@/models/Product"
import { getSession } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await connectDB()

    const products = await Product.find({
      $expr: { $lte: ["$currentStock", "$minimumStockAlert"] },
      status: "ACTIVE",
    }).sort({ currentStock: 1 })

    return NextResponse.json({ products })
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

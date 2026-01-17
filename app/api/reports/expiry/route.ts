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

    const searchParams = request.nextUrl.searchParams
    const daysThreshold = Number.parseInt(searchParams.get("days") || "30")

    const currentDate = new Date()
    const futureDate = new Date(currentDate.getTime() + daysThreshold * 24 * 60 * 60 * 1000)

    const products = await Product.find({
      expiryDate: {
        $lt: futureDate.toLocaleDateString("en-US", { year: "numeric", month: "2-digit" }).replace(/\//g, "/"),
      },
      currentStock: { $gt: 0 },
      status: "ACTIVE",
    }).sort({ expiryDate: 1 })

    return NextResponse.json({ products })
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

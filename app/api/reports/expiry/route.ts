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
    const daysThreshold = Number.parseInt(searchParams.get("days") || "30", 10)

    const currentDate = new Date()
    const futureDate = new Date(currentDate.getTime() + daysThreshold * 24 * 60 * 60 * 1000)

    // Fetch all active products with stock and then filter by parsed shelf life (MM/YYYY)
    const allProducts = await Product.find({
      currentStock: { $gt: 0 },
      status: "ACTIVE",
    })

    const products = allProducts
      .filter((product) => {
        if (!product.shelfLife) return false
        const match = /^(\d{2})\/(\d{4})$/.exec(product.shelfLife)
        if (!match) return false
        const month = Number.parseInt(match[1], 10)
        const year = Number.parseInt(match[2], 10)
        if (!month || !year) return false
        // Expiry is the last day of the given month
        const expiryDate = new Date(year, month, 0)
        return expiryDate <= futureDate
      })
      .sort((a, b) => {
        const parseExpiry = (shelfLife: string) => {
          const match = /^(\d{2})\/(\d{4})$/.exec(shelfLife)
          if (!match) return new Date(8640000000000000) // max date as fallback
          const month = Number.parseInt(match[1], 10)
          const year = Number.parseInt(match[2], 10)
          return new Date(year, month, 0)
        }
        return parseExpiry(a.shelfLife).getTime() - parseExpiry(b.shelfLife).getTime()
      })

    return NextResponse.json({ products })
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

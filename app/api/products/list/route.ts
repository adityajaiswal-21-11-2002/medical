import { connectDB } from "@/lib/mongodb"
import Product from "@/models/Product"
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
    const filter: any = { status: "ACTIVE" }

    if (searchParams.get("category")) {
      filter.category = searchParams.get("category")
    }

    if (searchParams.get("search")) {
      filter.name = { $regex: searchParams.get("search"), $options: "i" }
    }

    const products = await Product.find(filter).sort({ createdAt: -1 })

    return NextResponse.json({ products })
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

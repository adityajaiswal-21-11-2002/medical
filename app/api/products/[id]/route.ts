import { connectDB } from "@/lib/mongodb"
import Product from "@/models/Product"
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

    const gstPercent = body.gstPercent || 5
    const taxableValue = body.sellingRate * (1 - (body.discountPercent || 0) / 100)
    const totalGst = (taxableValue * gstPercent) / 100
    const cgst = totalGst / 2
    const sgst = totalGst / 2

    const product = await Product.findByIdAndUpdate(
      params.id,
      {
        ...body,
        cgst,
        sgst,
        taxableValue,
        totalGstAmount: totalGst,
        discountValue: (body.sellingRate * (body.discountPercent || 0)) / 100,
      },
      { new: true },
    )

    return NextResponse.json({ product })
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const product = await Product.findById(params.id)
    return NextResponse.json({ product })
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

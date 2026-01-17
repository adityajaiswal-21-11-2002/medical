import { connectDB } from "@/lib/mongodb"
import Product from "@/models/Product"
import { getSession } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"
import { validateInput, handleApiError, requireAdmin } from "@/lib/error-handler"
import { productCreateSchema } from "@/lib/validation"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    requireAdmin(session)

    const body = await request.json()

    const validatedData = validateInput(productCreateSchema, body)

    await connectDB()

    const gstPercent = validatedData.gstPercent || 5
    const cgst = (validatedData.mrp * gstPercent) / 100 / 2
    const sgst = (validatedData.mrp * gstPercent) / 100 / 2

    const product = new Product({
      ...validatedData,
      cgst,
      sgst,
      totalGstAmount: cgst + sgst,
      currentStock: validatedData.openingStock,
      createdBy: session.userId,
    })

    await product.save()

    return NextResponse.json({ product })
  } catch (error) {
    return handleApiError(error)
  }
}

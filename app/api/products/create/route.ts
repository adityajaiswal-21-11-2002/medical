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

    const gstPercent = validatedData.gstPercent ?? 5
    const taxableValue = validatedData.netMrp
    const cgst = (taxableValue * gstPercent) / 100 / 2
    const sgst = (taxableValue * gstPercent) / 100 / 2

    const product = new Product({
      ...validatedData,
      cgst,
      sgst,
      taxableValue,
      totalGstAmount: cgst + sgst,
      createdBy: session.userId,
    })

    await product.save()

    return NextResponse.json({ product })
  } catch (error) {
    return handleApiError(error)
  }
}

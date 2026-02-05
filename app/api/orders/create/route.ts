import { connectDB } from "@/lib/mongodb"
import Order from "@/models/Order"
import Product from "@/models/Product"
import { getSession } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"
import { validateInput, handleApiError, requireSession, ApiError } from "@/lib/error-handler"
import { orderCreateSchema } from "@/lib/validation"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    requireSession(session)

    const body = await request.json()

    const validatedData = validateInput(orderCreateSchema, body)

    await connectDB()
    const { customerName, customerMobile, customerAddress, customerEmail, pincode, gstin, doctorName, items } =
      validatedData

    if (!items || items.length === 0) {
      throw new ApiError(400, "Order must contain at least one item")
    }

    const orderNumber = "ORD-" + Date.now()

    let subtotal = 0
    let totalGst = 0
    const processedItems = []

    for (const item of items) {
      const product = await Product.findById(item.productId)
      if (!product) {
        throw new ApiError(404, `Product not found: ${item.productId}`)
      }
      if (product.currentStock < item.quantity) {
        throw new ApiError(400, `Insufficient stock for ${product.name}. Available: ${product.currentStock}`)
      }

      const itemAmount = item.quantity * product.netMrp
      const gstAmount = (itemAmount * product.gstPercent) / 100

      processedItems.push({
        product: product._id,
        quantity: item.quantity,
        freeQuantity: product.freeQuantity,
        mrp: product.mrp,
        rate: product.netMrp,
        cgst: gstAmount / 2,
        sgst: gstAmount / 2,
        amount: itemAmount + gstAmount,
      })

      product.currentStock -= item.quantity
      await product.save()

      subtotal += itemAmount
      totalGst += gstAmount
    }

    const invoiceNumber = `SANDP/${orderNumber}`

    const order = new Order({
      orderNumber,
      invoiceNumber,
      bookedBy: session.userId,
      customerName,
      customerMobile,
      customerAddress,
      customerEmail,
      pincode,
      gstin: gstin || undefined,
      doctorName: doctorName || undefined,
      items: processedItems,
      subtotal,
      totalGst,
      netAmount: subtotal + totalGst,
    })

    await order.save()

    return NextResponse.json({
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        netAmount: order.netAmount,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

import { connectDB } from "@/lib/mongodb"
import Order from "@/models/Order"
import Product from "@/models/Product"
import { getSession } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await connectDB()

    const order = await Order.findById(params.id).populate("bookedBy", "name email mobile").populate("items.product")

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (session.role === "USER" && order.bookedBy._id.toString() !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await connectDB()

    const body = await request.json()
    const { status } = body

    if (status === "CANCELLED") {
      const order = await Order.findById(params.id)
      if (order && order.status !== "CANCELLED") {
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { currentStock: item.quantity },
          })
        }
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(params.id, { status }, { new: true }).populate("items.product")

    return NextResponse.json({ order: updatedOrder })
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

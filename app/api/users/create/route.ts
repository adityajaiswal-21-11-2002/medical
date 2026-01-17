import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import { getSession } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"
import { validateInput, handleApiError, requireAdmin } from "@/lib/error-handler"
import { userCreateSchema } from "@/lib/validation"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    requireAdmin(session)

    const body = await request.json()
    const validatedData = validateInput(userCreateSchema, body)

    await connectDB()

    const existingUser = await User.findOne({ email: validatedData.email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const newUser = new User({
      ...validatedData,
      password: Math.random().toString(36).substring(2, 15),
      createdBy: session.userId,
    })

    await newUser.save()

    return NextResponse.json({
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        mobile: newUser.mobile,
        role: newUser.role,
        status: newUser.status,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

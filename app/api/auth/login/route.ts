import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import { createToken } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"
import { validateInput, handleApiError } from "@/lib/error-handler"
import { userLoginSchema } from "@/lib/validation"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validatedData = validateInput(userLoginSchema, body)
    const { email, password } = validatedData

    await connectDB()

    const user = await User.findOne({ email: validatedData.email, status: "ACTIVE" })
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isValidPassword = await user.comparePassword(password)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = await createToken(user._id.toString(), user.role)
    user.lastLogin = new Date()
    await user.save()

    const response = NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch (error) {
    return handleApiError(error)
  }
}

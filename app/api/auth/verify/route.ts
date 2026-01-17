import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { type NextRequest, NextResponse } from "next/server"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 })
    }

    const verified = await jwtVerify(token, secret)

    return NextResponse.json({
      success: true,
      role: verified.payload.role,
      userId: verified.payload.userId,
    })
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}

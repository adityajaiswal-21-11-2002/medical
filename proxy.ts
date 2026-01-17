import { type NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
      const verified = await jwtVerify(token, secret)
      if (verified.payload.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/user", request.url))
      }
    } catch (err) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  if (pathname.startsWith("/user")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
      await jwtVerify(token, secret)
    } catch (err) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
}

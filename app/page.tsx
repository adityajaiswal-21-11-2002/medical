import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { redirect } from "next/navigation"
import LoginForm from "@/components/login-form"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret")

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function RootPage() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (token) {
      try {
        const verified = await jwtVerify(token, secret)
        const user = verified.payload as { role?: string }

        if (user.role === "ADMIN") {
          redirect("/admin/dashboard")
        } else if (user.role === "USER") {
          redirect("/user/dashboard")
        }
      } catch (error) {
        // Token invalid or expired, show login
      }
    }

    // No valid token, show login form
    return <LoginForm />
  } catch (error) {
    // Error reading cookies or verifying, show login
    return <LoginForm />
  }
}

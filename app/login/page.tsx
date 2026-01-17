import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default function LoginPage() {
  // Redirect to root which handles auth check and shows login or dashboard
  redirect("/")
}

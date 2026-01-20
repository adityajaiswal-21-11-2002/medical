import { NextResponse } from "next/server"

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: any,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export function handleApiError(error: any) {
  console.error("[API Error]", error)

  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message, details: error.details }, { status: error.statusCode })
  }

  if (error.name === "ZodError") {
    return NextResponse.json(
      {
        error: "Validation error",
        details: error.errors.map((e: any) => `${e.path.join(".")}: ${e.message}`),
      },
      { status: 400 },
    )
  }

  if (error.name === "ValidationError") {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ error: "Internal server error" }, { status: 500 })
}

export function requireSession(session: any) {
  if (!session) {
    throw new ApiError(401, "Unauthorized - please login")
  }
}

export function requireAdmin(session: any) {
  if (!session || session.role !== "ADMIN") {
    throw new ApiError(403, "Forbidden - admin access required")
  }
}

export function validateInput<T>(schema: any, data: any): T {
  const result = schema.safeParse(data)
  if (!result.success) {
    const flattened = result.error.flatten()
    throw new ApiError(400, "Validation error", {
      fieldErrors: flattened.fieldErrors,
      formErrors: flattened.formErrors,
    })
  }
  return result.data
}

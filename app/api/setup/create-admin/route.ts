import { type NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"

export async function POST(req: NextRequest) {
  try {
    const setupToken = req.headers.get("x-setup-token")
    const setupSecret = process.env.SETUP_SECRET || "dev-setup-token"

    if (setupToken !== setupSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) {
      return NextResponse.json(
        {
          error: "MONGODB_URI not configured",
          details: "Please set MONGODB_URI in environment variables",
        },
        { status: 500 },
      )
    }

    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(mongoUri)
    }

    const User =
      mongoose.models.User ||
      mongoose.model(
        "User",
        new mongoose.Schema(
          {
            name: { type: String, required: true },
            email: { type: String, required: true, unique: true, lowercase: true },
            password: { type: String, required: true },
            mobile: { type: String, required: true },
            role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
            status: { type: String, enum: ["ACTIVE", "BLOCKED"], default: "ACTIVE" },
            createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            lastLogin: Date,
          },
          { timestamps: true },
        ),
      )

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@example.com" })
    if (existingAdmin) {
      return NextResponse.json(
        {
          success: true,
          message: "Admin user already exists",
          credentials: {
            email: "admin@example.com",
            password: "admin123",
            role: "ADMIN",
          },
        },
        { status: 200 },
      )
    }

    const admin = new User({
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      mobile: "9999999999",
      role: "ADMIN",
      status: "ACTIVE",
    })

    await admin.save()

    return NextResponse.json(
      {
        success: true,
        message: "Admin user created successfully",
        credentials: {
          email: "admin@example.com",
          password: "admin123",
          role: "ADMIN",
          note: "Use these credentials to login",
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Error creating admin:", error)
    return NextResponse.json(
      {
        error: "Failed to create admin user",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

import { z } from "zod"

const toNumber = (val: unknown) => {
  if (val === "" || val === null || val === undefined) return val
  if (typeof val === "number") return val
  if (typeof val === "string") {
    const n = Number(val)
    return Number.isNaN(n) ? val : n
  }
  return val
}

const toOptionalNumber = (val: unknown) => {
  if (val === "" || val === null || val === undefined) return undefined
  return toNumber(val)
}

// User validation schemas
export const userLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const userCreateSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    mobile: z.string().regex(/^[0-9]{10}$/, "Mobile must be 10 digits"),
    role: z.enum(["ADMIN", "USER"]),
    status: z.enum(["ACTIVE", "BLOCKED"]).optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
    // Optional base64-encoded user photo
    photoBase64: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  })

// Product validation schemas
export const productCreateSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  genericName: z.string().min(1, "Generic name is required"),
  packaging: z.string().min(1, "Packaging is required"),
  dosageForm: z.string().min(1, "Dosage form is required"),
  category: z.string().min(1, "Category is required"),
  pts: z.preprocess(toNumber, z.number().positive("PTS must be positive")),
  ptr: z.preprocess(toNumber, z.number().positive("PTR must be positive")),
  netMrp: z.preprocess(toNumber, z.number().positive("Net MRP must be positive")),
  mrp: z.preprocess(toNumber, z.number().positive("MRP must be positive")),
  gstPercent: z.preprocess(toNumber, z.union([z.literal(0), z.literal(5), z.literal(12)])),
  hsnCode: z.string().min(1, "HSN code is required"),
  shelfLife: z.string().regex(/^(0[1-9]|1[0-2])\/\d{4}$/, "Format: MM/YYYY"),
  currentStock: z.preprocess(toNumber, z.number().int().nonnegative("Current stock must be 0 or more")),
  // Optional base64-encoded product photo
  photoBase64: z.string().optional(),
})

// Order validation schemas
export const orderCreateSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerMobile: z.string().regex(/^[0-9]{10}$/, "Mobile must be 10 digits"),
  customerAddress: z.string().min(5, "Address must be at least 5 characters"),
  gstin: z
    .string()
    .regex(/^[0-9A-Z]{15}$/, "Invalid GSTIN format")
    .optional()
    .or(z.literal("")),
  doctorName: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string().min(1, "Product ID is required"),
      quantity: z.number().int().positive("Quantity must be positive"),
    }),
  ),
})

export type UserLogin = z.infer<typeof userLoginSchema>
export type UserCreate = z.infer<typeof userCreateSchema>
export type ProductCreate = z.infer<typeof productCreateSchema>
export type OrderCreate = z.infer<typeof orderCreateSchema>

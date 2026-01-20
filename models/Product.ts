import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    strength: String,
    dosageForm: {
      type: String, // free-text dosage form
      required: true,
    },
    category: String,
    hsnCode: { type: String, required: true },
    manufacturerName: { type: String, required: true },
    batch: { type: String, required: true },
    manufacturingDate: String, // MM/YYYY
    expiryDate: { type: String, required: true }, // MM/YYYY
    drugLicenseNumber: String,
    scheduleType: {
      type: String,
      enum: ["NON", "H", "H1", "X"],
      default: "NON",
    },
    packType: String,
    unitsPerPack: Number,
    freeQuantity: { type: Number, default: 0 },
    mrp: { type: Number, required: true },
    ptr: { type: Number, required: true },
    sellingRate: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
    discountValue: Number,
    gstPercent: {
      type: Number,
      enum: [0, 5, 12],
      default: 5,
    },
    cgst: Number,
    sgst: Number,
    taxableValue: Number,
    totalGstAmount: Number,
    openingStock: { type: Number, required: true },
    currentStock: { type: Number, required: true },
    minimumStockAlert: { type: Number, required: true },
    stockUnit: {
      type: String,
      enum: ["Strip", "Box", "Bottle"],
      default: "Strip",
    },
    stockStatus: {
      type: String,
      enum: ["IN_STOCK", "LOW", "OUT"],
      default: "IN_STOCK",
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    // Base64-encoded product photo (data URL or raw base64 string)
    photoBase64: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
)

export default mongoose.models.Product || mongoose.model("Product", productSchema)

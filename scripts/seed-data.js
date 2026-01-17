try {
  require("dotenv").config()
} catch (e) {
  // dotenv is optional - environment variables can be set directly
}
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// Models
const userSchema = new mongoose.Schema(
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
)

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    strength: String,
    dosageForm: { type: String, enum: ["Tablet", "Capsule", "Syrup", "Injection"], required: true },
    category: String,
    hsnCode: { type: String, required: true },
    manufacturerName: { type: String, required: true },
    batch: { type: String, required: true },
    manufacturingDate: String,
    expiryDate: { type: String, required: true },
    drugLicenseNumber: String,
    scheduleType: { type: String, enum: ["NON", "H", "H1", "X"], default: "NON" },
    packType: String,
    unitsPerPack: Number,
    freeQuantity: { type: Number, default: 0 },
    mrp: { type: Number, required: true },
    ptr: { type: Number, required: true },
    sellingRate: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
    discountValue: Number,
    gstPercent: { type: Number, enum: [0, 5, 12], default: 5 },
    cgst: Number,
    sgst: Number,
    taxableValue: Number,
    totalGstAmount: Number,
    openingStock: { type: Number, required: true },
    currentStock: { type: Number, required: true },
    minimumStockAlert: { type: Number, required: true },
    stockUnit: { type: String, enum: ["Strip", "Box", "Bottle"], default: "Strip" },
    stockStatus: { type: String, enum: ["IN_STOCK", "LOW", "OUT"], default: "IN_STOCK" },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
)

async function seedData() {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/medical-inventory"
    await mongoose.connect(mongoUri)
    console.log("Connected to MongoDB")

    const User = mongoose.model("User", userSchema)
    const Product = mongoose.model("Product", productSchema)

    // Clear existing data
    await User.deleteMany({})
    await Product.deleteMany({})
    console.log("Cleared existing data")

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10)
    const admin = new User({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      mobile: "9999999999",
      role: "ADMIN",
      status: "ACTIVE",
    })
    await admin.save()
    console.log("Admin user created: admin@example.com / admin123")

    // Create sample user
    const userPassword = await bcrypt.hash("user123", 10)
    const user = new User({
      name: "Demo User",
      email: "user@example.com",
      password: userPassword,
      mobile: "8888888888",
      role: "USER",
      status: "ACTIVE",
      createdBy: admin._id,
    })
    await user.save()
    console.log("Sample user created: user@example.com / user123")

    // Create sample products
    const products = [
      {
        name: "Aspirin 500mg",
        strength: "500mg",
        dosageForm: "Tablet",
        category: "Pain Relief",
        hsnCode: "30049099",
        manufacturerName: "Bayer Pharma",
        batch: "ASPIRIN-001",
        manufacturingDate: "01/2024",
        expiryDate: "12/2025",
        drugLicenseNumber: "20B-WB/KOL/NBO/W/754323",
        scheduleType: "NON",
        packType: "1*10",
        unitsPerPack: 10,
        mrp: 50,
        ptr: 40,
        sellingRate: 45,
        gstPercent: 5,
        openingStock: 500,
        minimumStockAlert: 100,
        stockUnit: "Strip",
        createdBy: admin._id,
      },
      {
        name: "Paracetamol 650mg",
        strength: "650mg",
        dosageForm: "Tablet",
        category: "Fever Reducer",
        hsnCode: "30049099",
        manufacturerName: "GSK India",
        batch: "PARA-002",
        manufacturingDate: "02/2024",
        expiryDate: "01/2026",
        drugLicenseNumber: "20B-WB/KOL/NBO/W/754323",
        scheduleType: "NON",
        packType: "1*15",
        unitsPerPack: 15,
        mrp: 35,
        ptr: 28,
        sellingRate: 32,
        gstPercent: 5,
        openingStock: 800,
        minimumStockAlert: 150,
        stockUnit: "Strip",
        createdBy: admin._id,
      },
      {
        name: "Amoxicillin 500mg",
        strength: "500mg",
        dosageForm: "Capsule",
        category: "Antibiotic",
        hsnCode: "30049099",
        manufacturerName: "Cipla",
        batch: "AMOX-003",
        manufacturingDate: "03/2024",
        expiryDate: "02/2026",
        drugLicenseNumber: "20B-WB/KOL/NBO/W/754323",
        scheduleType: "H",
        packType: "1*10",
        unitsPerPack: 10,
        mrp: 120,
        ptr: 95,
        sellingRate: 110,
        gstPercent: 12,
        openingStock: 300,
        minimumStockAlert: 50,
        stockUnit: "Strip",
        createdBy: admin._id,
      },
      {
        name: "Cough Syrup 100ml",
        strength: "100ml",
        dosageForm: "Syrup",
        category: "Cough Treatment",
        hsnCode: "30049099",
        manufacturerName: "Balsusyl",
        batch: "COUGH-004",
        manufacturingDate: "04/2024",
        expiryDate: "03/2026",
        drugLicenseNumber: "20B-WB/KOL/NBO/W/754323",
        scheduleType: "NON",
        packType: "1*100ml",
        unitsPerPack: 1,
        mrp: 85,
        ptr: 68,
        sellingRate: 80,
        gstPercent: 5,
        openingStock: 200,
        minimumStockAlert: 30,
        stockUnit: "Bottle",
        createdBy: admin._id,
      },
      {
        name: "Insulin Injection 10ml",
        strength: "100 units/ml",
        dosageForm: "Injection",
        category: "Diabetes",
        hsnCode: "30049099",
        manufacturerName: "Novo Nordisk",
        batch: "INSULIN-005",
        manufacturingDate: "05/2024",
        expiryDate: "04/2026",
        drugLicenseNumber: "20B-WB/KOL/NBO/W/754323",
        scheduleType: "H",
        packType: "1*10ml",
        unitsPerPack: 1,
        mrp: 350,
        ptr: 280,
        sellingRate: 320,
        gstPercent: 5,
        openingStock: 100,
        minimumStockAlert: 20,
        stockUnit: "Box",
        createdBy: admin._id,
      },
    ]

    for (const productData of products) {
      const gstPercent = productData.gstPercent || 5
      const taxableValue = productData.sellingRate * (1 - (productData.discountPercent || 0) / 100)
      const totalGst = (taxableValue * gstPercent) / 100
      const cgst = totalGst / 2
      const sgst = totalGst / 2

      const product = new Product({
        ...productData,
        cgst,
        sgst,
        taxableValue,
        totalGstAmount: totalGst,
        discountValue: (productData.sellingRate * (productData.discountPercent || 0)) / 100,
        currentStock: productData.openingStock,
      })
      await product.save()
    }
    console.log("Sample products created")

    console.log("\n=== Seed Data Complete ===")
    console.log("Admin: admin@example.com / admin123")
    console.log("User: user@example.com / user123")
    console.log("5 sample products added")

    await mongoose.connection.close()
  } catch (error) {
    console.error("Error seeding data:", error)
    process.exit(1)
  }
}

seedData()

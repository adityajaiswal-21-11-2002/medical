try {
  require("dotenv").config()
} catch (e) {
  // dotenv is optional - environment variables can be set directly
}
const mongoose = require("mongoose")

// Models (same as seed script)
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

async function verifyData() {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/medical-inventory"
    await mongoose.connect(mongoUri)
    
    const dbName = mongoose.connection.db.databaseName
    console.log("\n=== MongoDB Connection Info ===")
    console.log("Connection URI:", mongoUri.replace(/\/\/.*@/, "//***:***@")) // Hide password
    console.log("Database Name:", dbName)
    console.log("Connection State:", mongoose.connection.readyState === 1 ? "Connected" : "Not Connected")
    
    const User = mongoose.model("User", userSchema)
    const Product = mongoose.model("Product", productSchema)
    
    // Get all databases to verify connection
    const adminDb = mongoose.connection.db.admin()
    const { databases } = await adminDb.listDatabases()
    console.log("\n=== Available Databases ===")
    databases.forEach(db => {
      const sizeMB = (db.sizeOnDisk / 1024 / 1024).toFixed(2)
      const marker = db.name === dbName ? " <-- CURRENT" : ""
      console.log(`  - ${db.name} (${sizeMB} MB)${marker}`)
    })
    
    // Check collections in current database
    const collections = await mongoose.connection.db.listCollections().toArray()
    console.log("\n=== Collections in '" + dbName + "' database ===")
    if (collections.length === 0) {
      console.log("  ⚠️  No collections found!")
    } else {
      collections.forEach(col => {
        console.log(`  - ${col.name}`)
      })
    }
    
    // Count users
    const userCount = await User.countDocuments()
    console.log("\n=== Users Collection ===")
    console.log(`Total users: ${userCount}`)
    
    if (userCount > 0) {
      const users = await User.find({}).select("name email role status").lean()
      console.log("\nUsers found:")
      users.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.email} (${user.role}) - ${user.name}`)
      })
    } else {
      console.log("  ⚠️  No users found!")
    }
    
    // Count products
    const productCount = await Product.countDocuments()
    console.log("\n=== Products Collection ===")
    console.log(`Total products: ${productCount}`)
    
    if (productCount > 0) {
      const products = await Product.find({}).select("name category currentStock").lean()
      console.log("\nProducts found:")
      products.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.name} - ${product.category} (Stock: ${product.currentStock})`)
      })
    } else {
      console.log("  ⚠️  No products found!")
    }
    
    console.log("\n=== Verification Complete ===")
    
    await mongoose.connection.close()
  } catch (error) {
    console.error("Error verifying data:", error)
    process.exit(1)
  }
}

verifyData()

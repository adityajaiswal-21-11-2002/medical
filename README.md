# Medical Inventory System (MIS)

A comprehensive Next.js-based Management Information System for pharmaceutical distribution with role-based access control, inventory management, order booking, and GST-compliant invoicing.

## Features

### Authentication & Security
- Role-based access control (Admin/User)
- JWT token-based authentication with HTTP-only cookies
- Password hashing with bcryptjs
- Session management and automatic token refresh
- Protected routes with middleware

### Admin Features
- **Dashboard**: KPI metrics (total products, low stock items, expired products, orders, sales)
- **User Management**: Create users, activate/deactivate employees, view user list
- **Product Management**: Add medical products with complete pharma details, batch tracking, expiry management
- **Order Management**: View all orders, filter by date/user/customer, update order status, cancel with stock reversal
- **Reports**: Expiry reports, low stock alerts, sales analysis with date filters
- **Invoicing**: GST-compliant invoices matching SANDP Healthcare format with PDF export

### User/Distributor Features
- **Dashboard**: Quick access to orders and products
- **Product Browsing**: View available inventory with stock status
- **Order Creation**: Add products to cart, manage quantities, FEFO batch selection
- **Customer Management**: Store customer details, GSTIN, doctor references
- **Order History**: Track all created orders with status updates
- **Invoice Access**: Download invoices for placed orders

### Inventory Management
- Batch-wise stock tracking
- FEFO (First Expiry First Out) logic
- Automatic stock updates on order placement
- Stock reversal on order cancellation
- Low stock alerts and expiry warnings
- Expired stock exclusion from orders

### Product Management
- Complete medical product information:
  - Product name, strength, dosage form
  - HSN code, manufacturer, batch number
  - Manufacturing and expiry dates
  - Drug license number, schedule type
  - MRP, PTR, selling rate with GST calculations
  - Stock units and minimum alert levels

### Billing & Invoicing
- Auto-generated invoice numbers
- Company details (SANDP Healthcare)
- GST calculations (CGST & SGST breakup)
- Amount in words conversion
- HSN codes per product
- Batch and expiry tracking per item
- PDF download capability
- Print-ready formatting

### Reports & Analytics
- **Expiry Report**: Products nearing expiry (15/30/60/90 days)
- **Low Stock Report**: Items below minimum stock level
- **Sales Report**: Date-range filtered sales analysis with user-wise breakdown
- Total sales amount and order count metrics

## Tech Stack

- **Framework**: Next.js 16.0.10 with App Router
- **Frontend**: React 19.2.0 with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcryptjs
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: shadcn/ui + Radix UI
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Notifications**: Sonner toast

## Prerequisites

- Node.js 18+ and npm
- MongoDB instance (local or cloud)
- Environment variables configured

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medical-inventory
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
```

### 3. Seed Database with Sample Data

```bash
npm run seed
```

This will create:
- Admin user: `admin@example.com` / `admin123`
- Sample user: `user@example.com` / `user123`
- 5 sample pharmaceutical products

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and login with admin credentials.

## User Roles

### Admin
- Full system access
- Create and manage users
- Add/edit/manage products
- View all orders and reports
- Update order statuses
- Generate sales reports

### User (Distributor)
- Create orders
- View product inventory
- Track own orders
- Access invoices
- Limited to orders they created

## Project Structure

```
app/
├── login/                    # Login page
├── admin/
│   ├── dashboard/           # KPI dashboard
│   ├── users/              # User management
│   ├── products/           # Product management
│   ├── orders/             # Orders list & detail
│   └── reports/            # Reports & analytics
├── user/
│   ├── dashboard/          # User dashboard
│   ├── products/           # Product browsing
│   ├── orders/             # My orders
│   └── orders/create       # Create new order
├── api/
│   ├── auth/               # Authentication endpoints
│   ├── users/              # User management API
│   ├── products/           # Product API
│   ├── orders/             # Order API
│   ├── reports/            # Reports API
│   └── dashboard/          # KPI API
├── components/             # Reusable components
├── models/                 # MongoDB schemas
├── lib/                    # Utilities (auth, mongodb)
└── proxy.ts               # Authentication middleware
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout

### Users (Admin only)
- `GET /api/users/list` - Fetch all users with search
- `POST /api/users/create` - Create new user
- `PUT /api/users/[id]` - Update user details/status

### Products
- `GET /api/products/list` - List products
- `POST /api/products/create` - Create product (Admin only)
- `GET /api/products/[id]` - Get product details
- `PUT /api/products/[id]` - Update product (Admin only)

### Orders
- `GET /api/orders/list` - List orders (filtered by user role)
- `POST /api/orders/create` - Create new order
- `GET /api/orders/[id]` - Get order details
- `PUT /api/orders/[id]` - Update order status (Admin only)

### Reports
- `GET /api/reports/expiry` - Expiry products (days threshold)
- `GET /api/reports/low-stock` - Low stock items
- `GET /api/reports/sales` - Sales report with filters

### Dashboard
- `GET /api/dashboard/kpis` - Get KPI metrics

## Database Models

### User
```typescript
{
  name: String
  email: String (unique)
  password: String (hashed)
  mobile: String
  role: "ADMIN" | "USER"
  status: "ACTIVE" | "BLOCKED"
  createdBy: ObjectId
  lastLogin: Date
  timestamps: true
}
```

### Product
```typescript
{
  name: String
  strength: String
  dosageForm: "Tablet" | "Capsule" | "Syrup" | "Injection"
  category: String
  hsnCode: String
  manufacturerName: String
  batch: String
  manufacturingDate: String (MM/YYYY)
  expiryDate: String (MM/YYYY)
  drugLicenseNumber: String
  scheduleType: "NON" | "H" | "H1" | "X"
  mrp: Number
  ptr: Number
  sellingRate: Number
  gstPercent: 0 | 5 | 12
  cgst: Number
  sgst: Number
  openingStock: Number
  currentStock: Number
  minimumStockAlert: Number
  status: "ACTIVE" | "INACTIVE"
  timestamps: true
}
```

### Order
```typescript
{
  orderNumber: String (unique)
  bookedBy: ObjectId (User)
  customerName: String
  customerMobile: String
  customerAddress: String
  gstin: String (optional)
  doctorName: String (optional)
  items: [{
    product: ObjectId
    batch: String
    expiry: String
    quantity: Number
    rate: Number
    cgst: Number
    sgst: Number
    amount: Number
  }]
  subtotal: Number
  totalGst: Number
  netAmount: Number
  status: "PLACED" | "CANCELLED" | "DELIVERED"
  timestamps: true
}
```

## Invoice Format

The system generates GST-compliant invoices matching the SANDP Healthcare template with:
- Company letterhead with GSTIN and license details
- Invoice/Order details and dates
- Customer and consignee information
- Itemized product table with HSN, batch, expiry
- GST breakup (CGST & SGST)
- Amount in words
- Bank details
- Terms and conditions
- Authorized signatory section

## Security Features

- Password hashing with bcryptjs (10 salt rounds)
- JWT tokens with 7-day expiration
- HTTP-only secure cookies
- Role-based access control on all routes
- Input validation and sanitization
- Parameterized database queries
- CORS protection via middleware

## Troubleshooting

### MongoDB Connection Error
- Verify `MONGODB_URI` is correct in `.env.local`
- Check MongoDB cluster is running
- Ensure IP is whitelisted (for Atlas)

### Login Issues
- Clear browser cookies
- Verify user status is "ACTIVE"
- Check JWT_SECRET is set

### Invoice Generation Issues
- Ensure order has populated items with product details
- Check product batch and expiry date format (MM/YYYY)

## Running Scripts

### Seed Database
```bash
npm run seed
```

### Build for Production
```bash
npm run build
npm start
```

### Lint Code
```bash
npm run lint
```

## Support

For issues or questions, please check the troubleshooting section or contact support.

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**License**: Proprietary - SANDP Healthcare Pvt Ltd

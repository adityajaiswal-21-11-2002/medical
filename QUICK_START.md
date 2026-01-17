# Quick Start Guide - Medical Inventory System

## Prerequisites

- Node.js 18+ installed
- MongoDB running (local or cloud)
- npm or yarn package manager

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/medical-inventory
JWT_SECRET=your-super-secret-jwt-key-here
SETUP_SECRET=dev-setup-token
```

**For MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medical-inventory
JWT_SECRET=your-super-secret-jwt-key-here
SETUP_SECRET=dev-setup-token
```

### 3. Seed Database with Test Data

```bash
npm run seed
```

This creates:
- Admin user (admin@example.com / admin123)
- Sample user (user@example.com / user123)
- 5 sample pharmaceutical products
- Test inventory data

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Access the System

### Admin Account
- **URL:** http://localhost:3000/login
- **Email:** admin@example.com
- **Password:** admin123

### Employee/User Account
- **URL:** http://localhost:3000/login
- **Email:** user@example.com
- **Password:** user123

## Admin Dashboard Features

After logging in with admin credentials, you can access:

1. **Dashboard** - KPI metrics and overview
2. **Users** - Manage employees and users
3. **Products** - Add and manage pharmaceutical products
4. **Orders** - View and manage customer orders
5. **Reports** - Expiry, low-stock, and sales reports

## Employee Dashboard Features

After logging in with user credentials, you can:

1. **Products** - Browse all available products
2. **Create Order** - Create orders for customers
3. **Orders** - View order history

## Build for Production

```bash
npm run build
npm start
```

## Deployment

The system is ready to deploy on:
- Vercel (recommended)
- AWS
- Heroku
- Any Node.js hosting platform

## Troubleshooting

**MongoDB Connection Error:**
- Verify MongoDB is running
- Check MONGODB_URI is correct
- For Atlas, ensure IP is whitelisted

**Login Not Working:**
- Run seed script again
- Clear browser cache and cookies
- Check console for errors

**Products Not Showing:**
- Verify seed script ran successfully
- Check MongoDB database has data
- Restart development server

## System Requirements Checklist

- ✅ Authentication with role-based access control
- ✅ Admin and user dashboards
- ✅ User management system
- ✅ Product management with pharmaceutical details
- ✅ Order creation and management
- ✅ GST-compliant invoicing (SANDP Healthcare format)
- ✅ Batch management with FEFO logic
- ✅ Inventory tracking and alerts
- ✅ Expiry, low-stock, and sales reports
- ✅ PDF invoice export
- ✅ Responsive UI/UX

## Support

For issues or questions:
1. Check ADMIN_CREDENTIALS.md for authentication help
2. Review TESTING_GUIDE.md for feature validation
3. Check console logs for technical errors

# Admin Credentials

## Quick Setup

To create admin credentials, you have two options:

### Option 1: Run Seed Script (Recommended)

```bash
npm run seed
```

This will create both admin and sample user accounts with test data.

### Option 2: Use Setup API

Make a POST request with setup token:

```bash
curl -X POST http://localhost:3000/api/setup/create-admin \
  -H "x-setup-token: dev-setup-token" \
  -H "Content-Type: application/json"
```

## Test Credentials

### Admin Account
- **Email:** admin@example.com
- **Password:** admin123
- **Role:** ADMIN
- **Permissions:** Full access to all features

### Demo User Account (created via seed)
- **Email:** user@example.com
- **Password:** user123
- **Role:** USER
- **Permissions:** Product browsing, order creation

## Access the System

1. Navigate to `http://localhost:3000/login`
2. Enter admin credentials
3. You will be redirected to the admin dashboard

## Features Available to Admin

- ✅ Admin Dashboard with KPIs
- ✅ User Management (Create, Search, Activate/Block)
- ✅ Product Management (Add, Edit, Delete)
- ✅ Order Tracking (View, Update Status, Cancel)
- ✅ Invoice Generation & PDF Export
- ✅ Reports (Expiry, Low Stock, Sales)
- ✅ Batch Management with FEFO Logic
- ✅ Stock Management & Alerts

## Security Notes

- Password is hashed using bcryptjs
- Change admin password after first login
- For production, use strong passwords
- Disable setup API endpoint in production environment

## Troubleshooting

If you can't login:
1. Verify MongoDB is running and connected
2. Check MONGODB_URI environment variable
3. Run the seed script again
4. Check browser console for errors

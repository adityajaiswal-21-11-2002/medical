# Medical Inventory System - Setup Guide

## Quick Start (5 minutes)

### 1. Prerequisites
- Node.js 18 or higher
- MongoDB (Atlas or local)
- npm or yarn

### 2. Clone & Install

```bash
# Install dependencies
npm install
```

### 3. Environment Setup

Create `.env.local`:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medical-inventory

# JWT Secret Key
JWT_SECRET=your-super-secret-key-change-in-production

# Environment
NODE_ENV=development
```

### 4. Seed Database

```bash
npm run seed
```

**Default Credentials:**
- Admin: `admin@example.com` / `admin123`
- User: `user@example.com` / `user123`

### 5. Start Development Server

```bash
npm run dev
```

Open `http://localhost:3000` and login with admin credentials.

---

## MongoDB Setup

### Option A: MongoDB Atlas (Cloud) - Recommended

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account and cluster
3. Create database user with username/password
4. Whitelist your IP address
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/medical-inventory`
6. Add to `.env.local`

### Option B: Local MongoDB

```bash
# macOS with Homebrew
brew install mongodb-community
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# Download from mongodb.com and run installer
```

Connection string: `mongodb://localhost:27017/medical-inventory`

---

## Features Overview

### Admin Workflow
1. Login as `admin@example.com`
2. Create users (distributors) from User Management
3. Add pharmaceutical products with batch tracking
4. View all orders and update statuses
5. Generate sales and inventory reports

### User Workflow
1. Login as regular user
2. Browse available products
3. Create orders with customer details
4. View order history
5. Download invoices

---

## Troubleshooting

### "Cannot connect to MongoDB"
- Check MongoDB URI in `.env.local`
- Verify MongoDB cluster is running
- For Atlas: Whitelist your IP in Network Access

### "Invalid credentials" on login
- Verify seed was successful: `npm run seed`
- Check database has users created
- Clear browser cookies and try again

### "Port 3000 already in use"
```bash
# Use different port
npm run dev -- -p 3001
```

---

## Production Deployment

### 1. Build
```bash
npm run build
npm start
```

### 2. Environment Variables
Set production variables:
- Secure `JWT_SECRET` (use strong random string)
- Production MongoDB URI
- Set `NODE_ENV=production`

### 3. Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Follow prompts to connect your Git repository.

---

## File Structure

```
├── app/                  # Next.js app directory
├── components/          # Reusable React components
├── models/             # MongoDB schemas
├── lib/                # Utilities (auth, db)
├── scripts/            # Setup scripts
├── public/             # Static assets
├── .env.local          # Environment variables (git-ignored)
├── package.json        # Dependencies
└── README.md          # Documentation
```

---

## API Testing

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### Get Users
```bash
curl http://localhost:3000/api/users/list \
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

---

## Support & Documentation

- Full documentation: See `README.md`
- Code examples: Check `components/` and `app/api/`
- Database schema: See `models/` directory

---

**Version**: 1.0.0  
**Last Updated**: January 2026

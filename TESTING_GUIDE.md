# Testing Guide - Medical Inventory System

## Pre-requisites

1. MongoDB running locally or cloud connection
2. Environment variables configured:
   - `MONGODB_URI` - MongoDB connection string
   - `JWT_SECRET` - JWT secret key (for sessions)
   - `SETUP_SECRET` - Setup token (default: dev-setup-token)

3. Run seed script:
   ```bash
   npm run seed
   ```

## Test Scenarios

### 1. Authentication Flow

**Admin Login:**
- Email: admin@example.com
- Password: admin123
- Expected: Redirected to admin dashboard
- Verify: Cookie set, JWT token valid

**User Login:**
- Email: user@example.com  
- Password: user123
- Expected: Redirected to user dashboard
- Verify: Limited permissions enforced

**Invalid Login:**
- Any wrong credentials
- Expected: Error message displayed
- Verify: No redirect, session not created

### 2. Admin Dashboard

Navigate to `/admin/dashboard` after logging in as admin:

- ✅ Total Products KPI shows 5
- ✅ Low Stock products count
- ✅ Expired products count
- ✅ Total Orders created
- ✅ Total Sales amount
- ✅ Quick action buttons visible

### 3. User Management

Navigate to `/admin/users`:

**Create New User:**
1. Click "Add New User" button
2. Fill in: Name, Email, Mobile, Role, Password
3. Submit form
4. Verify: User appears in list, status is ACTIVE

**Search User:**
1. Type email in search box
2. Verify: List filters in real-time

**Block/Activate User:**
1. Click status button on any user
2. Verify: Status changes, blocked users can't login

**Edit User:**
1. Click edit icon
2. Update details
3. Verify: Changes saved

### 4. Product Management

Navigate to `/admin/products`:

**Add Product:**
1. Click "Add New Product"
2. Fill all fields:
   - Name: Paracetamol 500mg
   - HSN Code: 30049099
   - Batch: TEST-001
   - Expiry: 12/2025
   - MRP: 50
   - Selling Rate: 45
   - GST: 5%
   - Opening Stock: 100
3. Submit
4. Verify: Product appears in list

**GST Calculation Check:**
1. Add product with:
   - Selling Rate: 100
   - GST: 5%
2. Verify: CGST = 2.50, SGST = 2.50, Total GST = 5

**Stock Status Check:**
1. View product with stock < minimum alert
2. Verify: Stock status shows "LOW"
3. View product with stock = 0
4. Verify: Stock status shows "OUT"

**Filter by Category:**
1. Use filter dropdown
2. Select "Pain Relief"
3. Verify: Only pain relief products shown

### 5. Order Creation (User)

Login as user, navigate to `/user/orders/create`:

**Create Order:**
1. Select 1-2 products
2. Enter quantities
3. Fill customer details: Name, Email, Mobile
4. Verify price calculation
5. Submit order
6. Verify: Order created, stock reduced

**Quantity Validation:**
1. Try ordering more than available stock
2. Verify: Error message shown
3. Quantity limits enforced

**Price Calculation:**
1. Order product with:
   - Unit Price: 100
   - Quantity: 2
   - Discount: 10%
   - GST: 12%
2. Verify calculations:
   - Subtotal: 200
   - After Discount: 180
   - GST (12%): 21.60
   - Total: 201.60

### 6. Order Management (Admin)

Navigate to `/admin/orders`:

**View Orders:**
1. List shows all orders
2. Click any order for details
3. Verify: All order info displayed

**Order Status Update:**
1. Click on order
2. Change status: PENDING → CONFIRMED → DISPATCHED → DELIVERED
3. Verify: Status updates in list

**Cancel Order:**
1. Click cancel on PENDING order
2. Verify: Stock is restored, order status = CANCELLED

**Stock Rollback:**
1. Check product stock before cancel
2. Cancel order with that product
3. Verify: Stock increases by ordered quantity

### 7. Invoice Generation

Navigate to `/admin/orders/[id]`:

**View Invoice:**
1. Click "View Invoice" or "Print Invoice"
2. Verify format matches SANDP Healthcare template
3. Check fields:
   - Invoice number (auto-generated)
   - Date and time
   - Customer details
   - Product details with HSN codes
   - Tax breakdown (CGST/SGST)
   - Amount in words
   - Total with GST

**PDF Export:**
1. Click "Download PDF"
2. Verify: PDF downloads with same format

**Print:**
1. Click "Print Invoice"
2. Verify: Print dialog opens
3. Print to PDF for verification

### 8. Reports

Navigate to `/admin/reports`:

**Expiry Report:**
1. Filter by 15 days
2. Verify: Shows products expiring in 15 days
3. Filter by 30/60/90 days
4. Verify: Correct products shown

**Low Stock Report:**
1. View products with stock < minimum alert
2. Verify: Shows stock level and alert level
3. Filter by category

**Sales Report:**
1. Filter by date range
2. Verify: Shows orders in range
3. Check totals calculation
4. Filter by status (PENDING, DELIVERED, etc.)

### 9. Batch Management (FEFO)

**Test FEFO Logic:**
1. Add product with 3 batches:
   - Batch A: Expiry 06/2025, Stock 100
   - Batch B: Expiry 08/2025, Stock 100
   - Batch C: Expiry 12/2025, Stock 100
2. Create order for 50 units
3. Verify: Batch A (earliest expiry) is used first

### 10. Role-Based Access Control

**Test Admin-only Routes:**
1. Login as user
2. Try accessing `/admin/users`
3. Verify: Access denied, redirected to user dashboard

**Test User Routes:**
1. Both admin and user can access `/user/products`
2. Verify: Both can browse and create orders

## Performance Tests

1. Load dashboard with 1000+ products
2. Verify: Page loads within 2 seconds
3. Test search with large datasets
4. Verify: Real-time filtering responsive

## Error Handling Tests

1. Delete product while order pending
2. Modify product during order creation
3. Network error during payment
4. Verify: Graceful error messages shown

## Session Tests

1. Login as admin
2. Wait 30 minutes
3. Make request
4. Verify: Session still valid or re-login required
5. Logout
6. Verify: Session cleared, redirected to login

## Mobile Responsiveness

1. Test on mobile (375px width)
2. Verify: All tables responsive
3. Forms layout correctly
4. Navigation accessible

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

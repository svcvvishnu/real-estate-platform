# On-Call Runbook: Real Estate Trust Platform

**Target Audience:** Verification Team & System Administrators  
**System Status:** Beta (Local Development)  
**Last Updated:** 2025-12-28

---

## 1. System Setup & Configuration

### Database Configuration

- **Database Type**: SQLite
- **Database Location**: `prisma/dev.db`
- **Database URL**: `file:./dev.db` (relative to `prisma/` directory)
- **Schema Location**: `prisma/schema.prisma`

### Server Configuration

- **Framework**: Next.js 16.1.1
- **Port**: 3000
- **Local URL**: http://localhost:3000
- **Authentication**: NextAuth v5 (beta)

### Starting the Application

```bash
# Navigate to the web directory
cd /Users/vishnuvini/freelance/real-estate-platform/web

# Install dependencies (first time only)
npm install

# Run database migrations (if schema changed)
npx prisma migrate dev

# Seed the database with test users
npx prisma db seed

# Start the development server
npm run dev
```

**Available NPM Scripts:**
- `npm run dev` - Start development server (Turbopack)
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Stopping the Application

```bash
# Find the process running on port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)

# Or use Ctrl+C in the terminal where npm run dev is running
```

---

## 2. User Accounts & Credentials

All seeded users share the same password for testing purposes.

### Universal Password
**Password**: `AdminSecurePass2025!`

### User Accounts

| Mobile Number | Name | Role | KYC Status | Access Level |
|--------------|------|------|------------|--------------|
| `9000000001` | Admin User | `ADMIN` | `APPROVED` | Full system access, verification portal |
| `9000000002` | Buyer User | `BUYER` | `APPROVED` | Browse properties, make inquiries |
| `9000000003` | Seller User | `SELLER` | `APPROVED` | List properties, view dashboard |
| `9000000004` | Verification Team | `VERIFICATION_TEAM` | `APPROVED` | Verification portal access |

### Login Instructions

1. Navigate to http://localhost:3000/login
2. Enter mobile number (10 digits)
3. Enter password: `AdminSecurePass2025!`
4. Click "Sign in"

**Post-Login Redirects:**
- **Admin/Verification Team** → `/admin/verification`
- **Buyer/Seller** → `/dashboard`

### Resetting User Passwords

If passwords become out of sync, re-run the seed script:

```bash
npx prisma db seed
```

This will reset all user passwords to `AdminSecurePass2025!`.

---

## 3. Role Definitions

| Role | Permissions | Key Responsibilities |
|------|-------------|---------------------|
| **Admin** (`ADMIN`) | Full Access | User management, system config, escalation point |
| **Verifier** (`VERIFICATION_TEAM`) | Verification Portal | Reviewing and approving/rejecting property listings |
| **Seller** (`SELLER`) | Property Management | List properties, manage listings |
| **Buyer** (`BUYER`) | Browse & Inquire | Search properties, view details |

---

## 4. Core Workflows

### A. Property Verification (Daily Routine)

Properties are **hidden** from the public until approved.

**Process:**

1. **Trigger**: New property submitted by Seller (Status: `PENDING`)
2. **Access Portal**: 
   - Login as Admin (`9000000001`) or Verifier (`9000000004`)
   - Navigate to http://localhost:3000/admin/verification
3. **Review Properties**:
   - Check title/description for professionalism
   - Verify images are valid (no inappropriate content)
   - Confirm price/area seem realistic
4. **Decision**:
   - **Approve**: Click "Approve" → Status: `APPROVED` → Visible on search
   - **Reject**: Enter reason → Click "Reject" → Status: `REJECTED` → Seller notified

### B. User Support (KYC Issues)

**Issue**: User cannot list property because "KYC Login" required.

**Diagnosis**: Check User record in database. `kycStatus` must be `APPROVED`.

**Resolution (Dev/Test)**:

```bash
# Option 1: Re-run seed (resets all users to APPROVED)
npx prisma db seed

# Option 2: Manual database update
npx prisma studio
# Then navigate to User table and update kycStatus to APPROVED
```

---

## 5. Database Management

### Accessing the Database

**Using Prisma Studio (GUI):**
```bash
npx prisma studio
```
Opens browser at http://localhost:5555 with database GUI.

**Using SQLite CLI:**
```bash
sqlite3 prisma/dev.db
```

### Common Database Commands

```bash
# View database schema
npx prisma db pull

# Apply schema changes
npx prisma migrate dev

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Seed database with test data
npx prisma db seed

# Generate Prisma Client (after schema changes)
npx prisma generate
```

### Checking User Data

```bash
# Run the check-admin-user script
node check-admin-user.js

# Or check any user
node check-user.js
```

---

## 6. Emergency & Testing Access

### Quick Access Credentials

**For System Health Checks:**

```
Admin Login:
Mobile: 9000000001
Password: AdminSecurePass2025!
URL: http://localhost:3000/login
```

**For Verification Testing:**

```
Verifier Login:
Mobile: 9000000004
Password: AdminSecurePass2025!
URL: http://localhost:3000/login
```

**For Seller Flow Testing:**

```
Seller Login:
Mobile: 9000000003
Password: AdminSecurePass2025!
URL: http://localhost:3000/login
Note: This user has pre-seeded properties
```

---

## 7. Troubleshooting Common Issues

### Issue: Admin Login Fails

**Symptom**: Login returns error or "Invalid credentials"

**Cause**: Password hash mismatch in database

**Fix**:
```bash
# Re-seed the database to reset passwords
npx prisma db seed

# Verify admin user exists
node check-admin-user.js
```

### Issue: "Approve" Button Doesn't Work

**Symptom**: Click button, spinner shows, but nothing happens

**Cause**: Network timeout or database lock

**Fix**:
1. Refresh the page
2. Check server logs for `PrismaClientKnownRequestError`
3. Restart the dev server if needed

### Issue: Images Not Loading

**Cause**: `public/uploads` directory missing or permissions issue

**Fix**:
```bash
# Ensure directory exists
mkdir -p public/uploads/properties

# Check permissions
ls -la public/uploads
```

### Issue: Server Won't Start

**Symptom**: `npm run dev` fails or port already in use

**Fix**:
```bash
# Check if port 3000 is already in use
lsof -ti:3000

# Kill existing process
kill -9 $(lsof -ti:3000)

# Try starting again
npm run dev
```

### Issue: Database Connection Error

**Symptom**: Prisma errors about database connection

**Fix**:
```bash
# Regenerate Prisma Client
npx prisma generate

# Check database file exists
ls -la prisma/dev.db

# If missing, run migrations
npx prisma migrate dev
```

### Issue: Session/Auth Errors

**Symptom**: Logged in but redirects to login, or session errors

**Cause**: Missing AUTH_SECRET or session issues

**Fix**:
1. Check `.env.local` has `AUTH_SECRET` set
2. Clear browser cookies for localhost:3000
3. Restart the dev server

---

## 8. Monitoring & Logs

### Server Logs

Development server logs appear in the terminal where `npm run dev` is running.

**Key Log Patterns:**
- `Authorize called with:` - Login attempts
- `User found:` - User lookup results
- `Password match result:` - Password verification
- `GET /admin/verification 200` - Successful verification portal access
- `GET /dashboard 307` - Dashboard redirect (for admin/verifier)

### Checking Running Processes

```bash
# Check if dev server is running
ps aux | grep "next dev"

# Check port 3000 usage
lsof -ti:3000
```

---

## 9. Quick Reference

### Important File Locations

- **Auth Config**: `auth.ts`
- **Database Schema**: `prisma/schema.prisma`
- **Seed Script**: `prisma/seed.ts`
- **Database File**: `prisma/dev.db`
- **Login Page**: `app/login/page.tsx`
- **Verification Portal**: `app/admin/verification/page.tsx`

### Important URLs

- **Login**: http://localhost:3000/login
- **Dashboard**: http://localhost:3000/dashboard
- **Verification Portal**: http://localhost:3000/admin/verification
- **Prisma Studio**: http://localhost:5555 (when running)

### Support Scripts

- `check-admin-user.js` - Verify admin user in database
- `check-user.js` - Check any user by mobile
- `promote-admin.js` - Promote user to admin role
- `reset-admin-password.js` - Reset admin password
- `reset-runbook-admin.js` - Reset runbook admin credentials

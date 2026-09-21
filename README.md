# Mahakal Property Bhopal - Internal Management System

A production-ready Next.js application for field operations and team management.

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-secret-key
```

### 2. Database Migration
Run the initial SQL script (`supabase/migrations/0001_initial_schema.sql`) in your Supabase SQL Editor to create all tables and RLS policies.

---

## HOW TO CREATE THE FIRST MANAGER

Normal signups from the `/signup` page ALWAYS default to `role = employee` and `status = pending`. To create the first manager (your account) so you can access the `/manager/dashboard`:

**Step 1:**
Create an account using the normal `/signup` page.

**Step 2:**
Open your Supabase Dashboard at supabase.com.

**Step 3:**
Navigate to **Authentication → Users** and find the User UUID of the account you just created.

**Step 4:**
Navigate to the **SQL Editor** on the left sidebar.

**Step 5:**
Run the following secure SQL command, replacing `YOUR-UUID-HERE` with the actual UUID from Step 3:

```sql
UPDATE profiles
SET role = 'manager', status = 'active'
WHERE id = 'YOUR-UUID-HERE';
```

**Step 6:**
Log out of the app and log in again, or just navigate to `/debug` to verify your role has changed.

**Step 7:**
The application will now securely redirect you to `/manager/dashboard`.

---

## Debugging

If you run into routing or authentication issues, you can visit `/debug` when logged in to view your current raw User ID, Role, and Status directly from the database.

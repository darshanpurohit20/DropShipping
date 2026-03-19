# Supabase Setup Guide for Arey Beta

To integrate Supabase with your project, follow these steps:

## 1. Create a Project
- Go to [Supabase Dashboard](https://supabase.com/dashboard/) and create a new project.
- Set a strong Database Password and note it down.

## 2. Authentication Config
- **Email/Password**: Enabled by default.
- **Magic Link**: In the Dashboard, go to **Auth > Providers**, search for **Email**, and ensure **Confirm Email** or **Secure Magic Links** are toggled as needed.
- **Google OAuth (CRITICAL)**:
  1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/).
  2. Navigate to **Auth > Providers**.
  3. Find **Google** in the list.
  4. **Toggle "Enable Google Provider" to ON**. 
  5. Visit [Google Cloud Console](https://console.cloud.google.com/).
  6. Create an OAuth 2.0 Client ID for a **Web Application**.
  7. Add the **Redirect URL** (found in your Supabase Google Provider settings) to the "Authorized redirect URIs" in Google Cloud.
  8. Copy the **Client ID** and **Client Secret** from Google Cloud into the Supabase Google Provider settings.
  9. Click **Save** in Supabase.

## 3. Database Schema (SQL API)
You'll need to run the SQL commands for your basic tables. I've designed these to support all your requirements (profiles, carts, orders, receipts, and admin access).

Run these in the **SQL Editor** of your Supabase dashboard.

```sql
-- 1. PROFILES (Extends AUTH.USERS)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  phone_number TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  address TEXT, -- Simplified for now
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CART ITEMS (Real-time syncing)
CREATE TABLE cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  product_id TEXT NOT NULL, -- Corresponds to your existing product logic
  quantity INTEGER DEFAULT 1,
  metadata JSONB, -- For options like color/size
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ORDERS
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  total_amount NUMERIC(10, 2),
  status TEXT DEFAULT 'pending', -- pending, paid, shipped, delivered, cancelled
  payment_status TEXT DEFAULT 'unpaid', -- unpaid, paid
  receipt_url TEXT, -- Link to generated PDF or receipt
  shipping_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ORDER ITEMS
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price_at_purchase NUMERIC(10, 2) NOT NULL
);

-- 5. WISHLIST
CREATE TABLE wishlist_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, product_id)
);
```

## 4. How to Run This Project

Now that Supabase is integrated, here are the terminal commands you need to run to get everything up and running:

### 4.1 Update Environment Variables
Make sure you have updated the `.env.local` file with your **Supabase URL** and **Anon Key** from the Supabase Dashboard (`Project Settings > API`).

### 4.2 Run These Commands In Order
```bash
# 1. Install any remaining dependencies
npm install

# 2. Start the development server
npm run dev
```

### 4.3 Setup Steps Reminder
- **Database**: Go to **SQL Editor** in Supabase and paste/run the SQL from section 3.
- **Auth**: Go to **Auth > Providers** and enable **Email** (for Magic Links) or **Google** (if configured).

---

## 5. Final Key Check

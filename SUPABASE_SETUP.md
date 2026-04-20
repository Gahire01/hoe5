# 🛠️ Supabase Database Setup & Migrations

To ensure the **Home of Electronics** platform works correctly, run these SQL commands in your **Supabase SQL Editor**.

### 1. Products Table
Manages the inventory catalog.
```sql
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  rating NUMERIC DEFAULT 5,
  is_new BOOLEAN DEFAULT false,
  badge TEXT,
  specs JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public Read" ON products FOR SELECT USING (true);
CREATE POLICY "Admin All" ON products FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'admin');
```

### 2. Employees Table
Manages the operational team members.
```sql
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL,
  image TEXT,
  social JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public Read" ON employees FOR SELECT USING (true);
CREATE POLICY "Admin All" ON employees FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'admin');
```

### 3. Users Metadata & Roles
Users are managed by Supabase Auth. To make an admin, go to the **Auth** section in Supabase, select the user `homeofelectronics20@gmail.com`, and add `{"role": "admin"}` to their **User Metadata**.

### 4. Storage Buckets
Create a **Public** bucket named `uploads`.
- Folders to create: `products/`, `employees/`, `avatars/`, `tradein-proofs/`.

**Storage Policies:**
- `Public Read`: Allow all users to read files.
- `Authenticated Upload`: Allow authenticated users to upload to `avatars/` and `tradein-proofs/`.
- `Admin All`: Allow users with `admin` role to manage all files.

---
### 🔍 Verification Query
Run this to verify your schema cache is up to date:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products';
```

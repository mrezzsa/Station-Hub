-- Schema for Station Profile Hub v1.0

-- Create enum types if needed (Optional but good for data integrity)
-- CREATE TYPE training_status AS ENUM ('Valid', 'Warning', 'Expired');
-- CREATE TYPE asset_category AS ENUM ('Ground Support Equipment', 'Small Tools', 'Office');
-- CREATE TYPE asset_condition AS ENUM ('Serviceable', 'Under Maintenance', 'Unserviceable');

-- 1. tbl_stations
CREATE TABLE IF NOT EXISTS public.tbl_stations (
    id TEXT PRIMARY KEY,
    station_name TEXT NOT NULL,
    iata_code TEXT NOT NULL,
    manager_name TEXT,
    manager_email TEXT,
    manager_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. tbl_manpower
CREATE TABLE IF NOT EXISTS public.tbl_manpower (
    id TEXT PRIMARY KEY,
    station_id TEXT REFERENCES public.tbl_stations(id) ON DELETE CASCADE,
    employee_name TEXT NOT NULL,
    position TEXT NOT NULL,
    training_status TEXT, -- Valid / Warning / Expired
    license_expiry DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. tbl_assets
CREATE TABLE IF NOT EXISTS public.tbl_assets (
    id TEXT PRIMARY KEY,
    station_id TEXT REFERENCES public.tbl_stations(id) ON DELETE CASCADE,
    asset_name TEXT NOT NULL,
    category TEXT,
    qty INTEGER DEFAULT 1,
    condition TEXT, -- Serviceable / Under Maintenance / Unserviceable
    calibration_due DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. tbl_users
CREATE TABLE IF NOT EXISTS public.tbl_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    employee_id TEXT,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL, -- Super Admin / Station Manager / Viewer
    assigned_station TEXT, -- Station ID or 'ALL'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Note: In a real production environment, you would enable Row Level Security (RLS)
-- and link tbl_users to Supabase's auth.users.
-- ALTER TABLE public.tbl_stations ENABLE ROW LEVEL SECURITY;
-- (Add policies as needed)

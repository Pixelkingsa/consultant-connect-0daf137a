
-- Add referral_code column to profiles table if it doesn't exist
ALTER TABLE IF EXISTS public.profiles 
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;

-- Previous updates
-- This file has been updated to remove stock_quantity references
-- The previous content was:
-- ALTER TABLE IF EXISTS products 
-- ADD COLUMN IF NOT EXISTS stock_quantity INTEGER NOT NULL DEFAULT 0;


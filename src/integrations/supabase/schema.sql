
-- Add stock_quantity to products table if it doesn't exist
ALTER TABLE IF EXISTS products 
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER NOT NULL DEFAULT 0;

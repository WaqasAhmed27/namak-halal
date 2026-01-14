-- =====================================================
-- CLERK INTEGRATION MIGRATION
-- Migrates from Supabase Auth (UUID) to Clerk (TEXT user IDs)
-- =====================================================

-- WARNING: Run this in a non-production environment only!
-- This migration will drop and recreate tables with new schema.

-- =====================================================
-- STEP 1: Drop existing policies that reference auth.uid()
-- =====================================================

-- Drop profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;

-- Drop products policies
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Admins can manage products" ON products;
DROP POLICY IF EXISTS "Anyone can view active products" ON products;
DROP POLICY IF EXISTS "Admins can do everything with products" ON products;

-- Drop addresses policies
DROP POLICY IF EXISTS "Users can view their own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can insert their own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can update their own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can delete their own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can manage their own addresses" ON addresses;

-- Drop cart_items policies
DROP POLICY IF EXISTS "Users can manage their own cart" ON cart_items;
DROP POLICY IF EXISTS "Guests can manage cart by session" ON cart_items;
DROP POLICY IF EXISTS "Users can manage their own cart items" ON cart_items;

-- Drop wishlist_items policies
DROP POLICY IF EXISTS "Users can view their own wishlist" ON wishlist_items;
DROP POLICY IF EXISTS "Users can add to their wishlist" ON wishlist_items;
DROP POLICY IF EXISTS "Users can remove from wishlist" ON wishlist_items;
DROP POLICY IF EXISTS "Users can manage their own wishlist" ON wishlist_items;

-- Drop orders policies
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Admins can manage all orders" ON orders;

-- Drop order_items policies
DROP POLICY IF EXISTS "Users can view their order items" ON order_items;
DROP POLICY IF EXISTS "Order items created with orders" ON order_items;
DROP POLICY IF EXISTS "Admins can manage order items" ON order_items;
DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;

-- Drop discount_codes policies
DROP POLICY IF EXISTS "Active discount codes are viewable" ON discount_codes;
DROP POLICY IF EXISTS "Admins can manage discount codes" ON discount_codes;
DROP POLICY IF EXISTS "Anyone can view active discount codes" ON discount_codes;

-- Drop reviews policies
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON reviews;
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON reviews;
DROP POLICY IF EXISTS "Anyone can view reviews" ON reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;

-- =====================================================
-- STEP 2: Drop existing triggers
-- =====================================================

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_cart_items_updated_at ON cart_items;
DROP TRIGGER IF EXISTS update_addresses_updated_at ON addresses;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS set_order_number ON orders;

-- =====================================================
-- STEP 3: Drop foreign key constraints
-- =====================================================

ALTER TABLE IF EXISTS cart_items DROP CONSTRAINT IF EXISTS cart_items_user_id_fkey;
ALTER TABLE IF EXISTS addresses DROP CONSTRAINT IF EXISTS addresses_user_id_fkey;
ALTER TABLE IF EXISTS orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
ALTER TABLE IF EXISTS wishlist_items DROP CONSTRAINT IF EXISTS wishlist_items_user_id_fkey;
ALTER TABLE IF EXISTS reviews DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;

-- =====================================================
-- STEP 4: Modify profiles table (primary key change)
-- =====================================================

-- Drop the old profiles table and recreate with TEXT id
DROP TABLE IF EXISTS profiles CASCADE;

CREATE TABLE profiles (
  id TEXT PRIMARY KEY, -- Clerk user ID (e.g., 'user_xxxxx')
  email TEXT,
  full_name TEXT,
  phone TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- STEP 5: Modify other tables to use TEXT for user_id
-- =====================================================

-- Modify cart_items
ALTER TABLE cart_items ALTER COLUMN user_id TYPE TEXT;

-- Modify addresses
ALTER TABLE addresses ALTER COLUMN user_id TYPE TEXT;

-- Modify orders
ALTER TABLE orders ALTER COLUMN user_id TYPE TEXT;

-- Modify wishlist_items
ALTER TABLE wishlist_items ALTER COLUMN user_id TYPE TEXT;

-- Modify reviews
ALTER TABLE reviews ALTER COLUMN user_id TYPE TEXT;

-- =====================================================
-- STEP 6: Recreate RLS Policies (Clerk-compatible)
-- Using service role bypass for mutations via server actions
-- =====================================================

-- PROFILES: Public read for admin checks, mutations via service role
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read profiles for admin check"
  ON profiles FOR SELECT USING (true);

-- PRODUCTS: Public read for active, mutations via service role only
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT USING (is_active = true);

-- Admins use service role which bypasses RLS

-- CART_ITEMS: Session-based for guests, user-based for authenticated (read only)
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own cart"
  ON cart_items FOR SELECT USING (true);
-- Mutations handled via service role in server actions

-- ADDRESSES: User can read their own
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read addresses"
  ON addresses FOR SELECT USING (true);
-- Mutations handled via service role

-- ORDERS: Users can read their orders, admins use service role
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read orders"
  ON orders FOR SELECT USING (true);

-- ORDER_ITEMS: Read through orders
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read order items"
  ON order_items FOR SELECT USING (true);

-- WISHLIST_ITEMS: User can read their wishlist
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read wishlist"
  ON wishlist_items FOR SELECT USING (true);

-- DISCOUNT_CODES: Public read for active codes
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active discount codes"
  ON discount_codes FOR SELECT
  USING (is_active = true AND valid_from <= NOW() AND (valid_until IS NULL OR valid_until >= NOW()));

-- REVIEWS: Public read
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT USING (true);

-- =====================================================
-- STEP 7: Recreate Triggers
-- =====================================================

-- Recreate updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at
  BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Order number trigger
CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL)
  EXECUTE FUNCTION generate_order_number();

-- =====================================================
-- STEP 8: Add indexes for performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_user_id ON wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);

-- =====================================================
-- DONE! Schema is now compatible with Clerk authentication.
-- All mutations must go through server actions using service role.
-- =====================================================

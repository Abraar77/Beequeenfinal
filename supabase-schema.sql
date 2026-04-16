-- ============================================================
-- BeeQueen of Kashmir — Supabase Schema
-- Paste this entire file into your Supabase SQL Editor and run.
-- ============================================================

-- ============================================================
-- Products table
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT NOT NULL,
  slug           TEXT UNIQUE NOT NULL,
  description    TEXT,
  price          DECIMAL(10,2) NOT NULL CHECK (price > 0),
  original_price DECIMAL(10,2) CHECK (original_price > 0),
  category       TEXT NOT NULL,
  subcategory    TEXT,
  images         TEXT[] DEFAULT '{}',
  stock          INTEGER DEFAULT 0 CHECK (stock >= 0),
  featured       BOOLEAN DEFAULT false,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured  ON products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_products_slug      ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_stock     ON products(stock);
CREATE INDEX IF NOT EXISTS idx_products_created   ON products(created_at DESC);

-- ============================================================
-- Orders table
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  phone         TEXT NOT NULL,
  email         TEXT NOT NULL,
  location      TEXT NOT NULL,
  total_price   DECIMAL(10,2) NOT NULL CHECK (total_price > 0),
  items         JSONB NOT NULL DEFAULT '[]',
  status        TEXT DEFAULT 'pending'
                  CHECK (status IN ('pending','processing','shipped','delivered','cancelled')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_status  ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_phone   ON orders(phone);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Products: public can SELECT, only service_role can write
DROP POLICY IF EXISTS "Products: public read"  ON products;
DROP POLICY IF EXISTS "Products: service write" ON products;

CREATE POLICY "Products: public read" ON products
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Products: service write" ON products
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Orders: public can INSERT, only service_role can read all
DROP POLICY IF EXISTS "Orders: public insert"    ON orders;
DROP POLICY IF EXISTS "Orders: service read/write" ON orders;

CREATE POLICY "Orders: public insert" ON orders
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Orders: service read/write" ON orders
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================================
-- Storage Bucket
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  true,
  5242880,  -- 5 MB
  ARRAY['image/jpeg','image/png','image/webp','image/avif']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Products storage: public read"   ON storage.objects;
DROP POLICY IF EXISTS "Products storage: auth upload"   ON storage.objects;
DROP POLICY IF EXISTS "Products storage: service manage" ON storage.objects;

CREATE POLICY "Products storage: public read" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'products');

CREATE POLICY "Products storage: auth upload" ON storage.objects
  FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'products');

CREATE POLICY "Products storage: service manage" ON storage.objects
  FOR ALL TO service_role USING (bucket_id = 'products');

-- ============================================================
-- Sample Data (optional — uncomment to seed products)
-- ============================================================

/*
INSERT INTO products (title, slug, description, price, original_price, category, images, stock, featured) VALUES
(
  'Premium Kashmiri Saffron — Grade A',
  'premium-kashmiri-saffron-grade-a',
  'The finest pure Kashmiri saffron (Crocus sativus), hand-picked from the fields of Pampore. Known for its deep red color, rich aroma, and superior medicinal properties. Certified organic.',
  599, 999, 'saffron', '{}', 50, true
),
(
  'Kashmiri Walnuts — Premium Halves',
  'kashmiri-walnuts-premium-halves',
  'Fresh, light-colored walnut halves from the orchards of Shopian. Rich in omega-3 fatty acids and antioxidants. No shell, no additives — pure natural goodness.',
  399, 549, 'dry-fruits', '{}', 100, true
),
(
  'Pure Kashmiri Honey — Wild Forest',
  'pure-kashmiri-honey-wild-forest',
  'Raw, unprocessed wild forest honey collected from the high-altitude meadows of Kashmir. Dark amber in color with a complex floral bouquet.',
  449, 599, 'honey', '{}', 75, true
),
(
  'Original Kahwa — 25 Sachets',
  'original-kahwa-25-sachets',
  'Traditional Kashmiri green tea infused with cinnamon, cardamom, almonds, saffron and rose petals. A warming, aromatic blend.',
  299, 399, 'kahwa-tea', '{}', 120, false
),
(
  'Shilajit Resin — Pure Himalayan',
  'shilajit-resin-pure-himalayan',
  'Authentic Himalayan Shilajit sourced from high-altitude rocks. Packed with fulvic acid, minerals and trace elements. Lab-tested for purity.',
  799, 1299, 'shilajit', '{}', 40, true
),
(
  'Kashmiri Almonds (Mamra) — 500g',
  'kashmiri-almonds-mamra-500g',
  'Authentic Kashmiri Mamra almonds — smaller, oval-shaped and far more nutritious than regular almonds. Sourced directly from Kashmir''s almond orchards.',
  549, 699, 'dry-fruits', '{}', 80, false
);
*/

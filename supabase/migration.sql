-- ============================================================
-- UniShield First Aid & Safety — Database Migration
-- Run this in the Supabase Dashboard → SQL Editor
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── CATEGORIES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  description TEXT,
  hero_image  TEXT,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── SUBCATEGORIES ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subcategories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT NOT NULL,
  category_slug TEXT REFERENCES categories(slug) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  description   TEXT,
  sort_order    INT DEFAULT 0,
  UNIQUE(slug, category_slug)
);

-- ─── PRODUCTS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              TEXT UNIQUE NOT NULL,
  name              TEXT NOT NULL,
  category_slug     TEXT REFERENCES categories(slug) ON DELETE SET NULL,
  subcategory_slug  TEXT,
  short_description TEXT,
  description       TEXT,
  image             TEXT,
  compliance_tags   TEXT[] DEFAULT '{}',
  is_published      BOOLEAN DEFAULT TRUE,
  sort_order        INT DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_specs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  label      TEXT NOT NULL,
  value      TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- ─── COURSES ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS courses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  tagline         TEXT,
  summary         TEXT,
  hero_image      TEXT,
  duration_label  TEXT,
  compliance_tags TEXT[] DEFAULT '{}',
  is_published    BOOLEAN DEFAULT TRUE,
  sort_order      INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS course_curriculum (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id  UUID REFERENCES courses(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  body       TEXT,
  sort_order INT DEFAULT 0
);

-- ─── SERVICES ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT UNIQUE NOT NULL,
  name         TEXT NOT NULL,
  summary      TEXT,
  description  TEXT,
  hero_image   TEXT,
  bullets      TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT TRUE,
  sort_order   INT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── INDUSTRIES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS industries (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             TEXT UNIQUE NOT NULL,
  name             TEXT NOT NULL,
  headline         TEXT,
  body             TEXT,
  hero_image       TEXT,
  pain_points      TEXT[] DEFAULT '{}',
  related_products TEXT[] DEFAULT '{}',
  related_services TEXT[] DEFAULT '{}',
  related_courses  TEXT[] DEFAULT '{}',
  is_published     BOOLEAN DEFAULT TRUE,
  sort_order       INT DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─── BLOG POSTS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  title         TEXT NOT NULL,
  excerpt       TEXT,
  body          TEXT,
  category      TEXT,
  author        TEXT,
  author_title  TEXT,
  published_at  DATE,
  cover_image   TEXT,
  related_slugs TEXT[] DEFAULT '{}',
  is_published  BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── FAQS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS faqs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,  -- 'product' | 'course' | 'company'
  entity_slug TEXT,           -- slug of the product/course, NULL for company
  question    TEXT NOT NULL,
  answer      TEXT,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TESTIMONIALS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote        TEXT NOT NULL,
  name         TEXT NOT NULL,
  org          TEXT,
  location     TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  sort_order   INT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── LEADS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name   TEXT NOT NULL,
  last_name    TEXT NOT NULL,
  company      TEXT,
  phone        TEXT NOT NULL,
  email        TEXT NOT NULL,
  inquiry_type TEXT NOT NULL,
  interest     TEXT,
  message      TEXT,
  status       TEXT DEFAULT 'new',  -- new | contacted | qualified | closed
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── UPDATED_AT TRIGGER ──────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at  BEFORE UPDATE ON products  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER courses_updated_at   BEFORE UPDATE ON courses   FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────
ALTER TABLE categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories    ENABLE ROW LEVEL SECURITY;
ALTER TABLE products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_specs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses          ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_curriculum ENABLE ROW LEVEL SECURITY;
ALTER TABLE services         ENABLE ROW LEVEL SECURITY;
ALTER TABLE industries       ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs             ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials     ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads            ENABLE ROW LEVEL SECURITY;

-- Public read (anon can read published content)
CREATE POLICY "public_read_categories"       ON categories       FOR SELECT USING (true);
CREATE POLICY "public_read_subcategories"    ON subcategories    FOR SELECT USING (true);
CREATE POLICY "public_read_products"         ON products         FOR SELECT USING (is_published = true);
CREATE POLICY "public_read_product_specs"    ON product_specs    FOR SELECT USING (true);
CREATE POLICY "public_read_courses"          ON courses          FOR SELECT USING (is_published = true);
CREATE POLICY "public_read_curriculum"       ON course_curriculum FOR SELECT USING (true);
CREATE POLICY "public_read_services"         ON services         FOR SELECT USING (is_published = true);
CREATE POLICY "public_read_industries"       ON industries       FOR SELECT USING (is_published = true);
CREATE POLICY "public_read_blog_posts"       ON blog_posts       FOR SELECT USING (is_published = true);
CREATE POLICY "public_read_faqs"             ON faqs             FOR SELECT USING (true);
CREATE POLICY "public_read_testimonials"     ON testimonials     FOR SELECT USING (is_published = true);

-- Public can INSERT leads (contact form)
CREATE POLICY "public_insert_leads" ON leads FOR INSERT WITH CHECK (true);

-- Authenticated users (admins) get full access
CREATE POLICY "admin_all_categories"        ON categories        FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_subcategories"     ON subcategories     FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_products"          ON products          FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_product_specs"     ON product_specs     FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_courses"           ON courses           FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_curriculum"        ON course_curriculum FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_services"          ON services          FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_industries"        ON industries        FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_blog_posts"        ON blog_posts        FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_faqs"              ON faqs              FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_testimonials"      ON testimonials      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_leads"             ON leads             FOR ALL USING (auth.role() = 'authenticated');

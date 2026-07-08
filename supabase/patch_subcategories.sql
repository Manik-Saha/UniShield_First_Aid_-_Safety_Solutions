-- ============================================================
-- Patch: Fix subcategories table to use category_slug instead of category_id
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- Step 1: Drop the old table and recreate with category_slug
-- (Safe because seed data will be re-inserted in Step 2)
DROP TABLE IF EXISTS subcategories CASCADE;

-- Step 2: Recreate with category_slug column
CREATE TABLE subcategories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT NOT NULL,
  category_slug TEXT REFERENCES categories(slug) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  description   TEXT,
  sort_order    INT DEFAULT 0,
  UNIQUE(slug, category_slug)
);

-- Step 3: Re-enable RLS
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_subcategories"
  ON subcategories FOR SELECT USING (true);

CREATE POLICY "admin_all_subcategories"
  ON subcategories FOR ALL USING (auth.role() = 'authenticated');

-- Step 4: Re-insert all subcategory data
INSERT INTO subcategories (slug, category_slug, name, description, sort_order) VALUES
('wall-cabinets',          'first-aid-cabinets-kits',       'Wall-Mount Cabinets',              'Lockable steel cabinets for fixed workplace locations.',                  1),
('portable-kits',          'first-aid-cabinets-kits',       'Portable First Aid Kits',          'Compact kits for field crews, vehicles, and remote worksites.',           2),
('industrial-cabinets',    'first-aid-cabinets-kits',       'Industrial Cabinets',              'Heavy-duty cabinets built for manufacturing and warehouse environments.',  3),
('bandages-dressings',     'first-aid-restocking-supplies', 'Bandages & Dressings',             'Adhesive bandages, gauze, and wound-care essentials.',                    1),
('medications-ointments',  'first-aid-restocking-supplies', 'Medications & Ointments',          'OTC medications, antiseptics, and topical treatments.',                   2),
('burn-care',              'first-aid-restocking-supplies', 'Burn Care',                        'Burn gels, dressings, and cooling products.',                            3),
('gloves-hand-protection', 'ppe',                           'Gloves & Hand Protection',         'Nitrile, latex, and cut-resistant gloves.',                              1),
('eye-face-protection',    'ppe',                           'Eye & Face Protection',            'Safety glasses, goggles, and face shields.',                             2),
('respiratory-protection', 'ppe',                           'Respiratory Protection',           'Disposable masks, half-face respirators, and filters.',                  3),
('plumbed-stations',       'eye-wash-stations',             'Plumbed Eyewash Stations',         'Permanent plumbed units for high-hazard areas.',                         1),
('portable-stations',      'eye-wash-stations',             'Portable Eyewash Stations',        'Self-contained portable units for areas without plumbing.',              2),
('eyewash-supplies',       'eye-wash-stations',             'Eyewash Solution & Supplies',      'Replacement saline solution, dust covers, and accessories.',             3),
('aed-units',              'aed-supplies',                  'AED Units',                        'FDA-cleared AEDs from leading manufacturers.',                           1),
('aed-accessories',        'aed-supplies',                  'AED Accessories',                  'Replacement pads, batteries, cabinets, and signage.',                    2),
('aed-program-management', 'aed-supplies',                  'AED Program Management',           'Inspection, compliance tracking, and maintenance services.',             3),
('72-hour-kits',           'disaster-survival-kits',        '72-Hour Emergency Kits',           'Individual and group kits with food, water, and first aid.',             1),
('office-kits',            'disaster-survival-kits',        'Office Emergency Kits',            'Pre-built kits sized for teams of 10, 25, 50, or 100.',                 2),
('earthquake-supplies',    'disaster-survival-kits',        'Earthquake Preparedness Supplies', 'Specialty supplies for seismic-risk environments.',                      3)
ON CONFLICT (slug, category_slug) DO NOTHING;

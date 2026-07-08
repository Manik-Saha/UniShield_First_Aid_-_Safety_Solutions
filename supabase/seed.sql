-- ============================================================
-- UniShield Seed Data — run AFTER migration.sql
-- ============================================================

-- CATEGORIES
INSERT INTO categories (slug, name, description, hero_image, sort_order) VALUES
('first-aid-cabinets-kits',        'First Aid Cabinets & Kits',         'ANSI-compliant cabinets and kits sized for every workplace — from small offices to large industrial sites.',                       'https://picsum.photos/seed/firstaid-cabinets/800/500', 1),
('first-aid-restocking-supplies',  'First Aid Restocking Supplies',      'Everything you need to keep your cabinets fully stocked and OSHA-compliant between service visits.',                             'https://picsum.photos/seed/firstaid-supplies/800/500', 2),
('ppe',                            'PPE (Personal Protective Equipment)', 'OSHA-required personal protective equipment for every industry and hazard level.',                                               'https://picsum.photos/seed/ppe/800/500',              3),
('eye-wash-stations',              'Eye Wash Stations & Supplies',        'ANSI Z358.1-compliant eyewash stations and replacement supplies for laboratories, shops, and industrial facilities.',           'https://picsum.photos/seed/eyewash/800/500',          4),
('aed-supplies',                   'AED & Supplies',                      'Automated external defibrillators and accessories to keep your facility cardiac-emergency ready.',                                'https://picsum.photos/seed/aed/800/500',              5),
('disaster-survival-kits',         'Disaster / Survival Kits',            '72-hour and extended survival kits built for California earthquake preparedness and workplace emergency plans.',                  'https://picsum.photos/seed/disaster-kits/800/500',    6)
ON CONFLICT (slug) DO NOTHING;

-- SUBCATEGORIES
INSERT INTO subcategories (slug, category_slug, name, description, sort_order) VALUES
('wall-cabinets',          'first-aid-cabinets-kits',        'Wall-Mount Cabinets',               'Lockable steel cabinets for fixed workplace locations.',                   1),
('portable-kits',          'first-aid-cabinets-kits',        'Portable First Aid Kits',           'Compact kits for field crews, vehicles, and remote worksites.',            2),
('industrial-cabinets',    'first-aid-cabinets-kits',        'Industrial Cabinets',               'Heavy-duty cabinets built for manufacturing and warehouse environments.',   3),
('bandages-dressings',     'first-aid-restocking-supplies',  'Bandages & Dressings',              'Adhesive bandages, gauze, and wound-care essentials.',                     1),
('medications-ointments',  'first-aid-restocking-supplies',  'Medications & Ointments',           'OTC medications, antiseptics, and topical treatments.',                    2),
('burn-care',              'first-aid-restocking-supplies',  'Burn Care',                         'Burn gels, dressings, and cooling products.',                             3),
('gloves-hand-protection', 'ppe',                            'Gloves & Hand Protection',          'Nitrile, latex, and cut-resistant gloves.',                               1),
('eye-face-protection',    'ppe',                            'Eye & Face Protection',             'Safety glasses, goggles, and face shields.',                              2),
('respiratory-protection', 'ppe',                            'Respiratory Protection',            'Disposable masks, half-face respirators, and filters.',                   3),
('plumbed-stations',       'eye-wash-stations',              'Plumbed Eyewash Stations',          'Permanent plumbed units for high-hazard areas.',                          1),
('portable-stations',      'eye-wash-stations',              'Portable Eyewash Stations',         'Self-contained portable units for areas without plumbing.',               2),
('eyewash-supplies',       'eye-wash-stations',              'Eyewash Solution & Supplies',       'Replacement saline solution, dust covers, and accessories.',              3),
('aed-units',              'aed-supplies',                   'AED Units',                         'FDA-cleared AEDs from leading manufacturers.',                            1),
('aed-accessories',        'aed-supplies',                   'AED Accessories',                   'Replacement pads, batteries, cabinets, and signage.',                     2),
('aed-program-management', 'aed-supplies',                   'AED Program Management',            'Inspection, compliance tracking, and maintenance services.',              3),
('72-hour-kits',           'disaster-survival-kits',         '72-Hour Emergency Kits',            'Individual and group kits with food, water, and first aid.',              1),
('office-kits',            'disaster-survival-kits',         'Office Emergency Kits',             'Pre-built kits sized for teams of 10, 25, 50, or 100.',                  2),
('earthquake-supplies',    'disaster-survival-kits',         'Earthquake Preparedness Supplies',  'Specialty supplies for seismic-risk environments.',                       3)
ON CONFLICT (slug, category_slug) DO NOTHING;

-- PRODUCTS
INSERT INTO products (slug, name, category_slug, subcategory_slug, short_description, description, image, compliance_tags, sort_order) VALUES
('standard-wall-cabinet-25-person','Standard Wall Cabinet — 25 Person','first-aid-cabinets-kits','wall-cabinets',
  'Lockable steel wall-mount cabinet, ANSI Z308.1 compliant, stocked for up to 25 employees.',
  'A rugged, powder-coated steel cabinet with a hinged door and built-in lock. Comes fully stocked with ANSI Z308.1 Class A supplies to cover a 25-person workplace.',
  'https://picsum.photos/seed/wall-cabinet-25/600/400', ARRAY['ANSI Z308.1','OSHA Compliant'], 1),
('deluxe-wall-cabinet-50-person','Deluxe Wall Cabinet — 50 Person','first-aid-cabinets-kits','wall-cabinets',
  'Large steel cabinet with dual-door design, stocked to ANSI Class B for up to 50 employees.',
  'A heavy-duty dual-door steel cabinet designed for medium-to-large workplaces. Stocked to ANSI Z308.1 Class B.',
  'https://picsum.photos/seed/wall-cabinet-50/600/400', ARRAY['ANSI Z308.1 Class B','OSHA Compliant'], 2),
('vehicle-first-aid-kit','Vehicle / Field First Aid Kit','first-aid-cabinets-kits','portable-kits',
  'Compact, weatherproof kit for company vehicles, field crews, and remote worksites.',
  'A rugged, zip-closure kit built for vehicles and outdoor use. Contents meet ANSI Z308.1 Class A minimums.',
  'https://picsum.photos/seed/vehicle-kit/600/400', ARRAY['ANSI Z308.1','OSHA Compliant'], 3),
('nitrile-exam-gloves-box-100','Nitrile Exam Gloves — Box of 100','ppe','gloves-hand-protection',
  'Powder-free nitrile gloves, ASTM D6319 tested, available in S/M/L/XL.',
  'Medical-grade powder-free nitrile gloves offering excellent chemical and puncture resistance.',
  'https://picsum.photos/seed/nitrile-gloves/600/400', ARRAY['ASTM D6319','OSHA 1910.1030'], 1),
('portable-eyewash-station-16-gallon','Portable Eyewash Station — 16 Gallon','eye-wash-stations','portable-stations',
  'Self-contained 16-gallon eyewash station for areas without plumbing. ANSI Z358.1 compliant.',
  'A fully self-contained portable eyewash station that requires no plumbing. The 16-gallon polypropylene tank provides a 15-minute continuous flush.',
  'https://picsum.photos/seed/portable-eyewash/600/400', ARRAY['ANSI Z358.1','OSHA Compliant'], 1),
('philips-heartstart-frx-aed','Philips HeartStart FRx AED','aed-supplies','aed-units',
  'FDA-cleared, shock-advised AED designed for untrained bystanders. Built-in infant/child capability.',
  'The Philips HeartStart FRx is one of the most trusted AEDs in the workplace. Clear voice instructions guide any bystander through the shock-delivery process.',
  'https://picsum.photos/seed/philips-frx/600/400', ARRAY['FDA Cleared','OSHA Compliant'], 1),
('office-emergency-kit-25-person','Office Emergency Kit — 25 Person','disaster-survival-kits','office-kits',
  '72-hour earthquake and disaster preparedness kit for an office team of 25. California OES recommended.',
  'Pre-packaged in a rugged backpack, this kit provides 72 hours of emergency supplies for 25 employees.',
  'https://picsum.photos/seed/office-emergency-kit/600/400', ARRAY['OSHA 1910.38','FEMA Recommended','California OES'], 1),
('adhesive-bandage-assortment-box','Adhesive Bandage Assortment — Box of 100','first-aid-restocking-supplies','bandages-dressings',
  '100-count assortment of latex-free adhesive bandages in four sizes.',
  'A mixed-size box of latex-free adhesive bandages for restocking ANSI-compliant first aid kits.',
  'https://picsum.photos/seed/bandages/600/400', ARRAY['ANSI Z308.1 Compatible'], 1)
ON CONFLICT (slug) DO NOTHING;

-- PRODUCT SPECS
INSERT INTO product_specs (product_id, label, value, sort_order) VALUES
((SELECT id FROM products WHERE slug='standard-wall-cabinet-25-person'), 'Compliance', 'ANSI Z308.1 Class A', 1),
((SELECT id FROM products WHERE slug='standard-wall-cabinet-25-person'), 'Capacity',   'Up to 25 persons',    2),
((SELECT id FROM products WHERE slug='standard-wall-cabinet-25-person'), 'Material',   'Powder-coated steel', 3),
((SELECT id FROM products WHERE slug='standard-wall-cabinet-25-person'), 'Dimensions', '16" W × 20" H × 5" D',4),
((SELECT id FROM products WHERE slug='standard-wall-cabinet-25-person'), 'Locking',    'Cam lock with 2 keys',5),
((SELECT id FROM products WHERE slug='deluxe-wall-cabinet-50-person'),   'Compliance', 'ANSI Z308.1 Class B', 1),
((SELECT id FROM products WHERE slug='deluxe-wall-cabinet-50-person'),   'Capacity',   'Up to 50 persons',    2),
((SELECT id FROM products WHERE slug='nitrile-exam-gloves-box-100'),     'Material',   'Nitrile (latex-free)',1),
((SELECT id FROM products WHERE slug='nitrile-exam-gloves-box-100'),     'Standard',   'ASTM D6319',          2),
((SELECT id FROM products WHERE slug='nitrile-exam-gloves-box-100'),     'Count',      '100 per box',         3),
((SELECT id FROM products WHERE slug='portable-eyewash-station-16-gallon'),'Compliance','ANSI Z358.1',        1),
((SELECT id FROM products WHERE slug='portable-eyewash-station-16-gallon'),'Tank Capacity','16 gallons',      2),
((SELECT id FROM products WHERE slug='portable-eyewash-station-16-gallon'),'Flow Duration','15 minutes at 0.4 GPM',3),
((SELECT id FROM products WHERE slug='philips-heartstart-frx-aed'),      'FDA Clearance','510(k) cleared',   1),
((SELECT id FROM products WHERE slug='philips-heartstart-frx-aed'),      'IP Rating', 'IP55',                2),
((SELECT id FROM products WHERE slug='philips-heartstart-frx-aed'),      'Battery Life','4 years standby',   3);

-- COURSES
INSERT INTO courses (slug, name, tagline, summary, hero_image, duration_label, compliance_tags, sort_order) VALUES
('cpr-aed-first-aid','CPR/AED & First Aid','Equip your team to respond confidently in cardiac and medical emergencies.',
  'This hands-on, instructor-led course covers adult, child, and infant CPR, AED operation, and essential first aid skills.',
  'https://picsum.photos/seed/cpr-course/800/500','4 Hours',ARRAY['OSHA 1910.151','AHA Guidelines'],1),
('active-shooter-response','Active Shooter Response','Practical, scenario-based training to help employees survive and assist others during an active threat.',
  'Based on the Run-Hide-Fight framework, this course prepares employees to make fast, sound decisions during an active shooter event.',
  'https://picsum.photos/seed/active-shooter/800/500','3 Hours',ARRAY['Cal/OSHA SB 553','FEMA Recommended'],2),
('bloodborne-pathogens','Bloodborne Pathogens','Required annual training for employees with potential exposure to blood or OPIM.',
  'Mandatory under OSHA 29 CFR 1910.1030, this training covers HIV, Hepatitis B, and Hepatitis C transmission and exposure control.',
  'https://picsum.photos/seed/bbp/800/500','2 Hours',ARRAY['OSHA 1910.1030','Cal/OSHA Required'],3),
('earthquake-disaster-preparedness','Earthquake & Disaster Preparedness','Get your team ready before the next California earthquake — not after.',
  'California employers have a unique responsibility to prepare for seismic events. This course covers drop-cover-hold-on, evacuation, and post-earthquake safety.',
  'https://picsum.photos/seed/earthquake/800/500','2.5 Hours',ARRAY['Cal/OSHA 8 CCR 3220','FEMA Recommended'],4),
('fire-extinguisher-safety','Fire Extinguisher Safety','Know your fire classes, your extinguisher types, and how to use PASS — before you need to.',
  'OSHA requires that employees who are expected to use portable fire extinguishers receive training. This hands-on course covers fire chemistry and PASS technique.',
  'https://picsum.photos/seed/fire-ext/800/500','2 Hours',ARRAY['OSHA 1910.157','Cal/OSHA Required'],5),
('forklift-certification','Forklift Certification','OSHA-mandated operator training for powered industrial trucks in your facility.',
  'OSHA 29 CFR 1910.178 requires that every forklift operator be evaluated and certified by their employer.',
  'https://picsum.photos/seed/forklift/800/500','8 Hours',ARRAY['OSHA 1910.178','Cal/OSHA Required'],6),
('hazwoper','Hazwoper','OSHA-required hazardous waste operations and emergency response training.',
  'Required under OSHA 29 CFR 1910.120 for employees involved in hazmat cleanup or emergency response.',
  'https://picsum.photos/seed/hazwoper/800/500','8–40 Hours',ARRAY['OSHA 1910.120','Cal/OSHA Required'],7),
('respirator-fit-testing','Respirator Fit Testing','OSHA-compliant qualitative and quantitative fit testing for tight-fitting respirators.',
  'OSHA 29 CFR 1910.134 requires medical clearance, proper training, and annual fit testing for tight-fitting respirator users.',
  'https://picsum.photos/seed/fit-test/800/500','1–2 Hours',ARRAY['OSHA 1910.134','Cal/OSHA Required'],8),
('osha-compliance','OSHA Compliance Training','Understand your OSHA obligations before an inspection — not after.',
  'Practical overview of OSHA standards most commonly cited in SoCal workplaces, covering recordkeeping, posting requirements, and inspection prep.',
  'https://picsum.photos/seed/osha-compliance/800/500','4 Hours',ARRAY['Cal/OSHA','OSHA Compliant'],9),
('workplace-safety','Workplace Safety','Building a culture of safety that reduces incidents and keeps your team on the job.',
  'A broad-based safety orientation covering hazard identification, slip-trip-fall prevention, lockout/tagout, and emergency response.',
  'https://picsum.photos/seed/workplace-safety/800/500','3 Hours',ARRAY['OSHA 1910.132','Cal/OSHA Compliant'],10),
('workplace-violence-de-escalation','Workplace Violence & De-Escalation','Recognize warning signs and resolve conflict before it becomes a crisis.',
  'Required under California SB 553, this training covers identifying threatening behavior, de-escalation techniques, and your Workplace Violence Prevention Plan.',
  'https://picsum.photos/seed/wv-deescalation/800/500','2 Hours',ARRAY['Cal/OSHA SB 553','California Required'],11),
('heat-injury-illness-prevention','Heat Injury & Illness Prevention','California''s outdoor and indoor heat illness regulations — training that keeps people working safely.',
  'Cal/OSHA''s heat illness prevention regulations require specific training for all employees working in heat conditions.',
  'https://picsum.photos/seed/heat-illness/800/500','1.5 Hours',ARRAY['Cal/OSHA 8 CCR 3395','California Required'],12),
('sexual-harassment-prevention','Sexual Harassment Prevention','California-compliant training that meets SB 1343 requirements for supervisory and non-supervisory employees.',
  'California law requires employers with 5+ employees to provide sexual harassment prevention training every two years.',
  'https://picsum.photos/seed/harassment-prev/800/500','1–2 Hours',ARRAY['SB 1343','AB 1825','FEHA Compliant'],13)
ON CONFLICT (slug) DO NOTHING;

-- COURSE CURRICULUM (CPR/AED only as example — others omitted for brevity)
INSERT INTO course_curriculum (course_id, title, body, sort_order) VALUES
((SELECT id FROM courses WHERE slug='cpr-aed-first-aid'),'Recognizing a Life-Threatening Emergency','Participants learn how to identify cardiac arrest, severe allergic reaction, choking, and other emergencies requiring immediate intervention.',1),
((SELECT id FROM courses WHERE slug='cpr-aed-first-aid'),'Adult & Child CPR Technique','Hands-on practice of compression depth, rate, and rescue breathing on CPR manikins.',2),
((SELECT id FROM courses WHERE slug='cpr-aed-first-aid'),'AED Operation','Step-by-step operation of the workplace AED trainer.',3),
((SELECT id FROM courses WHERE slug='cpr-aed-first-aid'),'Infant CPR & Choking Response','Specialized techniques for infants including back blows, chest thrusts, and modified CPR.',4),
((SELECT id FROM courses WHERE slug='cpr-aed-first-aid'),'Basic First Aid Skills','Wound care, bleeding control, burn treatment, shock management, and recognition of stroke symptoms.',5);

-- SERVICES
INSERT INTO services (slug, name, summary, description, hero_image, bullets, sort_order) VALUES
('first-aid-restocking','First Aid Cabinet Restocking','Scheduled, documented restocking of your first aid cabinets — so you''re always OSHA-compliant, always ready.',
  'A UniShield technician visits your facility on a scheduled cadence, inspects every first aid cabinet, replaces expired or depleted supplies, and provides a signed compliance report.',
  'https://picsum.photos/seed/restocking-service/800/500',
  ARRAY['Scheduled monthly, quarterly, or custom cadence','Full inspection and restock of all cabinets on each visit','ANSI Z308.1-compliant products','Signed compliance report with technician''s findings','Expiration date tracking','No surprise charges — flat-rate service agreement'],1),
('eyewash-station-service','Eye Wash Station Servicing','ANSI Z358.1 requires weekly eyewash activation and annual inspection. We handle both.',
  'ANSI Z358.1 mandates that plumbed eyewash stations be activated weekly and self-contained units be refilled regularly.',
  'https://picsum.photos/seed/eyewash-service/800/500',
  ARRAY['Weekly activation and water flush per ANSI Z358.1','Portable unit refills with fresh buffered saline solution','Annual formal inspection with documented results','Replacement of worn heads, dust covers, and signage','Compliance report after each visit'],2),
('aed-maintenance','AED Maintenance & Management','Keep your AED ready to save a life — routine maintenance, battery replacement, and compliance tracking.',
  'Our AED maintenance program ensures your unit stays in ready status through scheduled inspections and proactive consumable replacement.',
  'https://picsum.photos/seed/aed-maintenance/800/500',
  ARRAY['Annual AED inspection and function test','Proactive replacement of pads and batteries before expiration','Compliance calendar with email reminders','AED registration and local EMS notification support','All major brands supported (Philips, Zoll, Defibtech, Cardiac Science)'],3),
('training-compliance','Training & Compliance Management','Ongoing coordination of your employee safety training schedule, records, and renewal tracking.',
  'Our Training & Compliance Management service assigns a dedicated coordinator who tracks completion records and schedules refresher courses.',
  'https://picsum.photos/seed/training-mgmt/800/500',
  ARRAY['Dedicated compliance coordinator','Training calendar with renewal reminders','Digital storage of all completion certificates','Scheduling of on-site instructor-led sessions','Coverage for all Cal/OSHA and California-mandated training'],4),
('fire-protection','Fire Protection Services','Fire extinguisher inspection, recharge, and hydrostatic testing — all backed by documentation.',
  'OSHA 29 CFR 1910.157 and NFPA 10 require annual inspection of portable fire extinguishers and periodic hydrostatic testing.',
  'https://picsum.photos/seed/fire-protection/800/500',
  ARRAY['Annual visual inspection per NFPA 10 and OSHA 1910.157','Recharge and refill of discharged extinguishers','6-year internal maintenance and 12-year hydrostatic testing','Inspection tags and compliance documentation'],5),
('facility-services','Facility Safety Services','A bundled safety program covering multiple compliance areas under one service agreement.',
  'For facilities that want a single partner, our Facility Services program bundles first aid restocking, eyewash servicing, AED maintenance, and training compliance into one annual contract.',
  'https://picsum.photos/seed/facility-services/800/500',
  ARRAY['Single point of contact for all safety services','Bundled first aid, eyewash, AED, and training management','One annual contract with consolidated billing','Master compliance calendar tracking all deadlines','Annual safety program review with recommendations'],6)
ON CONFLICT (slug) DO NOTHING;

-- INDUSTRIES
INSERT INTO industries (slug, name, headline, body, hero_image, pain_points, related_products, related_services, related_courses, sort_order) VALUES
('offices','Offices','Keep your team safe and your building OSHA-compliant — without adding to your HR team''s plate.',
  'Office environments carry real OSHA obligations that are easy to overlook: mandatory first aid supplies, bloodborne pathogen training, and emergency action plans.',
  'https://picsum.photos/seed/office-industry/800/500',
  ARRAY['OSHA first aid cabinet requirements scale with headcount','Bloodborne pathogen training is annual and must be documented','Emergency Action Plans require employee training','Expired supplies in cabinets are an immediate OSHA citation'],
  ARRAY['first-aid-cabinets-kits','first-aid-restocking-supplies'],
  ARRAY['first-aid-restocking','training-compliance'],
  ARRAY['bloodborne-pathogens','cpr-aed-first-aid'],1),
('schools','Schools & Educational Institutions','Students, staff, and visitors depend on you to be prepared. UniShield helps you stay ready.',
  'Schools face a wide range of emergency scenarios and must maintain compliance across multiple OSHA and Title 22 requirements simultaneously.',
  'https://picsum.photos/seed/school-industry/800/500',
  ARRAY['Multiple buildings require multiple stocked cabinets','AED placement requirements mandate devices in specific locations','Active shooter and lockdown drills must be documented annually','Large staff turnover means CPR/AED training certification lapses'],
  ARRAY['first-aid-cabinets-kits','aed-supplies'],
  ARRAY['first-aid-restocking','aed-maintenance'],
  ARRAY['cpr-aed-first-aid','active-shooter-response'],2),
('restaurants','Restaurants & Food Service','Fast-paced kitchens and high staff turnover make compliance harder — and more important.',
  'Restaurant environments have elevated injury risk: burns, cuts, slip-and-fall. Cal/OSHA enforces first aid requirements in food service as vigorously as in any other industry.',
  'https://picsum.photos/seed/restaurant-industry/800/500',
  ARRAY['High staff turnover means training records lapse constantly','Kitchen injuries require well-stocked burn care and wound treatment','Bloodborne pathogen training is mandatory for any employee who may be exposed to blood','Health department inspections increasingly check first aid compliance'],
  ARRAY['first-aid-cabinets-kits','first-aid-restocking-supplies'],
  ARRAY['first-aid-restocking','training-compliance'],
  ARRAY['bloodborne-pathogens','cpr-aed-first-aid'],3),
('medical-dental','Medical & Dental Offices','Your patients expect clinical-grade safety. Your compliance obligations do too.',
  'Medical and dental offices operate under both OSHA and California Department of Public Health requirements.',
  'https://picsum.photos/seed/medical-industry/800/500',
  ARRAY['OSHA bloodborne pathogen standards require annual training and a written Exposure Control Plan','PPE inventory must match exposure risks','Sharps container management and disposal records must be maintained','Staff CPR certification lapses are a liability risk'],
  ARRAY['ppe','first-aid-restocking-supplies'],
  ARRAY['training-compliance','first-aid-restocking'],
  ARRAY['bloodborne-pathogens','cpr-aed-first-aid'],4),
('shops-factories','Shops & Factories','Industrial hazards demand industrial-grade compliance. UniShield delivers both.',
  'Manufacturing, fabrication, and warehouse environments face the broadest range of OSHA requirements: first aid, PPE, lockout/tagout, eyewash, hazmat, forklift, and more.',
  'https://picsum.photos/seed/factory-industry/800/500',
  ARRAY['Eyewash stations must be within 10 seconds of hazardous chemical areas per ANSI Z358.1','Forklift operators must be evaluated and certified by the employer','PPE selection must be based on a documented hazard assessment','HAZWOPER training is mandatory for hazmat employees'],
  ARRAY['eye-wash-stations','ppe','first-aid-cabinets-kits'],
  ARRAY['eyewash-station-service','fire-protection','facility-services'],
  ARRAY['forklift-certification','hazwoper','respirator-fit-testing'],5),
('film-industry','Film & Entertainment Industry','Production sets move fast and span multiple locations. Your safety program has to keep up.',
  'Film productions carry unique hazards: stunt work, pyrotechnics, electrical rigging, remote locations, and constantly rotating crews.',
  'https://picsum.photos/seed/film-industry/800/500',
  ARRAY['Production locations change daily — portable first aid solutions are essential','Large rotating crews mean CPR/AED training must reach a constantly changing workforce','Union safety bulletins require specific training records for productions','Remote or outdoor locations may require disaster and emergency preparedness planning'],
  ARRAY['first-aid-cabinets-kits','disaster-survival-kits','ppe'],
  ARRAY['training-compliance','facility-services'],
  ARRAY['cpr-aed-first-aid','active-shooter-response','heat-injury-illness-prevention'],6)
ON CONFLICT (slug) DO NOTHING;

-- BLOG POSTS
INSERT INTO blog_posts (slug, title, excerpt, body, category, author, author_title, published_at, cover_image, related_slugs) VALUES
('cal-osha-first-aid-cabinet-requirements-2024','What Cal/OSHA Actually Requires for First Aid Cabinets in 2024',
  'Most SoCal employers know they need a first aid cabinet. Fewer know the specific ANSI Z308.1 requirements that determine whether their cabinet passes an inspection.',
  'California employers are subject to both federal OSHA (29 CFR 1910.151) and Cal/OSHA first aid regulations...','First Aid','UniShield Safety Team','Workplace Safety Specialists','2024-09-15','https://picsum.photos/seed/blog-firstaid/800/500',ARRAY['aed-workplace-requirements-california']),
('california-sb-553-workplace-violence-prevention','California SB 553: What Every Employer Needs to Know Before the Deadline',
  'California''s Workplace Violence Prevention Plan requirement took effect July 1, 2024. Here''s what the law requires, who it covers, and how to get compliant.',
  'California Senate Bill 553 created a new requirement under Cal/OSHA...','Safety Training','UniShield Safety Team','Workplace Safety Specialists','2024-08-01','https://picsum.photos/seed/blog-sb553/800/500',ARRAY['cal-osha-first-aid-cabinet-requirements-2024']),
('earthquake-preparedness-workplace-socal','Is Your SoCal Workplace Actually Prepared for an Earthquake?',
  'Southern California sits on some of the most active fault systems in the country. Most workplaces have a plan — fewer have tested it.',
  'The Southern California region sits atop or near several major fault systems...','Disaster Preparedness','UniShield Safety Team','Workplace Safety Specialists','2024-06-20','https://picsum.photos/seed/blog-earthquake/800/500',ARRAY['cal-osha-first-aid-cabinet-requirements-2024']),
('aed-workplace-requirements-california','AED Requirements for California Workplaces: What Employers Need to Know',
  'California has some of the most specific AED laws in the country. Does your workplace need one?',
  'Automated external defibrillators (AEDs) save lives — but only if they''re in the right place...','First Aid','UniShield Safety Team','Workplace Safety Specialists','2024-05-10','https://picsum.photos/seed/blog-aed/800/500',ARRAY['cal-osha-first-aid-cabinet-requirements-2024']),
('cal-osha-heat-illness-prevention-2024','Cal/OSHA''s Indoor Heat Illness Rule: New Requirements for SoCal Employers',
  'California extended its heat illness prevention rules to indoor workplaces in 2024.',
  'Cal/OSHA''s indoor heat illness prevention regulation (8 CCR 3396) took effect in July 2024...','Safety Training','UniShield Safety Team','Workplace Safety Specialists','2024-04-22','https://picsum.photos/seed/blog-heat/800/500',ARRAY['cal-osha-first-aid-cabinet-requirements-2024']),
('fire-extinguisher-inspection-osha-requirements','Fire Extinguisher Inspection: What OSHA Requires and What Most Employers Miss',
  'Annual inspection, monthly checks, 6-year maintenance, 12-year hydrostatic testing — fire extinguisher compliance has more moving parts than most employers realize.',
  'OSHA 29 CFR 1910.157 and NFPA 10 establish a multi-layer maintenance schedule...','Fire Safety','UniShield Safety Team','Workplace Safety Specialists','2024-03-05','https://picsum.photos/seed/blog-fire/800/500',ARRAY['cal-osha-first-aid-cabinet-requirements-2024'])
ON CONFLICT (slug) DO NOTHING;

-- FAQs
INSERT INTO faqs (entity_type, entity_slug, question, answer, sort_order) VALUES
('product','standard-wall-cabinet-25-person','Can UniShield restock this cabinet on a scheduled basis?','Yes. Our restocking service can be scheduled monthly, quarterly, or on a custom cadence.',1),
('product','standard-wall-cabinet-25-person','Is this cabinet OSHA compliant?','Yes. When stocked per the included contents list it meets OSHA 29 CFR 1910.151 requirements.',2),
('product','nitrile-exam-gloves-box-100','Are these suitable for bloodborne pathogen response?','Yes. When used with proper training and other PPE, these gloves meet the barrier requirements under OSHA 29 CFR 1910.1030.',1),
('product','portable-eyewash-station-16-gallon','How often does the water need to be changed?','ANSI Z358.1 recommends flushing and refilling at least weekly to maintain water quality.',1),
('product','philips-heartstart-frx-aed','Do we need a trained person on staff to use an AED?','No. AEDs are designed for use by untrained bystanders. However, we strongly recommend pairing your AED with CPR/AED training.',1),
('product','office-emergency-kit-25-person','Is this kit required by OSHA?','OSHA 29 CFR 1910.38 requires employers to have an Emergency Action Plan. Having a kit supports your plan.',1),
('course','cpr-aed-first-aid','Does this course provide certification?','Our training delivers skill-based competency in line with American Heart Association guidelines. Certificates of completion are issued.',1),
('course','cpr-aed-first-aid','How many employees can attend one session?','We recommend a maximum of 10–15 participants per instructor to ensure adequate hands-on practice time.',2),
('course','bloodborne-pathogens','How often is this training required?','OSHA requires annual retraining for all employees with potential exposure. Training records must be retained for three years.',1),
('course','workplace-violence-de-escalation','Is this training required under California law?','Yes. California SB 553, effective July 1, 2024, requires most California employers to provide this training annually.',1),
('company',NULL,'What areas do you serve?','UniShield serves businesses across five Southern California counties: Los Angeles, San Diego, Orange, Ventura, and San Bernardino.',1),
('company',NULL,'How do I schedule a restocking service?','Contact us via the quote form or by phone at (800) 480-5855. We''ll assess your facility and set up a service agreement.',2),
('company',NULL,'Do you provide documentation for OSHA inspections?','Yes. Every service visit generates a signed compliance report that satisfies OSHA inspectors.',3),
('company',NULL,'Can I bundle multiple services into one agreement?','Yes. Our Facility Safety Services program bundles first aid, eyewash, AED, and training into one annual contract.',4)
ON CONFLICT DO NOTHING;

-- TESTIMONIALS
INSERT INTO testimonials (quote, name, org, location, sort_order) VALUES
('UniShield has handled our first aid cabinet restocking for three years. Every visit is documented, every cabinet is compliant, and when an OSHA inspector came through last spring they had zero findings on our first aid program.','Sandra R.','Facilities Manager, Manufacturing Company','Los Angeles County',1),
('We needed CPR/AED and active shooter training for 60 employees across two buildings in one week. UniShield scheduled it all, sent a great instructor, and had the certificates to us the same day.','Michael T.','HR Director, Corporate Office','Orange County',2),
('When we opened our third location, we called UniShield before we called the interior designer. They set up the cabinets, eyewash stations, and AEDs correctly from day one.','Priya N.','Practice Administrator, Multi-Location Dental Group','San Diego County',3),
('I was nervous about our first Cal/OSHA inspection. UniShield had trained our team on bloodborne pathogens, restocked every cabinet, and given us a compliance report for every service visit.','Carlos M.','Safety Officer, Food Processing Facility','Ventura County',4)
ON CONFLICT DO NOTHING;

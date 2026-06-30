import type { Category } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "first-aid-cabinets-kits",
    name: "First Aid Cabinets & Kits",
    description: "ANSI-compliant cabinets and kits sized for every workplace — from small offices to large industrial sites.",
    heroImage: "https://picsum.photos/seed/firstaid-cabinets/800/500",
    subcategories: [
      { slug: "wall-cabinets", name: "Wall-Mount Cabinets", description: "Lockable steel cabinets for fixed workplace locations." },
      { slug: "portable-kits", name: "Portable First Aid Kits", description: "Compact kits for field crews, vehicles, and remote worksites." },
      { slug: "industrial-cabinets", name: "Industrial Cabinets", description: "Heavy-duty cabinets built for manufacturing and warehouse environments." },
    ],
  },
  {
    slug: "first-aid-restocking-supplies",
    name: "First Aid Restocking Supplies",
    description: "Everything you need to keep your cabinets fully stocked and OSHA-compliant between service visits.",
    heroImage: "https://picsum.photos/seed/firstaid-supplies/800/500",
    subcategories: [
      { slug: "bandages-dressings", name: "Bandages & Dressings", description: "Adhesive bandages, gauze, and wound-care essentials." },
      { slug: "medications-ointments", name: "Medications & Ointments", description: "OTC medications, antiseptics, and topical treatments." },
      { slug: "burn-care", name: "Burn Care", description: "Burn gels, dressings, and cooling products." },
    ],
  },
  {
    slug: "ppe",
    name: "PPE (Personal Protective Equipment)",
    description: "OSHA-required personal protective equipment for every industry and hazard level.",
    heroImage: "https://picsum.photos/seed/ppe/800/500",
    subcategories: [
      { slug: "gloves-hand-protection", name: "Gloves & Hand Protection", description: "Nitrile, latex, and cut-resistant gloves." },
      { slug: "eye-face-protection", name: "Eye & Face Protection", description: "Safety glasses, goggles, and face shields." },
      { slug: "respiratory-protection", name: "Respiratory Protection", description: "Disposable masks, half-face respirators, and filters." },
    ],
  },
  {
    slug: "eye-wash-stations",
    name: "Eye Wash Stations & Supplies",
    description: "ANSI Z358.1-compliant eyewash stations and replacement supplies for laboratories, shops, and industrial facilities.",
    heroImage: "https://picsum.photos/seed/eyewash/800/500",
    subcategories: [
      { slug: "plumbed-stations", name: "Plumbed Eyewash Stations", description: "Permanent plumbed units for high-hazard areas." },
      { slug: "portable-stations", name: "Portable Eyewash Stations", description: "Self-contained portable units for areas without plumbing." },
      { slug: "eyewash-supplies", name: "Eyewash Solution & Supplies", description: "Replacement saline solution, dust covers, and accessories." },
    ],
  },
  {
    slug: "aed-supplies",
    name: "AED & Supplies",
    description: "Automated external defibrillators and accessories to keep your facility cardiac-emergency ready.",
    heroImage: "https://picsum.photos/seed/aed/800/500",
    subcategories: [
      { slug: "aed-units", name: "AED Units", description: "FDA-cleared AEDs from leading manufacturers." },
      { slug: "aed-accessories", name: "AED Accessories", description: "Replacement pads, batteries, cabinets, and signage." },
      { slug: "aed-program-management", name: "AED Program Management", description: "Inspection, compliance tracking, and maintenance services." },
    ],
  },
  {
    slug: "disaster-survival-kits",
    name: "Disaster / Survival Kits",
    description: "72-hour and extended survival kits built for California earthquake preparedness and workplace emergency plans.",
    heroImage: "https://picsum.photos/seed/disaster-kits/800/500",
    subcategories: [
      { slug: "72-hour-kits", name: "72-Hour Emergency Kits", description: "Individual and group kits with food, water, and first aid." },
      { slug: "office-kits", name: "Office Emergency Kits", description: "Pre-built kits sized for teams of 10, 25, 50, or 100." },
      { slug: "earthquake-supplies", name: "Earthquake Preparedness Supplies", description: "Specialty supplies for seismic-risk environments." },
    ],
  },
];

// llms.txt is an emerging convention for providing AI systems with structured
// information about a website's content. See https://llmstxt.org for context.

import { createStaticClient } from "@/lib/supabase/static";

export const revalidate = 86400;

export async function GET() {
  const supabase = createStaticClient();

  const [{ data: categories }, { data: courses }, { data: services }] = await Promise.all([
    supabase.from("categories").select("name, description").order("sort_order"),
    supabase.from("courses").select("name, duration_label, tagline").eq("is_published", true).order("sort_order"),
    supabase.from("services").select("name, summary").eq("is_published", true).order("sort_order"),
  ]);

  const lines: string[] = [
    "# UniShield First Aid & Safety",
    "",
    "## About",
    "UniShield First Aid & Safety (also known as SoCal First Aid) is a B2B first-aid-and-safety company",
    "founded in 1996 and headquartered in San Fernando, CA. It serves businesses across five Southern",
    "California counties: Los Angeles, San Diego, Orange, Ventura, and San Bernardino.",
    "",
    "Phone: (800) 480-5855",
    "Email: sales@socalfirstaid.com",
    "Address: 599 4th St., San Fernando, CA 91340",
    "Website: https://www.socalfirstaid.com",
    "",
    "## What We Do",
    "1. Sell safety products (quote-based, no e-commerce checkout) — first aid cabinets, PPE, eyewash stations, AEDs, disaster kits",
    "2. Provide recurring services — first aid restocking, eyewash servicing, AED maintenance, training compliance, fire protection",
    "3. Deliver on-site safety training courses — instructor-led, delivered at the client's facility",
    "",
    "## Product Categories",
    ...(categories ?? []).map((c) => `- ${c.name}: ${c.description ?? ""}`),
    "",
    "## Training Courses",
    ...(courses ?? []).map((c) => `- ${c.name} (${c.duration_label ?? ""}): ${c.tagline ?? ""}`),
    "",
    "## Services",
    ...(services ?? []).map((s) => `- ${s.name}: ${s.summary ?? ""}`),
    "",
    "## Key URLs",
    "- Products: https://www.socalfirstaid.com/products",
    "- Training: https://www.socalfirstaid.com/training",
    "- Services: https://www.socalfirstaid.com/services",
    "- Who We Help: https://www.socalfirstaid.com/who-we-help",
    "- Blog: https://www.socalfirstaid.com/blog",
    "- Contact / Quote: https://www.socalfirstaid.com/contact",
    "- FAQ: https://www.socalfirstaid.com/faq",
    "",
    "## Audience",
    "Facility managers, HR directors, safety officers, and office managers at businesses in Southern California",
    "responsible for OSHA compliance. This is a lead-generation site — there is no shopping cart.",
    "All product inquiries end in a quote request.",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

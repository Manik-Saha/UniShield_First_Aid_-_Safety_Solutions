import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import type { Category, Course, Service, Industry, BlogPost, Testimonial, Product, FAQ } from "@/lib/types";

// ─── CATEGORIES ──────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*, subcategories(slug, name, description, sort_order)")
    .order("sort_order");
  if (error || !data) return [];
  return data.map((row) => ({
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    heroImage: row.hero_image ?? "",
    subcategories: (row.subcategories ?? [])
      .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
      .map((s: { slug: string; name: string; description: string | null }) => ({
        slug: s.slug,
        name: s.name,
        description: s.description ?? "",
      })),
  }));
}

export async function getCategory(slug: string): Promise<Category | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*, subcategories(slug, name, description, sort_order)")
    .eq("slug", slug)
    .single();
  if (error || !data) return null;
  return {
    slug: data.slug,
    name: data.name,
    description: data.description ?? "",
    heroImage: data.hero_image ?? "",
    subcategories: (data.subcategories ?? [])
      .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
      .map((s: { slug: string; name: string; description: string | null }) => ({
        slug: s.slug,
        name: s.name,
        description: s.description ?? "",
      })),
  };
}

// ─── PRODUCTS ────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_specs(label, value, sort_order)")
    .eq("is_published", true)
    .order("sort_order");
  if (error || !data) return [];
  return data.map(dbProductToProduct);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_specs(label, value, sort_order)")
    .eq("is_published", true)
    .eq("category_slug", categorySlug)
    .order("sort_order");
  if (error || !data) return [];
  return data.map(dbProductToProduct);
}

export async function getProduct(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_specs(label, value, sort_order)")
    .eq("slug", slug)
    .single();
  if (error || !data) return null;

  const faqs = await getFaqsForEntity("product", slug);
  const product = dbProductToProduct(data);
  return { ...product, faqs };
}

function dbProductToProduct(row: Record<string, unknown>): Product {
  const specs = (row.product_specs as { label: string; value: string; sort_order: number }[] ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(({ label, value }) => ({ label, value }));
  return {
    slug: row.slug as string,
    name: row.name as string,
    category: row.category_slug as string ?? "",
    subcategory: row.subcategory_slug as string ?? "",
    shortDescription: row.short_description as string ?? "",
    description: row.description as string ?? "",
    image: row.image as string ?? "",
    specs,
    faqs: [],
    complianceTags: (row.compliance_tags as string[]) ?? [],
  };
}

// ─── COURSES ─────────────────────────────────────────────────

export async function getCourses(): Promise<Course[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*, course_curriculum(title, body, sort_order)")
    .eq("is_published", true)
    .order("sort_order");
  if (error || !data) return [];
  return data.map(dbCourseToCourse);
}

export async function getCourse(slug: string): Promise<Course | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*, course_curriculum(title, body, sort_order)")
    .eq("slug", slug)
    .single();
  if (error || !data) return null;
  const faqs = await getFaqsForEntity("course", slug);
  return { ...dbCourseToCourse(data), faqs };
}

function dbCourseToCourse(row: Record<string, unknown>): Course {
  const curriculum = (row.course_curriculum as { title: string; body: string; sort_order: number }[] ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(({ title, body }) => ({ title, body }));
  return {
    slug: row.slug as string,
    name: row.name as string,
    tagline: row.tagline as string ?? "",
    summary: row.summary as string ?? "",
    heroImage: row.hero_image as string ?? "",
    durationLabel: row.duration_label as string ?? "",
    curriculum,
    faqs: [],
    complianceTags: (row.compliance_tags as string[]) ?? [],
  };
}

// ─── SERVICES ────────────────────────────────────────────────

export async function getServices(): Promise<Service[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  if (error || !data) return [];
  return data.map(dbServiceToService);
}

export async function getService(slug: string): Promise<Service | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error || !data) return null;
  const faqs = await getFaqsForEntity("service", slug);
  return { ...dbServiceToService(data), faqs };
}

function dbServiceToService(row: Record<string, unknown>): Service {
  return {
    slug: row.slug as string,
    name: row.name as string,
    summary: row.summary as string ?? "",
    description: row.description as string ?? "",
    heroImage: row.hero_image as string ?? "",
    bullets: (row.bullets as string[]) ?? [],
    faqs: [],
  };
}

// ─── INDUSTRIES ──────────────────────────────────────────────

export async function getIndustries(): Promise<Industry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("industries")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  if (error || !data) return [];
  return data.map(dbIndustryToIndustry);
}

export async function getIndustry(slug: string): Promise<Industry | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("industries")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error || !data) return null;
  return dbIndustryToIndustry(data);
}

function dbIndustryToIndustry(row: Record<string, unknown>): Industry {
  return {
    slug: row.slug as string,
    name: row.name as string,
    headline: row.headline as string ?? "",
    body: row.body as string ?? "",
    heroImage: row.hero_image as string ?? "",
    painPoints: (row.pain_points as string[]) ?? [],
    relatedProducts: (row.related_products as string[]) ?? [],
    relatedServices: (row.related_services as string[]) ?? [],
    relatedCourses: (row.related_courses as string[]) ?? [],
  };
}

// ─── BLOG POSTS ──────────────────────────────────────────────

export async function getPosts(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  if (error || !data) return [];
  return data.map(dbPostToPost);
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error || !data) return null;
  return dbPostToPost(data);
}

export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  const supabase = await createClient();
  const categoryLabel = category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .ilike("category", categoryLabel)
    .order("published_at", { ascending: false });
  if (error || !data) return [];
  return data.map(dbPostToPost);
}

function dbPostToPost(row: Record<string, unknown>): BlogPost {
  return {
    slug: row.slug as string,
    title: row.title as string,
    excerpt: row.excerpt as string ?? "",
    body: row.body as string ?? "",
    category: row.category as string ?? "",
    author: row.author as string ?? "",
    authorTitle: row.author_title as string ?? "",
    publishedAt: (row.published_at as string) ?? "",
    coverImage: row.cover_image as string ?? "",
    relatedSlugs: (row.related_slugs as string[]) ?? [],
  };
}

// ─── TESTIMONIALS ─────────────────────────────────────────────

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  if (error || !data) return [];
  return data.map((row) => ({
    quote: row.quote,
    name: row.name,
    org: row.org ?? "",
    location: row.location ?? "",
  }));
}

// ─── FAQs ────────────────────────────────────────────────────

export async function getFaqsForEntity(
  entityType: string,
  entitySlug: string | null
): Promise<FAQ[]> {
  const supabase = await createClient();
  let query = supabase
    .from("faqs")
    .select("question, answer, sort_order")
    .eq("entity_type", entityType)
    .order("sort_order");

  if (entitySlug) {
    query = query.eq("entity_slug", entitySlug);
  } else {
    query = query.is("entity_slug", null);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data.map((row) => ({ question: row.question, answer: row.answer ?? "" }));
}

export async function getCompanyFaqs(): Promise<FAQ[]> {
  return getFaqsForEntity("company", null);
}

// ─── STATIC PARAMS HELPERS ────────────────────────────────────
// Used by generateStaticParams — falls back to mock data if DB unavailable

export async function getCategorySlugs(): Promise<string[]> {
  const supabase = createStaticClient();
  const { data } = await supabase.from("categories").select("slug");
  if (!data || data.length === 0) {
    const { categories } = await import("@/lib/mock-data");
    return categories.map((c) => c.slug);
  }
  return data.map((r) => r.slug);
}

export async function getProductSlugs(): Promise<{ category: string; product: string }[]> {
  const supabase = createStaticClient();
  const { data } = await supabase.from("products").select("slug, category_slug");
  if (!data || data.length === 0) {
    const { products } = await import("@/lib/mock-data");
    return products.map((p) => ({ category: p.category, product: p.slug }));
  }
  return data.map((r) => ({ category: r.category_slug ?? "", product: r.slug }));
}

export async function getCourseSlugs(): Promise<string[]> {
  const supabase = createStaticClient();
  const { data } = await supabase.from("courses").select("slug");
  if (!data || data.length === 0) {
    const { courses } = await import("@/lib/mock-data");
    return courses.map((c) => c.slug);
  }
  return data.map((r) => r.slug);
}

export async function getServiceSlugs(): Promise<string[]> {
  const supabase = createStaticClient();
  const { data } = await supabase.from("services").select("slug");
  if (!data || data.length === 0) {
    const { services } = await import("@/lib/mock-data");
    return services.map((s) => s.slug);
  }
  return data.map((r) => r.slug);
}

export async function getIndustrySlugs(): Promise<string[]> {
  const supabase = createStaticClient();
  const { data } = await supabase.from("industries").select("slug");
  if (!data || data.length === 0) {
    const { industries } = await import("@/lib/mock-data");
    return industries.map((i) => i.slug);
  }
  return data.map((r) => r.slug);
}

export async function getPostSlugs(): Promise<string[]> {
  const supabase = createStaticClient();
  const { data } = await supabase.from("blog_posts").select("slug").eq("is_published", true);
  if (!data || data.length === 0) {
    const { posts } = await import("@/lib/mock-data");
    return posts.map((p) => p.slug);
  }
  return data.map((r) => r.slug);
}

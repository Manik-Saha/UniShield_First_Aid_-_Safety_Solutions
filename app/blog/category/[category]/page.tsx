import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "@/lib/mock-data/posts";
import { SafetyTag } from "@/components/SafetyTag";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SectionReveal } from "@/components/SectionReveal";
import { JsonLd } from "@/components/JsonLd";

const BLOG_CATEGORIES = [
  { slug: "disaster-preparedness", name: "Disaster Preparedness" },
  { slug: "fire-safety", name: "Fire Safety" },
  { slug: "first-aid", name: "First Aid" },
  { slug: "general", name: "General" },
  { slug: "safety-training", name: "Safety Training" },
];

export const revalidate = 3600;

export async function generateStaticParams() {
  return BLOG_CATEGORIES.map((cat) => ({ category: cat.slug }));
}

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const cat = BLOG_CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return {};
  return {
    title: `${cat.name} — Blog`,
    description: `Workplace safety articles in the ${cat.name} category from UniShield.`,
  };
}

export default async function BlogCategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const cat = BLOG_CATEGORIES.find((c) => c.slug === slug);
  if (!cat) notFound();

  const filtered = posts.filter(
    (p) => p.category.toLowerCase().replace(/\s+/g, "-") === slug
  );

  return (
    <>
      <JsonLd />
      <div className="bg-ink py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { name: "Home", href: "/" },
              { name: "Blog", href: "/blog" },
              { name: cat.name, href: `/blog/category/${slug}` },
            ]}
          />
          <h1 className="font-display font-extrabold text-3xl text-white mt-4">{cat.name}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filtered.length === 0 ? (
          <p className="text-ink/50 text-sm">No posts in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <SectionReveal key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block bg-white rounded-lg border border-line overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="relative h-44">
                    <Image src={post.coverImage} alt={post.title} fill className="object-cover" sizes="33vw" />
                  </div>
                  <div className="p-5">
                    <SafetyTag label={post.category} />
                    <h2 className="font-sans font-semibold text-ink text-sm mt-2 mb-2 group-hover:text-safety-red transition-colors">{post.title}</h2>
                    <p className="text-xs text-ink/60 leading-relaxed">{post.excerpt}</p>
                  </div>
                </Link>
              </SectionReveal>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

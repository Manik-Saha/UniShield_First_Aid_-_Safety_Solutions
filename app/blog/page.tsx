import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { posts } from "@/lib/mock-data/posts";
import { SafetyTag } from "@/components/SafetyTag";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SectionReveal } from "@/components/SectionReveal";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Safety Resources Blog",
  description:
    "OSHA compliance guides, Cal/OSHA updates, and workplace safety resources from the UniShield team.",
};

const BLOG_CATEGORIES = ["Disaster Preparedness", "Fire Safety", "First Aid", "General", "Safety Training"];

export default function BlogPage() {
  const [featured, ...rest] = posts;

  return (
    <>
      <JsonLd />
      <div className="bg-ink py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Blog", href: "/blog" }]} />
          <h1 className="font-display font-extrabold text-4xl text-white mt-4 mb-2">Safety Resources</h1>
          <p className="text-white/60 text-sm">OSHA compliance guides and workplace safety insights from the UniShield team.</p>
        </div>
      </div>

      {/* Category filter */}
      <div className="bg-white border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap gap-2">
          <Link href="/blog" className="font-mono text-xs uppercase tracking-widest text-safety-red border border-safety-red px-3 py-1 rounded">
            All
          </Link>
          {BLOG_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/blog/category/${cat.toLowerCase().replace(/\s+/g, "-")}`}
              className="font-mono text-xs uppercase tracking-widest text-ink/60 border border-line px-3 py-1 rounded hover:border-ink/30 hover:text-ink transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured */}
        {featured && (
          <SectionReveal>
            <Link
              href={`/blog/${featured.slug}`}
              className="group block bg-white rounded-lg border border-line overflow-hidden hover:shadow-lg transition-all duration-200 mb-10"
            >
              <div className="grid md:grid-cols-2">
                <div className="relative h-56 md:h-auto bg-line">
                  <Image src={featured.coverImage} alt={featured.title} fill className="object-cover" sizes="50vw" />
                </div>
                <div className="p-7 flex flex-col justify-center">
                  <SafetyTag label={featured.category} />
                  <h2 className="font-display font-bold text-2xl text-ink mt-3 mb-2 group-hover:text-safety-red transition-colors leading-snug">
                    {featured.title}
                  </h2>
                  <p className="text-ink/60 text-sm leading-relaxed mb-4">{featured.excerpt}</p>
                  <div className="flex items-center gap-2 text-xs text-ink/40 font-mono">
                    <span>{featured.author}</span>
                    <span>·</span>
                    <span>{featured.publishedAt}</span>
                  </div>
                </div>
              </div>
            </Link>
          </SectionReveal>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post) => (
            <SectionReveal key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block bg-white rounded-lg border border-line overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 h-full"
              >
                <div className="relative h-44">
                  <Image src={post.coverImage} alt={post.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
                </div>
                <div className="p-5">
                  <SafetyTag label={post.category} />
                  <h3 className="font-sans font-semibold text-ink text-sm mt-2 mb-2 group-hover:text-safety-red transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-ink/60 leading-relaxed mb-3">{post.excerpt}</p>
                  <div className="flex items-center gap-1 text-xs text-ink/40 font-mono">
                    <span>{post.author}</span>
                    <span>·</span>
                    <span>{post.publishedAt}</span>
                  </div>
                </div>
              </Link>
            </SectionReveal>
          ))}
        </div>
      </div>
    </>
  );
}

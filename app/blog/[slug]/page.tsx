import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getPosts, getPostSlugs } from "@/lib/data";
import { SafetyTag } from "@/components/SafetyTag";
import { Cross } from "@/components/Cross";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { blogPostSchema, breadcrumbSchema } from "@/lib/schema";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  // Fetch related posts if slugs are defined
  const related = post.relatedSlugs?.length
    ? (await Promise.all(post.relatedSlugs.map((s) => getPost(s)))).filter(Boolean)
    : [];

  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: post.title, href: `/blog/${slug}` },
  ];

  // Render basic markdown (bold, headings)
  const renderBody = (body: string) =>
    body.split("\n\n").map((para, i) => {
      if (para.startsWith("**") && para.endsWith("**")) {
        return <h3 key={i} className="font-display font-bold text-xl text-ink mt-6 mb-2">{para.replace(/\*\*/g, "")}</h3>;
      }
      const parts = para.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} className="mb-4">
          {parts.map((part, j) =>
            part.startsWith("**") && part.endsWith("**")
              ? <strong key={j}>{part.replace(/\*\*/g, "")}</strong>
              : part
          )}
        </p>
      );
    });

  return (
    <>
      <JsonLd schema={blogPostSchema(post)} />
      <JsonLd schema={breadcrumbSchema(breadcrumbItems)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
        {/* Header */}
        <div className="mb-8">
          <SafetyTag label={post.category} />
          <h1 className="font-display font-extrabold text-3xl md:text-4xl text-ink mt-3 mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-ink/50 font-mono mb-6">
            <span>{post.author}</span>
            <span>·</span>
            <span>{post.authorTitle}</span>
            <span>·</span>
            <time dateTime={post.publishedAt}>{post.publishedAt}</time>
          </div>
          {post.coverImage && (
            <div className="relative h-56 rounded-lg overflow-hidden bg-line">
              <Image src={post.coverImage} alt={post.title} fill className="object-cover" sizes="700px" priority />
            </div>
          )}
        </div>

        {/* Body */}
        <div className="text-ink/80 leading-relaxed text-base [&>p]:mb-4 [&>h3]:font-display [&>h3]:font-bold [&>h3]:text-xl [&>h3]:text-ink [&>h3]:mt-6 [&>h3]:mb-2">
          {renderBody(post.body)}
        </div>

        {/* Author byline */}
        <div className="mt-10 border-t border-line pt-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-ink/10 flex items-center justify-center shrink-0">
              <Cross size={14} className="text-safety-red" />
            </div>
            <div>
              <p className="font-semibold text-ink text-sm">{post.author}</p>
              <p className="text-ink/50 text-xs">{post.authorTitle} · UniShield First Aid & Safety</p>
              <p className="text-ink/50 text-xs mt-1">Serving Southern California since 1996.</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-8 text-xs text-ink/40 border border-line rounded p-3 leading-relaxed">
          This article is intended to provide general workplace safety information. It is not professional medical advice and does not substitute for consultation with a licensed safety professional, attorney, or physician. Regulatory requirements vary by jurisdiction — verify current Cal/OSHA and federal OSHA standards for your specific situation.
        </p>

        {/* CTA */}
        <div className="mt-10 bg-safety-red rounded-lg p-6 text-center">
          <h2 className="font-display font-bold text-xl text-white mb-2">Have questions about your compliance?</h2>
          <p className="text-white/80 text-sm mb-4">UniShield has helped SoCal businesses stay OSHA-compliant for 30 years. Let us help yours.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-safety-red font-semibold px-5 py-2.5 rounded text-sm hover:bg-surface transition-colors">
              <Cross size={12} />
              Get a Free Quote
            </Link>
            <a href="tel:+18004805855" className="font-mono text-white/80 hover:text-white text-sm font-semibold py-2.5 transition-colors">
              (800) 480-5855
            </a>
          </div>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display font-bold text-xl text-ink mb-5">Related Articles</h2>
            <div className="flex flex-col gap-4">
              {related.map((rp) => rp && (
                <Link key={rp.slug} href={`/blog/${rp.slug}`} className="group flex gap-4 bg-white border border-line rounded-lg p-4 hover:shadow-sm transition-all">
                  <div className="relative w-20 h-16 rounded overflow-hidden shrink-0 bg-line">
                    <Image src={rp.coverImage} alt={rp.title} fill className="object-cover" sizes="80px" />
                  </div>
                  <div>
                    <SafetyTag label={rp.category} />
                    <p className="font-sans font-semibold text-ink text-sm mt-1 group-hover:text-safety-red transition-colors leading-snug">{rp.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}

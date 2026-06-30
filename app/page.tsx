import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/mock-data/categories";
import { courses } from "@/lib/mock-data/courses";
import { services } from "@/lib/mock-data/services";
import { industries } from "@/lib/mock-data/industries";
import { testimonials } from "@/lib/mock-data/testimonials";
import { posts } from "@/lib/mock-data/posts";
import { SafetyTag } from "@/components/SafetyTag";
import { Cross } from "@/components/Cross";
import { SectionReveal } from "@/components/SectionReveal";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "UniShield First Aid & Safety | OSHA-Compliant Supplies, Services & Training — Southern California",
  description:
    "First aid supplies, restocking services, and on-site safety training for SoCal workplaces. Serving Los Angeles, San Diego, Orange, Ventura, and San Bernardino counties since 1996.",
};

const VALUE_POINTS = [
  { headline: "Save up to 40% vs. national distributors", body: "Direct relationships with manufacturers keep our prices competitive — without sacrificing ANSI compliance." },
  { headline: "30 years serving Southern California", body: "Founded in 1996, we understand the local OSHA enforcement landscape across all five SoCal counties." },
  { headline: "OSHA & ANSI compliant, documented", body: "Every service visit comes with a signed compliance report you can hand to an inspector." },
  { headline: "Supplies, restocking & training — one call", body: "Stop coordinating multiple vendors. UniShield handles every layer of your workplace safety program." },
];

export default function HomePage() {
  const recentPosts = posts.slice(0, 3);

  return (
    <>
      <JsonLd />

      {/* HERO */}
      <section className="bg-ink relative overflow-hidden">
        {/* Cross watermark */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-end opacity-[0.04] pointer-events-none"
        >
          <Cross size={480} className="text-white" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex flex-wrap gap-2 mb-6">
              <SafetyTag label="OSHA Compliant" variant="compliance" />
              <SafetyTag label="ANSI Z308.1" variant="compliance" />
              <SafetyTag label="Serving 5 Counties" />
              <SafetyTag label="Since 1996" />
            </div>
            <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-white leading-tight tracking-tight mb-5">
              Keep your SoCal workplace emergency-ready and OSHA-compliant.
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-lg">
              First aid supplies, scheduled restocking, and on-site safety training — delivered to businesses across Los Angeles, San Diego, Orange, Ventura, and San Bernardino counties.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-safety-red hover:bg-red-700 text-white font-semibold px-6 py-3 rounded transition-colors"
              >
                <Cross size={14} />
                Get a Free Quote
              </Link>
              <Link
                href="/training"
                className="inline-flex items-center border border-white/30 hover:border-white text-white font-semibold px-6 py-3 rounded transition-colors"
              >
                Explore Training
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <Image
              src="https://picsum.photos/seed/hero-firstaid/640/480"
              alt="Safety professional stocking a first aid cabinet"
              width={640}
              height={480}
              className="rounded-lg object-cover shadow-2xl"
              priority
            />
          </div>
        </div>
      </section>

      {/* VALUE STRIP */}
      <SectionReveal>
        <section className="bg-white border-b border-line">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUE_POINTS.map((point) => (
                <div key={point.headline} className="flex gap-3">
                  <span className="text-safety-red mt-1 shrink-0"><Cross size={14} /></span>
                  <div>
                    <p className="font-display font-bold text-ink text-sm mb-1">{point.headline}</p>
                    <p className="text-sm text-ink/60 leading-relaxed">{point.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* PRODUCT CATEGORIES */}
      <SectionReveal>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-10">
            <p className="font-mono text-xs uppercase tracking-widest text-safety-red mb-2">OSHA-Compliant Supplies</p>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink">Product Categories</h2>
            <p className="mt-2 text-ink/60 max-w-xl">
              Quote-based pricing — no checkout, no guessing. Request a quote for exactly what your facility needs.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products/${cat.slug}`}
                className="group block bg-white rounded-lg border border-line overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="relative h-44 bg-line">
                  <Image
                    src={cat.heroImage}
                    alt={cat.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-ink text-lg mb-1 group-hover:text-safety-red transition-colors">{cat.name}</h3>
                  <p className="text-sm text-ink/60 leading-relaxed mb-3">{cat.description}</p>
                  <span className="text-sm font-semibold text-safety-red">Browse →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </SectionReveal>

      {/* TRAINING COURSES */}
      <SectionReveal>
        <section className="bg-white border-t border-b border-line py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-safety-red mb-2">On-Site · Instructor-Led</p>
                <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink">Safety Training Courses</h2>
                <p className="mt-2 text-ink/60 max-w-xl">Certified training delivered at your facility across five Southern California counties. OSHA-aligned, documentation included.</p>
              </div>
              <Link href="/training" className="shrink-0 text-sm font-semibold text-safety-red hover:underline">
                All 13 courses →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <Link
                  key={course.slug}
                  href={`/training/${course.slug}`}
                  className="group block bg-surface rounded-lg border border-line p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-sans font-semibold text-ink text-sm group-hover:text-safety-red transition-colors pr-2">{course.name}</h3>
                    <span className="font-mono text-xs text-ink/50 shrink-0 border border-line/80 rounded px-1.5 py-0.5">{course.durationLabel}</span>
                  </div>
                  <p className="text-xs text-ink/60 leading-relaxed">{course.tagline}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* SERVICES OVERVIEW */}
      <SectionReveal>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-10">
            <p className="font-mono text-xs uppercase tracking-widest text-safety-red mb-2">Recurring Programs</p>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink">Safety Services</h2>
            <p className="mt-2 text-ink/60 max-w-xl">Scheduled, documented service visits that keep your facility compliant between inspections.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc) => (
              <Link
                key={svc.slug}
                href={`/services/${svc.slug}`}
                className="group block bg-white rounded-lg border border-line p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-safety-red"><Cross size={12} /></span>
                  <h3 className="font-sans font-semibold text-ink text-sm group-hover:text-safety-red transition-colors">{svc.name}</h3>
                </div>
                <p className="text-xs text-ink/60 leading-relaxed">{svc.summary}</p>
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/services" className="text-sm font-semibold text-safety-red hover:underline">
              See all services →
            </Link>
          </div>
        </section>
      </SectionReveal>

      {/* WHO WE HELP */}
      <SectionReveal>
        <section className="bg-white border-t border-b border-line py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <p className="font-mono text-xs uppercase tracking-widest text-safety-red mb-2">Industries Served</p>
              <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink">Who We Help</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {industries.map((ind) => (
                <Link
                  key={ind.slug}
                  href={`/who-we-help/${ind.slug}`}
                  className="group flex flex-col items-center text-center p-4 bg-surface rounded-lg border border-line hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span className="text-safety-red mb-2"><Cross size={20} /></span>
                  <span className="text-sm font-semibold text-ink group-hover:text-safety-red transition-colors">{ind.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* TESTIMONIALS */}
      <SectionReveal>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-10">
            <p className="font-mono text-xs uppercase tracking-widest text-safety-red mb-2">Client Stories</p>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink">What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <blockquote
                key={i}
                className="bg-white rounded-lg border border-line p-6"
              >
                <p className="text-ink/80 leading-relaxed mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
                <footer className="text-sm">
                  <span className="font-semibold text-ink">{t.name}</span>
                  <span className="text-ink/50">{" · "}{t.org}</span>
                  <span className="text-ink/40 block font-mono text-xs mt-0.5">{t.location}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      </SectionReveal>

      {/* BLOG TEASER */}
      <SectionReveal>
        <section className="bg-white border-t border-b border-line py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-safety-red mb-2">Safety Resources</p>
                <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink">From the Blog</h2>
              </div>
              <Link href="/blog" className="shrink-0 text-sm font-semibold text-safety-red hover:underline">
                All articles →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block bg-surface rounded-lg border border-line overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="relative h-40">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <SafetyTag label={post.category} />
                    <h3 className="font-sans font-semibold text-ink text-sm mt-2 mb-1 group-hover:text-safety-red transition-colors leading-snug">{post.title}</h3>
                    <p className="text-xs text-ink/50 font-mono">{post.publishedAt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* CONTACT CTA BAND */}
      <section className="bg-safety-red">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <Cross size={32} className="text-white/30 mx-auto mb-4" />
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white mb-3">
            Ready to get compliant?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            One call, one vendor, everything your facility needs. Serving SoCal businesses since 1996.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-safety-red font-semibold px-6 py-3 rounded hover:bg-surface transition-colors"
            >
              <Cross size={14} />
              Get a Free Quote
            </Link>
            <a
              href="tel:+18004805855"
              className="inline-flex items-center border border-white/40 hover:border-white text-white font-semibold px-6 py-3 rounded transition-colors font-mono"
            >
              (800) 480-5855
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

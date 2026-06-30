import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { industries } from "@/lib/mock-data/industries";
import { categories } from "@/lib/mock-data/categories";
import { services } from "@/lib/mock-data/services";
import { courses } from "@/lib/mock-data/courses";
import { SafetyTag } from "@/components/SafetyTag";
import { Cross } from "@/components/Cross";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SectionReveal } from "@/components/SectionReveal";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const revalidate = 3600;

export async function generateStaticParams() {
  return industries.map((i) => ({ industry: i.slug }));
}

interface Props {
  params: Promise<{ industry: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry: slug } = await params;
  const ind = industries.find((i) => i.slug === slug);
  if (!ind) return {};
  return {
    title: ind.name,
    description: ind.headline,
  };
}

export default async function IndustryPage({ params }: Props) {
  const { industry: slug } = await params;
  const ind = industries.find((i) => i.slug === slug);
  if (!ind) notFound();

  const relatedCats = categories.filter((c) => ind.relatedProducts.includes(c.slug));
  const relatedSvcs = services.filter((s) => ind.relatedServices.includes(s.slug));
  const relatedCourses = courses.filter((c) => ind.relatedCourses.includes(c.slug));

  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Who We Help", href: "/who-we-help" },
    { name: ind.name, href: `/who-we-help/${slug}` },
  ];

  return (
    <>
      <JsonLd schema={breadcrumbSchema(breadcrumbItems)} />

      <div className="bg-ink relative overflow-hidden py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-6 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <SafetyTag label={ind.name} />
              <h1 className="font-display font-extrabold text-4xl text-white mt-3 mb-4 leading-tight">
                {ind.headline}
              </h1>
            </div>
            <div className="hidden md:block relative h-52 rounded-lg overflow-hidden">
              <Image src={ind.heroImage} alt={ind.name} fill className="object-cover" sizes="50vw" priority />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <SectionReveal>
          <div className="grid lg:grid-cols-3 gap-10 mb-14">
            <div className="lg:col-span-2">
              <p className="text-ink/70 text-lg leading-relaxed mb-8">{ind.body}</p>

              <h2 className="font-display font-bold text-xl text-ink mb-4 flex items-center gap-2">
                <Cross size={14} className="text-safety-red" />
                Common challenges we solve
              </h2>
              <ul className="flex flex-col gap-3 mb-8">
                {ind.painPoints.map((point, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="text-safety-red mt-1 shrink-0"><Cross size={12} /></span>
                    <span className="text-ink/70 text-sm leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-surface border border-line rounded-lg p-6 h-fit">
              <p className="font-semibold text-ink mb-2">Get a free compliance assessment</p>
              <p className="text-sm text-ink/60 mb-4">We&apos;ll review your facility&apos;s needs and recommend the right products, services, and training.</p>
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 bg-safety-red hover:bg-red-700 text-white font-semibold px-5 py-3 rounded transition-colors text-sm mb-3 w-full"
              >
                <Cross size={12} />
                Get a Free Quote
              </Link>
              <a href="tel:+18004805855" className="flex items-center justify-center font-mono text-sm font-semibold text-ink hover:text-safety-red transition-colors">
                (800) 480-5855
              </a>
            </div>
          </div>
        </SectionReveal>

        {/* Related products */}
        {relatedCats.length > 0 && (
          <SectionReveal>
            <section className="mb-12">
              <h2 className="font-display font-bold text-xl text-ink mb-4">Recommended Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedCats.map((cat) => (
                  <Link key={cat.slug} href={`/products/${cat.slug}`} className="group block bg-white border border-line rounded-lg p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    <h3 className="font-sans font-semibold text-sm text-ink group-hover:text-safety-red transition-colors">{cat.name}</h3>
                    <p className="text-xs text-ink/50 mt-1 leading-relaxed">{cat.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          </SectionReveal>
        )}

        {/* Related services */}
        {relatedSvcs.length > 0 && (
          <SectionReveal>
            <section className="mb-12">
              <h2 className="font-display font-bold text-xl text-ink mb-4">Recommended Services</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedSvcs.map((svc) => (
                  <Link key={svc.slug} href={`/services/${svc.slug}`} className="group block bg-white border border-line rounded-lg p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    <h3 className="font-sans font-semibold text-sm text-ink group-hover:text-safety-red transition-colors">{svc.name}</h3>
                    <p className="text-xs text-ink/50 mt-1 leading-relaxed">{svc.summary}</p>
                  </Link>
                ))}
              </div>
            </section>
          </SectionReveal>
        )}

        {/* Related training */}
        {relatedCourses.length > 0 && (
          <SectionReveal>
            <section>
              <h2 className="font-display font-bold text-xl text-ink mb-4">Recommended Training</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedCourses.map((c) => (
                  <Link key={c.slug} href={`/training/${c.slug}`} className="group block bg-white border border-line rounded-lg p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-sans font-semibold text-sm text-ink group-hover:text-safety-red transition-colors pr-2">{c.name}</h3>
                      <SafetyTag label={c.durationLabel} />
                    </div>
                    <p className="text-xs text-ink/50 leading-relaxed">{c.tagline}</p>
                  </Link>
                ))}
              </div>
            </section>
          </SectionReveal>
        )}
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getService, getServiceSlugs } from "@/lib/data";
import { SafetyTag } from "@/components/SafetyTag";
import { Cross } from "@/components/Cross";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SectionReveal } from "@/components/SectionReveal";
import { JsonLd } from "@/components/JsonLd";
import { serviceSchema, breadcrumbSchema } from "@/lib/schema";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getServiceSlugs();
  return slugs.map((service) => ({ service }));
}

interface Props {
  params: Promise<{ service: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service: slug } = await params;
  const svc = await getService(slug);
  if (!svc) return {};
  return { title: svc.name, description: svc.summary };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { service: slug } = await params;
  const svc = await getService(slug);
  if (!svc) notFound();

  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: svc.name, href: `/services/${slug}` },
  ];

  return (
    <>
      <JsonLd schema={serviceSchema(svc)} />
      <JsonLd schema={breadcrumbSchema(breadcrumbItems)} />

      <div className="bg-ink py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-6 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <SafetyTag label="Recurring Service" />
                <SafetyTag label="Compliance Documented" variant="compliance" />
              </div>
              <h1 className="font-display font-extrabold text-4xl text-white mb-4">{svc.name}</h1>
              <p className="text-white/70 text-lg leading-relaxed">{svc.summary}</p>
            </div>
            <div className="hidden md:block relative h-52 rounded-lg overflow-hidden">
              <Image src={svc.heroImage} alt={svc.name} fill className="object-cover" sizes="50vw" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <SectionReveal>
          <div className="grid lg:grid-cols-3 gap-10 mb-14">
            <div className="lg:col-span-2">
              <p className="text-ink/70 text-lg leading-relaxed mb-8">{svc.description}</p>

              <h2 className="font-display font-bold text-2xl text-ink mb-5 flex items-center gap-2">
                <Cross size={14} className="text-safety-red" />
                What&apos;s Included
              </h2>
              <ul className="flex flex-col gap-3">
                {svc.bullets.map((bullet, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="text-compliance mt-1 shrink-0"><Cross size={12} /></span>
                    <span className="text-ink/80 text-sm leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="bg-surface border border-line rounded-lg p-6 sticky top-24">
                <p className="font-semibold text-ink mb-2">Get a quote for this service</p>
                <p className="text-sm text-ink/60 mb-4">We&apos;ll assess your facility and provide a flat-rate service agreement with no surprise charges.</p>
                <Link
                  href={`/contact?service=${slug}`}
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
          </div>
        </SectionReveal>
      </div>
    </>
  );
}

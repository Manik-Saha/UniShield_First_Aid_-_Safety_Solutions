import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getServices } from "@/lib/data";
import { SafetyTag } from "@/components/SafetyTag";
import { Cross } from "@/components/Cross";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SectionReveal } from "@/components/SectionReveal";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Safety Services",
  description:
    "Scheduled first aid restocking, eyewash servicing, AED maintenance, training management, and fire protection services for SoCal workplaces.",
};

export const revalidate = 3600;

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <JsonLd />
      <div className="bg-ink py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Services", href: "/services" }]} />
          <div className="mt-6 flex flex-wrap gap-2 mb-4">
            <SafetyTag label="Scheduled Service" />
            <SafetyTag label="Compliance Documented" variant="compliance" />
            <SafetyTag label="5 Counties" />
          </div>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-white leading-tight mb-4">
            Safety Services
          </h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
            Recurring, documented service programs that keep your facility compliant between OSHA inspections — without taking staff time to manage.
          </p>
        </div>
      </div>

      <SectionReveal>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc) => (
              <Link
                key={svc.slug}
                href={`/services/${svc.slug}`}
                className="group block bg-white rounded-lg border border-line overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="relative h-40 bg-line">
                  <Image src={svc.heroImage} alt={svc.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                </div>
                <div className="p-5">
                  <h2 className="font-sans font-semibold text-ink text-base mb-2 group-hover:text-safety-red transition-colors">{svc.name}</h2>
                  <p className="text-sm text-ink/60 leading-relaxed">{svc.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </SectionReveal>

      <div className="bg-surface border-t border-line py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-2xl text-ink mb-3">Bundle multiple services and save</h2>
          <p className="text-ink/60 mb-6 max-w-xl mx-auto">Our Facility Safety Services program combines restocking, eyewash, AED, and training management under one annual contract.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-safety-red hover:bg-red-700 text-white font-semibold px-6 py-3 rounded transition-colors">
            <Cross size={12} />
            Get a Free Quote
          </Link>
        </div>
      </div>
    </>
  );
}

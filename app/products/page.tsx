import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/mock-data/categories";
import { SafetyTag } from "@/components/SafetyTag";
import { Cross } from "@/components/Cross";
import { SectionReveal } from "@/components/SectionReveal";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Safety Products",
  description:
    "OSHA and ANSI-compliant first aid cabinets, PPE, eyewash stations, AEDs, and disaster kits. Quote-based pricing for SoCal businesses.",
};

export default function ProductsPage() {
  return (
    <>
      <JsonLd />
      <div className="bg-ink py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Products", href: "/products" }]} />
          <div className="mt-6 flex flex-wrap gap-2 mb-4">
            <SafetyTag label="ANSI Z308.1" variant="compliance" />
            <SafetyTag label="OSHA Compliant" variant="compliance" />
            <SafetyTag label="Quote-Based Pricing" />
          </div>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-white leading-tight mb-4">
            Safety Products
          </h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
            OSHA and ANSI-compliant supplies delivered to workplaces across five Southern California counties. No checkout — request a quote and we&apos;ll tailor it to your facility.
          </p>
        </div>
      </div>

      <SectionReveal>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products/${cat.slug}`}
                className="group block bg-white rounded-lg border border-line overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="relative h-48 bg-line">
                  <Image
                    src={cat.heroImage}
                    alt={cat.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <h2 className="font-display font-bold text-ink text-lg mb-1 group-hover:text-safety-red transition-colors">{cat.name}</h2>
                  <p className="text-sm text-ink/60 leading-relaxed mb-3">{cat.description}</p>
                  <span className="text-sm font-semibold text-safety-red">Browse category →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </SectionReveal>

      {/* CTA */}
      <div className="bg-ink py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display font-bold text-xl text-white mb-1">Need help choosing the right supplies?</h2>
            <p className="text-white/60 text-sm">Our team can assess your facility and recommend the right ANSI class and quantity.</p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 inline-flex items-center gap-2 bg-safety-red hover:bg-red-700 text-white font-semibold px-5 py-3 rounded transition-colors"
          >
            <Cross size={12} />
            Get a Free Quote
          </Link>
        </div>
      </div>
    </>
  );
}

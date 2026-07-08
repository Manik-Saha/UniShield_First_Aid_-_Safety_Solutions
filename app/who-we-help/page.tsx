import type { Metadata } from "next";
import Link from "next/link";
import { getIndustries } from "@/lib/data";
import { Cross } from "@/components/Cross";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SectionReveal } from "@/components/SectionReveal";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Who We Help",
  description:
    "UniShield serves offices, schools, restaurants, medical practices, shops, factories, and the film industry across Southern California.",
};

export const revalidate = 3600;

export default async function WhoWeHelpPage() {
  const industries = await getIndustries();

  return (
    <>
      <JsonLd />
      <div className="bg-ink py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Who We Help", href: "/who-we-help" }]} />
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-white mt-6 mb-4">
            Who We Help
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">
            UniShield serves businesses across six major industry verticals in Southern California. Each has different OSHA obligations — we know all of them.
          </p>
        </div>
      </div>

      <SectionReveal>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((ind) => (
              <Link
                key={ind.slug}
                href={`/who-we-help/${ind.slug}`}
                className="group block bg-white rounded-lg border border-line p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-safety-red"><Cross size={16} /></span>
                  <h2 className="font-display font-bold text-ink text-lg group-hover:text-safety-red transition-colors">{ind.name}</h2>
                </div>
                <p className="text-sm text-ink/60 leading-relaxed mb-4">{ind.headline}</p>
                <span className="text-sm font-semibold text-safety-red">Learn more →</span>
              </Link>
            ))}
          </div>
        </div>
      </SectionReveal>
    </>
  );
}

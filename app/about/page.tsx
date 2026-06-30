import type { Metadata } from "next";
import Link from "next/link";
import { SafetyTag } from "@/components/SafetyTag";
import { Cross } from "@/components/Cross";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SectionReveal } from "@/components/SectionReveal";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "UniShield First Aid & Safety has served Southern California businesses since 1996. Learn about our 30-year history, our service area, and our commitment to OSHA compliance.",
};

const MILESTONES = [
  { year: "1996", text: "Founded in San Fernando, CA, under the name SoCal First Aid, supplying first aid cabinets to local businesses." },
  { year: "2000s", text: "Expanded restocking services to all five Southern California counties, building a route network that still operates today." },
  { year: "2010s", text: "Added instructor-led safety training, AED program management, and eyewash station servicing to meet growing compliance demand." },
  { year: "2024+", text: "Operating under the UniShield brand alongside SoCal First Aid, serving offices, schools, factories, restaurants, and the film industry." },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd />
      <div className="bg-ink py-12 relative overflow-hidden">
        <div aria-hidden="true" className="absolute right-0 bottom-0 opacity-[0.04] pointer-events-none">
          <Cross size={300} className="text-white" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "About", href: "/about" }]} />
          <div className="mt-6 flex flex-wrap gap-2 mb-4">
            <SafetyTag label="Founded 1996" />
            <SafetyTag label="5 SoCal Counties" />
            <SafetyTag label="OSHA Compliant" variant="compliance" />
          </div>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-white leading-tight mb-4">
            Thirty years of keeping SoCal workplaces safe.
          </h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
            UniShield First Aid & Safety was founded in San Fernando, CA, in 1996 with a straightforward mission: make it easy for Southern California businesses to stay OSHA-compliant and emergency-ready.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-14 mb-16">
          <SectionReveal>
            <div>
              <h2 className="font-display font-bold text-2xl text-ink mb-4">Our story</h2>
              <div className="text-ink/70 leading-relaxed flex flex-col gap-4">
                <p>
                  We started as a single route supplying first aid cabinets to businesses in the San Fernando Valley. Over three decades, we grew alongside the companies we serve — adding restocking services, then eyewash and AED maintenance, then instructor-led training — because our clients kept asking us to handle more.
                </p>
                <p>
                  Today, UniShield (also known as SoCal First Aid) operates across Los Angeles, San Diego, Orange, Ventura, and San Bernardino counties. We work with facility managers, HR directors, safety officers, and office managers who don&apos;t have time to track compliance deadlines on their own.
                </p>
                <p>
                  Our model is straightforward: one vendor, every layer of your safety program, documented on every visit. When an OSHA inspector arrives, our clients hand over a binder — not a guess.
                </p>
              </div>
            </div>
          </SectionReveal>

          <SectionReveal>
            <div>
              <h2 className="font-display font-bold text-2xl text-ink mb-6">Timeline</h2>
              <ol className="flex flex-col gap-5">
                {MILESTONES.map((m) => (
                  <li key={m.year} className="flex gap-4">
                    <div className="shrink-0 w-16 font-mono font-bold text-safety-red text-sm pt-0.5">{m.year}</div>
                    <div className="text-sm text-ink/70 leading-relaxed border-l border-line pl-4">{m.text}</div>
                  </li>
                ))}
              </ol>
            </div>
          </SectionReveal>
        </div>

        {/* Service area */}
        <SectionReveal>
          <div className="bg-ink rounded-lg p-8 mb-16">
            <h2 className="font-display font-bold text-2xl text-white mb-5">Service Area</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {["Los Angeles County", "San Diego County", "Orange County", "Ventura County", "San Bernardino County"].map((county) => (
                <div key={county} className="flex flex-col gap-2 items-center text-center">
                  <Cross size={16} className="text-safety-red" />
                  <span className="font-mono text-xs text-white/70">{county}</span>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* What we do */}
        <SectionReveal>
          <div className="mb-16">
            <h2 className="font-display font-bold text-2xl text-ink mb-6">What we do</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { title: "Products", desc: "ANSI and OSHA-compliant first aid cabinets, PPE, eyewash stations, AEDs, and disaster kits — quote-based, no checkout." },
                { title: "Services", desc: "Scheduled restocking, eyewash servicing, AED maintenance, fire protection, and comprehensive facility safety programs." },
                { title: "Training", desc: "13 instructor-led courses delivered at your facility: CPR, active shooter response, OSHA compliance, forklift, HAZWOPER, and more." },
              ].map((item) => (
                <div key={item.title} className="bg-surface rounded-lg border border-line p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Cross size={12} className="text-safety-red" />
                    <h3 className="font-display font-bold text-ink">{item.title}</h3>
                  </div>
                  <p className="text-sm text-ink/60 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>

        <div className="text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-safety-red hover:bg-red-700 text-white font-semibold px-6 py-3 rounded transition-colors"
          >
            <Cross size={12} />
            Get a Free Quote
          </Link>
        </div>
      </div>
    </>
  );
}

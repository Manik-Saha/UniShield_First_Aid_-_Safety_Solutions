import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqAccordion } from "@/components/FaqAccordion";
import { JsonLd } from "@/components/JsonLd";
import { faqPageSchema } from "@/lib/schema";
import type { FAQ } from "@/lib/types";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about UniShield's first aid supplies, restocking services, training courses, and service area.",
};

const COMPANY_FAQS: FAQ[] = [
  {
    question: "What areas do you serve?",
    answer: "UniShield serves businesses across five Southern California counties: Los Angeles, San Diego, Orange, Ventura, and San Bernardino. If you're unsure whether we cover your location, call us at (800) 480-5855.",
  },
  {
    question: "How do I schedule a restocking service?",
    answer: "Contact us via the quote form or by phone at (800) 480-5855. We'll assess your facility, confirm which cabinets and compliance standards apply, and set up a service agreement with your preferred schedule (monthly, quarterly, or custom).",
  },
  {
    question: "What does 'OSHA compliant' mean for a first aid cabinet?",
    answer: "OSHA 29 CFR 1910.151 requires employers to have adequate first aid supplies. 'Adequate' is defined by reference to ANSI Z308.1, which establishes Class A (general workplace) and Class B (complex/high-hazard) minimum content lists. A cabinet stocked to the applicable class, with non-expired supplies and a signed inspection record, meets this standard.",
  },
  {
    question: "Do you provide documentation for OSHA inspections?",
    answer: "Yes. Every UniShield service visit generates a signed compliance report that lists what was found, what was replaced, and the date of service. These reports are designed to satisfy OSHA inspectors who ask for maintenance records.",
  },
  {
    question: "How is training delivered — classroom or on-site?",
    answer: "All UniShield training is instructor-led and delivered on-site at your facility. We come to you. This means the training can be tailored to your specific layout, hazards, and team.",
  },
  {
    question: "How far in advance should I schedule training?",
    answer: "We recommend scheduling at least two weeks in advance, especially for larger groups or multi-session programs. For time-sensitive compliance deadlines, call us and we'll do our best to accommodate your timeline.",
  },
  {
    question: "What does eyewash station servicing include?",
    answer: "Our eyewash servicing program covers weekly activation and water flush (for plumbed units), refilling self-contained units with fresh buffered saline solution, annual formal inspection, and replacement of worn components. Each visit is documented per ANSI Z358.1 requirements.",
  },
  {
    question: "Can I bundle multiple services into one agreement?",
    answer: "Yes. Our Facility Safety Services program combines first aid restocking, eyewash servicing, AED maintenance, and training compliance management into one annual contract with consolidated billing and a single point of contact.",
  },
  {
    question: "Do you work with small businesses?",
    answer: "Absolutely. We serve businesses of all sizes, from small offices with one first aid cabinet to large manufacturing facilities with complex multi-service programs. Our service agreements are sized to the facility, not a minimum spend.",
  },
];

export default function FaqPage() {
  return (
    <>
      <JsonLd schema={faqPageSchema(COMPANY_FAQS)} />

      <div className="bg-ink py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "FAQ", href: "/faq" }]} />
          <h1 className="font-display font-extrabold text-4xl text-white mt-4 mb-2">Frequently Asked Questions</h1>
          <p className="text-white/60">Common questions about our products, services, training, and service area.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <FaqAccordion faqs={COMPANY_FAQS} />
      </div>
    </>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { SafetyTag } from "@/components/SafetyTag";
import { Cross } from "@/components/Cross";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { faqPageSchema } from "@/lib/schema";
import { ContactFormSection } from "./ContactFormSection";

export const metadata: Metadata = {
  title: "Get a Free Quote",
  description:
    "Request a free quote for first aid supplies, restocking services, or safety training. UniShield serves businesses across five Southern California counties.",
};

const COMPANY_FAQS = [
  { question: "How quickly will someone follow up?", answer: "We respond to all quote requests within one business day, Monday through Friday. For urgent needs, call us directly at (800) 480-5855." },
  { question: "Do you offer on-site assessments?", answer: "Yes. For facilities with multiple cabinets, eyewash stations, or AEDs, we offer complimentary on-site assessments to make sure you're getting the right products and service schedule." },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd schema={faqPageSchema(COMPANY_FAQS)} />

      <div className="bg-ink py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Contact", href: "/contact" }]} />
          <div className="mt-4 flex flex-wrap gap-2 mb-3">
            <SafetyTag label="Free Quote" variant="compliance" />
            <SafetyTag label="1 Business Day Response" />
          </div>
          <h1 className="font-display font-extrabold text-4xl text-white mb-2">Get a Free Quote</h1>
          <p className="text-white/60 text-lg">Tell us about your facility and we&apos;ll get back to you with pricing and recommendations.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <Suspense fallback={<div className="h-64 bg-surface rounded-lg animate-pulse" />}>
              <ContactFormSection />
            </Suspense>
          </div>

          <aside>
            <div className="bg-white border border-line rounded-lg p-6 mb-6">
              <h2 className="font-display font-bold text-ink text-lg mb-4">Contact Info</h2>
              <div className="flex flex-col gap-4 text-sm">
                <div className="flex gap-3">
                  <Cross size={12} className="text-safety-red mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-ink">Phone</p>
                    <a href="tel:+18004805855" className="text-safety-red font-mono font-medium hover:underline">(800) 480-5855</a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Cross size={12} className="text-safety-red mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-ink">Email</p>
                    <a href="mailto:sales@socalfirstaid.com" className="text-ink/70 hover:text-safety-red transition-colors break-all">
                      sales@socalfirstaid.com
                    </a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Cross size={12} className="text-safety-red mt-1 shrink-0" />
                  <address className="not-italic text-ink/70">
                    <p className="font-semibold text-ink not-italic">Address</p>
                    599 4th St.<br />
                    San Fernando, CA 91340
                  </address>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <SafetyTag label="Serving 5 Counties" />
                <SafetyTag label="Since 1996" />
              </div>
            </div>

            <div className="bg-surface border border-line rounded-lg p-5">
              <h3 className="font-sans font-semibold text-ink mb-3 text-sm">Service Area</h3>
              <ul className="flex flex-col gap-1.5 text-sm text-ink/70">
                {["Los Angeles County", "San Diego County", "Orange County", "Ventura County", "San Bernardino County"].map((county) => (
                  <li key={county} className="flex gap-2 items-center">
                    <Cross size={10} className="text-safety-red shrink-0" />
                    {county}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

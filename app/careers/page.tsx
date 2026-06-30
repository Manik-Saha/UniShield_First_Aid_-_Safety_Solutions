import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Cross } from "@/components/Cross";
import { LeadForm } from "@/components/LeadForm";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join the UniShield team. We're always looking for driven individuals who want to help Southern California businesses stay safe and compliant.",
};

export default function CareersPage() {
  return (
    <>
      <JsonLd />
      <div className="bg-ink py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Careers", href: "/careers" }]} />
          <h1 className="font-display font-extrabold text-4xl text-white mt-4 mb-2">Careers at UniShield</h1>
          <p className="text-white/60 text-lg max-w-xl">
            We&apos;re always looking for team members who take safety seriously and want to build something long-term with us.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="bg-white border border-line rounded-lg p-7 mb-8">
              <h2 className="font-display font-bold text-xl text-ink mb-4">Why UniShield</h2>
              <ul className="flex flex-col gap-3">
                {[
                  "30-year-old business with a stable, growing client base across five counties",
                  "Meaningful work — what we do keeps people safe in emergencies",
                  "Opportunities across service, sales, training instruction, and operations",
                  "Serving the full range of Southern California industries",
                ].map((point, i) => (
                  <li key={i} className="flex gap-3 items-start text-sm text-ink/70">
                    <Cross size={12} className="text-safety-red mt-0.5 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <h2 className="font-display font-bold text-xl text-ink mb-5">Express Interest</h2>
            <LeadForm mode="careers" />
          </div>

          <aside>
            <div className="bg-surface border border-line rounded-lg p-5">
              <h3 className="font-sans font-semibold text-ink mb-3">Questions?</h3>
              <p className="text-sm text-ink/60 mb-3">Reach out directly and we&apos;ll get back to you.</p>
              <a href="mailto:sales@socalfirstaid.com" className="text-sm text-safety-red hover:underline break-all">sales@socalfirstaid.com</a>
              <div className="mt-2">
                <a href="tel:+18004805855" className="font-mono text-sm font-semibold text-ink hover:text-safety-red transition-colors">(800) 480-5855</a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

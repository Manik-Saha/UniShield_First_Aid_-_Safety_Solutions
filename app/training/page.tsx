import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { courses } from "@/lib/mock-data/courses";
import { SafetyTag } from "@/components/SafetyTag";
import { Cross } from "@/components/Cross";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SectionReveal } from "@/components/SectionReveal";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Safety Training Courses",
  description:
    "On-site, instructor-led safety training for SoCal workplaces. CPR/AED, OSHA compliance, active shooter, forklift, and 10 more courses delivered at your facility.",
};

export default function TrainingPage() {
  return (
    <>
      <JsonLd />
      <div className="bg-ink py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Training", href: "/training" }]} />
          <div className="mt-6 flex flex-wrap gap-2 mb-4">
            <SafetyTag label="On-Site Delivery" />
            <SafetyTag label="OSHA Aligned" variant="compliance" />
            <SafetyTag label="Instructor-Led" />
            <SafetyTag label="5 Counties" />
          </div>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-white leading-tight mb-4">
            Safety Training
          </h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
            Certified, instructor-led training delivered at your workplace across Los Angeles, San Diego, Orange, Ventura, and San Bernardino counties. Attendance records and certificates included.
          </p>
        </div>
      </div>

      <SectionReveal>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course.slug}
                href={`/training/${course.slug}`}
                className="group block bg-white rounded-lg border border-line overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="relative h-40 bg-line">
                  <Image
                    src={course.heroImage}
                    alt={course.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="font-sans font-semibold text-ink text-sm group-hover:text-safety-red transition-colors pr-2 leading-snug">{course.name}</h2>
                    <SafetyTag label={course.durationLabel} />
                  </div>
                  <p className="text-xs text-ink/60 leading-relaxed mb-3">{course.tagline}</p>
                  <div className="flex flex-wrap gap-1">
                    {course.complianceTags.slice(0, 2).map((tag) => (
                      <SafetyTag key={tag} label={tag} variant="compliance" />
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </SectionReveal>

      <div className="bg-safety-red py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-2xl text-white mb-3">Ready to schedule training for your team?</h2>
          <p className="text-white/80 mb-6">We&apos;ll come to your facility. Contact us to discuss dates, group size, and course selection.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/contact?inquiryType=training"
              className="inline-flex items-center gap-2 bg-white text-safety-red font-semibold px-5 py-3 rounded hover:bg-surface transition-colors"
            >
              <Cross size={12} />
              Request Training Info
            </Link>
            <a href="tel:+18004805855" className="font-mono text-white font-semibold px-5 py-3 border border-white/40 rounded hover:border-white transition-colors">
              (800) 480-5855
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

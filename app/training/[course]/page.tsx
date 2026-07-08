import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse, getCourses, getCourseSlugs } from "@/lib/data";
import { SafetyTag } from "@/components/SafetyTag";
import { Cross } from "@/components/Cross";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqAccordion } from "@/components/FaqAccordion";
import { SectionReveal } from "@/components/SectionReveal";
import { JsonLd } from "@/components/JsonLd";
import { courseSchema, breadcrumbSchema, faqPageSchema } from "@/lib/schema";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getCourseSlugs();
  return slugs.map((course) => ({ course }));
}

interface Props {
  params: Promise<{ course: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course: slug } = await params;
  const course = await getCourse(slug);
  if (!course) return {};
  return { title: course.name, description: course.summary };
}

export default async function CourseDetailPage({ params }: Props) {
  const { course: slug } = await params;
  const [course, allCourses] = await Promise.all([getCourse(slug), getCourses()]);
  if (!course) notFound();

  const related = allCourses.filter((c) => c.slug !== slug).slice(0, 3);

  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Training", href: "/training" },
    { name: course.name, href: `/training/${slug}` },
  ];

  return (
    <>
      <JsonLd schema={courseSchema(course)} />
      <JsonLd schema={breadcrumbSchema(breadcrumbItems)} />
      {course.faqs.length > 0 && <JsonLd schema={faqPageSchema(course.faqs)} />}

      {/* Hero */}
      <div className="bg-ink relative overflow-hidden">
        <div aria-hidden="true" className="absolute right-0 top-0 opacity-[0.04] pointer-events-none">
          <Cross size={320} className="text-white" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-6 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <SafetyTag label={course.durationLabel} />
                {course.complianceTags.map((tag) => (
                  <SafetyTag key={tag} label={tag} variant="compliance" />
                ))}
              </div>
              <h1 className="font-display font-extrabold text-4xl md:text-5xl text-white leading-tight mb-4">
                {course.name}
              </h1>
              <p className="text-white/70 text-lg leading-relaxed mb-6">{course.tagline}</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/contact?course=${course.slug}`}
                  className="inline-flex items-center gap-2 bg-safety-red hover:bg-red-700 text-white font-semibold px-5 py-3 rounded transition-colors"
                >
                  <Cross size={12} />
                  Request Training Info
                </Link>
                <a href="tel:+18004805855" className="font-mono text-white/70 hover:text-white font-medium py-3 transition-colors">
                  (800) 480-5855
                </a>
              </div>
            </div>
            <div className="hidden md:block relative h-56 rounded-lg overflow-hidden">
              <Image src={course.heroImage} alt={course.name} fill className="object-cover" sizes="50vw" priority />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Summary */}
        <SectionReveal>
          <section className="mb-14 max-w-3xl">
            <p className="text-ink/70 text-lg leading-relaxed">{course.summary}</p>
          </section>
        </SectionReveal>

        {/* Curriculum */}
        <SectionReveal>
          <section className="mb-14">
            <h2 className="font-display font-bold text-2xl text-ink mb-8 flex items-center gap-2">
              <Cross size={14} className="text-safety-red" />
              Course Curriculum
            </h2>
            <ol className="flex flex-col gap-6" aria-label="Course curriculum">
              {course.curriculum.map((item, i) => (
                <li key={i} className="flex gap-5">
                  <div className="shrink-0 w-12 h-12 bg-ink text-white font-mono font-bold text-sm rounded flex items-center justify-center" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="pt-1">
                    <h3 className="font-sans font-semibold text-ink mb-1">{item.title}</h3>
                    <p className="text-ink/60 text-sm leading-relaxed">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </SectionReveal>

        {/* FAQs */}
        {course.faqs.length > 0 && (
          <SectionReveal>
            <section className="mb-14 max-w-3xl">
              <h2 className="font-display font-bold text-2xl text-ink mb-5">Frequently Asked Questions</h2>
              <FaqAccordion faqs={course.faqs} />
            </section>
          </SectionReveal>
        )}

        {/* Training CTA */}
        <div className="bg-surface border border-line rounded-lg p-6 mb-14 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <p className="font-semibold text-ink mb-1">Bring {course.name} to your workplace</p>
            <p className="text-sm text-ink/60">On-site, instructor-led. We come to you, anywhere in the five-county area.</p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href={`/contact?course=${course.slug}`}
              className="inline-flex items-center gap-2 bg-safety-red hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded transition-colors text-sm"
            >
              <Cross size={12} />
              Request Training Info
            </Link>
            <a href="tel:+18004805855" className="font-mono text-sm font-semibold text-ink hover:text-safety-red transition-colors py-2.5">
              (800) 480-5855
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-ink/40 border-t border-line pt-6 mb-14 max-w-3xl">
          Course content is intended for workplace safety training purposes. It is not a substitute for professional medical advice, diagnosis, or treatment, and does not replace jurisdiction-specific certification or licensure requirements.
        </p>

        {/* Related courses */}
        {related.length > 0 && (
          <section>
            <h2 className="font-display font-bold text-2xl text-ink mb-5">Other Training Courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((rc) => (
                <Link
                  key={rc.slug}
                  href={`/training/${rc.slug}`}
                  className="group block bg-white rounded-lg border border-line p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-sans font-semibold text-ink text-sm group-hover:text-safety-red transition-colors pr-2">{rc.name}</h3>
                    <SafetyTag label={rc.durationLabel} />
                  </div>
                  <p className="text-xs text-ink/50 leading-relaxed">{rc.tagline}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

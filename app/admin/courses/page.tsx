import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TogglePublished } from "../_components/TogglePublished";

export const metadata: Metadata = { title: "Courses" };
export const dynamic = "force-dynamic";

export default async function CoursesAdminPage() {
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("id, slug, name, duration_label, is_published, sort_order")
    .order("sort_order");

  return (
    <div className="p-8">
      <h1 className="font-display font-bold text-2xl text-ink mb-6">Training Courses</h1>
      <div className="bg-white rounded-lg border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface border-b border-line">
              {["Course", "Duration", "Published", "Links"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-mono text-xs uppercase tracking-widest text-ink/40">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {(courses ?? []).map((course) => (
              <tr key={course.id} className="hover:bg-surface/40">
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{course.name}</p>
                  <p className="font-mono text-xs text-ink/40">{course.slug}</p>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-ink/60">{course.duration_label}</td>
                <td className="px-4 py-3">
                  <TogglePublished table="courses" id={course.id} current={course.is_published} />
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <Link href={`/training/${course.slug}`} target="_blank" className="text-xs text-ink/40 hover:text-ink transition-colors">View ↗</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-ink/40">Course content is managed directly in the database. Contact your developer to add or edit course curriculum and FAQs.</p>
    </div>
  );
}

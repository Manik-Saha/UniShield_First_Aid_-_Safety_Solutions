import type { Metadata } from "next";
import Link from "next/link";
import { faPenToSquare, faEye } from "@fortawesome/free-solid-svg-icons";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "../_components/DeleteButton";
import { TogglePublished } from "../_components/TogglePublished";
import { IconLink } from "../_components/IconLink";

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-ink">Training Courses</h1>
        <Link
          href="/admin/courses/new"
          className="inline-flex items-center gap-1.5 bg-safety-red hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded transition-colors"
        >
          + New Course
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface border-b border-line">
              {["Course", "Duration", "Published", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-mono text-xs uppercase tracking-widest text-ink/40">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {(courses ?? []).map((course) => (
              <tr key={course.id} className="hover:bg-surface/40">
                <td className="px-4 py-3">
                  <Link href={`/admin/courses/${course.id}`} className="font-medium text-ink hover:text-safety-red transition-colors">
                    {course.name}
                  </Link>
                  <p className="font-mono text-xs text-ink/40 mt-0.5">/training/{course.slug}</p>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-ink/60">{course.duration_label ?? "—"}</td>
                <td className="px-4 py-3">
                  <TogglePublished table="courses" id={course.id} current={course.is_published} paths={[`/training/${course.slug}`]} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <IconLink href={`/admin/courses/${course.id}`} icon={faPenToSquare} title="Edit course" className="text-safety-red/60 hover:text-safety-red hover:bg-red-50" />
                    <IconLink href={`/training/${course.slug}`} icon={faEye} title="View course" external />
                    <DeleteButton table="courses" id={course.id} label="Course" paths={[`/training/${course.slug}`]} />
                  </div>
                </td>
              </tr>
            ))}
            {(courses ?? []).length === 0 && (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-ink/40 text-sm">No courses yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

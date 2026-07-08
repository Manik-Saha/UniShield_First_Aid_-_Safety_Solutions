import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CourseForm } from "./CourseForm";

export const metadata: Metadata = { title: "Edit Course" };
export const dynamic = "force-dynamic";

interface Props { params: Promise<{ id: string }> }

export default async function EditCoursePage({ params }: Props) {
  const { id } = await params;
  const isNew = id === "new";

  const supabase = await createClient();
  let course = null;
  let curriculum: { id: string; title: string; body: string; sort_order: number }[] = [];

  if (!isNew) {
    const { data } = await supabase.from("courses").select("*").eq("id", id).single();
    if (!data) notFound();
    course = data;
    const { data: currData } = await supabase
      .from("course_curriculum")
      .select("*")
      .eq("course_id", id)
      .order("sort_order");
    curriculum = currData ?? [];
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-display font-bold text-2xl text-ink mb-6">
        {isNew ? "New Course" : "Edit Course"}
      </h1>
      <CourseForm course={course} curriculum={curriculum} />
    </div>
  );
}

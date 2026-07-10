"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { revalidate } from "@/lib/revalidate";

interface CurriculumItem { id?: string; title: string; body: string; sort_order: number; }

interface CourseFormProps {
  course: Record<string, unknown> | null;
  curriculum: CurriculumItem[];
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function CourseForm({ course, curriculum: initCurr }: CourseFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatingFaqs, setGeneratingFaqs] = useState(false);
  const [faqMessage, setFaqMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    slug: (course?.slug as string) ?? "",
    name: (course?.name as string) ?? "",
    tagline: (course?.tagline as string) ?? "",
    summary: (course?.summary as string) ?? "",
    hero_image: (course?.hero_image as string) ?? "",
    duration_label: (course?.duration_label as string) ?? "",
    compliance_tags: ((course?.compliance_tags as string[]) ?? []).join(", "),
    is_published: (course?.is_published as boolean) ?? true,
  });

  const [curriculum, setCurriculum] = useState<CurriculumItem[]>(
    initCurr.length > 0 ? initCurr : [{ title: "", body: "", sort_order: 0 }]
  );

  function addModule() {
    setCurriculum((c) => [...c, { title: "", body: "", sort_order: c.length }]);
  }

  function updateModule(i: number, field: "title" | "body", val: string) {
    setCurriculum((c) => c.map((m, idx) => idx === i ? { ...m, [field]: val } : m));
  }

  function removeModule(i: number) {
    setCurriculum((c) => c.filter((_, idx) => idx !== i));
  }

  async function handleGenerateFaqs() {
    if (!form.slug || !form.name) {
      setFaqMessage("Save the course first (need a slug and name).");
      return;
    }
    setGeneratingFaqs(true);
    setFaqMessage(null);
    const res = await fetch("/api/ai/generate-faqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entityType: "course",
        entitySlug: form.slug,
        entityName: form.name,
        context: form.tagline || form.summary,
      }),
    });
    const json = await res.json();
    setGeneratingFaqs(false);
    if (!res.ok) { setFaqMessage(`Error: ${json.error}`); return; }
    setFaqMessage(`Generated ${json.faqs.length} FAQs and saved to database.`);
  }

  async function handleSave(publish: boolean) {
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const payload = {
      ...form,
      is_published: publish,
      compliance_tags: form.compliance_tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    let courseId = course?.id as string | undefined;

    if (courseId) {
      const { error } = await supabase.from("courses").update(payload).eq("id", courseId);
      if (error) { setError(error.message); setSaving(false); return; }
    } else {
      const { data, error } = await supabase.from("courses").insert(payload).select("id").single();
      if (error || !data) { setError(error?.message ?? "Insert failed"); setSaving(false); return; }
      courseId = data.id;
    }

    // Sync curriculum
    await supabase.from("course_curriculum").delete().eq("course_id", courseId);
    const validModules = curriculum.filter((m) => m.title.trim());
    if (validModules.length > 0) {
      await supabase.from("course_curriculum").insert(
        validModules.map((m, i) => ({ course_id: courseId, title: m.title, body: m.body, sort_order: i }))
      );
    }

    await revalidate(["/training", `/training/${form.slug}`]);

    setSaving(false);
    router.push("/admin/courses");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Name *" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v, slug: course ? f.slug : slugify(v) }))} />
        <Field label="Slug *" value={form.slug} onChange={(v) => setForm((f) => ({ ...f, slug: v }))} mono />
      </div>

      <Field label="Tagline" value={form.tagline} onChange={(v) => setForm((f) => ({ ...f, tagline: v }))} />
      <TextareaField label="Summary" value={form.summary} onChange={(v) => setForm((f) => ({ ...f, summary: v }))} rows={3} />
      <Field label="Hero Image URL" value={form.hero_image} onChange={(v) => setForm((f) => ({ ...f, hero_image: v }))} />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Duration Label (e.g. 4 Hours)" value={form.duration_label} onChange={(v) => setForm((f) => ({ ...f, duration_label: v }))} />
        <Field label="Compliance Tags (comma-separated)" value={form.compliance_tags} onChange={(v) => setForm((f) => ({ ...f, compliance_tags: v }))} mono />
      </div>

      {/* Curriculum */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-semibold text-ink">Curriculum Modules</label>
          <button type="button" onClick={addModule} className="text-xs text-safety-red hover:underline">+ Add Module</button>
        </div>
        <div className="flex flex-col gap-3">
          {curriculum.map((mod, i) => (
            <div key={i} className="border border-line rounded p-3 flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <input
                  value={mod.title}
                  onChange={(e) => updateModule(i, "title", e.target.value)}
                  placeholder={`Module ${i + 1} title`}
                  className="flex-1 border border-line rounded px-3 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-safety-red"
                />
                <button onClick={() => removeModule(i)} className="text-ink/30 hover:text-safety-red transition-colors text-lg leading-none px-1">×</button>
              </div>
              <textarea
                value={mod.body}
                onChange={(e) => updateModule(i, "body", e.target.value)}
                placeholder="Module description (optional)"
                rows={2}
                className="w-full border border-line rounded px-3 py-1.5 text-sm text-ink/70 focus:outline-none focus:ring-2 focus:ring-safety-red resize-y"
              />
            </div>
          ))}
        </div>
      </div>

      {/* AI FAQ Generation */}
      <div className="border border-line rounded-lg p-4 bg-surface/40">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-ink">AI-Generated FAQs</p>
          <button
            type="button"
            onClick={handleGenerateFaqs}
            disabled={generatingFaqs}
            className="text-xs bg-ink text-white hover:bg-ink/80 disabled:opacity-60 px-3 py-1.5 rounded transition-colors"
          >
            {generatingFaqs ? "Generating…" : "✨ Generate FAQs with AI"}
          </button>
        </div>
        {faqMessage && <p className="text-xs text-ink/60 mt-1">{faqMessage}</p>}
        <p className="text-xs text-ink/40">Generates 5 FAQs and saves them to the database. Save the course first.</p>
      </div>

      {error && <p className="text-sm text-safety-red" role="alert">{error}</p>}

      <div className="flex gap-3 pt-2 border-t border-line">
        <button onClick={() => handleSave(true)} disabled={saving}
          className="bg-safety-red hover:bg-red-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded transition-colors text-sm">
          {saving ? "Saving…" : "Save & Publish"}
        </button>
        <button onClick={() => handleSave(false)} disabled={saving}
          className="bg-surface border border-line hover:border-ink/30 text-ink font-semibold px-5 py-2.5 rounded transition-colors text-sm">
          Save as Draft
        </button>
        <button onClick={() => router.push("/admin/courses")}
          className="text-ink/40 hover:text-ink text-sm px-3 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, mono }: { label: string; value: string; onChange: (v: string) => void; mono?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-ink mb-1">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)}
        className={`w-full border border-line rounded px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-safety-red ${mono ? "font-mono" : ""}`} />
    </div>
  );
}

function TextareaField({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-ink mb-1">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows}
        className="w-full border border-line rounded px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-safety-red resize-y" />
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  org: string;
  location: string;
  is_published: boolean;
  sort_order: number;
}

interface TestimonialsManagerProps {
  testimonials: Testimonial[];
}

const BLANK = { id: "", quote: "", name: "", org: "", location: "", is_published: true, sort_order: 0 };

export function TestimonialsManager({ testimonials }: TestimonialsManagerProps) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ ...BLANK });
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const supabase = createClient();
    await supabase.from("testimonials").insert({
      quote: form.quote,
      name: form.name,
      org: form.org,
      location: form.location,
      is_published: true,
      sort_order: testimonials.length,
    });
    setSaving(false);
    setAdding(false);
    setForm({ ...BLANK });
    router.refresh();
  }

  async function togglePublish(id: string, current: boolean) {
    const supabase = createClient();
    await supabase.from("testimonials").update({ is_published: !current }).eq("id", id);
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    const supabase = createClient();
    await supabase.from("testimonials").delete().eq("id", id);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      {testimonials.map((t) => (
        <div key={t.id} className={`bg-white border rounded-lg p-5 ${t.is_published ? "border-line" : "border-line/50 opacity-60"}`}>
          <p className="text-ink/80 text-sm italic mb-3 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-ink">{t.name}</p>
              <p className="text-xs text-ink/50">{t.org} · {t.location}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => togglePublish(t.id, t.is_published)}
                className={`text-xs font-mono uppercase px-2.5 py-1 rounded border transition-colors ${t.is_published ? "border-compliance text-compliance" : "border-line text-ink/40"}`}>
                {t.is_published ? "Live" : "Draft"}
              </button>
              <button onClick={() => remove(t.id)} className="text-xs text-ink/30 hover:text-safety-red transition-colors">Delete</button>
            </div>
          </div>
        </div>
      ))}

      {adding ? (
        <div className="bg-white border border-safety-red rounded-lg p-5 flex flex-col gap-3">
          <textarea value={form.quote} onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
            placeholder="Quote text…" rows={3}
            className="w-full border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-safety-red resize-none" />
          <div className="grid grid-cols-3 gap-2">
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Name" className="border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-safety-red" />
            <input value={form.org} onChange={(e) => setForm((f) => ({ ...f, org: e.target.value }))}
              placeholder="Organization" className="border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-safety-red" />
            <input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="Location" className="border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-safety-red" />
          </div>
          <div className="flex gap-2">
            <button onClick={save} disabled={saving}
              className="bg-safety-red hover:bg-red-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded transition-colors">
              {saving ? "Saving…" : "Add Testimonial"}
            </button>
            <button onClick={() => { setAdding(false); setForm({ ...BLANK }); }}
              className="text-ink/40 hover:text-ink text-sm px-3 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)}
          className="border-2 border-dashed border-line hover:border-safety-red text-ink/40 hover:text-safety-red text-sm font-semibold py-4 rounded-lg transition-colors">
          + Add Testimonial
        </button>
      )}
    </div>
  );
}

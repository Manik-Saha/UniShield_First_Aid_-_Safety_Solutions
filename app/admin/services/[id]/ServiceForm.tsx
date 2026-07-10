"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { revalidate } from "@/lib/revalidate";

interface ServiceFormProps {
  service: Record<string, unknown> | null;
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function ServiceForm({ service }: ServiceFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatingFaqs, setGeneratingFaqs] = useState(false);
  const [faqMessage, setFaqMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    slug: (service?.slug as string) ?? "",
    name: (service?.name as string) ?? "",
    summary: (service?.summary as string) ?? "",
    description: (service?.description as string) ?? "",
    hero_image: (service?.hero_image as string) ?? "",
    bullets: ((service?.bullets as string[]) ?? []).join("\n"),
    is_published: (service?.is_published as boolean) ?? true,
  });

  async function handleGenerateFaqs() {
    if (!form.slug || !form.name) {
      setFaqMessage("Save the service first (need a slug and name).");
      return;
    }
    setGeneratingFaqs(true);
    setFaqMessage(null);
    const res = await fetch("/api/ai/generate-faqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entityType: "service",
        entitySlug: form.slug,
        entityName: form.name,
        context: form.summary || form.description,
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
      bullets: form.bullets.split("\n").map((b) => b.trim()).filter(Boolean),
    };

    const { error } = service?.id
      ? await supabase.from("services").update(payload).eq("id", service.id as string)
      : await supabase.from("services").insert(payload);

    if (error) { setError(error.message); setSaving(false); return; }

    await revalidate(["/services", `/services/${form.slug}`]);

    setSaving(false);
    router.push("/admin/services");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Name *" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v, slug: service ? f.slug : slugify(v) }))} />
        <Field label="Slug *" value={form.slug} onChange={(v) => setForm((f) => ({ ...f, slug: v }))} mono />
      </div>

      <Field label="Summary (short, shown in listings)" value={form.summary} onChange={(v) => setForm((f) => ({ ...f, summary: v }))} />
      <TextareaField label="Full Description" value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} rows={6} />
      <Field label="Hero Image URL" value={form.hero_image} onChange={(v) => setForm((f) => ({ ...f, hero_image: v }))} />
      <TextareaField
        label="Bullet Points (one per line)"
        value={form.bullets}
        onChange={(v) => setForm((f) => ({ ...f, bullets: v }))}
        rows={5}
        placeholder={"OSHA-compliant training available\nOn-site or remote delivery\nCertificates issued within 24 hours"}
      />

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
        <p className="text-xs text-ink/40">Generates 5 FAQs and saves them to the database. Save the service first.</p>
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
        <button onClick={() => router.push("/admin/services")}
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

function TextareaField({ label, value, onChange, rows = 4, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-ink mb-1">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={placeholder}
        className="w-full border border-line rounded px-3 py-2 text-sm bg-white text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-safety-red resize-y" />
    </div>
  );
}

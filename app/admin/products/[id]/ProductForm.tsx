"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Spec { id?: string; label: string; value: string; sort_order: number; }
interface Category { slug: string; name: string; }

interface ProductFormProps {
  product: Record<string, unknown> | null;
  specs: Spec[];
  categories: Category[];
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function ProductForm({ product, specs: initSpecs, categories }: ProductFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    slug: (product?.slug as string) ?? "",
    name: (product?.name as string) ?? "",
    category_slug: (product?.category_slug as string) ?? (categories[0]?.slug ?? ""),
    subcategory_slug: (product?.subcategory_slug as string) ?? "",
    short_description: (product?.short_description as string) ?? "",
    description: (product?.description as string) ?? "",
    image: (product?.image as string) ?? "",
    compliance_tags: ((product?.compliance_tags as string[]) ?? []).join(", "),
    is_published: (product?.is_published as boolean) ?? true,
  });

  const [specs, setSpecs] = useState<Spec[]>(
    initSpecs.length > 0 ? initSpecs : [{ label: "", value: "", sort_order: 0 }]
  );

  function addSpec() {
    setSpecs((s) => [...s, { label: "", value: "", sort_order: s.length }]);
  }

  function updateSpec(i: number, field: "label" | "value", val: string) {
    setSpecs((s) => s.map((spec, idx) => idx === i ? { ...spec, [field]: val } : spec));
  }

  function removeSpec(i: number) {
    setSpecs((s) => s.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const payload = {
      ...form,
      compliance_tags: form.compliance_tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    let productId = product?.id as string | undefined;

    if (productId) {
      const { error } = await supabase.from("products").update(payload).eq("id", productId);
      if (error) { setError(error.message); setSaving(false); return; }
    } else {
      const { data, error } = await supabase.from("products").insert(payload).select("id").single();
      if (error || !data) { setError(error?.message ?? "Insert failed"); setSaving(false); return; }
      productId = data.id;
    }

    // Sync specs
    await supabase.from("product_specs").delete().eq("product_id", productId);
    const validSpecs = specs.filter((s) => s.label.trim());
    if (validSpecs.length > 0) {
      await supabase.from("product_specs").insert(
        validSpecs.map((s, i) => ({ product_id: productId, label: s.label, value: s.value, sort_order: i }))
      );
    }

    setSaving(false);
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Name *" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v, slug: product ? f.slug : slugify(v) }))} />
        <Field label="Slug *" value={form.slug} onChange={(v) => setForm((f) => ({ ...f, slug: v }))} mono />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-ink mb-1">Category</label>
          <select value={form.category_slug} onChange={(e) => setForm((f) => ({ ...f, category_slug: e.target.value }))}
            className="w-full border border-line rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-safety-red">
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <Field label="Subcategory Slug" value={form.subcategory_slug} onChange={(v) => setForm((f) => ({ ...f, subcategory_slug: v }))} mono />
      </div>

      <Field label="Short Description" value={form.short_description} onChange={(v) => setForm((f) => ({ ...f, short_description: v }))} />
      <TextareaField label="Full Description" value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} />
      <Field label="Image URL" value={form.image} onChange={(v) => setForm((f) => ({ ...f, image: v }))} />
      <Field label="Compliance Tags (comma-separated)" value={form.compliance_tags} onChange={(v) => setForm((f) => ({ ...f, compliance_tags: v }))} mono />

      {/* Specs */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-semibold text-ink">Specifications</label>
          <button type="button" onClick={addSpec} className="text-xs text-safety-red hover:underline">+ Add row</button>
        </div>
        <div className="flex flex-col gap-2">
          {specs.map((spec, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input value={spec.label} onChange={(e) => updateSpec(i, "label", e.target.value)}
                placeholder="Label" className="flex-1 border border-line rounded px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-safety-red" />
              <input value={spec.value} onChange={(e) => updateSpec(i, "value", e.target.value)}
                placeholder="Value" className="flex-2 border border-line rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-safety-red" />
              <button onClick={() => removeSpec(i)} className="text-ink/30 hover:text-safety-red transition-colors text-lg leading-none">×</button>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-safety-red" role="alert">{error}</p>}

      <div className="flex gap-3 pt-2 border-t border-line">
        <button onClick={handleSave} disabled={saving}
          className="bg-safety-red hover:bg-red-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded transition-colors text-sm">
          {saving ? "Saving…" : "Save Product"}
        </button>
        <button onClick={() => router.push("/admin/products")}
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

function TextareaField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-ink mb-1">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4}
        className="w-full border border-line rounded px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-safety-red resize-y" />
    </div>
  );
}

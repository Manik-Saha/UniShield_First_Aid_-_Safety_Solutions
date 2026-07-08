"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { revalidate } from "@/lib/revalidate";

const CATEGORIES = ["Disaster Preparedness", "Fire Safety", "First Aid", "General", "Safety Training"];

interface BlogPost {
  id?: string;
  slug?: string;
  title?: string;
  excerpt?: string;
  body?: string;
  category?: string;
  author?: string;
  author_title?: string;
  published_at?: string;
  cover_image?: string;
  is_published?: boolean;
  related_slugs?: string[];
}

interface BlogPostFormProps {
  post: BlogPost | null;
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function BlogPostForm({ post }: BlogPostFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    slug: post?.slug ?? "",
    title: post?.title ?? "",
    excerpt: post?.excerpt ?? "",
    body: post?.body ?? "",
    category: post?.category ?? "General",
    author: post?.author ?? "UniShield Safety Team",
    author_title: post?.author_title ?? "Workplace Safety Specialists",
    published_at: post?.published_at ?? new Date().toISOString().slice(0, 10),
    cover_image: post?.cover_image ?? "",
    is_published: post?.is_published ?? false,
  });

  function handleTitleChange(title: string) {
    setForm((f) => ({
      ...f,
      title,
      slug: post?.slug ? f.slug : slugify(title),
    }));
  }

  async function handleSave(publish: boolean) {
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const payload = { ...form, is_published: publish };

    const { error } = post?.id
      ? await supabase.from("blog_posts").update(payload).eq("id", post.id)
      : await supabase.from("blog_posts").insert(payload);

    setSaving(false);
    if (error) { setError(error.message); return; }

    // Revalidate all blog-related public pages
    await revalidate([
      "/blog",
      `/blog/${payload.slug}`,
      `/blog/category/${payload.category.toLowerCase().replace(/\s+/g, "-")}`,
    ]);

    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-5">
      <Field label="Title *" value={form.title} onChange={handleTitleChange} />
      <Field label="Slug *" value={form.slug} onChange={(v) => setForm((f) => ({ ...f, slug: v }))} mono />

      <div className="grid grid-cols-2 gap-4">
        <SelectField label="Category" value={form.category} onChange={(v) => setForm((f) => ({ ...f, category: v }))} options={CATEGORIES} />
        <Field label="Published Date" value={form.published_at} onChange={(v) => setForm((f) => ({ ...f, published_at: v }))} type="date" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Author" value={form.author} onChange={(v) => setForm((f) => ({ ...f, author: v }))} />
        <Field label="Author Title" value={form.author_title} onChange={(v) => setForm((f) => ({ ...f, author_title: v }))} />
      </div>

      <Field label="Cover Image URL" value={form.cover_image} onChange={(v) => setForm((f) => ({ ...f, cover_image: v }))} />
      <TextareaField label="Excerpt" value={form.excerpt} onChange={(v) => setForm((f) => ({ ...f, excerpt: v }))} rows={2} />
      <TextareaField label="Body (plain text or Markdown)" value={form.body} onChange={(v) => setForm((f) => ({ ...f, body: v }))} rows={16} mono />

      {error && <p className="text-sm text-safety-red" role="alert">{error}</p>}

      <div className="flex gap-3 pt-2 border-t border-line">
        <button
          onClick={() => handleSave(true)}
          disabled={saving}
          className="bg-safety-red hover:bg-red-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded transition-colors text-sm"
        >
          {saving ? "Saving…" : "Save & Publish"}
        </button>
        <button
          onClick={() => handleSave(false)}
          disabled={saving}
          className="bg-surface border border-line hover:border-ink/30 text-ink font-semibold px-5 py-2.5 rounded transition-colors text-sm"
        >
          Save as Draft
        </button>
        <button
          onClick={() => router.push("/admin/blog")}
          className="text-ink/40 hover:text-ink text-sm px-3 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", mono,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; mono?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-ink mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border border-line rounded px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-safety-red ${mono ? "font-mono" : ""}`}
      />
    </div>
  );
}

function TextareaField({
  label, value, onChange, rows = 4, mono,
}: {
  label: string; value: string; onChange: (v: string) => void; rows?: number; mono?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-ink mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={`w-full border border-line rounded px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-safety-red resize-y ${mono ? "font-mono text-xs" : ""}`}
      />
    </div>
  );
}

function SelectField({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-ink mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-line rounded px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-safety-red"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

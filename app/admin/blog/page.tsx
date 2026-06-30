import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "../_components/DeleteButton";
import { TogglePublished } from "../_components/TogglePublished";

export const metadata: Metadata = { title: "Blog Posts" };
export const dynamic = "force-dynamic";

export default async function BlogAdminPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, slug, title, category, author, published_at, is_published, created_at")
    .order("published_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-ink">Blog Posts</h1>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-1.5 bg-safety-red hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded transition-colors"
        >
          + New Post
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface border-b border-line">
              {["Title", "Category", "Author", "Date", "Published", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-mono text-xs uppercase tracking-widest text-ink/40">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {(posts ?? []).map((post) => (
              <tr key={post.id} className="hover:bg-surface/40">
                <td className="px-4 py-3">
                  <Link href={`/admin/blog/${post.id}`} className="font-medium text-ink hover:text-safety-red transition-colors line-clamp-1">
                    {post.title}
                  </Link>
                  <p className="font-mono text-xs text-ink/40 mt-0.5">/blog/{post.slug}</p>
                </td>
                <td className="px-4 py-3 text-ink/60 font-mono text-xs uppercase">{post.category}</td>
                <td className="px-4 py-3 text-ink/60">{post.author}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink/40">{post.published_at ?? "—"}</td>
                <td className="px-4 py-3">
                  <TogglePublished table="blog_posts" id={post.id} current={post.is_published} />
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <Link href={`/admin/blog/${post.id}`} className="text-xs text-safety-red hover:underline">Edit</Link>
                  <Link href={`/blog/${post.slug}`} target="_blank" className="text-xs text-ink/40 hover:text-ink transition-colors">View ↗</Link>
                  <DeleteButton table="blog_posts" id={post.id} label="Post" />
                </td>
              </tr>
            ))}
            {(posts ?? []).length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-ink/40 text-sm">No posts yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BlogPostForm } from "./BlogPostForm";

export const metadata: Metadata = { title: "Edit Post" };
export const dynamic = "force-dynamic";

interface Props { params: Promise<{ id: string }> }

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params;
  const isNew = id === "new";

  let post = null;
  if (!isNew) {
    const supabase = await createClient();
    const { data } = await supabase.from("blog_posts").select("*").eq("id", id).single();
    if (!data) notFound();
    post = data;
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-display font-bold text-2xl text-ink mb-6">
        {isNew ? "New Blog Post" : "Edit Post"}
      </h1>
      <BlogPostForm post={post} />
    </div>
  );
}

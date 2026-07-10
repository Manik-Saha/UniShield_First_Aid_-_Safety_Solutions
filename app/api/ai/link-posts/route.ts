import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateText } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { postId } = await req.json();
    if (!postId) {
      return NextResponse.json({ error: "Missing postId" }, { status: 400 });
    }

    const supabase = await createClient();

    // Fetch the target post
    const { data: post } = await supabase
      .from("blog_posts")
      .select("slug, title, excerpt, category")
      .eq("id", postId)
      .single();
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Fetch all other published posts
    const { data: others } = await supabase
      .from("blog_posts")
      .select("slug, title, excerpt, category")
      .eq("is_published", true)
      .neq("id", postId);

    if (!others || others.length === 0) {
      return NextResponse.json({ relatedSlugs: [] });
    }

    const prompt = `You are matching blog posts for internal linking on a workplace safety website.

Current post:
Title: ${post.title}
Category: ${post.category}
Excerpt: ${post.excerpt}

Other available posts:
${others.map((p) => `- slug: "${p.slug}" | title: "${p.title}" | category: ${p.category}`).join("\n")}

Return ONLY a JSON array of up to 3 slug strings from the list above that are most topically related to the current post. Example: ["slug-one","slug-two"]`;

    const raw = await generateText(prompt);
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    const relatedSlugs: string[] = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    // Update the post's related_slugs
    await supabase.from("blog_posts").update({ related_slugs: relatedSlugs }).eq("id", postId);

    return NextResponse.json({ relatedSlugs });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

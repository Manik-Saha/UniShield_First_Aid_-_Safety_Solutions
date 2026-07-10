import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateText } from "@/lib/ai";

// Vercel Cron calls this with the Authorization header containing CRON_SECRET
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = await createClient();

    // Fetch existing post titles to avoid duplicates
    const { data: existingPosts } = await supabase
      .from("blog_posts")
      .select("title, slug, category, excerpt")
      .order("published_at", { ascending: false })
      .limit(20);

    const existingTitles = (existingPosts ?? []).map((p) => p.title).join("\n- ");

    // Step 1: Pick a fresh topic
    const topicPrompt = `You are a content strategist for UniShield First Aid & Safety, a B2B workplace safety company in Southern California.

Suggest ONE new blog post topic that would be useful for facility managers, HR directors, and safety officers. It should relate to:
- OSHA compliance, Cal/OSHA regulations
- First aid, CPR, AED maintenance
- Workplace safety training
- Fire safety, disaster preparedness
- PPE, eyewash stations

${existingTitles ? `Avoid these already-covered topics:\n- ${existingTitles}` : ""}

Return ONLY a JSON object — no markdown, no explanation:
{"topic": "...", "category": "First Aid|Fire Safety|Safety Training|Disaster Preparedness|General"}`;

    const topicRaw = await generateText(topicPrompt);
    const topicMatch = topicRaw.match(/\{[\s\S]*\}/);
    if (!topicMatch) {
      return NextResponse.json({ error: "Failed to pick topic" }, { status: 500 });
    }
    const { topic, category } = JSON.parse(topicMatch[0]);

    // Step 2: Generate the full blog post
    const postPrompt = `You are a workplace safety content writer for UniShield First Aid & Safety (SoCal First Aid), a B2B safety company serving Southern California businesses.

Write a detailed, helpful blog post about: "${topic}"
Category: ${category}

Return ONLY valid JSON with no markdown fences:
{
  "title": "SEO-optimized blog post title",
  "slug": "url-friendly-slug-from-title",
  "excerpt": "2-sentence summary for meta description (under 160 chars)",
  "body": "Full blog post in plain text paragraphs. Use double newlines between paragraphs. 500-800 words. Include practical tips, OSHA context, and a soft call-to-action mentioning UniShield at the end."
}`;

    const postRaw = await generateText(postPrompt);
    const postMatch = postRaw.match(/\{[\s\S]*\}/);
    if (!postMatch) {
      return NextResponse.json({ error: "Failed to generate post" }, { status: 500 });
    }
    const post = JSON.parse(postMatch[0]);

    // Step 3: Check slug uniqueness
    const baseSlug: string = post.slug;
    const { count } = await supabase
      .from("blog_posts")
      .select("*", { count: "exact", head: true })
      .eq("slug", baseSlug);
    const finalSlug = count && count > 0 ? `${baseSlug}-${Date.now()}` : baseSlug;

    // Step 4: Save to Supabase
    const { data: newPost, error: insertError } = await supabase
      .from("blog_posts")
      .insert({
        slug: finalSlug,
        title: post.title,
        excerpt: post.excerpt,
        body: post.body,
        category,
        author: "UniShield Safety Team",
        author_title: "Workplace Safety Specialists",
        published_at: new Date().toISOString().slice(0, 10),
        cover_image: "",
        is_published: true,
      })
      .select("id")
      .single();

    if (insertError || !newPost) {
      return NextResponse.json({ error: insertError?.message ?? "Insert failed" }, { status: 500 });
    }

    // Step 5: Auto-link the new post to related posts
    const allPosts = existingPosts ?? [];
    if (allPosts.length > 0) {
      const linkPrompt = `You are matching blog posts for internal linking on a workplace safety website.

Current post:
Title: ${post.title}
Category: ${category}
Excerpt: ${post.excerpt}

Other available posts:
${allPosts.map((p) => `- slug: "${p.slug}" | title: "${p.title}" | category: ${p.category}`).join("\n")}

Return ONLY a JSON array of up to 3 slug strings that are most topically related. Example: ["slug-one","slug-two"]`;

      const linkRaw = await generateText(linkPrompt);
      const linkMatch = linkRaw.match(/\[[\s\S]*\]/);
      const relatedSlugs: string[] = linkMatch ? JSON.parse(linkMatch[0]) : [];

      await supabase
        .from("blog_posts")
        .update({ related_slugs: relatedSlugs })
        .eq("id", newPost.id);
    }

    // Step 6: Revalidate blog pages
    const revalidateSecret = process.env.REVALIDATE_SECRET;
    if (revalidateSecret) {
      const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.socalfirstaid.com";
      await fetch(`${base}/api/revalidate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: revalidateSecret,
          paths: ["/blog", `/blog/${finalSlug}`],
        }),
      });
    }

    return NextResponse.json({
      success: true,
      slug: finalSlug,
      title: post.title,
      category,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

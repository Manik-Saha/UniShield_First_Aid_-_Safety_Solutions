// Supabase Edge Function — runs on Deno
// Scheduled daily via Supabase Dashboard → Edge Functions → Schedule
// Env vars set in: Supabase Dashboard → Project Settings → Edge Functions → Secrets
//   GEMINI_API_KEY   — Google AI Studio free key
//   SUPABASE_URL     — auto-injected by Supabase
//   SUPABASE_SERVICE_ROLE_KEY — auto-injected by Supabase
//   SITE_URL         — https://www.socalfirstaid.com (for revalidation)
//   REVALIDATE_SECRET — must match your Next.js REVALIDATE_SECRET

import { createClient } from "npm:@supabase/supabase-js@2";
import OpenAI from "npm:openai@4";

const gemini = new OpenAI({
  apiKey: Deno.env.get("GEMINI_API_KEY")!,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

async function ask(prompt: string): Promise<string> {
  const resp = await gemini.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 2048,
  });
  return resp.choices[0]?.message?.content ?? "";
}

function extractJson(raw: string, type: "object" | "array"): string | null {
  const match = type === "object"
    ? raw.match(/\{[\s\S]*\}/)
    : raw.match(/\[[\s\S]*\]/);
  return match ? match[0] : null;
}

Deno.serve(async (req: Request) => {
  // Allow manual POST trigger with optional auth check
  const authHeader = req.headers.get("authorization");
  const cronSecret = Deno.env.get("CRON_SECRET");
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // ── Step 1: Fetch existing posts to avoid duplicate topics ──
    const { data: existingPosts } = await supabase
      .from("blog_posts")
      .select("title, slug, category, excerpt")
      .order("published_at", { ascending: false })
      .limit(30);

    const existingTitles = (existingPosts ?? [])
      .map((p: { title: string }) => p.title)
      .join("\n- ");

    // ── Step 2: Pick a fresh topic ──
    const topicRaw = await ask(`You are a content strategist for UniShield First Aid & Safety, a B2B workplace safety company in Southern California.

Suggest ONE new blog post topic useful for facility managers, HR directors, and safety officers. Topics should relate to:
- OSHA / Cal/OSHA compliance and regulations
- First aid, CPR, AED maintenance
- Workplace safety training
- Fire safety, disaster preparedness
- PPE, eyewash stations, chemical safety

${existingTitles ? `Avoid these already-covered topics:\n- ${existingTitles}` : ""}

Return ONLY a JSON object, no markdown:
{"topic": "...", "category": "First Aid|Fire Safety|Safety Training|Disaster Preparedness|General"}`);

    const topicJson = extractJson(topicRaw, "object");
    if (!topicJson) throw new Error("Failed to pick topic");
    const { topic, category } = JSON.parse(topicJson);

    // ── Step 3: Generate the full blog post ──
    const postRaw = await ask(`You are a workplace safety content writer for UniShield First Aid & Safety (SoCal First Aid), a B2B safety company serving Southern California businesses.

Write a detailed, helpful blog post about: "${topic}"
Category: ${category}

Return ONLY valid JSON, no markdown fences:
{
  "title": "SEO-optimized blog post title",
  "slug": "url-friendly-slug-from-title",
  "excerpt": "2-sentence summary for meta description (under 160 chars)",
  "body": "Full blog post in plain text paragraphs. Use double newlines between paragraphs. 500-800 words. Include practical tips, OSHA context, and a soft call-to-action mentioning UniShield at the end."
}`);

    const postJson = extractJson(postRaw, "object");
    if (!postJson) throw new Error("Failed to generate post");
    const post = JSON.parse(postJson);

    // ── Step 4: Ensure slug is unique ──
    const { count } = await supabase
      .from("blog_posts")
      .select("*", { count: "exact", head: true })
      .eq("slug", post.slug);
    const finalSlug: string =
      count && count > 0 ? `${post.slug}-${Date.now()}` : post.slug;

    // ── Step 5: Save to Supabase ──
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
      throw new Error(insertError?.message ?? "Insert failed");
    }

    // ── Step 6: Auto-link to related posts ──
    const others = existingPosts ?? [];
    let relatedSlugs: string[] = [];

    if (others.length > 0) {
      const linkRaw = await ask(`You are matching blog posts for internal linking on a workplace safety website.

Current post:
Title: ${post.title}
Category: ${category}
Excerpt: ${post.excerpt}

Other available posts:
${others.map((p: { slug: string; title: string; category: string }) => `- slug: "${p.slug}" | title: "${p.title}" | category: ${p.category}`).join("\n")}

Return ONLY a JSON array of up to 3 slug strings that are most topically related. Example: ["slug-one","slug-two"]`);

      const linkJson = extractJson(linkRaw, "array");
      relatedSlugs = linkJson ? JSON.parse(linkJson) : [];

      await supabase
        .from("blog_posts")
        .update({ related_slugs: relatedSlugs })
        .eq("id", newPost.id);
    }

    // ── Step 7: Revalidate Next.js blog pages ──
    const siteUrl = Deno.env.get("SITE_URL") ?? "https://www.socalfirstaid.com";
    const revalidateSecret = Deno.env.get("REVALIDATE_SECRET");
    if (revalidateSecret) {
      await fetch(`${siteUrl}/api/revalidate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: revalidateSecret,
          paths: ["/blog", `/blog/${finalSlug}`],
        }),
      }).catch(() => null);
    }

    const result = {
      success: true,
      title: post.title,
      slug: finalSlug,
      category,
      relatedSlugs,
    };

    console.log("Auto-blog generated:", result);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Auto-blog error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

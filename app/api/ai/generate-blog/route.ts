import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { topic, category, relatedProducts, relatedServices } = await req.json();
    if (!topic || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const prompt = `You are a workplace safety content writer for UniShield First Aid & Safety (SoCal First Aid), a B2B safety company serving Southern California businesses.

Write a detailed, helpful blog post about: "${topic}"
Category: ${category}
${relatedProducts?.length ? `Related products: ${relatedProducts.join(", ")}` : ""}
${relatedServices?.length ? `Related services: ${relatedServices.join(", ")}` : ""}

Return ONLY valid JSON with no markdown fences:
{
  "title": "SEO-optimized blog post title",
  "slug": "url-friendly-slug-from-title",
  "excerpt": "2-sentence summary for meta description (under 160 chars)",
  "body": "Full blog post in plain text paragraphs. Use double newlines between paragraphs. 500-800 words. Include practical tips, OSHA context, and a soft call-to-action at the end mentioning UniShield."
}`;

    const raw = await generateText(prompt);
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    const post = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ post });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

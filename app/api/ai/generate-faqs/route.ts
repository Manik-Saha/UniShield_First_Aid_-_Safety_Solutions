import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateText } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { entityType, entitySlug, entityName, context } = await req.json();
    if (!entityType || !entitySlug || !entityName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const prompt = `You are a safety industry content writer for UniShield First Aid & Safety (also called SoCal First Aid), a B2B first-aid and safety company in Southern California.

Generate 5 helpful frequently asked questions (FAQs) for the following ${entityType}:
Name: ${entityName}
${context ? `Context: ${context}` : ""}

Return ONLY a JSON array with exactly 5 objects, each with "question" and "answer" fields. No markdown fences, no explanation.
Example format:
[{"question":"...","answer":"..."},...]

Make the questions specific, practical, and relevant to B2B customers (facility managers, HR directors, safety officers). Answers should be 2-3 sentences.`;

    const raw = await generateText(prompt);
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    const faqs: { question: string; answer: string }[] = JSON.parse(jsonMatch[0]);

    // Save to Supabase
    const supabase = await createClient();
    // Delete existing FAQs for this entity
    await supabase.from("faqs").delete().eq("entity_type", entityType).eq("entity_slug", entitySlug);
    // Insert new FAQs
    const rows = faqs.map((faq, i) => ({
      entity_type: entityType,
      entity_slug: entitySlug,
      question: faq.question,
      answer: faq.answer,
      sort_order: i,
    }));
    const { error } = await supabase.from("faqs").insert(rows);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ faqs });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

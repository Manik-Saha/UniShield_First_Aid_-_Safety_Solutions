import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { TestimonialsManager } from "./TestimonialsManager";

export const metadata: Metadata = { title: "Testimonials" };
export const dynamic = "force-dynamic";

export default async function TestimonialsAdminPage() {
  const supabase = await createClient();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order");

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-display font-bold text-2xl text-ink mb-6">Testimonials</h1>
      <TestimonialsManager testimonials={testimonials ?? []} />
    </div>
  );
}

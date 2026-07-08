import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ServiceForm } from "./ServiceForm";

export const metadata: Metadata = { title: "Edit Service" };
export const dynamic = "force-dynamic";

interface Props { params: Promise<{ id: string }> }

export default async function EditServicePage({ params }: Props) {
  const { id } = await params;
  const isNew = id === "new";

  const supabase = await createClient();
  let service = null;

  if (!isNew) {
    const { data } = await supabase.from("services").select("*").eq("id", id).single();
    if (!data) notFound();
    service = data;
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-display font-bold text-2xl text-ink mb-6">
        {isNew ? "New Service" : "Edit Service"}
      </h1>
      <ServiceForm service={service} />
    </div>
  );
}

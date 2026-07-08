import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "./ProductForm";

export const metadata: Metadata = { title: "Edit Product" };
export const dynamic = "force-dynamic";

interface Props { params: Promise<{ id: string }> }

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const isNew = id === "new";

  let product = null;
  let specs: { id: string; label: string; value: string; sort_order: number }[] = [];
  const supabase = await createClient();

  if (!isNew) {
    const { data } = await supabase.from("products").select("*").eq("id", id).single();
    if (!data) notFound();
    product = data;
    const { data: specData } = await supabase
      .from("product_specs")
      .select("*")
      .eq("product_id", id)
      .order("sort_order");
    specs = specData ?? [];
  }

  const [{ data: categories }, { data: subcategories }] = await Promise.all([
    supabase.from("categories").select("slug, name").order("sort_order"),
    supabase.from("subcategories").select("slug, name, category_slug").order("sort_order"),
  ]);

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-display font-bold text-2xl text-ink mb-6">
        {isNew ? "New Product" : "Edit Product"}
      </h1>
      <ProductForm
        product={product}
        specs={specs}
        categories={categories ?? []}
        subcategories={subcategories ?? []}
      />
    </div>
  );
}

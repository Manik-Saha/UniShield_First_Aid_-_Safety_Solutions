import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "../_components/DeleteButton";
import { TogglePublished } from "../_components/TogglePublished";

export const metadata: Metadata = { title: "Products" };
export const dynamic = "force-dynamic";

export default async function ProductsAdminPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, slug, name, category_slug, subcategory_slug, is_published, sort_order")
    .order("category_slug")
    .order("sort_order");

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-ink">Products</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 bg-safety-red hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded transition-colors"
        >
          + New Product
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface border-b border-line">
              {["Name", "Category", "Subcategory", "Published", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-mono text-xs uppercase tracking-widest text-ink/40">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {(products ?? []).map((product) => (
              <tr key={product.id} className="hover:bg-surface/40">
                <td className="px-4 py-3">
                  <Link href={`/admin/products/${product.id}`} className="font-medium text-ink hover:text-safety-red transition-colors">
                    {product.name}
                  </Link>
                  <p className="font-mono text-xs text-ink/40">{product.slug}</p>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-ink/60">{product.category_slug}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink/60">{product.subcategory_slug}</td>
                <td className="px-4 py-3">
                  <TogglePublished table="products" id={product.id} current={product.is_published} />
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <Link href={`/admin/products/${product.id}`} className="text-xs text-safety-red hover:underline">Edit</Link>
                  <Link href={`/products/${product.category_slug}/${product.slug}`} target="_blank" className="text-xs text-ink/40 hover:text-ink transition-colors">View ↗</Link>
                  <DeleteButton table="products" id={product.id} label="Product" />
                </td>
              </tr>
            ))}
            {(products ?? []).length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-ink/40 text-sm">No products yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

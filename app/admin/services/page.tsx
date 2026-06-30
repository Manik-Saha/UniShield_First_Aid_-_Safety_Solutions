import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TogglePublished } from "../_components/TogglePublished";

export const metadata: Metadata = { title: "Services" };
export const dynamic = "force-dynamic";

export default async function ServicesAdminPage() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from("services")
    .select("id, slug, name, summary, is_published, sort_order")
    .order("sort_order");

  return (
    <div className="p-8">
      <h1 className="font-display font-bold text-2xl text-ink mb-6">Services</h1>
      <div className="bg-white rounded-lg border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface border-b border-line">
              {["Service", "Summary", "Published", "Links"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-mono text-xs uppercase tracking-widest text-ink/40">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {(services ?? []).map((svc) => (
              <tr key={svc.id} className="hover:bg-surface/40">
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{svc.name}</p>
                  <p className="font-mono text-xs text-ink/40">{svc.slug}</p>
                </td>
                <td className="px-4 py-3 text-ink/60 max-w-sm text-xs leading-relaxed">{svc.summary}</td>
                <td className="px-4 py-3">
                  <TogglePublished table="services" id={svc.id} current={svc.is_published} />
                </td>
                <td className="px-4 py-3">
                  <Link href={`/services/${svc.slug}`} target="_blank" className="text-xs text-ink/40 hover:text-ink transition-colors">View ↗</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

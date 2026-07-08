import type { Metadata } from "next";
import Link from "next/link";
import { faPenToSquare, faEye } from "@fortawesome/free-solid-svg-icons";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "../_components/DeleteButton";
import { TogglePublished } from "../_components/TogglePublished";
import { IconLink } from "../_components/IconLink";

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-ink">Services</h1>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-1.5 bg-safety-red hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded transition-colors"
        >
          + New Service
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface border-b border-line">
              {["Service", "Summary", "Published", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-mono text-xs uppercase tracking-widest text-ink/40">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {(services ?? []).map((svc) => (
              <tr key={svc.id} className="hover:bg-surface/40">
                <td className="px-4 py-3">
                  <Link href={`/admin/services/${svc.id}`} className="font-medium text-ink hover:text-safety-red transition-colors">
                    {svc.name}
                  </Link>
                  <p className="font-mono text-xs text-ink/40 mt-0.5">/services/{svc.slug}</p>
                </td>
                <td className="px-4 py-3 text-ink/60 max-w-sm text-xs leading-relaxed line-clamp-2">{svc.summary}</td>
                <td className="px-4 py-3">
                  <TogglePublished table="services" id={svc.id} current={svc.is_published} paths={[`/services/${svc.slug}`]} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <IconLink href={`/admin/services/${svc.id}`} icon={faPenToSquare} title="Edit service" className="text-safety-red/60 hover:text-safety-red hover:bg-red-50" />
                    <IconLink href={`/services/${svc.slug}`} icon={faEye} title="View service" external />
                    <DeleteButton table="services" id={svc.id} label="Service" paths={[`/services/${svc.slug}`]} />
                  </div>
                </td>
              </tr>
            ))}
            {(services ?? []).length === 0 && (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-ink/40 text-sm">No services yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

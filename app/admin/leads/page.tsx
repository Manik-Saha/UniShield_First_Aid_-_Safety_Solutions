import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { LeadActions } from "./LeadActions";

export const metadata: Metadata = { title: "Leads" };
export const dynamic = "force-dynamic";

const STATUS_OPTIONS = ["new", "contacted", "qualified", "closed"];
const TYPE_LABELS: Record<string, string> = {
  quote: "Quote", training: "Training", service: "Service", general: "General", careers: "Careers",
};

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string }>;
}) {
  const { status, type } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  if (type) query = query.eq("inquiry_type", type);

  const { data: leads } = await query;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink">Leads</h1>
          <p className="text-ink/50 text-sm">{leads?.length ?? 0} results</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <FilterChip href="/admin/leads" label="All" active={!status && !type} />
        {STATUS_OPTIONS.map((s) => (
          <FilterChip key={s} href={`/admin/leads?status=${s}`} label={s} active={status === s} />
        ))}
      </div>

      <div className="bg-white rounded-lg border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface border-b border-line">
                {["Name", "Company", "Phone", "Email", "Type", "Interest", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-mono text-xs uppercase tracking-widest text-ink/40 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {(leads ?? []).map((lead) => (
                <tr key={lead.id} className="hover:bg-surface/40">
                  <td className="px-4 py-3 font-semibold text-ink whitespace-nowrap">{lead.first_name} {lead.last_name}</td>
                  <td className="px-4 py-3 text-ink/60 max-w-32 truncate">{lead.company ?? "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs">
                    <a href={`tel:${lead.phone}`} className="hover:text-safety-red transition-colors">{lead.phone}</a>
                  </td>
                  <td className="px-4 py-3 text-ink/70 max-w-40 truncate">
                    <a href={`mailto:${lead.email}`} className="hover:text-safety-red transition-colors">{lead.email}</a>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs uppercase">{TYPE_LABELS[lead.inquiry_type] ?? lead.inquiry_type}</td>
                  <td className="px-4 py-3 text-ink/60 max-w-36 truncate">{lead.interest ?? "—"}</td>
                  <td className="px-4 py-3">
                    <LeadActions id={lead.id} currentStatus={lead.status} />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-ink/40 whitespace-nowrap">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`mailto:${lead.email}?subject=Re: Your UniShield inquiry`}
                      className="text-xs text-safety-red hover:underline"
                    >
                      Reply
                    </a>
                  </td>
                </tr>
              ))}
              {(leads ?? []).length === 0 && (
                <tr><td colSpan={9} className="px-4 py-10 text-center text-ink/40 text-sm">No leads found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message viewer */}
      {(leads ?? []).some((l) => l.message) && (
        <div className="mt-6 space-y-3">
          <h2 className="font-sans font-semibold text-ink">Messages</h2>
          {(leads ?? []).filter((l) => l.message).map((lead) => (
            <div key={lead.id} className="bg-white border border-line rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="font-semibold text-sm text-ink">{lead.first_name} {lead.last_name}</p>
                <span className="font-mono text-xs text-ink/40">{new Date(lead.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-ink/70 leading-relaxed">{lead.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <a
      href={href}
      className={`font-mono text-xs uppercase tracking-widest px-3 py-1.5 rounded border transition-colors ${
        active
          ? "bg-ink text-white border-ink"
          : "border-line text-ink/50 hover:border-ink/30 hover:text-ink"
      }`}
    >
      {label}
    </a>
  );
}

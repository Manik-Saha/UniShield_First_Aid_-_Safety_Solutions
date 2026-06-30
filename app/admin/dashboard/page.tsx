import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

async function getStat(table: string, filter?: Record<string, string>) {
  const supabase = await createClient();
  let q = supabase.from(table).select("*", { count: "exact", head: true });
  if (filter) {
    Object.entries(filter).forEach(([k, v]) => { q = q.eq(k, v); });
  }
  const { count } = await q;
  return count ?? 0;
}

export default async function DashboardPage() {
  const [totalLeads, newLeads, posts, products, courses] = await Promise.all([
    getStat("leads"),
    getStat("leads", { status: "new" }),
    getStat("blog_posts"),
    getStat("products"),
    getStat("courses"),
  ]);

  const supabase = await createClient();
  const { data: recentLeads } = await supabase
    .from("leads")
    .select("id, first_name, last_name, company, inquiry_type, created_at, status")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    { label: "New Leads",    value: newLeads,   href: "/admin/leads",    accent: true },
    { label: "Total Leads",  value: totalLeads,  href: "/admin/leads",   accent: false },
    { label: "Blog Posts",   value: posts,       href: "/admin/blog",    accent: false },
    { label: "Products",     value: products,    href: "/admin/products", accent: false },
    { label: "Courses",      value: courses,     href: "/admin/courses",  accent: false },
  ];

  return (
    <div className="p-8">
      <h1 className="font-display font-bold text-2xl text-ink mb-1">Dashboard</h1>
      <p className="text-ink/50 text-sm mb-8">UniShield First Aid & Safety — content and lead management.</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`rounded-lg border p-5 hover:shadow-md transition-shadow ${
              s.accent ? "bg-safety-red border-safety-red text-white" : "bg-white border-line"
            }`}
          >
            <p className={`text-3xl font-display font-bold mb-1 ${s.accent ? "text-white" : "text-ink"}`}>
              {s.value}
            </p>
            <p className={`text-xs font-mono uppercase tracking-widest ${s.accent ? "text-white/70" : "text-ink/50"}`}>
              {s.label}
            </p>
          </Link>
        ))}
      </div>

      {/* Recent leads */}
      <div className="bg-white rounded-lg border border-line overflow-hidden">
        <div className="px-5 py-4 border-b border-line flex justify-between items-center">
          <h2 className="font-sans font-semibold text-ink">Recent Leads</h2>
          <Link href="/admin/leads" className="text-sm text-safety-red hover:underline">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-surface">
                <th className="text-left px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-ink/40">Name</th>
                <th className="text-left px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-ink/40">Company</th>
                <th className="text-left px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-ink/40">Type</th>
                <th className="text-left px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-ink/40">Status</th>
                <th className="text-left px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-ink/40">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {(recentLeads ?? []).map((lead) => (
                <tr key={lead.id} className="hover:bg-surface/50">
                  <td className="px-4 py-3 font-medium text-ink">{lead.first_name} {lead.last_name}</td>
                  <td className="px-4 py-3 text-ink/60">{lead.company ?? "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs uppercase">{lead.inquiry_type}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-ink/40">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {(recentLeads ?? []).length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-ink/40 text-sm">No leads yet. They'll appear here when the contact form is submitted.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { href: "/admin/blog", label: "+ New Blog Post" },
          { href: "/admin/products", label: "+ New Product" },
          { href: "/admin/courses", label: "Manage Courses" },
          { href: "/admin/testimonials", label: "Manage Testimonials" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white border border-line rounded-lg px-4 py-3 text-sm font-semibold text-ink hover:border-safety-red hover:text-safety-red transition-colors text-center"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new:       "bg-blue-100 text-blue-700",
    contacted: "bg-yellow-100 text-yellow-700",
    qualified: "bg-compliance/10 text-compliance",
    closed:    "bg-ink/10 text-ink/50",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono uppercase ${colors[status] ?? "bg-surface text-ink/50"}`}>
      {status}
    </span>
  );
}

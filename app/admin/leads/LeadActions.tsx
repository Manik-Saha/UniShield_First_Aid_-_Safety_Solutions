"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const STATUS_OPTIONS = ["new", "contacted", "qualified", "closed"];
const STATUS_COLORS: Record<string, string> = {
  new: "text-blue-600",
  contacted: "text-yellow-600",
  qualified: "text-green-600",
  closed: "text-ink/40",
};

interface LeadActionsProps {
  id: string;
  currentStatus: string;
}

export function LeadActions({ id, currentStatus }: LeadActionsProps) {
  const router = useRouter();

  async function updateStatus(status: string) {
    const supabase = createClient();
    await supabase.from("leads").update({ status }).eq("id", id);
    router.refresh();
  }

  return (
    <select
      value={currentStatus}
      onChange={(e) => updateStatus(e.target.value)}
      className={`text-xs font-mono uppercase border border-line rounded px-2 py-1 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-safety-red ${STATUS_COLORS[currentStatus] ?? ""}`}
      aria-label="Update lead status"
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}

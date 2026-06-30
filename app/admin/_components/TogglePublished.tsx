"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface TogglePublishedProps {
  table: string;
  id: string;
  current: boolean;
}

export function TogglePublished({ table, id, current }: TogglePublishedProps) {
  const router = useRouter();

  async function toggle() {
    const supabase = createClient();
    await supabase.from(table).update({ is_published: !current }).eq("id", id);
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      className={`inline-block px-2.5 py-1 rounded text-xs font-mono uppercase font-semibold transition-colors ${
        current
          ? "bg-compliance/10 text-compliance hover:bg-compliance/20"
          : "bg-ink/10 text-ink/40 hover:bg-ink/20"
      }`}
      aria-label={current ? "Unpublish" : "Publish"}
    >
      {current ? "Live" : "Draft"}
    </button>
  );
}

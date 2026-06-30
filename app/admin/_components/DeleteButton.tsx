"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface DeleteButtonProps {
  table: string;
  id: string;
  label: string;
}

export function DeleteButton({ table, id, label }: DeleteButtonProps) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Delete this ${label}? This cannot be undone.`)) return;
    const supabase = createClient();
    await supabase.from(table).delete().eq("id", id);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-ink/30 hover:text-safety-red transition-colors"
    >
      Delete
    </button>
  );
}

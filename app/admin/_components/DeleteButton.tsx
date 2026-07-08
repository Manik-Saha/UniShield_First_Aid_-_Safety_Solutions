"use client";

import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { createClient } from "@/lib/supabase/client";
import { revalidate as revalidatePaths } from "@/lib/revalidate";

const TABLE_PATHS: Record<string, string[]> = {
  blog_posts: ["/blog"],
  products: ["/products"],
  courses: ["/training"],
  services: ["/services"],
};

interface DeleteButtonProps {
  table: string;
  id: string;
  label: string;
  paths?: string[];
}

export function DeleteButton({ table, id, label, paths = [] }: DeleteButtonProps) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Delete this ${label}? This cannot be undone.`)) return;
    const supabase = createClient();
    await supabase.from(table).delete().eq("id", id);

    const allPaths = [...(TABLE_PATHS[table] ?? []), ...paths];
    if (allPaths.length > 0) await revalidatePaths(allPaths);

    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      title={`Delete ${label}`}
      className="w-7 h-7 inline-flex items-center justify-center rounded text-ink/30 hover:text-safety-red hover:bg-red-50 transition-colors"
    >
      <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
    </button>
  );
}

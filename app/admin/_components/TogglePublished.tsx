"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { revalidate as revalidatePaths } from "@/lib/revalidate";

// Map of table → paths to revalidate (broad-stroke: revalidate the list page for each entity)
const TABLE_PATHS: Record<string, string[]> = {
  blog_posts: ["/blog"],
  products: ["/products"],
  courses: ["/training"],
  services: ["/services"],
  testimonials: ["/", "/about"],
};

interface TogglePublishedProps {
  table: string;
  id: string;
  current: boolean;
  /** Optional extra paths to revalidate (e.g. the specific detail page) */
  paths?: string[];
}

export function TogglePublished({ table, id, current, paths = [] }: TogglePublishedProps) {
  const router = useRouter();

  async function toggle() {
    const supabase = createClient();
    await supabase.from(table).update({ is_published: !current }).eq("id", id);

    const allPaths = [...(TABLE_PATHS[table] ?? []), ...paths];
    if (allPaths.length > 0) await revalidatePaths(allPaths);

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

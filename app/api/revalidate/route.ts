import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// Called by admin components after any data change.
// Body: { paths?: string[], tags?: string[], secret?: string }
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  // Optional: protect with a secret (set REVALIDATE_SECRET in env)
  const secret = process.env.REVALIDATE_SECRET;
  if (secret && body.secret !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paths: string[] = body.paths ?? [];

  for (const path of paths) {
    revalidatePath(path, "page");
  }

  return NextResponse.json({ revalidated: true, paths });
}

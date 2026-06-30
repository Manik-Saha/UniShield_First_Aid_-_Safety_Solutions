import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { readFileSync } from "fs";
import { join } from "path";

// One-time setup endpoint. Requires service role key in SUPABASE_SERVICE_ROLE_KEY.
// DELETE THIS FILE after running setup.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  // Basic security — require a setup token in the request body
  if (body.token !== process.env.SETUP_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createServiceClient();

    const migrationSql = readFileSync(
      join(process.cwd(), "supabase", "migration.sql"),
      "utf-8"
    );
    const seedSql = readFileSync(
      join(process.cwd(), "supabase", "seed.sql"),
      "utf-8"
    );

    // Run migration
    const { error: migError } = await supabase.rpc("exec_sql" as never, {
      sql: migrationSql,
    });

    if (migError) {
      // Fallback: some Supabase projects don't have exec_sql — instruct user to run manually
      return NextResponse.json({
        message: "exec_sql RPC not available. Please run migration.sql and seed.sql manually in the Supabase SQL editor.",
        migration_path: "supabase/migration.sql",
        seed_path: "supabase/seed.sql",
        dashboard_url: "https://supabase.com/dashboard/project/hyispjmpwyzwsayuuser/sql/new",
      });
    }

    // Run seed
    await supabase.rpc("exec_sql" as never, { sql: seedSql });

    return NextResponse.json({ success: true, message: "Schema and seed data applied." });
  } catch (err) {
    return NextResponse.json({
      error: String(err),
      message: "Run migration.sql then seed.sql in the Supabase SQL editor.",
      dashboard_url: "https://supabase.com/dashboard/project/hyispjmpwyzwsayuuser/sql/new",
    }, { status: 500 });
  }
}

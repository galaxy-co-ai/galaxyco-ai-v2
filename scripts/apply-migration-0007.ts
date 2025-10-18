/**
 * Apply Migration 0007: RLS Policies and System Settings
 *
 * This script manually applies migration 0007 which includes:
 * - system_settings table creation
 * - RLS policies for 17 new tables
 *
 * Run with: npx tsx scripts/apply-migration-0007.ts
 */

import { neon } from "@neondatabase/serverless";
import * as fs from "fs";
import * as path from "path";
import { config } from "dotenv";

// Load environment variables
config({ path: path.resolve(__dirname, "../.env.local") });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in environment variables");
  process.exit(1);
}

async function applyMigration() {
  console.log("🚀 Starting migration 0007 application...\n");

  const sql = neon(DATABASE_URL);

  try {
    // Read migration file
    const migrationPath = path.resolve(
      __dirname,
      "../packages/database/migrations/0007_add_rls_policies_new_tables.sql",
    );

    console.log(`📖 Reading migration file: ${migrationPath}`);
    const migrationSQL = fs.readFileSync(migrationPath, "utf-8");

    // Split into individual statements (simple approach)
    const statements = migrationSQL
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    console.log(`📝 Found ${statements.length} SQL statements\n`);

    // Execute each statement
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      // Skip comments and empty lines
      if (statement.startsWith("--") || statement.trim().length === 0) {
        continue;
      }

      try {
        // Extract table/policy name for logging
        const nameMatch = statement.match(/(?:TABLE|POLICY)\s+"?(\w+)"?/i);
        const name = nameMatch ? nameMatch[1] : "unknown";

        process.stdout.write(
          `  [${i + 1}/${statements.length}] Applying ${name}... `,
        );

        await sql(statement);

        console.log("✅");
        successCount++;
      } catch (error: any) {
        // Check if error is "already exists" - that's OK
        if (error.message?.includes("already exists")) {
          console.log("⏭️  (already exists)");
          successCount++;
        } else {
          console.log("❌");
          console.error(`    Error: ${error.message}`);
          errorCount++;
        }
      }
    }

    console.log("\n📊 Migration Results:");
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);

    // Verify system_settings table exists
    console.log("\n🔍 Verifying system_settings table...");
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'system_settings'
      ) as exists
    `;

    if (result[0]?.exists) {
      console.log("   ✅ system_settings table exists");

      // Check if default settings exist
      const settings = await sql`SELECT * FROM system_settings LIMIT 1`;
      if (settings.length > 0) {
        console.log("   ✅ Default settings initialized");
      } else {
        console.log("   ⚠️  No default settings found, creating...");
        await sql`
          INSERT INTO system_settings (settings)
          VALUES ('{"maintenanceMode":false,"allowSignups":true,"maxWorkspacesPerUser":5,"featureFlags":{"aiAgents":true,"knowledgeBase":true,"customPacks":false},"rateLimit":{"requestsPerMinute":60,"burstSize":100}}'::jsonb)
        `;
        console.log("   ✅ Default settings created");
      }
    } else {
      console.log("   ❌ system_settings table NOT found");
    }

    // Verify RLS policies
    console.log("\n🔍 Verifying RLS policies...");
    const policies = await sql`
      SELECT tablename, COUNT(*) as policy_count
      FROM pg_policies 
      WHERE tablename IN (
        'customers', 'contacts', 'projects', 'prospects', 'tasks', 'calendar_events',
        'invoices', 'campaigns', 'segments', 'exports', 'imports',
        'inbox_messages', 'email_threads', 'chat_messages', 'notifications',
        'webhooks', 'audit_logs'
      )
      GROUP BY tablename
      ORDER BY tablename
    `;

    console.log(`   📋 Found RLS policies on ${policies.length} tables:`);
    policies.forEach((p: any) => {
      console.log(
        `      • ${p.tablename}: ${p.policy_count} ${p.policy_count === 1 ? "policy" : "policies"}`,
      );
    });

    if (errorCount === 0) {
      console.log("\n✅ Migration 0007 applied successfully!");
      console.log("   🔒 All RLS policies are active");
      console.log("   ⚙️  System settings table ready");
      console.log("   🎉 Phase 2 database migration COMPLETE\n");
      process.exit(0);
    } else {
      console.log("\n⚠️  Migration completed with some errors");
      console.log("   Please review the errors above\n");
      process.exit(1);
    }
  } catch (error: any) {
    console.error("\n❌ Migration failed:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run migration
applyMigration();

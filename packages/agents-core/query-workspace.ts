import { db } from "@galaxyco/database/client";
import { workspaces } from "@galaxyco/database/schema";

async function main() {
  console.log("🔍 Querying database for workspaces...\n");

  try {
    const allWorkspaces = await db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        slug: workspaces.slug,
      })
      .from(workspaces)
      .limit(5);

    if (allWorkspaces.length === 0) {
      console.log("⚠️  No workspaces found in database");
      console.log("This is expected for a new database\n");
    } else {
      console.log("✅ Found workspaces:\n");
      allWorkspaces.forEach((ws, idx) => {
        console.log(`${idx + 1}. ${ws.name}`);
        console.log(`   ID: ${ws.id}`);
        console.log(`   Slug: ${ws.slug}\n`);
      });

      console.log("💡 First workspace ID for testing:");
      console.log(`   ${allWorkspaces[0].id}`);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

main().catch(console.error);

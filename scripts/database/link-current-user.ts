import { config } from "dotenv";
import { resolve } from "path";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";

// Load environment
config({ path: resolve(process.cwd(), ".env.local") });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL not found");
}

// Get Clerk User ID from command line argument
const clerkUserId = process.argv[2];

if (!clerkUserId) {
  console.error("\n❌ Error: Please provide your Clerk User ID\n");
  console.log(
    "Usage: tsx scripts/database/link-current-user.ts <your-clerk-user-id>",
  );
  console.log("\nTo find your Clerk User ID:");
  console.log("1. Open your app in browser");
  console.log("2. Open browser console (F12)");
  console.log("3. Run: window.Clerk?.user?.id");
  console.log("4. Copy the user_xxxxx value\n");
  process.exit(1);
}

const sql = neon(DATABASE_URL);
const db = drizzle(sql);

async function linkUser() {
  console.log("\n🔗 Linking Clerk user to workspace...\n");
  console.log("Clerk User ID:", clerkUserId);

  try {
    // 1. Check if user exists
    const existingUser = await db.execute(`
      SELECT id, email FROM users WHERE clerk_user_id = '${clerkUserId}';
    `);

    let userId: string;

    if (existingUser.rows.length === 0) {
      console.log("\n1️⃣  Creating new user in database...");
      const result = await db.execute(`
        INSERT INTO users (id, clerk_user_id, email, first_name, last_name, created_at, updated_at)
        VALUES (
          gen_random_uuid(),
          '${clerkUserId}',
          'user@galaxyco.ai',
          'User',
          'Demo',
          NOW(),
          NOW()
        )
        RETURNING id;
      `);
      userId = result.rows[0].id;
      console.log("✅ User created with ID:", userId);
    } else {
      userId = existingUser.rows[0].id;
      console.log("✅ User already exists with ID:", userId);
      console.log("   Email:", existingUser.rows[0].email);
    }

    // 2. Get the Demo Workspace
    console.log("\n2️⃣  Finding Demo Workspace...");
    const workspace = await db.execute(`
      SELECT id, name FROM workspaces WHERE slug = 'demo-workspace';
    `);

    if (workspace.rows.length === 0) {
      console.error("❌ Demo workspace not found. Run: pnpm db:seed first");
      process.exit(1);
    }

    const workspaceId = workspace.rows[0].id;
    console.log("✅ Found workspace:", workspace.rows[0].name);
    console.log("   ID:", workspaceId);

    // 3. Link user to workspace
    console.log("\n3️⃣  Linking user to workspace...");
    await db.execute(`
      INSERT INTO workspace_members (id, workspace_id, user_id, role, created_at, updated_at)
      VALUES (
        gen_random_uuid(),
        '${workspaceId}',
        '${userId}',
        'owner',
        NOW(),
        NOW()
      )
      ON CONFLICT (workspace_id, user_id) DO UPDATE
      SET updated_at = NOW();
    `);
    console.log("✅ User linked to workspace as owner");

    console.log(
      "\n🎉 Success! Your account is now linked to the Demo Workspace.",
    );
    console.log("\n📱 Next steps:");
    console.log("1. Refresh your browser");
    console.log("2. Navigate to My Work, CRM, or Analytics");
    console.log("3. Pages should now load with data\n");
  } catch (error) {
    console.error("\n❌ Error:", error);
    process.exit(1);
  }
}

linkUser().then(() => process.exit(0));

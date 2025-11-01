import { config } from 'dotenv';
import { resolve } from 'path';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

// Load environment
const envPath = resolve(process.cwd(), '.env.local');
console.log('📄 Loading .env.local from:', envPath);
config({ path: envPath });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL not found in .env.local');
}

console.log('✅ DATABASE_URL loaded');

// Initialize database
const sql = neon(DATABASE_URL);
const db = drizzle(sql);

async function seed() {
  console.log('\n🌱 Starting database seed...\n');

  try {
    // 1. Create test user
    console.log('1️⃣  Creating test user...');
    const userResult = await db.execute(`
      INSERT INTO users (id, clerk_user_id, email, first_name, last_name, created_at, updated_at)
      VALUES (
        gen_random_uuid(),
        'user_test_owner_1',
        'demo@galaxyco.ai',
        'Demo',
        'User',
        NOW(),
        NOW()
      )
      ON CONFLICT (clerk_user_id) DO NOTHING
      RETURNING id;
    `);
    console.log('✅ User created/found');

    // 2. Get user ID
    const userIdResult = await db.execute(`
      SELECT id FROM users WHERE clerk_user_id = 'user_test_owner_1';
    `);
    const userId = userIdResult.rows[0]?.id;
    console.log('   User ID:', userId);

    // 3. Create test workspace
    console.log('\n2️⃣  Creating test workspace...');
    const workspaceResult = await db.execute(`
      INSERT INTO workspaces (
        id, name, slug, subscription_tier, subscription_status,
        created_at, updated_at, settings
      )
      VALUES (
        gen_random_uuid(),
        'Demo Workspace',
        'demo-workspace',
        'professional',
        'active',
        NOW(),
        NOW(),
        '{"branding": {"primaryColor": "#6366f1"}}'::jsonb
      )
      ON CONFLICT (slug) DO NOTHING
      RETURNING id;
    `);
    console.log('✅ Workspace created');

    // 4. Get workspace ID
    const workspaceIdResult = await db.execute(`
      SELECT id FROM workspaces WHERE slug = 'demo-workspace';
    `);
    const workspaceId = workspaceIdResult.rows[0]?.id;
    console.log('   Workspace ID:', workspaceId);

    // 5. Link user to workspace
    console.log('\n3️⃣  Linking user to workspace...');
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
      ON CONFLICT (workspace_id, user_id) DO NOTHING;
    `);
    console.log('✅ User linked to workspace');

    console.log('\n🎉 Database seed completed successfully!');
    console.log('\nCreated:');
    console.log('  - User: demo@galaxyco.ai (clerk_user_id: user_test_owner_1)');
    console.log('  - Workspace: Demo Workspace (slug: demo-workspace)');
    console.log('  - Membership: User is owner of workspace');
    console.log('\n✨ You can now log in and access the dashboard!');
  } catch (error) {
    console.error('\n❌ Seed failed:');
    console.error(error);
    process.exit(1);
  }
}

seed().then(() => process.exit(0));

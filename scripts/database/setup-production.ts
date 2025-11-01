import { config } from 'dotenv';
import { resolve } from 'path';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import readline from 'readline';

// Load environment
config({ path: resolve(process.cwd(), '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL not found');
}

const sql = neon(DATABASE_URL);
const db = drizzle(sql);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setup() {
  console.log('\n🚀 GalaxyCo.ai Production Setup\n');
  console.log('This will create your workspace and link your Clerk account.\n');

  try {
    // Get user input
    const clerkUserId = await prompt(
      'Your Clerk User ID (from browser console: window.Clerk?.user?.id): ',
    );
    if (!clerkUserId.startsWith('user_')) {
      console.error("❌ Invalid Clerk User ID. Must start with 'user_'");
      process.exit(1);
    }

    const workspaceName = await prompt("Workspace Name (e.g., 'Acme Corp'): ");
    if (!workspaceName.trim()) {
      console.error('❌ Workspace name cannot be empty');
      process.exit(1);
    }

    const workspaceSlug = workspaceName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const userEmail = await prompt('Your Email: ');
    const firstName = await prompt('Your First Name: ');
    const lastName = await prompt('Your Last Name: ');

    console.log('\n📝 Creating your workspace...\n');
    console.log('Workspace:', workspaceName);
    console.log('Slug:', workspaceSlug);
    console.log('Owner:', `${firstName} ${lastName} (${userEmail})`);
    console.log('Clerk ID:', clerkUserId);

    const confirm = await prompt('\nProceed? (y/n): ');
    if (confirm.toLowerCase() !== 'y') {
      console.log('Cancelled.');
      process.exit(0);
    }

    // 1. Create user
    console.log('\n1️⃣  Creating user...');
    const userResult = await db.execute(`
      INSERT INTO users (id, clerk_user_id, email, first_name, last_name, created_at, updated_at)
      VALUES (
        gen_random_uuid(),
        '${clerkUserId}',
        '${userEmail}',
        '${firstName}',
        '${lastName}',
        NOW(),
        NOW()
      )
      ON CONFLICT (clerk_user_id) 
      DO UPDATE SET 
        email = EXCLUDED.email,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        updated_at = NOW()
      RETURNING id;
    `);
    const userId = userResult.rows[0].id;
    console.log('✅ User created/updated:', userId);

    // 2. Create workspace
    console.log('\n2️⃣  Creating workspace...');
    const workspaceResult = await db.execute(`
      INSERT INTO workspaces (
        id, name, slug, subscription_tier, subscription_status,
        created_at, updated_at, settings
      )
      VALUES (
        gen_random_uuid(),
        '${workspaceName}',
        '${workspaceSlug}',
        'professional',
        'active',
        NOW(),
        NOW(),
        '{"branding": {"primaryColor": "#6366f1"}}'::jsonb
      )
      ON CONFLICT (slug) DO UPDATE
      SET name = EXCLUDED.name,
          updated_at = NOW()
      RETURNING id;
    `);
    const workspaceId = workspaceResult.rows[0].id;
    console.log('✅ Workspace created:', workspaceId);

    // 3. Link user to workspace as owner
    console.log('\n3️⃣  Making you the workspace owner...');
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
      ON CONFLICT (workspace_id, user_id) 
      DO UPDATE SET 
        role = 'owner',
        updated_at = NOW();
    `);
    console.log('✅ You are now the workspace owner');

    console.log('\n🎉 Setup Complete!\n');
    console.log('Your workspace is ready:');
    console.log(`  - Name: ${workspaceName}`);
    console.log(`  - Slug: ${workspaceSlug}`);
    console.log(`  - Owner: ${firstName} ${lastName}`);
    console.log('\n📱 Next steps:');
    console.log('1. Refresh your browser');
    console.log('2. Navigate to My Work, CRM, or Analytics');
    console.log('3. Your workspace should now load!\n');

    rl.close();
  } catch (error) {
    console.error('\n❌ Error:', error);
    rl.close();
    process.exit(1);
  }
}

setup().then(() => process.exit(0));

#!/usr/bin/env node
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../apps/web/.env.local') });

const sql = neon(process.env.DATABASE_URL);

async function cleanup() {
  try {
    console.log('🗑️  Cleaning up duplicate workspace...');
    
    // Delete workspace_members first (foreign key constraint)
    const members = await sql`
      DELETE FROM workspace_members 
      WHERE workspace_id IN (
        SELECT id FROM workspaces 
        WHERE slug = 'dalton-s-founder-ops-workspace'
      )
      RETURNING id
    `;
    console.log(`✓ Deleted ${members.length} workspace member(s)`);
    
    // Delete workspace
    const workspaces = await sql`
      DELETE FROM workspaces 
      WHERE slug = 'dalton-s-founder-ops-workspace'
      RETURNING id, name, slug
    `;
    console.log(`✓ Deleted ${workspaces.length} workspace(s)`);
    
    if (workspaces.length > 0) {
      console.log('\n✅ Cleanup complete! You can now create your workspace.');
    } else {
      console.log('\n⚠️  No duplicate workspace found (already clean)');
    }
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    process.exit(1);
  }
}

cleanup();

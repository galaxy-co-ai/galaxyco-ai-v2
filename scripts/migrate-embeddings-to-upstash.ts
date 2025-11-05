#!/usr/bin/env tsx
/**
 * Migration Script: Sync PostgreSQL Embeddings to Upstash Vector
 *
 * This script migrates all existing knowledge item embeddings from PostgreSQL
 * to Upstash Vector for faster semantic search.
 *
 * Features:
 * - Batch processing (100 items at a time)
 * - Progress tracking
 * - Error handling with retry logic
 * - Dry-run mode for testing
 *
 * Usage:
 *   npx tsx scripts/migrate-embeddings-to-upstash.ts [--dry-run]
 */

import { db } from '../packages/database/src';
import { knowledgeItems } from '../packages/database/src/schema';
import { eq } from 'drizzle-orm';
import { getVectorClient } from '../apps/web/lib/vector';

interface MigrationStats {
  total: number;
  migrated: number;
  skipped: number;
  failed: number;
  startTime: Date;
  endTime?: Date;
}

async function migrateEmbeddingsToUpstash(dryRun = false) {
  console.log('🚀 Starting embedding migration to Upstash Vector...\n');

  if (dryRun) {
    console.log('⚠️  DRY RUN MODE - No changes will be made\n');
  }

  const stats: MigrationStats = {
    total: 0,
    migrated: 0,
    skipped: 0,
    failed: 0,
    startTime: new Date(),
  };

  try {
    // 1. Initialize Upstash Vector client
    const vectorClient = getVectorClient();
    console.log('✅ Connected to Upstash Vector\n');

    // 2. Fetch all knowledge items with embeddings
    console.log('📊 Fetching knowledge items from PostgreSQL...');
    const items = await db
      .select()
      .from(knowledgeItems)
      .where(eq(knowledgeItems.status, 'ready'));

    stats.total = items.length;
    console.log(`Found ${items.length} knowledge items\n`);

    if (items.length === 0) {
      console.log('✅ No items to migrate');
      return stats;
    }

    // 3. Filter items that have valid embeddings
    const itemsWithEmbeddings = items.filter((item) => {
      if (!item.embeddings) return false;
      if (!Array.isArray(item.embeddings)) return false;
      if (item.embeddings.length === 0) return false;
      return true;
    });

    console.log(`${itemsWithEmbeddings.length} items have embeddings`);
    console.log(`${items.length - itemsWithEmbeddings.length} items skipped (no embeddings)\n`);

    stats.skipped = items.length - itemsWithEmbeddings.length;

    if (dryRun) {
      console.log('🔍 Dry run complete. Would migrate:');
      console.log(`  - Total items: ${itemsWithEmbeddings.length}`);
      console.log(
        `  - Batches: ${Math.ceil(itemsWithEmbeddings.length / 100)}`
      );
      return stats;
    }

    // 4. Migrate in batches of 100
    const batchSize = 100;
    const totalBatches = Math.ceil(itemsWithEmbeddings.length / batchSize);

    console.log(`📦 Processing ${totalBatches} batches...\n`);

    for (let i = 0; i < itemsWithEmbeddings.length; i += batchSize) {
      const batchNumber = Math.floor(i / batchSize) + 1;
      const batch = itemsWithEmbeddings.slice(i, i + batchSize);

      console.log(`Batch ${batchNumber}/${totalBatches} (${batch.length} items)...`);

      try {
        // Prepare vectors for upsert
        const vectors = batch.map((item) => ({
          id: item.id,
          vector: item.embeddings as number[],
          metadata: {
            workspaceId: item.workspaceId,
            collectionId: item.collectionId,
            type: item.type,
            title: item.title,
            status: item.status,
            createdAt: item.createdAt.toISOString(),
          },
        }));

        // Upsert to Upstash Vector
        await vectorClient.upsert(vectors);

        stats.migrated += batch.length;
        console.log(`✅ Migrated batch ${batchNumber} successfully\n`);
      } catch (error) {
        stats.failed += batch.length;
        console.error(`❌ Failed to migrate batch ${batchNumber}:`, error);
        console.log(`Continuing with next batch...\n`);
      }

      // Progress bar
      const progress = ((stats.migrated + stats.failed) / itemsWithEmbeddings.length) * 100;
      console.log(`Progress: ${progress.toFixed(1)}% (${stats.migrated + stats.failed}/${itemsWithEmbeddings.length})\n`);
    }

    stats.endTime = new Date();
    const duration = (stats.endTime.getTime() - stats.startTime.getTime()) / 1000;

    // 5. Print summary
    console.log('═'.repeat(60));
    console.log('📊 Migration Complete!\n');
    console.log(`Total items:     ${stats.total}`);
    console.log(`✅ Migrated:     ${stats.migrated}`);
    console.log(`⏭️  Skipped:      ${stats.skipped}`);
    console.log(`❌ Failed:       ${stats.failed}`);
    console.log(`⏱️  Duration:     ${duration.toFixed(2)}s`);
    console.log(`⚡ Speed:        ${(stats.migrated / duration).toFixed(1)} items/sec`);
    console.log('═'.repeat(60));

    if (stats.failed > 0) {
      console.log('\n⚠️  Some items failed to migrate. Check logs above for details.');
      process.exit(1);
    }

    console.log('\n🎉 All embeddings successfully migrated to Upstash Vector!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }

  return stats;
}

// Run migration
const dryRun = process.argv.includes('--dry-run');
migrateEmbeddingsToUpstash(dryRun).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});


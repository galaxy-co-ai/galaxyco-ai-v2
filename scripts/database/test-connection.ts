/**
 * Test database connection and diagnose issues
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { neon } from '@neondatabase/serverless';

// Load environment variables
config({ path: resolve(__dirname, '../../.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables');
  process.exit(1);
}

console.log('🔍 Testing database connection...');
console.log('Connection string:', DATABASE_URL.replace(/:[^:@]+@/, ':***@')); // Hide password

const sql = neon(DATABASE_URL, {
  fetchOptions: {
    signal: AbortSignal.timeout(15000), // 15 second timeout
  },
});

async function testConnection() {
  try {
    console.log('\n📡 Attempting connection...');
    const startTime = Date.now();

    const result = await sql`SELECT 1 as test, NOW() as timestamp`;
    const duration = Date.now() - startTime;

    console.log('✅ Connection successful!');
    console.log(`⏱️  Response time: ${duration}ms`);
    console.log('📊 Test query result:', result);

    // Test a real query
    console.log('\n🔍 Testing schema query...');
    const tablesResult = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      LIMIT 5
    `;
    console.log('✅ Schema query successful!');
    console.log(
      '📋 Tables found:',
      tablesResult.map((r: any) => r.table_name),
    );
  } catch (error: any) {
    console.error('\n❌ Connection failed!');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);

    // Diagnose common issues
    console.log('\n🔍 Diagnosing issue...');

    if (error.message.includes('timeout')) {
      console.log('⚠️  TIMEOUT: Connection timed out after 15 seconds');
      console.log('   Possible causes:');
      console.log('   - Database is paused (Neon pauses after inactivity)');
      console.log('   - Network/firewall blocking connection');
      console.log('   - Database host is unreachable');
    } else if (error.message.includes('SSL') || error.message.includes('certificate')) {
      console.log('⚠️  SSL ERROR: SSL/TLS certificate issue');
      console.log('   Solution: Ensure connection string includes ?sslmode=require');
    } else if (error.message.includes('authentication') || error.message.includes('password')) {
      console.log('⚠️  AUTH ERROR: Authentication failed');
      console.log('   Solution: Check DATABASE_URL credentials');
    } else if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
      console.log('⚠️  NETWORK ERROR: Cannot reach database host');
      console.log('   Possible causes:');
      console.log('   - Database is paused (Neon)');
      console.log('   - Wrong hostname in connection string');
      console.log('   - Network connectivity issue');
    } else if (error.message.includes('does not exist')) {
      console.log('⚠️  DATABASE ERROR: Database or table does not exist');
      console.log('   Solution: Run migrations to create schema');
    }

    process.exit(1);
  }
}

testConnection()
  .then(() => {
    console.log('\n✅ All tests passed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Unexpected error:', error);
    process.exit(1);
  });

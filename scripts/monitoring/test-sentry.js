#!/usr/bin/env node

/**
 * Test script to verify Sentry integration
 * This sends a test event to Sentry to confirm the setup is working
 */

const Sentry = require('@sentry/nextjs');

// Initialize Sentry with your DSN
Sentry.init({
  dsn: 'https://699c1bed0c2be84c0d98970d34c68923@o4510119201603584.ingest.us.sentry.io/4510162095539328',
  tracesSampleRate: 1.0,
  debug: true, // Enable debug mode to see what's happening
  environment: 'test',
  // Force enable for testing
  enabled: true,
});

console.log('🧪 Sending test event to Sentry...\n');

// Send a test message
Sentry.captureMessage('Test message from GalaxyCo.ai setup verification', {
  level: 'info',
  tags: {
    source: 'manual-test',
    platform: 'galaxyco-ai-2.0',
  },
});

// Send a test error
try {
  throw new Error('Test error from GalaxyCo.ai setup verification');
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      source: 'manual-test',
      platform: 'galaxyco-ai-2.0',
    },
  });
}

// Flush events and wait for completion
console.log('📤 Flushing events to Sentry...\n');

Sentry.flush(2000)
  .then(() => {
    console.log('✅ Test events sent successfully!');
    console.log('\n📊 Check your Sentry dashboard:');
    console.log('   https://sentry.io/organizations/galaxyco-ai/issues/\n');
    console.log('   You should see:');
    console.log("   1. An info message: 'Test message from GalaxyCo.ai setup verification'");
    console.log("   2. An error: 'Test error from GalaxyCo.ai setup verification'\n");
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error sending test events:', error);
    process.exit(1);
  });

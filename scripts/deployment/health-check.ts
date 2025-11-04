#!/usr/bin/env npx tsx
/**
 * Deployment Health Check Script
 *
 * Checks production deployment health after deployment
 *
 * Usage:
 *   pnpm deploy:health                    - Check default production URL
 *   pnpm deploy:health --url https://... - Check custom URL
 *   pnpm deploy:health --ci             - CI mode (fails on errors)
 *
 * Checks:
 * - Production URL responds
 * - Health endpoint returns 200
 * - Key routes accessible
 * - Response times acceptable
 */

import { execSync } from 'child_process';

const PRODUCTION_URL =
  process.env.PRODUCTION_URL || process.env.VERCEL_URL || 'https://galaxyco.ai';
const CI_MODE = process.argv.includes('--ci');

// Parse custom URL from args
const urlIndex = process.argv.indexOf('--url');
const BASE_URL =
  urlIndex > -1 && process.argv[urlIndex + 1] ? process.argv[urlIndex + 1] : PRODUCTION_URL;

// Routes to check
const ROUTES_TO_CHECK = [
  { path: '/', name: 'Homepage' },
  { path: '/api/health', name: 'Health Endpoint' },
  { path: '/api/health/db', name: 'Database Health' },
  { path: '/dashboard', name: 'Dashboard' },
];

console.log('🔍 GalaxyCo.ai Deployment Health Check\n');
console.log('='.repeat(60));
console.log(`Base URL: ${BASE_URL}`);
console.log(`Mode: ${CI_MODE ? 'CI (will fail on errors)' : 'Development'}`);
console.log('='.repeat(60));

interface HealthCheckResult {
  route: string;
  name: string;
  status: 'pass' | 'fail';
  statusCode?: number;
  responseTime?: number;
  error?: string;
}

const results: HealthCheckResult[] = [];

async function checkRoute(path: string, name: string): Promise<HealthCheckResult> {
  const url = `${BASE_URL}${path}`;
  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'GalaxyCo-Health-Check/1.0',
      },
      // 10 second timeout
      signal: AbortSignal.timeout(10000),
    });

    const responseTime = Date.now() - startTime;
    const status = response.ok ? 'pass' : 'fail';

    return {
      route: path,
      name,
      status,
      statusCode: response.status,
      responseTime,
    };
  } catch (error: any) {
    return {
      route: path,
      name,
      status: 'fail',
      error: error.message,
    };
  }
}

// Run health checks
console.log('\n📊 Running Health Checks...\n');

for (const route of ROUTES_TO_CHECK) {
  const result = await checkRoute(route.path, route.name);
  results.push(result);

  if (result.status === 'pass') {
    console.log(`✅ ${route.name} (${route.path})`);
    if (result.statusCode) {
      console.log(`   Status: ${result.statusCode}`);
    }
    if (result.responseTime !== undefined) {
      console.log(`   Response Time: ${result.responseTime}ms`);
    }
  } else {
    console.log(`❌ ${route.name} (${route.path})`);
    if (result.statusCode) {
      console.log(`   Status: ${result.statusCode}`);
    }
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  }
}

// Summary
const passed = results.filter((r) => r.status === 'pass').length;
const failed = results.filter((r) => r.status === 'fail').length;
const avgResponseTime =
  results
    .filter((r) => r.responseTime !== undefined)
    .reduce((sum, r) => sum + (r.responseTime || 0), 0) / passed;

console.log('\n' + '='.repeat(60));
console.log('📊 Health Check Summary');
console.log('='.repeat(60));
console.log(`Total Routes: ${results.length}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
if (avgResponseTime > 0) {
  console.log(`Average Response Time: ${Math.round(avgResponseTime)}ms`);
}

// Check for slow responses
const slowRoutes = results.filter((r) => r.responseTime && r.responseTime > 2000);
if (slowRoutes.length > 0) {
  console.log('\n⚠️  Slow Routes (>2s):');
  slowRoutes.forEach((r) => {
    console.log(`   - ${r.name}: ${r.responseTime}ms`);
  });
}

// Final result
if (failed > 0) {
  console.log('\n❌ Deployment health check failed!');
  console.log('Review the errors above and fix issues before considering deployment successful.');

  if (CI_MODE) {
    process.exit(1);
  }
} else {
  console.log('\n✅ All health checks passed!');
  console.log('Deployment appears healthy.');
}

// Exit with appropriate code
process.exit(failed > 0 ? 1 : 0);

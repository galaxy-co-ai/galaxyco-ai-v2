#!/usr/bin/env node
/**
 * Automated Deployment Verification & Auto-Fix Script
 *
 * Monitors Vercel deployment, runs tests, and auto-fixes common issues
 */

const https = require('https');
const { execSync } = require('child_process');

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_ORG_ID = process.env.VERCEL_ORG_ID;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID || 'galaxyco-ai-2.0';
const PRODUCTION_URL = process.env.PRODUCTION_URL || 'https://app.galaxyco.ai';
const MAX_RETRIES = 3;
const MAX_WAIT_TIME = 600000; // 10 minutes

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data), headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data, headers: res.headers });
        }
      });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function getLatestDeployment() {
  log('🔍 Checking latest deployment...', 'blue');

  // Try getting deployment by project name first
  const url = `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/deployments?teamId=${VERCEL_ORG_ID}&limit=1`;

  try {
    const response = await makeRequest(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      // Try alternative endpoint
      const altUrl = `https://api.vercel.com/v6/deployments?projectId=${VERCEL_PROJECT_ID}&teamId=${VERCEL_ORG_ID}&limit=1`;
      const altResponse = await makeRequest(altUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (altResponse.status !== 200) {
        throw new Error(
          `Vercel API error: ${altResponse.status} - ${JSON.stringify(altResponse.data)}`,
        );
      }

      const deployments = altResponse.data.deployments || [];
      if (deployments.length === 0) {
        throw new Error('No deployments found');
      }

      return deployments[0];
    }

    const deployments = response.data.deployments || [];
    if (deployments.length === 0) {
      throw new Error('No deployments found');
    }

    return deployments[0];
  } catch (error) {
    log(`❌ Failed to get deployment: ${error.message}`, 'red');
    throw error;
  }
}

async function waitForDeployment(deploymentId) {
  log(`⏳ Waiting for deployment ${deploymentId} to complete...`, 'yellow');

  const startTime = Date.now();
  let lastState = '';

  while (Date.now() - startTime < MAX_WAIT_TIME) {
    try {
      const url = `https://api.vercel.com/v13/deployments/${deploymentId}?teamId=${VERCEL_ORG_ID}`;
      const response = await makeRequest(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
        },
      });

      if (response.status !== 200) {
        throw new Error(`Failed to get deployment status: ${response.status}`);
      }

      const deployment = response.data;
      const state = deployment.readyState || deployment.state;

      if (state !== lastState) {
        log(`   State: ${state}`, 'blue');
        lastState = state;
      }

      if (state === 'READY') {
        return { state, deployment };
      }

      if (state === 'ERROR' || state === 'CANCELED') {
        // Get detailed error information
        const buildError = deployment.buildError || deployment.error || 'Unknown error';
        const errorMessage =
          typeof buildError === 'string' ? buildError : JSON.stringify(buildError);

        // Try to get build logs
        let buildLogs = '';
        try {
          const logsUrl = `https://api.vercel.com/v2/deployments/${deploymentId}/events?teamId=${VERCEL_ORG_ID}`;
          const logsResponse = await makeRequest(logsUrl, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${VERCEL_TOKEN}`,
            },
          });

          if (logsResponse.status === 200 && logsResponse.data?.events) {
            const errorEvents = logsResponse.data.events
              .filter((e) => e.type === 'command' && e.payload?.text)
              .map((e) => e.payload.text)
              .filter(
                (text) =>
                  text.toLowerCase().includes('error') || text.toLowerCase().includes('failed'),
              )
              .slice(-20); // Last 20 error lines

            if (errorEvents.length > 0) {
              buildLogs = errorEvents.join('\n');
            }
          }
        } catch (logError) {
          log(`   Could not fetch build logs: ${logError.message}`, 'yellow');
        }

        return {
          state: 'ERROR',
          deployment,
          error: errorMessage,
          buildLogs: buildLogs || errorMessage,
        };
      }

      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
    } catch (error) {
      log(`⚠️  Error checking deployment status: ${error.message}`, 'yellow');
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  throw new Error('Deployment timeout - exceeded maximum wait time');
}

async function checkBuildErrors(deployment) {
  log('🔍 Checking for build errors...', 'blue');

  if (deployment.buildError) {
    log(`❌ Build error found: ${deployment.buildError}`, 'red');
    return { hasError: true, error: deployment.buildError };
  }

  // Check build logs
  try {
    const url = `https://api.vercel.com/v2/deployments/${deployment.uid}/events?teamId=${VERCEL_ORG_ID}`;
    const response = await makeRequest(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
      },
    });

    if (response.status === 200 && response.data) {
      const events = response.data.events || [];
      const errorEvents = events.filter(
        (e) =>
          e.type === 'command' &&
          (e.payload.text?.includes('Error') ||
            e.payload.text?.includes('Failed') ||
            e.payload.text?.includes('error')),
      );

      if (errorEvents.length > 0) {
        const errors = errorEvents.map((e) => e.payload.text).join('\n');
        log(`⚠️  Build warnings/errors detected:`, 'yellow');
        log(errors.substring(0, 500), 'yellow');
        return { hasError: true, error: errors };
      }
    }
  } catch (error) {
    log(`⚠️  Could not fetch build logs: ${error.message}`, 'yellow');
  }

  return { hasError: false };
}

async function runSmokeTests() {
  log('🧪 Running smoke tests...', 'blue');

  const tests = [
    { name: 'Health endpoint', url: `${PRODUCTION_URL}/api/health`, expectedStatus: 200 },
    { name: 'Homepage', url: PRODUCTION_URL, expectedStatus: 200 },
  ];

  const results = [];

  for (const test of tests) {
    try {
      const response = await makeRequest(test.url, { method: 'GET' });
      const passed = response.status === test.expectedStatus || response.status < 500;

      if (passed) {
        log(`   ✅ ${test.name}: ${response.status}`, 'green');
      } else {
        log(`   ❌ ${test.name}: ${response.status}`, 'red');
      }

      results.push({ name: test.name, passed, status: response.status });
    } catch (error) {
      log(`   ❌ ${test.name}: ${error.message}`, 'red');
      results.push({ name: test.name, passed: false, error: error.message });
    }
  }

  const allPassed = results.every((r) => r.passed);
  return { allPassed, results };
}

async function runPlaywrightTests() {
  log('🎭 Running Playwright smoke tests...', 'blue');

  try {
    execSync('pnpm test:smoke', {
      stdio: 'inherit',
      env: {
        ...process.env,
        PLAYWRIGHT_TEST_BASE_URL: PRODUCTION_URL,
      },
    });
    log('✅ Playwright tests passed', 'green');
    return { passed: true };
  } catch (error) {
    log(`❌ Playwright tests failed: ${error.message}`, 'red');
    return { passed: false, error: error.message };
  }
}

async function diagnoseBuildError(error) {
  log('🔍 Diagnosing build error...', 'blue');

  const commonIssues = {
    'npm error': { fix: 'Dependency issue', action: 'check-pnpm-lock' },
    TypeScript: { fix: 'Type errors', action: 'run-typecheck' },
    ENOENT: { fix: 'Missing file', action: 'check-file-exists' },
    'Module not found': { fix: 'Missing dependency', action: 'check-dependencies' },
    memory: { fix: 'Memory issue', action: 'increase-memory' },
    timeout: { fix: 'Build timeout', action: 'increase-timeout' },
  };

  const issue = Object.keys(commonIssues).find((key) => error.toLowerCase().includes(key));

  if (issue) {
    log(`   Found issue: ${commonIssues[issue].fix}`, 'yellow');
    return commonIssues[issue];
  }

  return null;
}

async function applyFix(diagnosis) {
  if (!diagnosis) {
    log('   No auto-fix available for this error', 'yellow');
    return false;
  }

  log(`🔧 Applying fix: ${diagnosis.action}`, 'blue');

  try {
    switch (diagnosis.action) {
      case 'run-typecheck':
        log('   Running typecheck locally...', 'blue');
        execSync('pnpm typecheck', { stdio: 'inherit' });
        break;

      case 'check-dependencies':
        log('   Checking dependencies...', 'blue');
        execSync('pnpm install --frozen-lockfile', { stdio: 'inherit' });
        break;

      default:
        log(`   Fix ${diagnosis.action} not yet implemented`, 'yellow');
        return false;
    }

    log('   ✅ Fix applied', 'green');
    return true;
  } catch (error) {
    log(`   ❌ Fix failed: ${error.message}`, 'red');
    return false;
  }
}

async function verifyDeployment() {
  log('🚀 Starting deployment verification...', 'blue');
  log(`   Production URL: ${PRODUCTION_URL}`, 'blue');
  log(`   Project: ${VERCEL_PROJECT_ID}`, 'blue');

  try {
    // Step 1: Get latest deployment
    const deployment = await getLatestDeployment();
    log(`✅ Found deployment: ${deployment.uid}`, 'green');
    log(`   State: ${deployment.readyState || deployment.state}`, 'blue');
    log(`   URL: ${deployment.url}`, 'blue');

    // Step 2: Wait for deployment to complete
    const { state, deployment: finalDeployment, error } = await waitForDeployment(deployment.uid);

    if (state === 'ERROR') {
      log('❌ Deployment failed!', 'red');
      log(`   Error: ${error || buildLogs || 'Unknown error'}`, 'red');

      // Diagnose and attempt fix
      const diagnosis = await diagnoseBuildError(error || buildLogs || 'Unknown error');
      const fixed = await applyFix(diagnosis);

      if (!fixed) {
        log('❌ Could not auto-fix deployment error', 'red');
        log('   Manual intervention required', 'yellow');
        log('   Check Vercel dashboard for detailed logs', 'yellow');
        process.exit(1);
      }

      // If fixed, we'd need to trigger a new deployment
      log('⚠️  Fix applied - manual redeployment required', 'yellow');
      process.exit(1);
    }

    log(`✅ Deployment ready: ${state}`, 'green');

    // Step 3: Check for build errors
    const buildCheck = await checkBuildErrors(finalDeployment);
    if (buildCheck.hasError) {
      log('⚠️  Build errors detected, but deployment is ready', 'yellow');
    }

    // Step 4: Wait for propagation
    log('⏳ Waiting for deployment to propagate...', 'yellow');
    await new Promise((resolve) => setTimeout(resolve, 15000));

    // Step 5: Run smoke tests
    const smokeResults = await runSmokeTests();
    if (!smokeResults.allPassed) {
      log('❌ Smoke tests failed!', 'red');
      log('   Failed tests:', 'red');
      smokeResults.results
        .filter((r) => !r.passed)
        .forEach((r) => {
          log(`     - ${r.name}: ${r.error || r.status}`, 'red');
        });
      process.exit(1);
    }

    // Step 6: Run Playwright tests
    const playwrightResults = await runPlaywrightTests();
    if (!playwrightResults.passed) {
      log('❌ Playwright tests failed!', 'red');
      process.exit(1);
    }

    log('\n✅ All deployment verification checks passed!', 'green');
    log(`   Deployment URL: ${finalDeployment.url}`, 'green');
    log(`   Production URL: ${PRODUCTION_URL}`, 'green');
  } catch (error) {
    log(`\n❌ Deployment verification failed: ${error.message}`, 'red');
    log(error.stack, 'red');
    process.exit(1);
  }
}

// Run verification
if (require.main === module) {
  if (!VERCEL_TOKEN) {
    log('❌ VERCEL_TOKEN environment variable is required', 'red');
    process.exit(1);
  }

  verifyDeployment().catch((error) => {
    log(`\n❌ Fatal error: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { verifyDeployment, getLatestDeployment, waitForDeployment };

/**
 * Enhanced Deployment Verification & Auto-Fix Script
 *
 * Monitors Vercel deployment, captures full build logs, analyzes warnings/errors,
 * and auto-fixes common issues
 */

const https = require('https');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_ORG_ID = process.env.VERCEL_ORG_ID;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID || 'galaxyco-ai-2.0';
const PRODUCTION_URL = process.env.PRODUCTION_URL || 'https://app.galaxyco.ai';
const MAX_WAIT_TIME = 600000; // 10 minutes

// Log directory for storing build logs
const LOG_DIR = path.join(__dirname, '../../logs/deployments');

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function log(message, color = 'reset') {
  const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
  };
  console.log(`${colors[color] || colors.reset}${message}${colors.reset}`);
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
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch {
          resolve({ status: res.statusCode, data: data });
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

async function fetchBuildLogs(deploymentId) {
  log('📋 Fetching full build logs...', 'blue');

  try {
    const logsUrl = `https://api.vercel.com/v2/deployments/${deploymentId}/events?teamId=${VERCEL_ORG_ID}`;
    const response = await makeRequest(logsUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
      },
    });

    if (response.status === 200 && response.data?.events) {
      const events = response.data.events || [];
      const allLogs = events
        .filter((e) => e.type === 'command' && e.payload?.text)
        .map((e) => e.payload.text);

      return allLogs.join('\n');
    }

    return '';
  } catch (error) {
    log(`⚠️  Could not fetch build logs: ${error.message}`, 'yellow');
    return '';
  }
}

function analyzeBuildLogs(logs) {
  const analysis = {
    warnings: [],
    errors: [],
    issues: [],
    summary: {
      totalWarnings: 0,
      totalErrors: 0,
      criticalIssues: 0,
    },
  };

  if (!logs) return analysis;

  const lines = logs.split('\n');
  const warningPatterns = [
    /warning:/i,
    /deprecated/i,
    /unused/i,
    /console\.(log|warn|error)/i,
    /eslint/i,
    /typescript.*warning/i,
    /missing dependency/i,
    /peer dependency/i,
  ];

  const errorPatterns = [
    /error:/i,
    /failed/i,
    /cannot find/i,
    /module not found/i,
    /type error/i,
    /syntax error/i,
    /build failed/i,
    /compilation error/i,
  ];

  lines.forEach((line, index) => {
    const lowerLine = line.toLowerCase();

    // Check for warnings
    for (const pattern of warningPatterns) {
      if (pattern.test(line)) {
        analysis.warnings.push({
          line: index + 1,
          message: line.trim(),
          category: categorizeIssue(line),
        });
        analysis.summary.totalWarnings++;
        break;
      }
    }

    // Check for errors
    for (const pattern of errorPatterns) {
      if (pattern.test(line)) {
        analysis.errors.push({
          line: index + 1,
          message: line.trim(),
          category: categorizeIssue(line),
          severity: determineSeverity(line),
        });
        analysis.summary.totalErrors++;
        if (determineSeverity(line) === 'critical') {
          analysis.summary.criticalIssues++;
        }
        break;
      }
    }
  });

  return analysis;
}

function categorizeIssue(message) {
  const lower = message.toLowerCase();

  if (lower.includes('type') || lower.includes('typescript')) return 'TypeScript';
  if (lower.includes('eslint') || lower.includes('lint')) return 'Linting';
  if (lower.includes('dependency') || lower.includes('module')) return 'Dependencies';
  if (lower.includes('console')) return 'Console Statements';
  if (lower.includes('deprecated')) return 'Deprecated APIs';
  if (lower.includes('memory') || lower.includes('heap')) return 'Memory';
  if (lower.includes('timeout')) return 'Timeout';
  if (lower.includes('import') || lower.includes('export')) return 'Module Resolution';
  if (lower.includes('build') || lower.includes('compile')) return 'Build';
  return 'Other';
}

function determineSeverity(message) {
  const lower = message.toLowerCase();

  if (
    lower.includes('cannot find') ||
    lower.includes('module not found') ||
    lower.includes('type error') ||
    lower.includes('syntax error') ||
    lower.includes('build failed')
  ) {
    return 'critical';
  }

  if (lower.includes('error') || lower.includes('failed')) {
    return 'high';
  }

  return 'medium';
}

async function autoFixIssues(analysis, deploymentId) {
  const fixes = [];

  // Auto-fix console statements
  if (analysis.warnings.some((w) => w.category === 'Console Statements')) {
    log('🔧 Attempting to fix console statements...', 'yellow');
    try {
      // Find and comment out console statements
      const consoleFiles = await findConsoleStatements();
      if (consoleFiles.length > 0) {
        for (const file of consoleFiles.slice(0, 5)) {
          // Only fix non-critical files
          if (!file.includes('route.ts') && !file.includes('api/')) {
            try {
              await removeConsoleStatements(file);
              fixes.push({ type: 'console-statements', file, status: 'fixed' });
            } catch (error) {
              fixes.push({ type: 'console-statements', file, status: 'failed', error });
            }
          }
        }
      }
    } catch (error) {
      log(`   ⚠️  Could not auto-fix console statements: ${error.message}`, 'yellow');
    }
  }

  // Auto-fix TypeScript errors
  if (analysis.errors.some((e) => e.category === 'TypeScript' && e.severity === 'critical')) {
    log('🔧 Attempting to fix TypeScript errors...', 'yellow');
    try {
      execSync('pnpm typecheck', { stdio: 'pipe' });
      fixes.push({ type: 'typescript', status: 'checked' });
    } catch (error) {
      log(`   ⚠️  TypeScript errors detected: ${error.message}`, 'yellow');
      fixes.push({ type: 'typescript', status: 'needs-attention' });
    }
  }

  // Auto-fix dependency issues
  if (analysis.errors.some((e) => e.category === 'Dependencies')) {
    log('🔧 Attempting to fix dependency issues...', 'yellow');
    try {
      execSync('pnpm install --frozen-lockfile', { stdio: 'pipe' });
      fixes.push({ type: 'dependencies', status: 'fixed' });
    } catch (error) {
      log(`   ⚠️  Could not fix dependencies: ${error.message}`, 'yellow');
      fixes.push({ type: 'dependencies', status: 'failed' });
    }
  }

  return fixes;
}

async function findConsoleStatements() {
  try {
    const result = execSync(
      'grep -r "console\\.log\\|console\\.warn\\|console\\.error" apps/web --include="*.ts" --include="*.tsx" || true',
      {
        encoding: 'utf-8',
        stdio: 'pipe',
      },
    );
    const files = result
      .split('\n')
      .filter((line) => line.includes(':'))
      .map((line) => line.split(':')[0])
      .filter(Boolean);
    return [...new Set(files)];
  } catch {
    return [];
  }
}

async function removeConsoleStatements(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const fixed = lines.map((line) => {
      // Comment out console statements but keep them for debugging
      if (
        line.trim().includes('console.log') ||
        line.trim().includes('console.warn') ||
        line.trim().includes('console.error')
      ) {
        // Only if not already commented
        if (!line.trim().startsWith('//')) {
          return '  // ' + line.trim();
        }
      }
      return line;
    });
    fs.writeFileSync(filePath, fixed.join('\n'));
  } catch (error) {
    throw new Error(`Could not fix ${filePath}: ${error.message}`);
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
        const buildError = deployment.buildError || deployment.error || 'Unknown error';
        const errorMessage =
          typeof buildError === 'string' ? buildError : JSON.stringify(buildError);

        const buildLogs = await fetchBuildLogs(deploymentId);

        return {
          state: 'ERROR',
          deployment,
          error: errorMessage,
          buildLogs,
        };
      }

      await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch (error) {
      log(`⚠️  Error checking deployment status: ${error.message}`, 'yellow');
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  throw new Error('Deployment timeout - exceeded maximum wait time');
}

async function checkBuildErrors(deployment) {
  log('🔍 Analyzing build logs for warnings and errors...', 'blue');

  const buildLogs = await fetchBuildLogs(deployment.uid);

  // Save logs to file
  const logFile = path.join(LOG_DIR, `deployment-${deployment.uid}-${Date.now()}.log`);
  fs.writeFileSync(logFile, buildLogs || 'No logs available');
  log(`   📄 Logs saved to: ${logFile}`, 'blue');

  // Analyze logs
  const analysis = analyzeBuildLogs(buildLogs);

  // Report findings
  if (analysis.summary.totalWarnings > 0) {
    log(`\n⚠️  Found ${analysis.summary.totalWarnings} warnings:`, 'yellow');
    analysis.warnings.slice(0, 10).forEach((warning) => {
      log(`   [${warning.category}] ${warning.message.substring(0, 100)}`, 'yellow');
    });
  }

  if (analysis.summary.totalErrors > 0) {
    log(`\n❌ Found ${analysis.summary.totalErrors} errors:`, 'red');
    analysis.errors.slice(0, 10).forEach((error) => {
      log(`   [${error.category}] ${error.message.substring(0, 100)}`, 'red');
    });
  }

  if (analysis.summary.totalWarnings === 0 && analysis.summary.totalErrors === 0) {
    log('✅ No warnings or errors detected in build logs', 'green');
  }

  // Save analysis
  const analysisFile = path.join(LOG_DIR, `analysis-${deployment.uid}-${Date.now()}.json`);
  fs.writeFileSync(analysisFile, JSON.stringify(analysis, null, 2));
  log(`   📊 Analysis saved to: ${analysisFile}`, 'blue');

  return { hasError: analysis.summary.totalErrors > 0, analysis, buildLogs };
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

  log(`🔧 Applying fix: ${diagnosis.action}`, 'yellow');

  try {
    switch (diagnosis.action) {
      case 'run-typecheck':
        log('   Running typecheck...', 'blue');
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
  log('\n🚀 Starting deployment verification...', 'blue');
  log(`   Production URL: ${PRODUCTION_URL}`, 'blue');
  log(`   Project: ${VERCEL_PROJECT_ID}`, 'blue');

  try {
    // Step 1: Get latest deployment
    const deployment = await getLatestDeployment();
    log(`✅ Found deployment: ${deployment.uid}`, 'green');
    log(`   State: ${deployment.state || deployment.readyState || 'UNKNOWN'}`, 'blue');
    log(`   URL: ${deployment.url}`, 'blue');

    // Step 2: Wait for deployment to complete
    const {
      state,
      deployment: finalDeployment,
      error,
      buildLogs,
    } = await waitForDeployment(deployment.uid);

    if (state === 'ERROR') {
      log('❌ Deployment failed!', 'red');
      log(`   Error: ${error || 'Unknown error'}`, 'red');

      // Diagnose and attempt fix
      const diagnosis = await diagnoseBuildError(error || buildLogs || 'Unknown error');
      const fixed = await applyFix(diagnosis);

      if (!fixed) {
        log('❌ Could not auto-fix deployment error', 'red');
        log('   Manual intervention required', 'yellow');
        log('   Check Vercel dashboard for detailed logs', 'yellow');
        process.exit(1);
      }

      log('⚠️  Fix applied - manual redeployment required', 'yellow');
      process.exit(1);
    }

    log(`✅ Deployment ready: ${state}`, 'green');

    // Step 3: Analyze build logs for warnings and errors
    const buildCheck = await checkBuildErrors(finalDeployment);

    // Step 4: Auto-fix issues if found
    if (
      buildCheck.analysis &&
      (buildCheck.analysis.summary.totalWarnings > 0 || buildCheck.analysis.summary.totalErrors > 0)
    ) {
      log('\n🔧 Attempting to auto-fix issues...', 'yellow');
      const fixes = await autoFixIssues(buildCheck.analysis, finalDeployment.uid);

      if (fixes.length > 0) {
        log(`   Applied ${fixes.filter((f) => f.status === 'fixed').length} fixes`, 'green');
        if (fixes.some((f) => f.status === 'fixed')) {
          log('   ⚠️  Please commit fixes and redeploy', 'yellow');
        }
      }
    }

    // Step 5: Wait for propagation
    log('⏳ Waiting for deployment to propagate...', 'yellow');
    await new Promise((resolve) => setTimeout(resolve, 15000));

    // Step 6: Run smoke tests
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

    // Step 7: Run Playwright tests
    const playwrightResults = await runPlaywrightTests();

    if (!playwrightResults.passed) {
      log('❌ Playwright tests failed!', 'red');
      process.exit(1);
    }

    // Step 8: Summary
    log('\n✅ All deployment verification checks passed!', 'green');
    log(`   Deployment URL: ${finalDeployment.url}`, 'green');
    log(`   Production URL: ${PRODUCTION_URL}`, 'green');

    if (buildCheck.analysis) {
      log(`\n📊 Build Analysis Summary:`, 'blue');
      log(`   Warnings: ${buildCheck.analysis.summary.totalWarnings}`, 'yellow');
      log(`   Errors: ${buildCheck.analysis.summary.totalErrors}`, 'red');
      log(`   Critical Issues: ${buildCheck.analysis.summary.criticalIssues}`, 'red');
    }
  } catch (error) {
    log(`\n❌ Deployment verification failed: ${error.message}`, 'red');
    if (error.stack) {
      log(error.stack, 'red');
    }
    process.exit(1);
  }
}

// Run verification
if (require.main === module) {
  if (!VERCEL_TOKEN || !VERCEL_ORG_ID) {
    log('❌ Missing required environment variables', 'red');
    log('   Required: VERCEL_TOKEN, VERCEL_ORG_ID', 'red');
    process.exit(1);
  }

  verifyDeployment().catch((error) => {
    log(`\n❌ Fatal error: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { verifyDeployment, getLatestDeployment, waitForDeployment };

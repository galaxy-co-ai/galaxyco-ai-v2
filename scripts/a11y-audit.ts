#!/usr/bin/env npx tsx
/**
 * Automated Accessibility Audit Script
 * 
 * Uses axe-core CLI to scan all pages for WCAG compliance
 * 
 * Usage:
 *   pnpm a11y:audit          - Run full audit
 *   pnpm a11y:audit --ci    - Run in CI mode (fails on violations)
 * 
 * Reports:
 *   - Console output with violations
 *   - JSON report: reports/a11y-report.json
 *   - HTML report: reports/a11y-report.html (if configured)
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
const CI_MODE = process.argv.includes('--ci');

// Pages to audit
const PAGES_TO_AUDIT = [
  '/',
  '/dashboard',
  '/workflows',
  '/workflows/builder',
  '/marketplace',
  '/settings/integrations',
  '/agents',
];

console.log('🔍 GalaxyCo.ai Accessibility Audit\n');
console.log('='.repeat(60));
console.log(`Base URL: ${BASE_URL}`);
console.log(`Mode: ${CI_MODE ? 'CI (will fail on violations)' : 'Development'}`);
console.log('='.repeat(60));

// Ensure reports directory exists
const reportsDir = path.join(process.cwd(), 'reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

let totalViolations = 0;
const violationsByPage: Record<string, number> = {};

for (const page of PAGES_TO_AUDIT) {
  const url = `${BASE_URL}${page}`;
  console.log(`\n📄 Auditing: ${page}`);
  
  try {
    // Use axe-core CLI to scan page
    // Note: This requires @axe-core/cli to be installed
    const command = `npx @axe-core/cli ${url} --tags wcag2a,wcag2aa,wcag21aa --rules color-contrast,image-alt,link-name,button-name,aria-required-attr --format json`;
    
    const result = execSync(command, { 
      encoding: 'utf-8',
      stdio: 'pipe',
    });
    
    // Parse results
    const data = JSON.parse(result);
    const violations = data.violations?.length || 0;
    violationsByPage[page] = violations;
    totalViolations += violations;
    
    if (violations > 0) {
      console.log(`  ⚠️  ${violations} violation(s) found`);
      data.violations?.forEach((violation: any) => {
        console.log(`     - ${violation.id}: ${violation.description}`);
      });
    } else {
      console.log(`  ✅ No violations`);
    }
  } catch (error: any) {
    console.log(`  ❌ Error auditing page: ${error.message}`);
    if (CI_MODE) {
      process.exit(1);
    }
  }
}

// Generate summary report
const report = {
  timestamp: new Date().toISOString(),
  baseUrl: BASE_URL,
  pages: PAGES_TO_AUDIT.map(page => ({
    url: page,
    violations: violationsByPage[page] || 0,
  })),
  totalViolations,
  summary: {
    pagesAudited: PAGES_TO_AUDIT.length,
    pagesWithViolations: Object.values(violationsByPage).filter(v => v > 0).length,
    totalViolations,
  },
};

// Write JSON report
const reportPath = path.join(reportsDir, 'a11y-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`\n📊 Report saved to: ${reportPath}`);

// Final summary
console.log('\n' + '='.repeat(60));
console.log('📊 Audit Summary');
console.log('='.repeat(60));
console.log(`Pages audited: ${PAGES_TO_AUDIT.length}`);
console.log(`Pages with violations: ${report.summary.pagesWithViolations}`);
console.log(`Total violations: ${totalViolations}`);

if (totalViolations > 0) {
  console.log('\n⚠️  Accessibility violations found!');
  console.log('Review the report and fix violations before committing.');
  
  if (CI_MODE) {
    console.log('\n❌ CI mode: Failing due to violations');
    process.exit(1);
  }
} else {
  console.log('\n✅ All pages passed accessibility audit!');
}


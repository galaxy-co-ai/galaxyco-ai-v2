import { enrichLeadCore } from '../src/trigger/lead-intel-agent';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

interface TestCompany {
  name: string;
  domain: string;
  expectedICPFit: 'high' | 'medium' | 'low';
  notes: string;
}

// Test companies covering different scenarios
const testCompanies: TestCompany[] = [
  {
    name: 'Lattice',
    domain: 'lattice.com',
    expectedICPFit: 'medium',
    notes: 'HR tech, ~200 employees - slightly larger than ideal but B2B SaaS',
  },
  {
    name: 'Gong',
    domain: 'gong.io',
    expectedICPFit: 'medium',
    notes: 'Revenue intelligence, ~500+ employees - too large but relevant industry',
  },
  {
    name: 'Superhuman',
    domain: 'superhuman.com',
    expectedICPFit: 'medium',
    notes: 'Email productivity, ~50 employees - good size match',
  },
  {
    name: 'Linear',
    domain: 'linear.app',
    expectedICPFit: 'low',
    notes: 'Project management for tech teams, small team but not services',
  },
  {
    name: 'Notion',
    domain: 'notion.so',
    expectedICPFit: 'low',
    notes: 'Large productivity company, not target ICP',
  },
  {
    name: 'Small Consulting Firm',
    domain: 'bain.com',
    expectedICPFit: 'low',
    notes: 'Large enterprise consulting, way too big',
  },
  {
    name: 'Marketing Agency Example',
    domain: 'metalab.com',
    expectedICPFit: 'high',
    notes: 'Design agency, should be closer to ICP',
  },
];

async function runBatchTest() {
  console.log('🧪 COMPREHENSIVE LEAD INTEL AGENT BATCH TEST');
  console.log('='.repeat(70));
  console.log(`Testing ${testCompanies.length} companies...\n`);

  const results = [];
  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < testCompanies.length; i++) {
    const company = testCompanies[i];
    console.log(
      `\n[${i + 1}/${testCompanies.length}] Testing: ${company.name} (${company.domain})`,
    );
    console.log(`Expected ICP Fit: ${company.expectedICPFit}`);
    console.log(`Notes: ${company.notes}`);
    console.log('-'.repeat(70));

    const startTime = Date.now();

    try {
      const result = await enrichLeadCore({
        companyDomain: company.domain,
        companyName: company.name,
        workspaceId: 'test-workspace',
        userId: 'test-user',
      });

      const duration = Date.now() - startTime;

      if (result.success && 'enrichedLead' in result) {
        successCount++;
        const lead = result.enrichedLead;

        // Ensure lead is properly defined
        if (!lead) {
          failureCount++;
          console.log(`❌ Failed: No enriched lead data returned`);
          results.push({
            company: company.name,
            domain: company.domain,
            success: false,
            error: 'No enriched lead data returned',
            duration,
          });
          continue;
        }

        console.log(`✅ Success (${duration}ms)`);
        console.log(`   Company: ${lead.companyName ?? 'N/A'}`);
        console.log(`   Industry: ${lead.industry ?? 'N/A'}`);
        console.log(`   ICP Score: ${lead.icpFitScore ?? 0}/100`);
        console.log(`   Confidence: ${lead.confidenceLevel ?? 'N/A'}`);
        const techStackPreview = Array.isArray(lead.techStack)
          ? `${lead.techStack.slice(0, 3).join(', ')}${lead.techStack.length > 3 ? '...' : ''}`
          : 'N/A';
        console.log(`   Tech Stack: ${techStackPreview}`);
        console.log(
          `   News Found: ${Array.isArray(lead.recentNews) ? lead.recentNews.length : 0} articles`,
        );
        console.log(`   Data Completeness: ${result.metadata?.dataCompleteness ?? 0}%`);

        results.push({
          company: company.name,
          domain: company.domain,
          success: true,
          icpScore: lead.icpFitScore,
          confidence: lead.confidenceLevel,
          duration,
          newsCount: lead.recentNews.length,
          completeness: result.metadata?.dataCompleteness,
        });
      } else {
        failureCount++;
        console.log(`❌ Failed: ${result.error || 'Unknown error'}`);
        results.push({
          company: company.name,
          domain: company.domain,
          success: false,
          error: result.error,
          duration,
        });
      }
    } catch (error) {
      failureCount++;
      console.log(`💥 Exception: ${error instanceof Error ? error.message : 'Unknown'}`);
      results.push({
        company: company.name,
        domain: company.domain,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown exception',
        duration: Date.now() - startTime,
      });
    }

    // Small delay between requests to be respectful
    if (i < testCompanies.length - 1) {
      console.log('\n⏸️  Waiting 2s before next test...');
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  // Summary Report
  console.log('\n\n');
  console.log('='.repeat(70));
  console.log('📊 BATCH TEST SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total Tests: ${testCompanies.length}`);
  console.log(
    `✅ Successful: ${successCount} (${Math.round((successCount / testCompanies.length) * 100)}%)`,
  );
  console.log(
    `❌ Failed: ${failureCount} (${Math.round((failureCount / testCompanies.length) * 100)}%)`,
  );

  if (successCount > 0) {
    const successfulResults = results.filter((r) => r.success && 'icpScore' in r);
    const avgScore =
      successfulResults.reduce((sum, r) => sum + (r.icpScore || 0), 0) / successfulResults.length;
    const avgDuration =
      successfulResults.reduce((sum, r) => sum + r.duration, 0) / successfulResults.length;
    const avgCompleteness =
      successfulResults.reduce((sum, r) => sum + (r.completeness || 0), 0) /
      successfulResults.length;
    const totalNews = successfulResults.reduce((sum, r) => sum + (r.newsCount || 0), 0);

    console.log(`\n📈 Performance Metrics:`);
    console.log(`   Average ICP Score: ${avgScore.toFixed(1)}/100`);
    console.log(
      `   Average Duration: ${avgDuration.toFixed(0)}ms (~${(avgDuration / 1000).toFixed(1)}s)`,
    );
    console.log(`   Average Data Completeness: ${avgCompleteness.toFixed(1)}%`);
    console.log(`   Total News Articles Found: ${totalNews}`);
  }

  console.log('\n\n📋 Detailed Results Table:');
  console.log('-'.repeat(70));
  console.log(
    'Company'.padEnd(25) +
      'ICP Score'.padEnd(12) +
      'Confidence'.padEnd(12) +
      'Duration'.padEnd(12) +
      'Status',
  );
  console.log('-'.repeat(70));

  results.forEach((r) => {
    const company = String(r.company).padEnd(25);
    const score =
      (r as any).success && 'icpScore' in (r as any)
        ? `${(r as any).icpScore}/100`.padEnd(12)
        : 'N/A'.padEnd(12);
    const confVal =
      (r as any).success && 'confidence' in (r as any) ? (r as any).confidence : 'N/A';
    const conf = String(confVal).padEnd(12);
    const dur = `${((r as any).duration / 1000).toFixed(1)}s`.padEnd(12);
    const status = (r as any).success ? '✅' : '❌';

    console.log(`${company}${score}${conf}${dur}${status}`);
  });

  console.log('-'.repeat(70));

  // Final verdict
  console.log('\n\n🎯 FINAL VERDICT:');
  const passRate = (successCount / testCompanies.length) * 100;

  if (passRate === 100) {
    console.log('✅ PERFECT! All tests passed. Agent is production-ready! 🚀');
  } else if (passRate >= 85) {
    console.log('✅ EXCELLENT! Agent is highly reliable and ready for production.');
  } else if (passRate >= 70) {
    console.log('⚠️  GOOD! Agent works but may need some error handling improvements.');
  } else {
    console.log('❌ NEEDS WORK! Review failed cases before production.');
  }

  console.log('\n');
}

// Run the batch test
runBatchTest().catch((error) => {
  console.error('💥 Batch test failed catastrophically:', error);
  process.exit(1);
});

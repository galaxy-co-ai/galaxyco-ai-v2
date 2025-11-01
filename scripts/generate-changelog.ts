#!/usr/bin/env tsx
/**
 * Automated Changelog Generator for AI Session Context
 *
 * Parses git commits using Conventional Commits format and generates:
 * - Structured JSON changelog
 * - Human-readable Markdown
 * - AI-optimized context summaries
 *
 * Usage:
 *   tsx scripts/generate-changelog.ts [options]
 *
 * Options:
 *   --days <n>        Number of days to look back (default: 7)
 *   --output <path>   Output file path (default: docs/RECENT_CHANGES.md)
 *   --json            Also output JSON version
 *   --since <hash>    Generate changelog since specific commit
 */

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

// ============================================================================
// Types
// ============================================================================

interface ConventionalCommit {
  hash: string;
  shortHash: string;
  type: string;
  scope?: string;
  subject: string;
  body?: string;
  breaking: boolean;
  author: string;
  date: string;
  timestamp: number;
  files: string[];
}

interface ChangelogData {
  generated: string;
  period: string;
  stats: {
    commits: number;
    filesChanged: number;
    additions: number;
    deletions: number;
  };
  commitsByType: Record<string, ConventionalCommit[]>;
  commitsByScope: Record<string, ConventionalCommit[]>;
  breakingChanges: ConventionalCommit[];
  fileChanges: {
    path: string;
    changeCount: number;
  }[];
  allCommits: ConventionalCommit[];
}

interface CliOptions {
  days: number;
  output: string;
  json: boolean;
  since?: string;
}

// ============================================================================
// Utilities
// ============================================================================

function exec(command: string): string {
  try {
    return execSync(command, {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024,
    });
  } catch (error) {
    return '';
  }
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {
    days: 7,
    output: 'docs/RECENT_CHANGES.md',
    json: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--days':
        options.days = parseInt(args[++i], 10);
        break;
      case '--output':
        options.output = args[++i];
        break;
      case '--json':
        options.json = true;
        break;
      case '--since':
        options.since = args[++i];
        break;
    }
  }

  return options;
}

// ============================================================================
// Git Operations
// ============================================================================

function getCommitStats(since: string): ChangelogData['stats'] {
  const commits = exec(`git log ${since} --oneline`).trim().split('\n').filter(Boolean).length;

  const diffStat = exec(`git diff --shortstat ${since}..HEAD`).trim();
  const filesChanged = parseInt(diffStat.match(/(\d+) files? changed/)?.[1] || '0', 10);
  const additions = parseInt(diffStat.match(/(\d+) insertions?/)?.[1] || '0', 10);
  const deletions = parseInt(diffStat.match(/(\d+) deletions?/)?.[1] || '0', 10);

  return { commits, filesChanged, additions, deletions };
}

function parseConventionalCommit(commitData: string): ConventionalCommit | null {
  const lines = commitData.split('\n');
  const [hash, author, timestamp, ...messageParts] = lines;

  // Validate inputs
  if (!hash || !author || !timestamp) {
    return null;
  }

  const message = messageParts.join('\n').trim();
  const firstLine = message.split('\n')[0];

  if (!firstLine) {
    return null;
  }

  // Parse and validate timestamp
  const timestampNum = parseInt(timestamp.trim(), 10);
  if (isNaN(timestampNum)) {
    return null;
  }
  const dateObj = new Date(timestampNum * 1000);
  if (isNaN(dateObj.getTime())) {
    return null;
  }

  // Parse conventional commit format: type(scope): subject
  const match = firstLine.match(/^(\w+)(?:\(([^)]+)\))?(!)?:\s*(.+)$/);

  if (!match) {
    // Fallback for non-conventional commits
    return {
      hash: hash.trim(),
      shortHash: hash.trim().substring(0, 7),
      type: 'other',
      subject: firstLine,
      body: message.split('\n').slice(1).join('\n').trim(),
      breaking: message.includes('BREAKING CHANGE'),
      author: author.trim(),
      date: dateObj.toISOString(),
      timestamp: timestampNum,
      files: [],
    };
  }

  const [, type, scope, breakingMarker, subject] = match;
  const body = message.split('\n').slice(1).join('\n').trim();
  const breaking = !!breakingMarker || body.includes('BREAKING CHANGE');

  return {
    hash: hash.trim(),
    shortHash: hash.trim().substring(0, 7),
    type: type.toLowerCase(),
    scope,
    subject,
    body: body || undefined,
    breaking,
    author: author.trim(),
    date: dateObj.toISOString(),
    timestamp: timestampNum,
    files: [],
  };
}

function getCommits(since: string): ConventionalCommit[] {
  const format = '%H%n%an%n%ct%n%B%n--END-COMMIT--';
  const log = exec(`git log ${since} --format="${format}"`);

  const commits: ConventionalCommit[] = [];
  const commitBlocks = log.split('--END-COMMIT--').filter(Boolean);

  for (const block of commitBlocks) {
    const commit = parseConventionalCommit(block.trim());
    if (commit) {
      // Get files changed in this commit
      const files = exec(`git show --name-only --pretty="" ${commit.hash}`)
        .trim()
        .split('\n')
        .filter(Boolean);
      commit.files = files;
      commits.push(commit);
    }
  }

  return commits;
}

function getFileChangeFrequency(commits: ConventionalCommit[]): ChangelogData['fileChanges'] {
  const fileMap = new Map<string, number>();

  for (const commit of commits) {
    for (const file of commit.files) {
      fileMap.set(file, (fileMap.get(file) || 0) + 1);
    }
  }

  return Array.from(fileMap.entries())
    .map(([path, changeCount]) => ({ path, changeCount }))
    .sort((a, b) => b.changeCount - a.changeCount)
    .slice(0, 30);
}

// ============================================================================
// Changelog Generation
// ============================================================================

function generateChangelog(options: CliOptions): ChangelogData {
  const since = options.since || `--since="${options.days} days ago"`;
  const periodDesc = options.since
    ? `Since commit ${options.since.substring(0, 7)}`
    : `Last ${options.days} days`;

  console.log(`🔍 Analyzing commits: ${periodDesc}...`);

  const allCommits = getCommits(since);
  const stats = getCommitStats(since);

  // Group by type
  const commitsByType: Record<string, ConventionalCommit[]> = {};
  for (const commit of allCommits) {
    if (!commitsByType[commit.type]) {
      commitsByType[commit.type] = [];
    }
    commitsByType[commit.type].push(commit);
  }

  // Group by scope
  const commitsByScope: Record<string, ConventionalCommit[]> = {};
  for (const commit of allCommits) {
    const scope = commit.scope || 'unscoped';
    if (!commitsByScope[scope]) {
      commitsByScope[scope] = [];
    }
    commitsByScope[scope].push(commit);
  }

  // Extract breaking changes
  const breakingChanges = allCommits.filter((c) => c.breaking);

  // Get file change frequency
  const fileChanges = getFileChangeFrequency(allCommits);

  return {
    generated: new Date().toISOString(),
    period: periodDesc,
    stats,
    commitsByType,
    commitsByScope,
    breakingChanges,
    fileChanges,
    allCommits,
  };
}

// ============================================================================
// Markdown Generation
// ============================================================================

function generateMarkdown(data: ChangelogData): string {
  const lines: string[] = [];

  // Header
  lines.push('# 📝 Recent Changes - Auto-Generated');
  lines.push('');
  lines.push(`**Generated**: ${new Date(data.generated).toUTCString()}`);
  lines.push(`**Period**: ${data.period}`);
  lines.push(`**Source**: Git commit history (Conventional Commits)`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Summary Stats
  lines.push('## 📊 Summary');
  lines.push('');
  lines.push(`- **Total Commits**: ${data.stats.commits}`);
  lines.push(`- **Files Changed**: ${data.stats.filesChanged}`);
  lines.push(`- **Lines Added**: +${data.stats.additions}`);
  lines.push(`- **Lines Removed**: -${data.stats.deletions}`);
  lines.push(`- **Breaking Changes**: ${data.breakingChanges.length}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Breaking Changes (if any)
  if (data.breakingChanges.length > 0) {
    lines.push('## ⚠️ Breaking Changes');
    lines.push('');
    for (const commit of data.breakingChanges) {
      lines.push(`### ${commit.shortHash} - ${commit.subject}`);
      lines.push('');
      lines.push(`**Type**: \`${commit.type}\``);
      if (commit.scope) lines.push(`**Scope**: \`${commit.scope}\``);
      lines.push(`**Author**: ${commit.author}`);
      lines.push(`**Date**: ${new Date(commit.date).toLocaleDateString()}`);
      if (commit.body) {
        lines.push('');
        lines.push(commit.body);
      }
      lines.push('');
    }
    lines.push('---');
    lines.push('');
  }

  // Changes by Type
  lines.push('## 🏷️ Changes by Type');
  lines.push('');

  const typeOrder = ['feat', 'fix', 'refactor', 'docs', 'test', 'chore', 'perf', 'style'];
  const sortedTypes = Object.keys(data.commitsByType).sort((a, b) => {
    const aIndex = typeOrder.indexOf(a);
    const bIndex = typeOrder.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  for (const type of sortedTypes) {
    const commits = data.commitsByType[type];
    lines.push(`### ${getTypeEmoji(type)} ${type} (${commits.length})`);
    lines.push('');
    for (const commit of commits) {
      const scopeTag = commit.scope ? `**${commit.scope}**: ` : '';
      lines.push(`- ${scopeTag}${commit.subject} (\`${commit.shortHash}\`)`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('');

  // Changes by Scope/Component
  lines.push('## 📦 Changes by Scope');
  lines.push('');
  const sortedScopes = Object.entries(data.commitsByScope)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 10);

  for (const [scope, commits] of sortedScopes) {
    lines.push(`### ${scope} (${commits.length} commits)`);
    lines.push('');
    for (const commit of commits) {
      lines.push(`- **${commit.type}**: ${commit.subject} (\`${commit.shortHash}\`)`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('');

  // File Changes
  lines.push('## 📁 Most Frequently Changed Files');
  lines.push('');
  lines.push('| File | Changes |');
  lines.push('|------|---------|');
  for (const { path, changeCount } of data.fileChanges.slice(0, 20)) {
    lines.push(`| \`${path}\` | ${changeCount} |`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  // AI Context Summary
  lines.push('## 🤖 AI Context Summary');
  lines.push('');
  lines.push('### What Changed');
  lines.push('');

  // Summarize by type
  for (const type of sortedTypes.slice(0, 5)) {
    const commits = data.commitsByType[type];
    if (commits.length > 0) {
      lines.push(`**${type}**: ${commits.map((c) => c.subject).join('; ')}`);
      lines.push('');
    }
  }

  lines.push('### Key Files Modified');
  lines.push('');
  lines.push('```');
  for (const { path } of data.fileChanges.slice(0, 15)) {
    lines.push(path);
  }
  lines.push('```');
  lines.push('');

  lines.push('### Next Steps Checklist');
  lines.push('');
  lines.push('- [ ] Review breaking changes (if any)');
  lines.push('- [ ] Verify all tests pass after recent changes');
  lines.push('- [ ] Check modified files for TODOs or incomplete work');
  lines.push('- [ ] Update CURRENT_SESSION.md with session summary');
  lines.push('- [ ] Run health checks before committing');
  lines.push('');

  // Footer
  lines.push('---');
  lines.push('');
  lines.push('_Generated by: `scripts/generate-changelog.ts`_');
  lines.push('_To regenerate: `tsx scripts/generate-changelog.ts`_');
  lines.push('');

  return lines.join('\n');
}

function getTypeEmoji(type: string): string {
  const emojiMap: Record<string, string> = {
    feat: '✨',
    fix: '🐛',
    docs: '📝',
    refactor: '♻️',
    test: '✅',
    chore: '🔧',
    perf: '⚡',
    style: '💄',
    ci: '👷',
    build: '📦',
  };
  return emojiMap[type] || '📌';
}

// ============================================================================
// Main
// ============================================================================

function main() {
  const options = parseArgs();

  console.log('📋 GalaxyCo.ai Changelog Generator');
  console.log('===================================\n');

  const data = generateChangelog(options);

  // Generate markdown
  const markdown = generateMarkdown(data);
  const outputPath = resolve(process.cwd(), options.output);
  writeFileSync(outputPath, markdown, 'utf-8');
  console.log(`✅ Markdown changelog saved: ${outputPath}`);

  // Generate JSON if requested
  if (options.json) {
    const jsonPath = outputPath.replace(/\.md$/, '.json');
    writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ JSON changelog saved: ${jsonPath}`);
  }

  console.log('');
  console.log('📊 Stats:');
  console.log(`  • Commits: ${data.stats.commits}`);
  console.log(`  • Files: ${data.stats.filesChanged}`);
  console.log(`  • +${data.stats.additions} / -${data.stats.deletions} lines`);
  console.log('');
  console.log('💡 Next: Commit this changelog or integrate with CI/CD');
}

main();

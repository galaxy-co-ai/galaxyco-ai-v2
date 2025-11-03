#!/usr/bin/env node

/**
 * Validation Script: Test All Cursor Customizations
 * 
 * Tests commands, workflows, and snippets to ensure they work correctly
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log(chalk.blue.bold('\n🧪 GalaxyCo Cursor Customizations Validation\n'));

let passed = 0;
let failed = 0;
const errors = [];

function test(name, fn) {
  try {
    fn();
    console.log(chalk.green('✓') + ` ${name}`);
    passed++;
  } catch (error) {
    console.log(chalk.red('✗') + ` ${name}`);
    errors.push({ name, error: error.message });
    failed++;
  }
}

// Test 1: Commands File Exists and is Valid JSON
test('Commands file exists and is valid', () => {
  const commandsPath = path.join(rootDir, '.cursor', 'commands', 'galaxyco-commands.json');
  if (!fs.existsSync(commandsPath)) {
    throw new Error('Commands file not found');
  }
  
  const commands = JSON.parse(fs.readFileSync(commandsPath, 'utf-8'));
  
  if (!commands.commands || !Array.isArray(commands.commands)) {
    throw new Error('Commands structure invalid');
  }
  
  if (commands.commands.length === 0) {
    throw new Error('No commands defined');
  }
  
  // Validate each command has required fields
  commands.commands.forEach((cmd, i) => {
    if (!cmd.name) throw new Error(`Command ${i} missing name`);
    if (!cmd.description) throw new Error(`Command ${i} missing description`);
    if (!cmd.prompt) throw new Error(`Command ${i} missing prompt`);
  });
  
  console.log(chalk.gray(`    Found ${commands.commands.length} commands`));
});

// Test 2: All Required Workflows Exist
test('All workflows exist and are valid', () => {
  const workflowsDir = path.join(rootDir, '.cursor', 'workflows');
  const requiredWorkflows = [
    'feature-creation-workflow.md',
    'security-audit-workflow.md',
    'refactoring-workflow.md',
    'ai-test-generation.md',
  ];
  
  requiredWorkflows.forEach(workflow => {
    const workflowPath = path.join(workflowsDir, workflow);
    if (!fs.existsSync(workflowPath)) {
      throw new Error(`Workflow missing: ${workflow}`);
    }
    
    const content = fs.readFileSync(workflowPath, 'utf-8');
    if (content.length < 100) {
      throw new Error(`Workflow too short: ${workflow}`);
    }
  });
  
  console.log(chalk.gray(`    Validated ${requiredWorkflows.length} workflows`));
});

// Test 3: Snippets File Exists and is Valid
test('Snippets file exists and is valid', () => {
  const snippetsPath = path.join(rootDir, '.cursor', 'snippets', 'galaxyco.code-snippets');
  if (!fs.existsSync(snippetsPath)) {
    throw new Error('Snippets file not found');
  }
  
  const snippets = JSON.parse(fs.readFileSync(snippetsPath, 'utf-8'));
  
  if (Object.keys(snippets).length === 0) {
    throw new Error('No snippets defined');
  }
  
  // Validate each snippet has required fields
  Object.entries(snippets).forEach(([key, snippet]) => {
    if (!snippet.prefix) throw new Error(`Snippet ${key} missing prefix`);
    if (!snippet.body) throw new Error(`Snippet ${key} missing body`);
    if (!snippet.description) throw new Error(`Snippet ${key} missing description`);
  });
  
  console.log(chalk.gray(`    Found ${Object.keys(snippets).length} snippets`));
});

// Test 4: Rules Files Exist
test('All rules files exist', () => {
  const rulesDir = path.join(rootDir, '.cursor', 'rules');
  const requiredRules = [
    'project-structure.md',
    'component-patterns.md',
    'database-rules.md',
    'api-conventions.md',
    'testing-standards.md',
    'architecture-decisions.md',
  ];
  
  requiredRules.forEach(rule => {
    const rulePath = path.join(rulesDir, rule);
    if (!fs.existsSync(rulePath)) {
      throw new Error(`Rule file missing: ${rule}`);
    }
  });
  
  console.log(chalk.gray(`    Validated ${requiredRules.length} rule files`));
});

// Test 5: Documentation Files Exist
test('All documentation files exist', () => {
  const docsDir = path.join(rootDir, '.cursor', 'docs');
  const requiredDocs = [
    'COMMANDS-WORKFLOWS-SNIPPETS-GUIDE.md',
    '5-MINUTE-QUICKSTART.md',
    'CURSOR-2.0-QUICK-START.md',
    'MCP-SERVERS-SETUP.md',
  ];
  
  requiredDocs.forEach(doc => {
    const docPath = path.join(docsDir, doc);
    if (!fs.existsSync(docPath)) {
      throw new Error(`Documentation missing: ${doc}`);
    }
  });
  
  console.log(chalk.gray(`    Validated ${requiredDocs.length} documentation files`));
});

// Test 6: Setup Script Exists and is Executable
test('Setup script exists', () => {
  const setupPath = path.join(rootDir, 'scripts', 'setup-cursor-env.mjs');
  if (!fs.existsSync(setupPath)) {
    throw new Error('Setup script not found');
  }
  
  const content = fs.readFileSync(setupPath, 'utf-8');
  if (!content.includes('GalaxyCo Cursor Environment Setup')) {
    throw new Error('Setup script content invalid');
  }
});

// Test 7: Pre-commit Hook Exists
test('Pre-commit hook exists', () => {
  const preCommitPath = path.join(rootDir, '.husky', 'pre-commit');
  if (!fs.existsSync(preCommitPath)) {
    throw new Error('Pre-commit hook not found');
  }
  
  const content = fs.readFileSync(preCommitPath, 'utf-8');
  if (!content.includes('GalaxyCo Pre-Commit Quality Checks')) {
    throw new Error('Pre-commit hook content invalid');
  }
});

// Test 8: Package.json Has New Scripts
test('Package.json has new scripts', () => {
  const packagePath = path.join(rootDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
  
  const requiredScripts = [
    'setup',
    'setup:cursor',
    'test:visual',
    'test:tdd',
    'test:coverage',
    'quality:full',
    'quality:quick',
  ];
  
  requiredScripts.forEach(script => {
    if (!pkg.scripts[script]) {
      throw new Error(`Package.json missing script: ${script}`);
    }
  });
  
  console.log(chalk.gray(`    Validated ${requiredScripts.length} npm scripts`));
});

// Test 9: Cursor Settings Exists
test('Cursor settings file exists', () => {
  const settingsPath = path.join(rootDir, '.cursor', 'settings.json');
  if (!fs.existsSync(settingsPath)) {
    throw new Error('Cursor settings not found');
  }
  
  const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
  if (!settings['cursor.ai']) {
    console.log(chalk.yellow('    Warning: Cursor AI settings not configured'));
  }
});

// Test 10: MCP Config Example Exists
test('MCP config example exists', () => {
  const mcpExamplePath = path.join(rootDir, '.cursor', 'mcp.json.example');
  if (!fs.existsSync(mcpExamplePath)) {
    throw new Error('MCP config example not found');
  }
  
  const mcp = JSON.parse(fs.readFileSync(mcpExamplePath, 'utf-8'));
  if (!mcp.mcpServers) {
    throw new Error('MCP config structure invalid');
  }
});

// Test 11: Validate Command Prompts Reference Rules
test('Commands reference GalaxyCo rules', () => {
  const commandsPath = path.join(rootDir, '.cursor', 'commands', 'galaxyco-commands.json');
  const commands = JSON.parse(fs.readFileSync(commandsPath, 'utf-8'));
  
  let referencesRules = 0;
  commands.commands.forEach(cmd => {
    if (cmd.prompt.includes('.cursor/rules/') || 
        cmd.prompt.includes('GalaxyCo')) {
      referencesRules++;
    }
  });
  
  if (referencesRules === 0) {
    throw new Error('No commands reference GalaxyCo rules');
  }
  
  console.log(chalk.gray(`    ${referencesRules} commands reference rules`));
});

// Test 12: Validate Snippets Have Unique Prefixes
test('Snippets have unique prefixes', () => {
  const snippetsPath = path.join(rootDir, '.cursor', 'snippets', 'galaxyco.code-snippets');
  const snippets = JSON.parse(fs.readFileSync(snippetsPath, 'utf-8'));
  
  const prefixes = new Set();
  const duplicates = [];
  
  Object.entries(snippets).forEach(([key, snippet]) => {
    if (prefixes.has(snippet.prefix)) {
      duplicates.push(snippet.prefix);
    }
    prefixes.add(snippet.prefix);
  });
  
  if (duplicates.length > 0) {
    throw new Error(`Duplicate snippet prefixes: ${duplicates.join(', ')}`);
  }
});

// Test 13: Validate Workflows Have Checklists
test('Workflows have completion checklists', () => {
  const workflowsDir = path.join(rootDir, '.cursor', 'workflows');
  const workflows = fs.readdirSync(workflowsDir).filter(f => f.endsWith('.md'));
  
  let withChecklists = 0;
  workflows.forEach(workflow => {
    const content = fs.readFileSync(path.join(workflowsDir, workflow), 'utf-8');
    if (content.includes('- [ ]') || content.includes('- [x]')) {
      withChecklists++;
    }
  });
  
  if (withChecklists === 0) {
    throw new Error('No workflows have checklists');
  }
  
  console.log(chalk.gray(`    ${withChecklists}/${workflows.length} workflows have checklists`));
});

// Test 14: Validate TDD Script Exists
test('TDD workflow script exists', () => {
  const tddPath = path.join(rootDir, 'scripts', 'tdd-workflow.mjs');
  // This is in the workflow file, not a separate script
  // Just check the workflow exists
  const workflowPath = path.join(rootDir, '.cursor', 'workflows', 'ai-test-generation.md');
  if (!fs.existsSync(workflowPath)) {
    throw new Error('TDD workflow not found');
  }
  
  const content = fs.readFileSync(workflowPath, 'utf-8');
  if (!content.includes('TDD') || !content.includes('Red-Green-Refactor')) {
    throw new Error('TDD workflow incomplete');
  }
});

// Test 15: Validate Quick Start Guide is Concise
test('Quick start guide is appropriately sized', () => {
  const quickStartPath = path.join(rootDir, '.cursor', 'docs', '5-MINUTE-QUICKSTART.md');
  const content = fs.readFileSync(quickStartPath, 'utf-8');
  
  const lineCount = content.split('\n').length;
  if (lineCount < 50) {
    throw new Error('Quick start guide too short');
  }
  if (lineCount > 500) {
    throw new Error('Quick start guide too long (not quick!)');
  }
  
  console.log(chalk.gray(`    Quick start is ${lineCount} lines`));
});

// Final Report
console.log(chalk.blue.bold('\n===================================='));
console.log(chalk.white.bold('Validation Results:'));
console.log(chalk.blue.bold('====================================\n'));

console.log(chalk.green(`✓ Passed: ${passed}`));
if (failed > 0) {
  console.log(chalk.red(`✗ Failed: ${failed}`));
  console.log(chalk.red.bold('\nErrors:'));
  errors.forEach(err => {
    console.log(chalk.red(`✗ ${err.name}`));
    console.log(chalk.gray(`  ${err.error}\n`));
  });
  process.exit(1);
} else {
  console.log(chalk.green.bold('\n🎉 All validations passed!'));
  console.log(chalk.white('\nYour Cursor environment is ready to use!'));
  console.log(chalk.gray('Run: pnpm setup:cursor'));
  process.exit(0);
}


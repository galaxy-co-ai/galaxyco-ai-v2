#!/usr/bin/env npx tsx
/**
 * Command Validation Script
 *
 * Validates .cursor/commands.json against JSON schema
 *
 * Usage:
 *   pnpm validate:commands
 *
 * Runs automatically on pre-commit hook
 */

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import fs from 'fs';
import path from 'path';

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);

const schemaPath = path.join(process.cwd(), '.cursor/commands.schema.json');
const commandsPath = path.join(process.cwd(), '.cursor/commands.json');

console.log('🔍 Validating Cursor Commands\n');
console.log('='.repeat(60));

// Check if files exist
if (!fs.existsSync(schemaPath)) {
  console.error(`❌ Schema file not found: ${schemaPath}`);
  process.exit(1);
}

if (!fs.existsSync(commandsPath)) {
  console.log(
    "⚠️  No commands.json file found (this is ok if you haven't created custom commands yet)",
  );
  process.exit(0);
}

// Load schema
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));

// Load commands
const commands = JSON.parse(fs.readFileSync(commandsPath, 'utf-8'));

// Validate
const validate = ajv.compile(schema);
const valid = validate(commands);

if (!valid) {
  console.error('❌ Command validation failed!\n');
  console.error('Errors:');
  validate.errors?.forEach((error, index) => {
    console.error(`\n${index + 1}. ${error.instancePath}: ${error.message}`);
    if (error.params) {
      console.error(`   Parameters:`, error.params);
    }
  });
  console.error('\nFix the errors above and try again.');
  process.exit(1);
}

// Additional semantic checks
let hasErrors = false;

if (commands.commands) {
  // Check for duplicate names
  const names = commands.commands.map((cmd: any) => cmd.name);
  const duplicates = names.filter((name: string, index: number) => names.indexOf(name) !== index);

  if (duplicates.length > 0) {
    console.error(`❌ Duplicate command names found: ${duplicates.join(', ')}`);
    hasErrors = true;
  }

  // Check for invalid command names (spaces, special chars)
  commands.commands.forEach((cmd: any) => {
    if (!/^[a-z0-9-]+$/.test(cmd.name)) {
      console.error(`❌ Invalid command name: "${cmd.name}" (must be lowercase, no spaces)`);
      hasErrors = true;
    }

    if (!cmd.command || cmd.command.trim() === '') {
      console.error(`❌ Empty command for: "${cmd.name}"`);
      hasErrors = true;
    }

    if (!cmd.description || cmd.description.trim() === '') {
      console.error(`❌ Missing description for: "${cmd.name}"`);
      hasErrors = true;
    }
  });
}

if (hasErrors) {
  console.error('\nFix the errors above and try again.');
  process.exit(1);
}

console.log(`✅ Commands validated successfully!`);
console.log(`   Found ${commands.commands?.length || 0} command(s)`);
process.exit(0);

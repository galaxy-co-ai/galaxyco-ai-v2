#!/usr/bin/env node

/**
 * Generate Encryption Key for GalaxyCo.ai
 *
 * Generates a secure 32-byte (256-bit) encryption key for AES-256-GCM encryption.
 * This key is used to encrypt API keys and other sensitive data stored in the database.
 *
 * Usage:
 *   pnpm run generate-encryption-key
 *
 * Security:
 *   - Keep this key secret
 *   - Never commit it to version control
 *   - Use different keys for production vs development
 *   - Store securely (password manager, Vercel dashboard, etc.)
 */

const crypto = require("crypto");

// Generate 32-byte (256-bit) random key
const key = crypto.randomBytes(32).toString("hex");

console.log("\n🔐 Generated Encryption Key\n");
console.log("═".repeat(80));
console.log("\nYour new encryption key:");
console.log("\n  " + key);
console.log("\n" + "═".repeat(80));
console.log("\n📋 Add this to your .env.local file:\n");
console.log("  ENCRYPTION_KEY=" + key);
console.log("\n" + "═".repeat(80));
console.log("\n⚠️  IMPORTANT SECURITY NOTES:\n");
console.log("  • Keep this secret! Never commit it to version control");
console.log("  • Use different keys for production vs development");
console.log("  • Store in password manager or Vercel dashboard");
console.log("  • If compromised, rotate immediately and re-encrypt all data");
console.log("\n" + "═".repeat(80));
console.log("\n✅ Key generation complete!\n");

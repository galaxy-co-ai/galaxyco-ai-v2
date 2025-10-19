/**
 * Token Encryption Utility
 *
 * Uses AES-256-GCM for encrypting OAuth tokens at rest.
 * ENCRYPTION_KEY must be 32 bytes (64 hex characters) for AES-256.
 *
 * Generate key with: openssl rand -hex 32
 */

import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16; // AES-GCM requires 16-byte IV
const AUTH_TAG_LENGTH = 16; // GCM auth tag length

/**
 * Get encryption key from environment
 * Must be 32 bytes (64 hex characters) for AES-256
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error("ENCRYPTION_KEY environment variable is not set");
  }

  if (key.length !== 64) {
    throw new Error(
      "ENCRYPTION_KEY must be 64 hex characters (32 bytes) for AES-256",
    );
  }

  return Buffer.from(key, "hex");
}

/**
 * Encrypt a string value using AES-256-GCM
 *
 * @param plaintext - The value to encrypt
 * @returns Base64-encoded encrypted value in format: iv:encryptedData:authTag
 */
export function encrypt(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, "utf8", "base64");
  encrypted += cipher.final("base64");

  const authTag = cipher.getAuthTag();

  // Format: iv:encryptedData:authTag (all base64-encoded)
  return `${iv.toString("base64")}:${encrypted}:${authTag.toString("base64")}`;
}

/**
 * Decrypt an encrypted string value
 *
 * @param ciphertext - Base64-encoded encrypted value in format: iv:encryptedData:authTag
 * @returns Decrypted plaintext string
 */
export function decrypt(ciphertext: string): string {
  const key = getEncryptionKey();

  // Split the encrypted value into components
  const parts = ciphertext.split(":");
  if (parts.length !== 3) {
    throw new Error(
      "Invalid encrypted value format. Expected: iv:encryptedData:authTag",
    );
  }

  const [ivBase64, encryptedBase64, authTagBase64] = parts;

  const iv = Buffer.from(ivBase64, "base64");
  const encrypted = Buffer.from(encryptedBase64, "base64");
  const authTag = Buffer.from(authTagBase64, "base64");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, undefined, "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * Encrypt OAuth tokens for storage
 */
export interface EncryptedTokens {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
}

export function encryptTokens(tokens: {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
}): EncryptedTokens {
  return {
    accessToken: encrypt(tokens.access_token),
    refreshToken: tokens.refresh_token
      ? encrypt(tokens.refresh_token)
      : undefined,
    idToken: tokens.id_token ? encrypt(tokens.id_token) : undefined,
  };
}

/**
 * Decrypt OAuth tokens from storage
 */
export function decryptTokens(encrypted: EncryptedTokens): {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
} {
  return {
    access_token: decrypt(encrypted.accessToken),
    refresh_token: encrypted.refreshToken
      ? decrypt(encrypted.refreshToken)
      : undefined,
    id_token: encrypted.idToken ? decrypt(encrypted.idToken) : undefined,
  };
}

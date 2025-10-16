import crypto from "crypto";

/**
 * Encryption key from environment variable
 * MUST be 32 bytes (256 bits) for AES-256
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;

  if (!key) {
    throw new Error("ENCRYPTION_KEY environment variable is required");
  }

  // Convert hex string to buffer
  const keyBuffer = Buffer.from(key, "hex");

  if (keyBuffer.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be 32 bytes (64 hex characters)");
  }

  return keyBuffer;
}

/**
 * Encrypt an API key using AES-256-GCM
 * Returns: base64-encoded string in format: iv:authTag:encryptedData
 */
export function encryptApiKey(apiKey: string): string {
  if (!apiKey) {
    throw new Error("API key cannot be empty");
  }

  const key = getEncryptionKey();

  // Generate random initialization vector (12 bytes for GCM)
  const iv = crypto.randomBytes(12);

  // Create cipher
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  // Encrypt the API key
  let encrypted = cipher.update(apiKey, "utf8", "base64");
  encrypted += cipher.final("base64");

  // Get authentication tag
  const authTag = cipher.getAuthTag();

  // Combine iv, authTag, and encrypted data
  const combined = Buffer.concat([
    iv,
    authTag,
    Buffer.from(encrypted, "base64"),
  ]);

  return combined.toString("base64");
}

/**
 * Decrypt an API key using AES-256-GCM
 * Input: base64-encoded string in format: iv:authTag:encryptedData
 */
export function decryptApiKey(encryptedKey: string): string {
  if (!encryptedKey) {
    throw new Error("Encrypted key cannot be empty");
  }

  const key = getEncryptionKey();

  // Decode the combined data
  const combined = Buffer.from(encryptedKey, "base64");

  // Extract components
  const iv = combined.subarray(0, 12);
  const authTag = combined.subarray(12, 28);
  const encrypted = combined.subarray(28);

  // Create decipher
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  // Decrypt
  let decrypted = decipher.update(
    encrypted.toString("base64"),
    "base64",
    "utf8",
  );
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * Mask an API key for display (show only last 4 characters)
 */
export function maskApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length < 4) {
    return "****";
  }
  return `••••${apiKey.slice(-4)}`;
}

/**
 * Generate a new encryption key (for setup only)
 * Returns a 32-byte hex string
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString("hex");
}

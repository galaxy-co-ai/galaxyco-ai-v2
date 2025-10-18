/**
 * Webhook Signature Validation
 *
 * Utilities for validating webhook signatures (HMAC-SHA256)
 * Used to verify webhook authenticity from external services
 */

import crypto from "crypto";

/**
 * Generate a webhook secret (32 bytes, base64 encoded)
 * Used when creating new webhooks
 */
export function generateWebhookSecret(): string {
  return crypto.randomBytes(32).toString("base64");
}

/**
 * Calculate HMAC-SHA256 signature for webhook payload
 *
 * @param payload - The webhook payload (JSON string or object)
 * @param secret - The webhook secret
 * @returns The signature as hex string
 */
export function calculateWebhookSignature(
  payload: string | object,
  secret: string,
): string {
  const payloadString =
    typeof payload === "string" ? payload : JSON.stringify(payload);

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(payloadString);
  return hmac.digest("hex");
}

/**
 * Verify webhook signature using constant-time comparison
 *
 * @param payload - The webhook payload
 * @param signature - The signature from the webhook header
 * @param secret - The webhook secret
 * @returns True if signature is valid
 */
export function verifyWebhookSignature(
  payload: string | object,
  signature: string,
  secret: string,
): boolean {
  const expectedSignature = calculateWebhookSignature(payload, secret);

  // Use constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex"),
    );
  } catch {
    // Signature lengths don't match
    return false;
  }
}

/**
 * Verify webhook timestamp to prevent replay attacks
 *
 * @param timestamp - The timestamp from webhook header (Unix seconds)
 * @param maxAge - Maximum allowed age in seconds (default: 5 minutes)
 * @returns True if timestamp is within acceptable range
 */
export function verifyWebhookTimestamp(
  timestamp: number,
  maxAge: number = 300, // 5 minutes default
): boolean {
  const now = Math.floor(Date.now() / 1000);
  const age = now - timestamp;

  // Check if timestamp is in the past and within acceptable age
  return age >= 0 && age <= maxAge;
}

/**
 * Complete webhook signature verification with timestamp check
 *
 * Example header format:
 * X-Webhook-Signature: t=1234567890,v1=abc123def456...
 */
export function verifyWebhookRequest(
  payload: string | object,
  signatureHeader: string,
  secret: string,
  maxAge?: number,
): { valid: boolean; error?: string } {
  // Parse signature header
  const parts = signatureHeader.split(",");
  const timestampPart = parts.find((p) => p.startsWith("t="));
  const signaturePart = parts.find((p) => p.startsWith("v1="));

  if (!timestampPart || !signaturePart) {
    return {
      valid: false,
      error: "Invalid signature header format",
    };
  }

  const timestamp = parseInt(timestampPart.split("=")[1]);
  const signature = signaturePart.split("=")[1];

  // Verify timestamp
  if (!verifyWebhookTimestamp(timestamp, maxAge)) {
    return {
      valid: false,
      error: "Webhook timestamp is too old or invalid",
    };
  }

  // Verify signature
  if (!verifyWebhookSignature(payload, signature, secret)) {
    return {
      valid: false,
      error: "Invalid webhook signature",
    };
  }

  return { valid: true };
}

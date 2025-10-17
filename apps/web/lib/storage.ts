import { put } from "@vercel/blob";
import { logger } from "@/lib/utils/logger";

/**
 * Storage Helper for Vercel Blob
 * Handles file uploads to Vercel Blob Storage
 */

export async function uploadFileToBlob(
  file: File | Buffer,
  filename: string,
  options?: {
    contentType?: string;
  },
): Promise<{ url: string; downloadUrl: string }> {
  try {
    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      contentType: options?.contentType,
    });

    return {
      url: blob.url,
      downloadUrl: blob.downloadUrl || blob.url,
    };
  } catch (error: any) {
    logger.error("Blob upload failed", {
      filename,
      error: error.message,
    });
    throw new Error(`Failed to upload file: ${error.message}`);
  }
}

/**
 * Generate a unique filename with timestamp and random string
 */
export function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalFilename.split(".").pop();
  const nameWithoutExt = originalFilename.replace(`.${extension}`, "");

  // Sanitize filename
  const sanitized = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .substring(0, 50);

  return `${sanitized}-${timestamp}-${random}.${extension}`;
}

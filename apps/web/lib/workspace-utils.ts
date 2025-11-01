/**
 * Workspace Utilities
 * Helper functions for workspace management
 */

/**
 * Generate a URL-friendly slug from a workspace name
 * Examples:
 *   "My Company" -> "my-company"
 *   "Acme Corp LLC" -> "acme-corp-llc"
 *   "Test@#$123" -> "test-123"
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Validate workspace name
 */
export function validateWorkspaceName(name: string): {
  valid: boolean;
  error?: string;
} {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Workspace name is required' };
  }

  if (name.length < 2) {
    return {
      valid: false,
      error: 'Workspace name must be at least 2 characters',
    };
  }

  if (name.length > 50) {
    return {
      valid: false,
      error: 'Workspace name must be less than 50 characters',
    };
  }

  return { valid: true };
}

/**
 * Validate workspace slug
 */
export function validateSlug(slug: string): { valid: boolean; error?: string } {
  if (!slug || slug.trim().length === 0) {
    return { valid: false, error: 'Slug is required' };
  }

  if (slug.length < 2) {
    return { valid: false, error: 'Slug must be at least 2 characters' };
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return {
      valid: false,
      error: 'Slug can only contain lowercase letters, numbers, and hyphens',
    };
  }

  return { valid: true };
}

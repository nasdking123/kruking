/**
 * Security & Input Sanitization Utilities
 */

/**
 * Escapes potentially dangerous HTML entities to prevent XSS.
 */
export function sanitizeHtml(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Validates and normalizes slugs for URLs and database queries.
 */
export function sanitizeSlug(input: string): string {
  if (!input) return '';
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Validates whether a given string is a safe, valid external or relative URL.
 */
export function isValidSafeUrl(urlStr: string): boolean {
  if (!urlStr) return false;
  if (urlStr.startsWith('/') || urlStr.startsWith('#')) return true;
  try {
    const parsed = new URL(urlStr);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

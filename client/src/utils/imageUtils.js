/**
 * Image Utilities and Resilient URL Resolution for Rithanya Hospital Platform
 */

// Universal lightweight SVG placeholder for broken, missing or loading images (Zero external dependencies)
export const DEFAULT_IMAGE_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <rect width="400" height="300" fill="#f1f5f9"/>
  <rect x="185" y="100" width="30" height="100" rx="6" fill="#cbd5e1"/>
  <rect x="150" y="135" width="100" height="30" rx="6" fill="#cbd5e1"/>
  <text x="200" y="240" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="14" font-weight="600" fill="#94a3b8" text-anchor="middle">
    Rithanya Hospital Asset
  </text>
</svg>
`)}`;

/**
 * Normalizes any image URL:
 * - Trims whitespace
 * - Ensures leading slash on local relative paths (preventing bad nested routing like /doctors/image.png)
 * - Properly encodes spaces and non-ASCII URI characters
 * - Returns DEFAULT_IMAGE_PLACEHOLDER if invalid or empty
 */
export function getSafeImageUrl(url) {
  if (!url || typeof url !== 'string') {
    return DEFAULT_IMAGE_PLACEHOLDER;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return DEFAULT_IMAGE_PLACEHOLDER;
  }

  // Already a data URL, blob, or absolute HTTP/HTTPS URL
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:') || /^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // Ensure leading slash for root-relative paths
  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;

  // Encode spaces and characters if not already encoded
  try {
    return encodeURI(decodeURI(withLeadingSlash));
  } catch (_) {
    return withLeadingSlash;
  }
}

/**
 * Safe image onError handler to prevent broken image iconography
 */
export function onImageError(e, fallback = DEFAULT_IMAGE_PLACEHOLDER) {
  if (e && e.target) {
    e.target.onerror = null; // Prevent infinite error loop
    e.target.src = fallback;
  }
}

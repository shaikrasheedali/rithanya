/**
 * Image Utilities and Resilient URL Resolution for Rithanya Hospital Platform
 */

// Universal lightweight SVG placeholder for broken, missing or loading images (Zero external dependencies)
export const DEFAULT_IMAGE_PLACEHOLDER = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="acc" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c50e1f"/>
      <stop offset="100%" stop-color="#991b1b"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bg)"/>
  <rect x="15" y="15" width="370" height="270" rx="10" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" stroke-dasharray="4 4"/>
  <circle cx="200" cy="115" r="32" fill="url(#acc)"/>
  <path d="M194 98 H206 V110 H218 V120 H206 V132 H194 V120 H182 V110 H194 Z" fill="#ffffff"/>
  <text x="200" y="180" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="13" font-weight="700" fill="#f8fafc" text-anchor="middle" letter-spacing="0.5">
    RITHANYA HOSPITAL
  </text>
  <text x="200" y="205" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="500" fill="#94a3b8" text-anchor="middle">
    Clinical Media Asset
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

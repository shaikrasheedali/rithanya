import React, { useState, useEffect } from 'react';

// Modern SVG Data URI fallback with hospital branding
const FALLBACK_SVG_DATA_URI = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
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
  <circle cx="200" cy="120" r="36" fill="url(#acc)"/>
  <!-- Medical Cross -->
  <path d="M194 100 H206 V114 H220 V126 H206 V140 H194 V126 H180 V114 H194 Z" fill="#ffffff"/>
  <text x="200" y="185" fill="#f8fafc" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="700" text-anchor="middle" letter-spacing="0.5">RITHANYA HOSPITAL</text>
  <text x="200" y="210" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" text-anchor="middle">Clinical Media Asset</text>
</svg>`);

/**
 * SafeImage - Resilient image component preventing broken images, 404 console errors, and retry loops
 */
export default function SafeImage({
  src,
  alt = 'Hospital Asset',
  fallbackSrc = FALLBACK_SVG_DATA_URI,
  className = '',
  style = {},
  loading = 'lazy',
  ...rest
}) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    } else {
      setImgSrc(src);
      setHasError(false);
    }
  }, [src, fallbackSrc]);

  const handleError = (e) => {
    // Prevent repeated failing fetch retry loops
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
    if (rest.onError) {
      rest.onError(e);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={`safe-image ${hasError ? 'safe-image-fallback' : ''} ${className}`}
      style={{
        objectFit: style.objectFit || 'cover',
        ...style
      }}
      loading={loading}
      onError={handleError}
      {...rest}
    />
  );
}

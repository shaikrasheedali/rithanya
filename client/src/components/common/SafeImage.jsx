import React, { useState, useEffect } from 'react';
import { getSafeImageUrl } from '../../utils/imageUtils';

// Zero-network modern SVG Data URI fallback with hospital branding
export const FALLBACK_SVG_DATA_URI = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
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
  fallbackSrc = '/image.png',
  className = '',
  style = {},
  loading = 'lazy',
  ...rest
}) {
  const primarySrc = src ? getSafeImageUrl(src) : fallbackSrc;
  const [imgSrc, setImgSrc] = useState(primarySrc);
  const [attemptLevel, setAttemptLevel] = useState(src ? 0 : 1); // 0: primary, 1: /image.png, 2: SVG data URI

  useEffect(() => {
    if (!src) {
      setImgSrc(fallbackSrc);
      setAttemptLevel(1);
    } else {
      const safe = getSafeImageUrl(src);
      setImgSrc(safe);
      setAttemptLevel(0);
    }
  }, [src, fallbackSrc]);

  const handleError = (e) => {
    // Stage 1: Try fallbackSrc (e.g. /image.png)
    if (attemptLevel === 0) {
      setAttemptLevel(1);
      setImgSrc(fallbackSrc);
    }
    // Stage 2: Try embedded SVG Data URI (zero network load, guaranteed never to 404)
    else if (attemptLevel === 1) {
      setAttemptLevel(2);
      setImgSrc(FALLBACK_SVG_DATA_URI);
    } else {
      // Prevent any further retries
      if (e?.target) {
        e.target.onerror = null;
      }
    }

    if (rest.onError) {
      rest.onError(e);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={`safe-image ${attemptLevel > 0 ? 'safe-image-fallback' : ''} ${className}`}
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

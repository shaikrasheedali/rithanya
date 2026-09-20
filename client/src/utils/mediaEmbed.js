/**
 * Media Embed Helper
 * Handles raw iframe embed codes, video URLs, and responsive aspect ratios for YouTube, Instagram, Facebook, and HTML5 video
 */

export function parseEmbedSource(input, defaultMediaType = 'YOUTUBE') {
  if (!input || typeof input !== 'string') {
    return { src: '', aspectRatio: '16/9', isVertical: false, rawHtml: '' };
  }

  const trimmed = input.trim();
  let src = '';
  let detectedType = defaultMediaType;

  // 1. Extract src from iframe string if present
  if (trimmed.includes('<iframe')) {
    const match = trimmed.match(/src=["']([^"']+)["']/i);
    if (match && match[1]) {
      src = match[1];
    } else {
      src = trimmed;
    }
  } else {
    src = trimmed;
  }

  // 2. Decode HTML entities in URL if any (&amp; -> &)
  src = src.replace(/&amp;/g, '&');

  // 3. Normalize URLs to embed endpoints
  if (src.includes('youtube.com') || src.includes('youtu.be')) {
    detectedType = 'YOUTUBE';
    let videoId = null;
    if (src.includes('v=')) {
      videoId = src.split('v=')[1]?.split('&')[0];
    } else if (src.includes('youtu.be/')) {
      videoId = src.split('youtu.be/')[1]?.split('?')[0];
    } else if (src.includes('shorts/')) {
      videoId = src.split('shorts/')[1]?.split('?')[0];
      return {
        src: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
        aspectRatio: '9/16',
        isVertical: true,
        mediaType: 'YOUTUBE',
        rawHtml: trimmed
      };
    } else if (src.includes('embed/')) {
      // already embed URL
      const isShort = src.includes('shorts') || trimmed.includes('height="7') || trimmed.includes('height="8');
      return {
        src: src.includes('?') ? src : `${src}?autoplay=1&rel=0`,
        aspectRatio: isShort ? '9/16' : '16/9',
        isVertical: isShort,
        mediaType: 'YOUTUBE',
        rawHtml: trimmed
      };
    }
    if (videoId) {
      src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }
  } else if (src.includes('instagram.com')) {
    detectedType = 'INSTAGRAM';
    // Clean up Instagram URL to embed format
    const clean = src.split('?')[0].replace(/\/$/, '');
    const isReel = clean.includes('/reel/') || trimmed.includes('/reel/');
    const embedUrl = clean.endsWith('/embed') ? clean : `${clean}/embed`;
    return {
      src: embedUrl,
      aspectRatio: isReel ? '9/16' : '1/1',
      isVertical: isReel,
      mediaType: 'INSTAGRAM',
      rawHtml: trimmed
    };
  } else if (src.includes('facebook.com')) {
    detectedType = 'FACEBOOK';
    if (!src.includes('plugins/video.php')) {
      src = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(src)}&show_text=false`;
    }
  }

  // Detect vertical aspect ratio from iframe dimensions or content
  const isVertical =
    trimmed.includes('9:16') ||
    trimmed.includes('reel') ||
    trimmed.includes('shorts') ||
    (trimmed.includes('height="7') && trimmed.includes('width="4')) ||
    (trimmed.includes('height="8') && trimmed.includes('width="4'));

  return {
    src,
    aspectRatio: isVertical ? '9/16' : '16/9',
    isVertical,
    mediaType: detectedType,
    rawHtml: trimmed
  };
}

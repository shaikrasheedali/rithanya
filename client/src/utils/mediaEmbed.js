/**
 * Media Embed Helper
 * Handles raw iframe embed codes, Instagram blockquotes, video URLs, and responsive aspect ratios for YouTube, Instagram, Facebook, and HTML5 video
 */

export function parseEmbedSource(input, defaultMediaType = 'YOUTUBE') {
  if (!input || typeof input !== 'string') {
    return { src: '', aspectRatio: '16/9', isVertical: false, rawHtml: '' };
  }

  const trimmed = input.trim();
  let src = '';
  let detectedType = defaultMediaType;

  // 1. Extract from Instagram blockquote if present
  if (trimmed.includes('data-instgrm-permalink')) {
    const igMatch = trimmed.match(/data-instgrm-permalink=["']([^"']+)["']/i);
    if (igMatch && igMatch[1]) {
      src = igMatch[1];
      detectedType = 'INSTAGRAM';
    }
  }

  // 2. Extract src from iframe string if present
  if (!src && trimmed.includes('<iframe')) {
    const match = trimmed.match(/src=["']([^"']+)["']/i);
    if (match && match[1]) {
      src = match[1];
    } else {
      src = trimmed;
    }
  } else if (!src) {
    src = trimmed;
  }

  // 3. Decode HTML entities in URL if any (&amp; -> &)
  src = src.replace(/&amp;/g, '&');

  // 4. Normalize URLs to embed endpoints
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
      // already embed URL - retain original query parameters
      const isShort = src.includes('shorts') || trimmed.includes('height="7') || trimmed.includes('height="8') || trimmed.includes('height: 7') || trimmed.includes('height: 8');
      return {
        src: src,
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
    const embedUrl = clean.endsWith('/embed') ? `${clean}/` : `${clean}/embed/`;
    return {
      src: embedUrl,
      aspectRatio: isReel ? '9/16' : '1/1',
      isVertical: isReel,
      mediaType: 'INSTAGRAM',
      rawHtml: trimmed
    };
  } else if (src.includes('facebook.com')) {
    detectedType = 'FACEBOOK';
    if (!src.includes('plugins/video.php') && !src.includes('plugins/post.php')) {
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

/**
 * Parses gallery item to determine if it is:
 * 1. 'CAROUSEL' (multiple images and/or videos)
 * 2. 'EMBED' (iframe/social embed)
 * 3. 'VIDEO' (single video)
 * 4. 'IMAGE' (single image)
 */
export function parseGalleryItemMedia(item) {
  if (!item) return { type: 'IMAGE', assets: [], count: 0 };

  // Check if embedUrl holds a JSON-encoded carousel / multi-asset configuration
  if (item.embedUrl && typeof item.embedUrl === 'string' && item.embedUrl.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(item.embedUrl);
      if (parsed && Array.isArray(parsed.assets) && parsed.assets.length > 0) {
        if (parsed.assets.length === 1) {
          const single = parsed.assets[0];
          return {
            type: single.type === 'VIDEO' ? 'VIDEO' : 'IMAGE',
            url: single.url,
            assets: [single],
            count: 1
          };
        }
        return {
          type: 'CAROUSEL',
          assets: parsed.assets,
          count: parsed.assets.length
        };
      }
    } catch (e) {
      // not JSON, fallback to standard embed
    }
  }

  // Check if mediaType is marked as CAROUSEL
  if (item.mediaType === 'CAROUSEL') {
    return {
      type: 'CAROUSEL',
      assets: [{ url: item.imageUrl, type: 'IMAGE' }],
      count: 1
    };
  }

  // Check if social embed or iframe
  if (item.embedUrl && item.embedUrl.trim().length > 0) {
    const embed = parseEmbedSource(item.embedUrl, item.mediaType);
    return {
      type: 'EMBED',
      embed,
      url: item.imageUrl,
      assets: [{ url: item.imageUrl, type: 'IMAGE' }],
      count: 1
    };
  }

  // Check if single direct video
  if (item.mediaType === 'VIDEO') {
    return {
      type: 'VIDEO',
      url: item.imageUrl,
      assets: [{ url: item.imageUrl, type: 'VIDEO' }],
      count: 1
    };
  }

  // Default single image
  return {
    type: 'IMAGE',
    url: item.imageUrl,
    assets: [{ url: item.imageUrl, type: 'IMAGE' }],
    count: 1
  };
}

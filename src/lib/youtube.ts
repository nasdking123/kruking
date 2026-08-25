/**
 * YouTube Utility Helper
 * Extracts Video IDs and formats clean Embed URLs from various YouTube URL formats.
 */

export function getYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  const cleanUrl = url.trim();

  // Handle iframe embed paste
  if (cleanUrl.includes('<iframe')) {
    const srcMatch = cleanUrl.match(/src=["'](.*?)["']/);
    if (srcMatch && srcMatch[1]) {
      return getYouTubeId(srcMatch[1]);
    }
  }

  // Handle standard youtube.com/watch?v=ID or youtu.be/ID or youtube.com/embed/ID or shorts
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?:.*&)?v=([^&#\s]+)/i,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?&#\s]+)/i,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?&#\s]+)/i,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^?&#\s]+)/i,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^?&#\s]+)/i,
    /(?:https?:\/\/)?(?:m\.)?youtube\.com\/watch\?(?:.*&)?v=([^&#\s]+)/i,
  ];

  for (const pattern of patterns) {
    const match = cleanUrl.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  // If 11-char alphanumeric ID is passed directly
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
    return cleanUrl;
  }

  return null;
}

export function getYouTubeEmbedUrl(url: string | null | undefined): string | null {
  const id = getYouTubeId(url);
  if (!id) return url || null;
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
}

export function getYouTubeThumbnail(url: string | null | undefined): string | null {
  const id = getYouTubeId(url);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

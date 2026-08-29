/**
 * Helper to encode/decode extended work metadata (e.g. file_url, youtube_url, doc_url)
 * seamlessly in content without breaking existing content markdown.
 */

export interface WorkMetadata {
  file_url?: string | null;
  youtube_url?: string | null;
  pdf_url?: string | null;
  doc_url?: string | null;
}

export function parseWorkContent(rawContent?: string | null): {
  cleanContent: string;
  metadata: WorkMetadata;
} {
  if (!rawContent) {
    return { cleanContent: '', metadata: {} };
  }

  const metadata: WorkMetadata = {};
  let cleanContent = rawContent;

  // Extract <!-- META_FILE_URL: ... -->
  const fileMatch = cleanContent.match(/<!--\s*META_FILE_URL:\s*(.*?)\s*-->/);
  if (fileMatch && fileMatch[1]) {
    metadata.file_url = fileMatch[1].trim();
    cleanContent = cleanContent.replace(fileMatch[0], '');
  }

  // Extract <!-- META_YOUTUBE_URL: ... -->
  const ytMatch = cleanContent.match(/<!--\s*META_YOUTUBE_URL:\s*(.*?)\s*-->/);
  if (ytMatch && ytMatch[1]) {
    metadata.youtube_url = ytMatch[1].trim();
    cleanContent = cleanContent.replace(ytMatch[0], '');
  }

  // Extract <!-- META_DOC_URL: ... -->
  const docMatch = cleanContent.match(/<!--\s*META_DOC_URL:\s*(.*?)\s*-->/);
  if (docMatch && docMatch[1]) {
    metadata.doc_url = docMatch[1].trim();
    cleanContent = cleanContent.replace(docMatch[0], '');
  }

  // Auto-detect YouTube URL inside content if not explicitly tagged
  if (!metadata.youtube_url) {
    const ytInContent = cleanContent.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]+/);
    if (ytInContent) {
      metadata.youtube_url = ytInContent[0];
    }
  }

  // Auto-detect Google Drive file link inside content if not explicitly tagged
  if (!metadata.file_url) {
    const driveInContent = cleanContent.match(/https:\/\/drive\.google\.com\/(?:file\/d\/|open\?id=)[a-zA-Z0-9_-]+/);
    if (driveInContent) {
      metadata.file_url = driveInContent[0];
    }
  }

  return {
    cleanContent: cleanContent.trim(),
    metadata,
  };
}

export function injectWorkMetadata(
  content: string,
  metadata: { file_url?: string | null; youtube_url?: string | null; doc_url?: string | null }
): string {
  // Strip any existing metadata tags first
  const result = content
    .replace(/<!--\s*META_FILE_URL:.*?\s*-->\n?/g, '')
    .replace(/<!--\s*META_YOUTUBE_URL:.*?\s*-->\n?/g, '')
    .replace(/<!--\s*META_DOC_URL:.*?\s*-->\n?/g, '')
    .trim();

  const metaTags: string[] = [];

  if (metadata.file_url?.trim()) {
    metaTags.push(`<!-- META_FILE_URL: ${metadata.file_url.trim()} -->`);
  }
  if (metadata.youtube_url?.trim()) {
    metaTags.push(`<!-- META_YOUTUBE_URL: ${metadata.youtube_url.trim()} -->`);
  }
  if (metadata.doc_url?.trim()) {
    metaTags.push(`<!-- META_DOC_URL: ${metadata.doc_url.trim()} -->`);
  }

  if (metaTags.length > 0) {
    return `${metaTags.join('\n')}\n\n${result}`;
  }

  return result;
}

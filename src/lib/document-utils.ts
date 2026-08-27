/**
 * Utility functions for parsing and transforming document & PDF links (Google Drive, Canva, Direct PDF, etc.)
 */

export interface ParsedDocumentInfo {
  type: 'pdf' | 'drive' | 'canva' | 'youtube' | 'doc' | 'other';
  embedUrl: string | null;
  downloadUrl: string | null;
  viewUrl: string;
  isEmbeddable: boolean;
}

export function parseDocumentUrl(url?: string | null): ParsedDocumentInfo | null {
  if (!url || typeof url !== 'string') return null;
  const cleanUrl = url.trim();
  if (!cleanUrl) return null;

  // 1. Google Drive Link parsing
  // Patterns:
  // - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  // - https://drive.google.com/file/d/FILE_ID/edit
  // - https://drive.google.com/open?id=FILE_ID
  // - https://docs.google.com/document/d/DOC_ID/edit
  // - https://docs.google.com/presentation/d/PRES_ID/edit
  // - https://docs.google.com/spreadsheets/d/SHEET_ID/edit
  const driveFileMatch = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  const driveOpenMatch = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  const gDocMatch = cleanUrl.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
  const gPresMatch = cleanUrl.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/);
  const gSheetMatch = cleanUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);

  if (driveFileMatch || driveOpenMatch) {
    const fileId = driveFileMatch ? driveFileMatch[1] : driveOpenMatch![1];
    return {
      type: 'drive',
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
      viewUrl: `https://drive.google.com/file/d/${fileId}/view`,
      isEmbeddable: true,
    };
  }

  if (gDocMatch) {
    const docId = gDocMatch[1];
    return {
      type: 'doc',
      embedUrl: `https://docs.google.com/document/d/${docId}/preview`,
      downloadUrl: `https://docs.google.com/document/d/${docId}/export?format=pdf`,
      viewUrl: cleanUrl,
      isEmbeddable: true,
    };
  }

  if (gPresMatch) {
    const presId = gPresMatch[1];
    return {
      type: 'doc',
      embedUrl: `https://docs.google.com/presentation/d/${presId}/embed?start=false&loop=false&delayms=3000`,
      downloadUrl: `https://docs.google.com/presentation/d/${presId}/export/pdf`,
      viewUrl: cleanUrl,
      isEmbeddable: true,
    };
  }

  if (gSheetMatch) {
    const sheetId = gSheetMatch[1];
    return {
      type: 'doc',
      embedUrl: `https://docs.google.com/spreadsheets/d/${sheetId}/preview`,
      downloadUrl: `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=pdf`,
      viewUrl: cleanUrl,
      isEmbeddable: true,
    };
  }

  // 2. Canva Presentation / Design link
  if (cleanUrl.includes('canva.com/design/')) {
    const canvaViewUrl = cleanUrl.split('?')[0] + '/view?embed';
    return {
      type: 'canva',
      embedUrl: canvaViewUrl,
      downloadUrl: cleanUrl,
      viewUrl: cleanUrl,
      isEmbeddable: true,
    };
  }

  // 3. Direct PDF file (.pdf)
  if (cleanUrl.toLowerCase().endsWith('.pdf') || cleanUrl.includes('.pdf?')) {
    return {
      type: 'pdf',
      embedUrl: cleanUrl,
      downloadUrl: cleanUrl,
      viewUrl: cleanUrl,
      isEmbeddable: true,
    };
  }

  // 4. Other URL (use Google Docs PDF Viewer as fallback embed if valid http url)
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    return {
      type: 'other',
      embedUrl: `https://docs.google.com/viewer?url=${encodeURIComponent(cleanUrl)}&embedded=true`,
      downloadUrl: cleanUrl,
      viewUrl: cleanUrl,
      isEmbeddable: true,
    };
  }

  return {
    type: 'other',
    embedUrl: null,
    downloadUrl: cleanUrl,
    viewUrl: cleanUrl,
    isEmbeddable: false,
  };
}

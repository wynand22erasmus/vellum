/**
 * Simple extension → MIME mapping for SFTP ingest (no magic-byte sniffing).
 *
 * @packageDocumentation
 */

const EXTENSION_MIME: Record<string, string> = {
  pdf: 'application/pdf',
  txt: 'text/plain',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  rtf: 'application/rtf',
  csv: 'text/csv',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  zip: 'application/zip',
  gz: 'application/gzip',
  '7z': 'application/x-7z-compressed',
  md: 'text/markdown',
  json: 'application/json',
  odt: 'application/vnd.oasis.opendocument.text',
  ods: 'application/vnd.oasis.opendocument.spreadsheet',
};

/** Returns a MIME type for a filename extension, or `application/octet-stream`. */
export function mimeFromFileName(fileName: string): string {
  const match = fileName.match(/\.([^.]+)$/u);
  if (!match?.[1]) {
    return 'application/octet-stream';
  }
  return EXTENSION_MIME[match[1].toLowerCase()] ?? 'application/octet-stream';
}

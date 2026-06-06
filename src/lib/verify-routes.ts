/**
 * Helpers for the recipient secure-download verification flow.
 *
 * @packageDocumentation
 */

/** Secure download form (`/verify/:token`). */
function isVerifyDownloadPath(pathname: string): boolean {
  return /^\/verify\/[^/]+$/.test(pathname);
}

/** Post-download confirmation (`/verify/:token/complete`). */
function isVerifyCompletePath(pathname: string): boolean {
  return /^\/verify\/[^/]+\/complete$/.test(pathname);
}

/** Returns true when the pathname is any step of the recipient download flow. */
export function isVerifyFlowPath(pathname: string): boolean {
  return isVerifyDownloadPath(pathname) || isVerifyCompletePath(pathname);
}

/**
 * Triggers a browser file download via a temporary anchor element.
 *
 * @param url - Download URL
 * @param fileName - Optional `download` attribute filename
 */
export function triggerFileDownload(url: string, fileName?: string): void {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.rel = 'noopener noreferrer';
  anchor.target = '_blank';
  if (fileName) {
    anchor.download = fileName;
  }
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

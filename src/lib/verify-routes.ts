/** Secure download form (`/verify/:token`). */
export function isVerifyDownloadPath(pathname: string): boolean {
  return /^\/verify\/[^/]+$/.test(pathname);
}

/** Post-download confirmation (`/verify/:token/complete`). */
export function isVerifyCompletePath(pathname: string): boolean {
  return /^\/verify\/[^/]+\/complete$/.test(pathname);
}

/** Either step of the recipient download flow. */
export function isVerifyFlowPath(pathname: string): boolean {
  return isVerifyDownloadPath(pathname) || isVerifyCompletePath(pathname);
}

export function triggerFileDownload(url: string, fileName?: string): void {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.rel = 'noopener noreferrer';
  if (fileName) {
    anchor.download = fileName;
  }
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

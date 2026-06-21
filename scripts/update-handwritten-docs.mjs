#!/usr/bin/env node
/** Updates hand-written docs for Communication model and purge terminology. */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const files = [
  'README.md',
  'docs/CONFIG.md',
  'docs/USAGE.md',
  'docs/ERROR_HANDLING.md',
  'docs/EVENTS_AND_WEBHOOKS.md',
  'docs/Nice-To-Have.md',
  'docs/Vellum_Comprehensive_Design_Document.md',
  'bruno/README.md',
];

const REPLACEMENTS = [
  ['DocumentUserLink', 'Communication'],
  ['DocumentFile', 'File'],
  ['document_user_links', 'Communication'],
  ['document_files', 'File'],
  ['DocumentLink', 'Communication'],
  ['documentLinkId', 'communicationId'],
  ['document-links', 'communications'],
  ['document-link', 'communication'],
  ['Document links', 'Communications'],
  ['document links', 'communications'],
  ['document link', 'communication'],
  ['FILE_SCRUBBED', 'FILE_PURGED'],
  ['file_scrubbed', 'file_purged'],
  ['WEBHOOK_URL_FILE_SCRUBBED', 'WEBHOOK_URL_FILE_PURGED'],
  ['fileScrubWorker', 'filePurgeWorker'],
  ['recordScrubWorker', 'recordPurgeWorker'],
  ['scrub-files', 'purge-files'],
  ['scrub-records', 'purge-records'],
  ['File scrub worker', 'File purge worker'],
  ['file scrub worker', 'file purge worker'],
  ['Scrub Workers', 'Purge Workers'],
  ['File scrub', 'File purge'],
  ['file scrub', 'file purge'],
  ['scrubbed', 'purged'],
  ['Scrubbed', 'Purged'],
  ['scrub,', 'purge,'],
  ['scrub ', 'purge '],
  ['Scrub / purge', 'Purge'],
  ['isUsed', 'downloadCount'],
  ['ingestDocumentFile', 'ingestFile'],
  ['createDocumentUserLink', 'createCommunication'],
  ['createDocumentLink', 'createCommunication'],
  ['revokeActiveDocumentLinks', 'revokeActiveCommunications'],
  ['GET /api/admin/document-files', 'GET /api/admin/files'],
  ['/admin/document-files', '/admin/files'],
  ['AuditLog.timestamp', 'AuditLog.createdAt'],
  ['totpSecretEnc', 'authenticatorSecretEnc'],
  ['Recipient.authenticatorSecretEnc on Recipient', 'Recipient.authenticatorSecretEnc'],
];

for (const rel of files) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  for (const [from, to] of REPLACEMENTS) {
    content = content.split(from).join(to);
  }
  fs.writeFileSync(file, content);
  console.log('updated', rel);
}

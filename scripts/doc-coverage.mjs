/**
 * Reports TSDoc coverage for exported symbols in src/ and e2e/helpers.ts.
 * Exits non-zero when coverage is below DOCS_COVERAGE_MIN (default 95).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Project, Node } from 'ts-morph';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const minCoverage = Number(process.env.DOCS_COVERAGE_MIN ?? '95');
const inventoryPath = path.join(root, 'docs', 'doc-inventory.json');

const project = new Project({
  tsConfigFilePath: path.join(root, 'tsconfig.typedoc.json'),
});

/** @param {import('ts-morph').Node} node */
function getJsDocNode(node) {
  if (Node.isVariableDeclaration(node)) {
    const statement = node.getVariableStatement();
    if (statement && Node.isJSDocable(statement)) return statement;
  }
  if (Node.isFunctionDeclaration(node) || Node.isClassDeclaration(node)) {
    return node;
  }
  if (Node.isExportAssignment(node)) {
    const source = node.getModuleSpecifierSourceFile();
    if (source) return node;
  }
  if (Node.isJSDocable(node)) return node;
  const parent = node.getParent();
  if (parent && Node.isJSDocable(parent)) return parent;
  return node;
}

/** @param {import('ts-morph').JSDocableNode} node */
function hasMeaningfulJsDoc(node) {
  const target = getJsDocNode(node);
  if (!Node.isJSDocable(target)) return false;

  const docs = target.getJsDocs();
  if (docs.length === 0) return false;

  for (const doc of docs) {
    const description = doc.getDescription().trim();
    if (description.length > 0) return true;
    for (const tag of doc.getTags()) {
      if (tag.getTagName() === 'inheritdoc') return true;
      if (tag.getText().trim().length > 0) return true;
    }
  }
  return false;
}

/** @param {import('ts-morph').Node} node */
function exportKind(node) {
  if (Node.isFunctionDeclaration(node)) return 'function';
  if (Node.isClassDeclaration(node)) return 'class';
  if (Node.isInterfaceDeclaration(node)) return 'interface';
  if (Node.isTypeAliasDeclaration(node)) return 'type';
  if (Node.isEnumDeclaration(node)) return 'enum';
  if (Node.isVariableDeclaration(node)) return 'variable';
  if (Node.isModuleDeclaration(node)) return 'namespace';
  return Node.isSourceFile(node) ? 'module' : 'export';
}

const sourceFiles = project
  .getSourceFiles()
  .filter((sf) => {
    const fp = sf.getFilePath();
    return (
      fp.includes(`${path.sep}src${path.sep}`) ||
      fp.endsWith(`${path.sep}e2e${path.sep}helpers.ts`)
    );
  });

const inventory = {
  generatedAt: new Date().toISOString(),
  minCoveragePercent: minCoverage,
  files: [],
  summary: { total: 0, documented: 0, coveragePercent: 0 },
};

let total = 0;
let documented = 0;

for (const sourceFile of sourceFiles) {
  const relPath = path.relative(root, sourceFile.getFilePath());
  const fileEntry = { path: relPath, exports: [] };
  const exported = sourceFile.getExportedDeclarations();

  for (const [name, declarations] of exported) {
    for (const decl of declarations) {
      const ok = hasMeaningfulJsDoc(decl);
      total += 1;
      if (ok) documented += 1;

      fileEntry.exports.push({
        name,
        kind: exportKind(decl),
        line: decl.getStartLineNumber(),
        status: ok ? 'complete' : 'missing',
      });
    }
  }

  if (fileEntry.exports.length > 0) {
    inventory.files.push(fileEntry);
  }
}

inventory.summary.total = total;
inventory.summary.documented = documented;
inventory.summary.coveragePercent =
  total === 0 ? 100 : Math.round((documented / total) * 1000) / 10;

fs.mkdirSync(path.dirname(inventoryPath), { recursive: true });
fs.writeFileSync(inventoryPath, `${JSON.stringify(inventory, null, 2)}\n`);

console.log(
  `Documentation coverage: ${documented}/${total} (${inventory.summary.coveragePercent}%)`,
);
console.log(`Inventory written to ${path.relative(root, inventoryPath)}`);

if (inventory.summary.coveragePercent < minCoverage) {
  const missing = inventory.files.flatMap((f) =>
    f.exports.filter((e) => e.status === 'missing').map((e) => `${f.path} → ${e.name}`),
  );
  console.error(`\nBelow minimum ${minCoverage}%. Undocumented exports (${missing.length}):`);
  for (const line of missing.slice(0, 30)) {
    console.error(`  - ${line}`);
  }
  if (missing.length > 30) {
    console.error(`  … and ${missing.length - 30} more`);
  }
  process.exit(1);
}

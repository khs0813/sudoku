import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const ignoredDirs = new Set(['.git', 'node_modules', 'mobile-audit']);
const ignoredFiles = new Set(['.idea/workspace.xml']);
const binaryExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico']);

const checks = [
  {
    label: 'legacy Korean brand with spacing',
    pattern: new RegExp(['포켓', ' 스도쿠'].join(''), 'i')
  },
  {
    label: 'legacy Korean compact brand',
    pattern: new RegExp(['포켓', '스도쿠'].join(''), 'i')
  },
  {
    label: 'legacy English brand',
    pattern: new RegExp(['Pocket', ' Sudoku'].join(''), 'i')
  },
  {
    label: 'legacy package token',
    pattern: new RegExp(['pocket', '-sudoku'].join(''), 'i')
  },
  {
    label: 'legacy Render host',
    pattern: new RegExp(['onrender', '\\.com'].join(''), 'i')
  }
];

const findings = [];

const hasBinaryExtension = (file) => {
  const lower = file.toLowerCase();
  return [...binaryExtensions].some((extension) => lower.endsWith(extension));
};

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) await walk(join(dir, entry.name));
      continue;
    }

    const file = join(dir, entry.name);
    const relativePath = relative(root, file);
    if (ignoredFiles.has(relativePath) || hasBinaryExtension(relativePath)) continue;

    let text = '';
    try {
      text = await readFile(file, 'utf8');
    } catch {
      continue;
    }

    for (const check of checks) {
      if (check.pattern.test(text)) findings.push(`${relativePath}: ${check.label}`);
    }
  }
}

await walk(root);
assert.deepEqual(findings, [], `Legacy strings found:\n${findings.join('\n')}`);
console.log('No legacy branding or host strings found in scanned files.');

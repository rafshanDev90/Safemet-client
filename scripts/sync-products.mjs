import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcFile = path.resolve(root, '../server/data/products.json');
const outFile = path.resolve(root, 'lib/catalog.js');

if (!fs.existsSync(srcFile)) {
  console.error(`No source catalog at ${srcFile}. Run this from within the full repo.`);
  process.exit(1);
}

const all = JSON.parse(fs.readFileSync(srcFile, 'utf-8'));

const fields = (p) => {
  const out = {};
  for (const key of ['id', 'name', 'slug', 'category', 'image', 'order', 'graphicType', 'specs', 'description']) {
    if (p[key] !== undefined) out[key] = p[key];
  }
  return out;
};

const visible = all.filter((p) => !p.isDeleted).map(fields);
const body = `export default ${JSON.stringify(visible, null, 2)};\n`;

fs.writeFileSync(outFile, body, 'utf-8');
console.log(`Wrote ${visible.length} products to ${outFile}`);
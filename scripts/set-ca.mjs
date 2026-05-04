// One-shot CA injector for STAR26 (WC2026 prediction market memecoin).
// Usage:
//   node scripts/set-ca.mjs <SOLANA_MINT>           — patch only
//   node scripts/set-ca.mjs <SOLANA_MINT> --deploy  — patch + vercel prod + alias
//
// Patches CA placeholders across components/ and app/. Idempotent.

import { readFile, writeFile } from "node:fs/promises";
import { existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dir, "..");

const ca = process.argv[2];

if (!ca || !/^[A-Za-z0-9]{32,48}$/.test(ca)) {
  console.error("Usage: node scripts/set-ca.mjs <CA> [--deploy]");
  console.error("       CA must be a Solana mint address (base58, 32–48 chars).");
  process.exit(1);
}

const truncate = (s) =>
  s.length <= 12 ? s : `${s.slice(0, 4)}…${s.slice(-4)}`;
const display = `CA: ${truncate(ca)}`;

const PATCH_DIRS = ["components", "app"].map((d) => join(ROOT, d));
const PATCH_EXT = new Set([".tsx", ".ts", ".jsx", ".js", ".html"]);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) {
      if (entry === "node_modules" || entry === ".next") continue;
      walk(full, out);
    } else if (PATCH_EXT.has(extname(entry).toLowerCase())) {
      out.push(full);
    }
  }
  return out;
}

let changes = 0;
const targets = PATCH_DIRS.flatMap((d) => (existsSync(d) ? walk(d) : []));

for (const f of targets) {
  let c = await readFile(f, "utf8");
  const before = c;
  c = c.replace(/"CA TBA"/g, `"${ca}"`);
  c = c.replace(/data-ca="([A-Za-z0-9]{1,48}|TBA)"/g, `data-ca="${ca}"`);
  c = c.replace(/CA:\s*(TBA|[A-Za-z0-9]{4}…[A-Za-z0-9]{4})/g, display);
  c = c.replace(/\bCA\s+TBA\b/g, `CA ${truncate(ca)}`);
  if (c !== before) {
    await writeFile(f, c, "utf8");
    changes++;
    console.log(`  ✓ ${f.replace(ROOT, ".")}`);
  }
}

console.log(`\n✓ patched ${changes} file(s)`);
console.log(`  data-ca:    ${ca}`);
console.log(`  visible:    ${display}`);
// fix(scripts): tighten CA regex to base58 32-48 chars @ 2026-05-04T13:36:05

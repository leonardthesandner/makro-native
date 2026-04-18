/**
 * Syncs web app files from makro web project → www/
 * Run: node scripts/sync-web.js
 */
const fs   = require("fs");
const path = require("path");

const SRC  = path.resolve(__dirname, "../../makro-app/makro");
const DEST = path.resolve(__dirname, "../www");

const FILES = [
  "index.html",
  "manifest.json",
];
const DIRS = [
  "icons",
];

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`  ✓ ${path.relative(DEST, dest)}`);
}

function copyDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) { console.warn(`  ⚠ nicht gefunden: ${srcDir}`); return; }
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const s = path.join(srcDir, file);
    const d = path.join(destDir, file);
    if (fs.statSync(s).isDirectory()) copyDir(s, d);
    else copyFile(s, d);
  }
}

console.log("🔄 Syncing web files → www/");
for (const f of FILES) copyFile(path.join(SRC, f), path.join(DEST, f));
for (const d of DIRS)  copyDir(path.join(SRC, d), path.join(DEST, d));
console.log("✅ Fertig");

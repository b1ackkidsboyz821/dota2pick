// Adds a position row to a hero in heroPositions.ts.
// Input: a JSON file of [heroKey, pos, role, note, adds[]] entries.
// A hero/position that is already there is skipped — use apply-adds-patch.mjs
// to change one instead.
// Usage: node scripts/add-position.mjs <rows.json>
import fs from "node:fs";

const rowsPath = process.argv[2];
if (!rowsPath) {
  console.error("usage: node scripts/add-position.mjs <rows.json>");
  process.exit(1);
}

const FILE = "src/data/heroPositions.ts";
const rows = JSON.parse(fs.readFileSync(rowsPath, "utf8"));
let src = fs.readFileSync(FILE, "utf8");
let added = 0;
const skipped = [];

for (const [hero, pos, role, note, adds] of rows) {
  const blockRe = new RegExp(`(\\n  ${hero}: \\[)([\\s\\S]*?)(\\n  \\],)`);
  const block = src.match(blockRe);
  if (!block) {
    skipped.push(`${hero}: block not found`);
    continue;
  }
  if (block[2].startsWith("[")) {
    skipped.push(`${hero}: written on one line — split the rows first`);
    continue;
  }
  if (new RegExp(`\\n    \\[${pos}, "`).test(block[2])) {
    skipped.push(`${hero} pos${pos}: already listed`);
    continue;
  }

  const rendered =
    `\n    [${pos}, "${role}", "${note}", [${adds.map((a) => `"${a}"`).join(", ")}]],`;
  src = src.replace(blockRe, (_m, open, body, close) => `${open}${body}${rendered}${close}`);
  added++;
}

fs.writeFileSync(FILE, src);
console.log(`added ${added}/${rows.length}`);
for (const s of skipped) console.log(`  SKIP ${s}`);

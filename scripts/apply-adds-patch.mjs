// Rewrites the `adds` array of one hero/position row in heroPositions.ts.
// Input: a JSON file of [heroKey, pos, newAdds[]] entries.
// Usage: node scripts/apply-adds-patch.mjs <patch.json>
import fs from "node:fs";

const patchPath = process.argv[2];
if (!patchPath) {
  console.error("usage: node scripts/apply-adds-patch.mjs <patch.json>");
  process.exit(1);
}

const FILE = "src/data/heroPositions.ts";
const patch = JSON.parse(fs.readFileSync(patchPath, "utf8"));
let src = fs.readFileSync(FILE, "utf8");
let applied = 0;
const missed = [];

for (const [hero, pos, adds] of patch) {
  // isolate this hero's block, then the row for this position inside it
  const blockRe = new RegExp(`(\\n  ${hero}: \\[)([\\s\\S]*?)(\\n  \\],)`);
  const block = src.match(blockRe);
  if (!block) {
    missed.push(`${hero}: block not found`);
    continue;
  }

  const rowRe = new RegExp(`(\\n    \\[${pos}, "[^"]*", "[^"]*", )(\\[[^\\]]*\\])`);
  const row = block[2].match(rowRe);
  if (!row) {
    missed.push(`${hero} pos${pos}: row not found`);
    continue;
  }

  const rendered = `[${adds.map((a) => `"${a}"`).join(", ")}]`;
  const newBlock = block[2].replace(rowRe, `$1${rendered}`);
  src = src.replace(blockRe, (_m, open, _body, close) => `${open}${newBlock}${close}`);
  applied++;
}

fs.writeFileSync(FILE, src);
console.log(`applied ${applied}/${patch.length}`);
for (const m of missed) console.log(`  MISS ${m}`);

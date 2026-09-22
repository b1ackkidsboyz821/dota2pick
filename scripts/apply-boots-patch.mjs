// Swaps the boots inside one hero/position's `early` list in builds.ts.
// Input: a JSON file of [heroKey, pos, boots] entries; the edit is scoped to
// that hero's block, so an identical line on another hero is left alone.
// Usage: node scripts/apply-boots-patch.mjs <patch.json>
import fs from "node:fs";

const patchPath = process.argv[2];
if (!patchPath) {
  console.error("usage: node scripts/apply-boots-patch.mjs <patch.json>");
  process.exit(1);
}

const FILE = "src/data/builds.ts";
const BOOTS = ["power_treads", "phase_boots", "arcane_boots", "tranquil_boots", "travel_boots"];
const patch = JSON.parse(fs.readFileSync(patchPath, "utf8"));
let src = fs.readFileSync(FILE, "utf8");
let applied = 0;
const missed = [];

for (const [hero, pos, boots] of patch) {
  if (!BOOTS.includes(boots)) {
    missed.push(`${hero} pos${pos}: ${boots} is not a boot`);
    continue;
  }
  const heroRe = new RegExp(`(\\n    key: "${hero}",)([\\s\\S]*?)(\\n    key: "|\\n\\];)`);
  const block = src.match(heroRe);
  if (!block) {
    missed.push(`${hero}: block not found`);
    continue;
  }
  const posRe = new RegExp(`(\\n        pos: ${pos},[\\s\\S]*?\\n        early: \\[)([^\\]]*)(\\])`);
  const row = block[2].match(posRe);
  if (!row) {
    missed.push(`${hero} pos${pos}: early list not found`);
    continue;
  }

  const list = row[2].split(",").map((x) => x.trim().replace(/^"|"$/g, ""));
  const next = list.some((i) => BOOTS.includes(i))
    ? list.map((i) => (BOOTS.includes(i) ? boots : i))
    : // no boots listed at all — put them where the shop order would
      [...list.slice(0, 2), boots, ...list.slice(2)];
  const rendered = next.map((i) => `"${i}"`).join(", ");

  const newBlock = block[2].replace(posRe, `$1${rendered}$3`);
  src = src.replace(heroRe, (_m, head, _body, tail) => `${head}${newBlock}${tail}`);
  applied++;
}

fs.writeFileSync(FILE, src);
console.log(`applied ${applied}/${patch.length}`);
for (const m of missed) console.log(`  MISS ${m}`);

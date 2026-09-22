// Rewrites the `early` or `core` list and appends `situational` entries for one
// hero/position in builds.ts. The edit is scoped to that hero's block, so an
// identical line on another hero is left alone.
//
// Input: a JSON file of [heroKey, pos, { early?, core?: string[], situational?: [{item, why}] }]
// Usage: node scripts/apply-build-patch.mjs <patch.json>
import fs from "node:fs";

const patchPath = process.argv[2];
if (!patchPath) {
  console.error("usage: node scripts/apply-build-patch.mjs <patch.json>");
  process.exit(1);
}

const FILE = "src/data/builds.ts";
const patch = JSON.parse(fs.readFileSync(patchPath, "utf8"));
let src = fs.readFileSync(FILE, "utf8");
let applied = 0;
const missed = [];

for (const [hero, pos, change] of patch) {
  const heroRe = new RegExp(`(\\n    key: "${hero}",)([\\s\\S]*?)(\\n    key: "|\\n\\];)`);
  const block = src.match(heroRe);
  if (!block) {
    missed.push(`${hero}: block not found`);
    continue;
  }
  let body = block[2];

  let failed = false;
  for (const slot of ["early", "core"]) {
    if (!change[slot]) continue;
    const re = new RegExp(`(\\n        pos: ${pos},[\\s\\S]*?\\n        ${slot}: \\[)([^\\]]*)(\\])`);
    if (!re.test(body)) {
      missed.push(`${hero} pos${pos}: ${slot} not found`);
      failed = true;
      break;
    }
    body = body.replace(re, `$1${change[slot].map((i) => `"${i}"`).join(", ")}$3`);
  }
  if (failed) continue;

  if (change.situational?.length) {
    // situational is either an empty list, a one-liner or an already-split block
    const sitRe = new RegExp(
      `(\\n        pos: ${pos},[\\s\\S]*?\\n        situational: )(\\[[\\s\\S]*?\\],)(\\n        (?:tips|\\}))`,
    );
    const m = body.match(sitRe);
    if (!m) {
      missed.push(`${hero} pos${pos}: situational not found`);
      continue;
    }
    const existing = [...m[2].matchAll(/item: "([a-z0-9_]+)"/g)].map((x) => x[1]);
    const fresh = change.situational.filter((s) => !existing.includes(s.item));
    if (fresh.length) {
      const inner = m[2].slice(1, m[2].lastIndexOf("]"));
      const rows = [
        ...(inner.trim() ? [inner.trim().replace(/,$/, "")] : []),
        ...fresh.map((s) => `{ item: "${s.item}", why: "${s.why}" }`),
      ];
      const nl = String.fromCharCode(10);
      const rendered = `[${nl}          ${rows.join("," + nl + "          ")},${nl}        ],`;
      body = body.replace(sitRe, (_x, head, _old, tail) => `${head}${rendered}${tail}`);
    }
  }

  src = src.replace(heroRe, (_m, head, _old, tail) => `${head}${body}${tail}`);
  applied++;
}

fs.writeFileSync(FILE, src);
console.log(`applied ${applied}/${patch.length}`);
for (const m of missed) console.log(`  MISS ${m}`);

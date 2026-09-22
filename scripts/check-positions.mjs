// Compares the positions heroPositions.ts lists against the positions heroes are
// actually played in, using the league sample in position-builds.json.
//
//   MISSING  a position with a real sample that the table does not list, so the
//            site never offers a build for it
//   UNPLAYED a position we list that barely shows up in league games — often
//            correct for pub play, so this is a question, not a verdict
// Usage: node scripts/check-positions.mjs [--json]
import fs from "node:fs";
import { HERO_POSITIONS } from "../src/data/heroPositions.ts";

const asJson = process.argv.includes("--json");
const heroes = JSON.parse(fs.readFileSync("src/data/heroes.json", "utf8"));
const built = JSON.parse(fs.readFileSync("src/data/generated/position-builds.json", "utf8"));
const raw = JSON.parse(fs.readFileSync("src/data/generated/position-items-raw.json", "utf8"));

/** a listed position needs at least this share of the hero's games to look real */
const THIN = 0.05;

const report = [];
for (const hero of heroes) {
  const measured = built[hero.key] ?? {};
  const all = raw.heroes[hero.key] ?? {};
  const total = Object.values(all).reduce((n, p) => n + (p.games ?? 0), 0);
  if (!total) continue;
  const listed = new Set((HERO_POSITIONS.get(hero.key) ?? []).map((i) => i.pos));

  const missing = Object.entries(measured)
    .filter(([pos]) => !listed.has(Number(pos)))
    .map(([pos, v]) => ({ pos: Number(pos), games: v.games, share: v.games / total }))
    .sort((a, b) => b.games - a.games);

  const unplayed = [...listed]
    .map((pos) => ({ pos, games: all[pos]?.games ?? 0, share: (all[pos]?.games ?? 0) / total }))
    .filter((x) => x.share < THIN)
    .sort((a, b) => a.games - b.games);

  if (missing.length || unplayed.length) {
    report.push({ hero: hero.key, name: hero.name, total, missing, unplayed });
  }
}

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  const pct = (n) => `${(n * 100).toFixed(0)}%`.padStart(4);
  for (const r of report) {
    console.log(`\n${r.name}  (${r.total} league games)`);
    for (const m of r.missing) console.log(`  MISSING  pos${m.pos}  ${m.games} games ${pct(m.share)}`);
    for (const u of r.unplayed) console.log(`  UNPLAYED pos${u.pos}  ${u.games} games ${pct(u.share)}`);
  }
  const missing = report.reduce((n, r) => n + r.missing.length, 0);
  const unplayed = report.reduce((n, r) => n + r.unplayed.length, 0);
  console.log(
    `\n${report.length} heroes · ${missing} positions played but not listed · ${unplayed} listed but barely played`,
  );
  console.log(`league sample: ${raw.poolMatches} matches over ${raw.days} days`);
}

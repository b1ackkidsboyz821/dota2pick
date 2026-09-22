// Which boots each hand-written build starts, against what that position buys
// in league games. Boots are one slot with one answer, so they get their own
// check instead of competing with real items inside check-curated.mjs.
// Usage: node scripts/check-boots.mjs [--json]
import fs from "node:fs";
import { HEROES } from "../src/data/builds.ts";

const asJson = process.argv.includes("--json");
const raw = JSON.parse(fs.readFileSync("src/data/generated/position-items-raw.json", "utf8"));
const items = JSON.parse(fs.readFileSync("src/data/items.json", "utf8"));
const nameOf = new Map(items.map((i) => [i.key, i.name]));

const BOOTS = ["power_treads", "phase_boots", "arcane_boots", "tranquil_boots", "travel_boots"];
/** same bars as check-curated.mjs, so the two agree on what "measured" means */
const MIN_POS_GAMES = 60;
const MIN_POS_SHARE = 0.1;
/** a second pair this popular is a real choice, not a mistake */
const ALSO_FINE = 0.3;

const report = [];
for (const hero of HEROES) {
  const byPos = raw.heroes[hero.key];
  if (!byPos) continue;
  const total = Object.values(byPos).reduce((n, p) => n + (p.games ?? 0), 0);

  for (const build of hero.builds) {
    const d = byPos[build.pos];
    if (!d || d.games < MIN_POS_GAMES || d.games < total * MIN_POS_SHARE) continue;

    // Travel Boots replace an earlier pair, so count every phase.
    const counts = BOOTS.map((k) => [k, (d.starting[k] ?? 0) + (d.early[k] ?? 0) + (d.mid[k] ?? 0) + (d.late[k] ?? 0)])
      .filter(([, n]) => n > 0)
      .sort((a, b) => b[1] - a[1]);
    if (counts.length === 0) continue;

    const max = counts[0][1];
    const ours = build.early.filter((i) => BOOTS.includes(i));
    const share = (k) => (counts.find(([c]) => c === k)?.[1] ?? 0) / max;
    const wrong = ours.filter((k) => share(k) < ALSO_FINE);

    if (ours.length === 0 || wrong.length) {
      report.push({
        hero: hero.key,
        pos: build.pos,
        games: d.games,
        ours,
        wrong,
        actual: counts.slice(0, 3).map(([k, n]) => ({ item: k, games: n, share: n / max })),
      });
    }
  }
}

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  for (const r of report) {
    const mine = r.ours.length === 0 ? "no boots listed" : r.ours.map((k) => nameOf.get(k) ?? k).join(", ");
    const real = r.actual.map((a) => `${nameOf.get(a.item) ?? a.item} ${(a.share * 100).toFixed(0)}%`).join(" · ");
    console.log(`${r.hero} pos${r.pos} (${r.games}g)\n  guide: ${mine}\n  league: ${real}`);
  }
  console.log(`\n${report.length} builds whose boots do not match the league sample`);
  console.log(`a pair bought by at least ${ALSO_FINE * 100}% of the leader counts as fine`);
}

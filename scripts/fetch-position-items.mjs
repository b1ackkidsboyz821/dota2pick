// Pulls item purchases from OpenDota's /explorer SQL endpoint, split by the
// position the hero was played in. The per-hero itemPopularity endpoint mixes
// every position together, which buries support items under core games.
//
// Position is inferred, not labelled: OpenDota only stores lane_role
// (safelane/mid/offlane/jungle), so supports are separated by their gold rank
// inside their own team — rank 5 is pos 5, rank 4 is pos 4, and the remaining
// three players get their lane's position. A mid also has to be top-two in gold,
// because lane_role marks roaming offlaners as mid often enough to matter.
// A pos 4 who out-farms the offlaner still lands on the wrong side of that
// line, so treat counts as a signal.
//
// Source is the `matches` table = league/pro games only (~23k per 365 days).
//
// --min is the smallest purchase count kept per item. It has to stay low: at 3,
// a position with a few hundred games reads a normal pick as never bought,
// because one or two purchases get dropped and the share works out to zero.
// Usage: node scripts/fetch-position-items.mjs [--force] [--days 365] [--min 1]
import fs from "node:fs";

const OUT = "src/data/generated/position-items-raw.json";
const DELAY_MS = 1200;
const FORCE = process.argv.includes("--force");
const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i === -1 ? fallback : Number(process.argv[i + 1]);
};
const DAYS = arg("--days", 365);
const MIN_COUNT = arg("--min", 1);

const heroes = JSON.parse(fs.readFileSync("src/data/heroes.json", "utf8"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function explorer(sql, tries = 6) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(
        "https://api.opendota.com/api/explorer?sql=" + encodeURIComponent(sql),
      );
      const body = await res.json();
      if (res.status === 429 || res.status >= 500) {
        await sleep(5000 * (i + 1));
        continue;
      }
      if (body.err) throw new Error(body.err);
      return body.rows;
    } catch (err) {
      lastErr = err;
      await sleep(3000 * (i + 1));
    }
  }
  throw lastErr ?? new Error("gave up");
}

// match_id is monotonic, so one lookup gives a cheap cutoff that avoids joining
// every per-hero query back to the matches table.
const [{ mid: SINCE, games: POOL }] = await explorer(
  `SELECT min(match_id) AS mid, count(*) AS games FROM matches
   WHERE start_time > extract(epoch from now() - interval '${DAYS} day')`,
);
console.log(`pool: ${POOL} league matches since match_id ${SINCE} (${DAYS} days)`);

const heroSql = (heroId) => `
WITH mine AS (
  SELECT match_id, player_slot FROM player_matches
  WHERE hero_id = ${heroId} AND match_id > ${SINCE}
), ranked AS (
  SELECT p.match_id, p.player_slot, p.lane_role, p.purchase_log,
         row_number() OVER (
           PARTITION BY p.match_id, (p.player_slot < 128) ORDER BY p.gold_per_min DESC
         ) AS gpm_rank
  FROM player_matches p WHERE p.match_id IN (SELECT match_id FROM mine)
), me AS (
  SELECT CASE
           WHEN r.gpm_rank = 5 THEN 5
           WHEN r.gpm_rank = 4 THEN 4
           WHEN r.lane_role = 2 AND r.gpm_rank <= 2 THEN 2
           WHEN r.lane_role IN (2, 3, 4) THEN 3
           ELSE 1
         END AS pos,
         r.match_id, r.player_slot, r.purchase_log
  FROM ranked r
  JOIN mine m ON m.match_id = r.match_id AND m.player_slot = r.player_slot
  WHERE r.purchase_log IS NOT NULL
), buys AS (
  SELECT me.pos, (e->>'key') AS item, (e->>'time')::int AS t
  FROM me, unnest(me.purchase_log) e
)
SELECT pos, 'games' AS phase, '' AS item, count(*) AS n FROM me GROUP BY 1
UNION ALL
SELECT pos,
       CASE WHEN t < 0 THEN 'starting'
            WHEN t < 600 THEN 'early'
            WHEN t < 1500 THEN 'mid'
            ELSE 'late' END AS phase,
       item, count(*) AS n
FROM buys
GROUP BY 1, 2, 3 HAVING count(*) >= ${MIN_COUNT}
`;

let raw = {};
if (!FORCE && fs.existsSync(OUT)) raw = JSON.parse(fs.readFileSync(OUT, "utf8"));
const data = raw.heroes ?? {};

for (const [idx, hero] of heroes.entries()) {
  if (data[hero.key]) continue;
  const started = Date.now();
  const rows = await explorer(heroSql(hero.id));

  const byPos = {};
  for (const row of rows) {
    const pos = (byPos[row.pos] ??= { games: 0, starting: {}, early: {}, mid: {}, late: {} });
    if (row.phase === "games") pos.games = Number(row.n);
    else pos[row.phase][row.item] = Number(row.n);
  }
  data[hero.key] = byPos;

  const played = Object.entries(byPos)
    .sort((a, b) => b[1].games - a[1].games)
    .map(([pos, v]) => `p${pos}:${v.games}`)
    .join(" ");
  console.log(`[${idx + 1}/${heroes.length}] ${hero.name} — ${Date.now() - started}ms — ${played}`);

  fs.writeFileSync(
    OUT,
    JSON.stringify({
      fetchedAt: new Date().toISOString(),
      days: DAYS,
      sinceMatchId: SINCE,
      poolMatches: POOL,
      minCount: MIN_COUNT,
      heroes: data,
    }),
  );
  await sleep(DELAY_MS);
}
console.log("done");

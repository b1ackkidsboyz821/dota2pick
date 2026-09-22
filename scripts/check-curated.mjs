// Cross-checks the hand-written guides against what players actually buy.
//
// The curated data in builds.ts / heroPositions.ts is written from knowledge,
// not measured — so it can drift out of patch. This compares every item it
// recommends against the raw OpenDota purchase counts for that hero and
// reports two kinds of mismatch:
//
//   RARE    an item we recommend that almost nobody buys on this hero
//   MISSING an item most players buy on this hero that no guide of ours mentions
//
// Popularity is measured relative to the most-bought item in the same bucket,
// so it is a share of "how often the most common pick appears", not a winrate.
//
// Once scripts/fetch-position-items.mjs has run, every recommendation is scored
// against games played in that position only, so a support item is no longer
// diluted by the hero's core games. A position with too small a sample falls
// back to the pooled numbers and keeps the softer "rare?" label.
//
// Usage: node scripts/check-curated.mjs [--hero <key>] [--strict] [--json]
//        node scripts/check-curated.mjs --all-pos   (ignore per-position data)
import fs from "node:fs";
import { HEROES } from "../src/data/builds.ts";
import { HERO_POSITIONS } from "../src/data/heroPositions.ts";

const RARE = 0.04; // recommended but bought by <4% of the bucket leader
const POPULAR = 0.45; // bought by >45% of the bucket leader but never recommended

const args = process.argv.slice(2);
const only = args.includes("--hero") ? args[args.indexOf("--hero") + 1] : null;
const asJson = args.includes("--json");
const quiet = args.includes("--strict"); // only the flags that are worth acting on
const ignorePos = args.includes("--all-pos");

/**
 * A position needs this many games before its own numbers beat the pooled ones.
 * The fetcher drops item counts below 3, so in a thin sample a real item reads
 * as a flat 0% — "no data" and "nobody buys it" look the same below this line.
 */
const MIN_POS_GAMES = 60;
/**
 * There is deliberately no minimum share of the hero's games here. A position
 * the hero is rarely played in still answers the question this script asks —
 * what does it buy when it IS played there. build-derived.mjs keeps a share bar
 * because showing a build for a position nobody plays is a different mistake.
 *
 * This only holds while the fetcher keeps low purchase counts (--min 1). At
 * --min 3 a position with a couple of hundred games read normal picks as 0%,
 * and every flag that came out of it was wrong.
 */

const heroes = JSON.parse(fs.readFileSync("src/data/heroes.json", "utf8"));
const items = JSON.parse(fs.readFileSync("src/data/items.json", "utf8"));
const raw = JSON.parse(fs.readFileSync("src/data/generated/item-popularity-raw.json", "utf8"));
const constants = JSON.parse(fs.readFileSync("src/data/generated/items-raw.json", "utf8"));

const POS_FILE = "src/data/generated/position-items-raw.json";
const posRaw =
  !ignorePos && fs.existsSync(POS_FILE)
    ? JSON.parse(fs.readFileSync(POS_FILE, "utf8"))
    : null;

const itemById = new Map(items.map((i) => [i.id, i.key]));
const nameOf = new Map(items.map((i) => [i.key, i.name]));
const heroName = new Map(heroes.map((h) => [h.key, h.name]));

/** Components exist inside finished items; counting them tells you nothing. */
const COMPONENTS = new Set();
for (const v of Object.values(constants)) for (const c of v.components ?? []) COMPONENTS.add(c);
/** ...except these, which people also keep as-is. */
const COMPONENT_BUT_FINAL = new Set([
  "blink", "travel_boots", "power_treads", "phase_boots", "arcane_boots", "tranquil_boots",
  "vanguard", "kaya", "maelstrom", "diffusal_blade", "medallion_of_courage", "echo_sabre",
  "helm_of_the_dominator", "orchid", "veil_of_discord", "rod_of_atos", "mask_of_madness",
  "vladmir", "pipe", "solar_crest", "crimson_guard", "force_staff", "aether_lens", "glimmer_cape",
  "ghost", "cyclone", "wind_waker", "desolator", "basher", "invis_sword", "witch_blade",
  "ancient_janggo", "boots_of_bearing", "spirit_vessel", "holy_locket", "mekansm",
  "guardian_greaves", "shivas_guard", "lotus_orb", "bloodstone", "eternal_shroud",
  "hand_of_midas", "helm_of_the_overlord", "dragon_lance", "urn_of_shadows", "sange", "yasha",
  "ultimate_scepter", "magic_wand", "pavise",
]);
/** Which boots a hero buys is its own question — see scripts/check-boots.mjs. */
const BOOTS = new Set(["power_treads", "phase_boots", "arcane_boots", "tranquil_boots", "travel_boots"]);

function isBuildItem(key) {
  return !COMPONENTS.has(key) || COMPONENT_BUT_FINAL.has(key);
}

/**
 * purchase_log records the moment an item is bought, so a hero on the way to
 * Sange and Yasha shows up buying Sange and Yasha separately. Flagging those as
 * items we forgot would be wrong when the finished item is already in the guide.
 */
const partsOf = new Map(Object.entries(constants).map(([k, v]) => [k, v.components ?? []]));
function withParts(keys) {
  const out = new Set();
  const walk = (key) => {
    for (const part of partsOf.get(key) ?? []) {
      if (out.has(part)) continue;
      out.add(part);
      walk(part);
    }
  };
  for (const key of keys) walk(key);
  return out;
}

/** Items whose purchase counts say nothing useful about a build. */
const IGNORE = new Set([
  "tango", "clarity", "flask", "enchanted_mango", "faerie_fire", "tpscroll", "ward_observer",
  "ward_sentry", "ward_dispenser", "smoke_of_deceit", "dust", "tome_of_knowledge", "cheese",
  "branches", "gauntlets", "slippers", "circlet", "mantle", "crown", "robe", "belt_of_strength",
  "boots_of_elves", "blades_of_attack", "chainmail", "helm_of_iron_will", "broadsword", "gloves",
  "quarterstaff", "ring_of_regen", "sobi_mask", "blood_grenade", "infused_raindrop", "boots",
  "magic_stick", "quelling_blade", "orb_of_venom", "ring_of_protection", "blight_stone",
  "observer_and_sentry_wards", "aghanims_shard_roshan", "ultimate_scepter_roshan", "famango",
  "great_famango", "greater_famango", "refresher_shard", "bottle", "magic_wand", "wraith_band",
  "null_talisman", "bracer", "soul_ring", "ring_of_basilius", "tome_of_aghanim", "aegis",
  "wind_lace", "gem", "cornucopia", "pocket_roshan", "ancient_guardian", "trident",
]);

/** share of each item, per bucket, relative to that bucket's most-bought item */
function shares(heroKey) {
  const pop = raw[heroKey];
  const out = new Map();
  if (!pop) return out;
  for (const bucket of Object.values(pop)) {
    if (!bucket) continue;
    const rows = Object.entries(bucket)
      .map(([id, count]) => [itemById.get(Number(id)), count])
      .filter(([key]) => key && !IGNORE.has(key) && isBuildItem(key));
    const max = Math.max(1, ...rows.map(([, c]) => c));
    for (const [key, count] of rows) {
      out.set(key, Math.max(out.get(key) ?? 0, count / max));
    }
  }
  return out;
}

/**
 * Same measure, but over the games where the hero was played in one position.
 * Source keys come from purchase_log, so they are item keys already — no id
 * lookup — and recipes are dropped because buying one is part of the item.
 * Returns Map<pos, { games, share: Map<item, number> }>.
 */
function posShares(heroKey) {
  const out = new Map();
  const byPos = posRaw?.heroes?.[heroKey];
  if (!byPos) return out;
  for (const [pos, data] of Object.entries(byPos)) {
    const share = new Map();
    for (const [phase, bucket] of Object.entries(data)) {
      if (phase === "games") continue;
      const rows = Object.entries(bucket).filter(
        ([key]) => !key.startsWith("recipe_") && !IGNORE.has(key) && isBuildItem(key),
      );
      const max = Math.max(1, ...rows.map(([, c]) => c));
      for (const [key, count] of rows) {
        share.set(key, Math.max(share.get(key) ?? 0, count / max));
      }
    }
    out.set(Number(pos), { games: data.games ?? 0, share });
  }
  return out;
}

/** every item our own data recommends for a hero, with where it came from */
function recommended(heroKey) {
  const out = new Map();
  const byPos = new Map();
  /** positions where a hand-written build replaces the measured item list */
  const handWritten = new Set();
  const note = (item, where) => {
    if (IGNORE.has(item)) return;
    const cur = out.get(item) ?? new Set();
    cur.add(where);
    out.set(item, cur);
    const pos = Number(where.slice(3, 4));
    if (!byPos.has(pos)) byPos.set(pos, new Set());
    byPos.get(pos).add(item);
  };

  const curated = HEROES.find((h) => h.key === heroKey);
  for (const b of curated?.builds ?? []) {
    handWritten.add(b.pos);
    for (const i of b.early) note(i, `pos${b.pos} early`);
    for (const i of b.core) note(i, `pos${b.pos} core`);
    for (const s of b.situational) note(s.item, `pos${b.pos} situational`);
  }
  for (const info of HERO_POSITIONS.get(heroKey) ?? []) {
    for (const i of info.adds) note(i, `pos${info.pos} adds`);
  }
  return { items: out, byPos, handWritten };
}

const report = [];
for (const hero of heroes) {
  if (only && hero.key !== only) continue;
  const share = shares(hero.key);
  if (share.size === 0) continue;
  const rec = recommended(hero.key);
  if (rec.items.size === 0) continue;

  const perPos = posShares(hero.key);
  const totalGames = [...perPos.values()].reduce((n, p) => n + p.games, 0);
  const sampled = (pos) => {
    const p = perPos.get(pos);
    return p && p.games >= MIN_POS_GAMES ? p : null;
  };

  const rare = [];
  for (const [item, where] of rec.items) {
    if (BOOTS.has(item)) continue;
    const sources = [...where];
    const positions = [...new Set(sources.map((w) => Number(w.slice(3, 4))))];

    // Score against the positions we actually recommend the item for. Without a
    // big enough sample there we fall back to the pooled number, which mixes
    // every position of this hero together.
    const measured = positions.map(sampled).filter(Boolean);
    const pooled = measured.length === 0;
    const s = pooled
      ? (share.get(item) ?? 0)
      : Math.max(...measured.map((p) => p.share.get(item) ?? 0));
    if (s >= RARE) continue;

    // A pos 4/5 item judged on pooled numbers is diluted by this hero's core
    // games, so it stays a softer signal than a core-slot mismatch. With a
    // per-position sample that dilution is gone and the flag is real.
    const supportOnly =
      pooled && sources.every((w) => w.startsWith("pos4") || w.startsWith("pos5"));
    // a situational pick is conditional by design (MKB only against evasion),
    // so a low purchase rate is expected and proves nothing
    const situationalOnly = sources.every((w) => w.endsWith("situational"));
    const scope = pooled
      ? `all pos — ${positions.map((x) => `pos${x}:${perPos.get(x)?.games ?? 0}g`).join(" ")}`
      : positions.filter((x) => sampled(x)).map((x) => `pos${x}`).join("/");
    rare.push({ item, share: s, where: sources.join(", "), scope, supportOnly, situationalOnly });
  }

  // Popular-but-unmentioned is only a gap where a hand-written build is what the
  // site shows. Everywhere else the measured list for that position is shown as
  // it is, so a popular item is already in front of the reader.
  const missing = new Map();
  const consider = (item, s, scope) => {
    if (s < POPULAR || BOOTS.has(item)) return;
    const cur = missing.get(item);
    if (!cur || s > cur.share) missing.set(item, { item, share: s, scope });
  };
  const anySample = [...perPos.keys()].some((pos) => sampled(pos));
  if (anySample) {
    for (const [pos, data] of perPos) {
      if (!sampled(pos) || !rec.handWritten.has(pos)) continue;
      const recHere = rec.byPos.get(pos) ?? new Set();
      const partsHere = withParts(recHere);
      for (const [item, s] of data.share) {
        if (recHere.has(item) || partsHere.has(item) || IGNORE.has(item)) continue;
        consider(item, s, `pos${pos}`);
      }
    }
  } else {
    for (const [item, s] of share) {
      if (!rec.items.has(item)) consider(item, s, "all pos");
    }
  }

  if (rare.length || missing.size) {
    report.push({
      hero: hero.key,
      name: hero.name,
      positions: Object.fromEntries([...perPos].map(([pos, p]) => [pos, p.games])),
      sampled: [...perPos.keys()].filter((pos) => sampled(pos)),
      rare: rare.sort((a, b) => a.share - b.share),
      missing: [...missing.values()].sort((a, b) => b.share - a.share),
    });
  }
}

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  const pct = (n) => `${(n * 100).toFixed(0)}%`.padStart(4);
  for (const r of report) {
    const tier = (x) => (x.situationalOnly ? "cond?  " : x.supportOnly ? "rare?  " : "RARE   ");
    const rank = (x) => (x.situationalOnly ? 2 : x.supportOnly ? 1 : 0);
    const lines = [
      ...(quiet ? r.rare.filter((x) => rank(x) === 0) : [...r.rare].sort((a, b) => rank(a) - rank(b))).map(
        (x) => `  ${tier(x)} ${pct(x.share)}  ${nameOf.get(x.item) ?? x.item}  [${x.where} · measured on ${x.scope}]`,
      ),
      ...(quiet ? [] : r.missing.slice(0, 5).map((x) => `  MISSING ${pct(x.share)}  ${nameOf.get(x.item) ?? x.item}  [${x.scope}]`)),
    ];
    if (lines.length === 0) continue;
    const sample = Object.entries(r.positions)
      .filter(([pos]) => r.sampled.includes(Number(pos)))
      .map(([pos, g]) => `pos${pos}:${g}`)
      .join(" ");
    console.log(`\n${r.name}${sample ? `  (${sample} games)` : ""}`);
    for (const l of lines) console.log(l);
  }
  const strong = report.reduce((n, r) => n + r.rare.filter((x) => !x.supportOnly && !x.situationalOnly).length, 0);
  const soft = report.reduce((n, r) => n + r.rare.filter((x) => x.supportOnly).length, 0);
  const cond = report.reduce((n, r) => n + r.rare.filter((x) => x.situationalOnly && !x.supportOnly).length, 0);
  const missing = report.reduce((n, r) => n + r.missing.length, 0);
  console.log(
    `\n${report.length} heroes flagged · ${strong} RARE on a core slot · ${soft} rare? cannot be judged (thin sample) · ${cond} cond? situational · ${missing} popular items we never mention`,
  );
  console.log(`thresholds: RARE < ${pct(RARE).trim()} · MISSING > ${pct(POPULAR).trim()} of the bucket leader`);
  console.log("MISSING only covers positions with a hand-written build — elsewhere the measured list is what the site shows");
  console.log("boots are not counted here — run: node scripts/check-boots.mjs");
  console.log(
    `rare? = the position has under ${MIN_POS_GAMES} league games, so this falls back to the hero's pooled numbers and cannot be judged · cond? = situational by design · --strict shows only RARE`,
  );
  if (posRaw) {
    console.log(
      `per-position data: ${posRaw.poolMatches} league matches over ${posRaw.days} days · a position needs ${MIN_POS_GAMES} games, else it falls back to pooled numbers`,
    );
  } else {
    console.log("no per-position data — run: node scripts/fetch-position-items.mjs");
  }
}
void heroName;

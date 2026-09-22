// Derives the item lists the site shows from the cached raw OpenDota popularity
// data, plus the hero-vs-hero winrate matrix. Runs entirely offline.
// Usage: node scripts/build-derived.mjs
import fs from "node:fs";

const GEN = "src/data/generated";
const MIN_GAMES = 50;
/**
 * A position gets its own item list only with a real sample behind it. Position
 * is inferred from gold rank, so every hero picks up a thin tail of positions it
 * is not really played in — both bars have to clear, same as check-curated.mjs.
 */
const MIN_POS_GAMES = 60;
const MIN_POS_SHARE = 0.1;

const heroes = JSON.parse(fs.readFileSync("src/data/heroes.json", "utf8"));
const items = JSON.parse(fs.readFileSync("src/data/items.json", "utf8"));
const constants = JSON.parse(fs.readFileSync(`${GEN}/items-raw.json`, "utf8"));
const raw = JSON.parse(fs.readFileSync(`${GEN}/item-popularity-raw.json`, "utf8"));
const POS_FILE = `${GEN}/position-items-raw.json`;
const posRaw = fs.existsSync(POS_FILE) ? JSON.parse(fs.readFileSync(POS_FILE, "utf8")) : null;
const matchups = JSON.parse(fs.readFileSync(`${GEN}/matchups.json`, "utf8"));

const itemById = new Map(items.map((i) => [i.id, i.key]));
const costOf = new Map(items.map((i) => [i.key, i.cost]));

/** Anything that only exists to be built into something else. */
const COMPONENTS = new Set();
for (const v of Object.values(constants)) for (const c of v.components ?? []) COMPONENTS.add(c);

/** Components that are also perfectly normal final items. */
const KEEP = new Set([
  "blink", "travel_boots", "power_treads", "phase_boots", "arcane_boots", "tranquil_boots",
  "magic_wand", "urn_of_shadows", "vanguard", "kaya", "yasha", "sange", "maelstrom",
  "dragon_lance", "diffusal_blade", "medallion_of_courage", "helm_of_the_dominator",
  "echo_sabre", "orchid", "veil_of_discord", "rod_of_atos", "mask_of_madness", "vladmir",
  "pipe", "hood_of_defiance", "solar_crest", "crimson_guard", "force_staff", "aether_lens",
  "glimmer_cape", "ghost", "cyclone", "wind_waker", "desolator", "basher", "invis_sword",
  "witch_blade", "falcon_blade", "pavise", "ancient_janggo", "boots_of_bearing", "spirit_vessel",
  "holy_locket", "mekansm", "guardian_greaves", "shivas_guard", "lotus_orb", "bloodstone",
  "eternal_shroud", "hand_of_midas", "helm_of_the_overlord", "talisman_of_evasion", "wraith_band",
  "null_talisman", "bracer", "soul_ring", "ring_of_basilius", "drum_of_endurance",
]);

/** Consumables and shop trash that say nothing about a build. */
const NOISE = new Set([
  "tango", "clarity", "flask", "enchanted_mango", "faerie_fire", "tpscroll", "ward_observer",
  "ward_sentry", "ward_dispenser", "smoke_of_deceit", "dust", "tome_of_knowledge", "cheese",
  "refresher_shard", "aghanims_shard_roshan", "ultimate_scepter_roshan", "famango",
  "great_famango", "greater_famango", "blood_grenade", "infused_raindrop", "bottle",
  "ancient_guardian", "aegis", "tome_of_aghanim", "cornucopia", "pocket_roshan", "trident",
]);

function keep(key, { allowCheap = false } = {}) {
  if (!key || NOISE.has(key)) return false;
  if (COMPONENTS.has(key) && !KEEP.has(key)) return false;
  if (!allowCheap && (costOf.get(key) ?? 0) < 500) return false;
  return true;
}

function top(bucket, n, opts) {
  if (!bucket) return [];
  return Object.entries(bucket)
    .map(([id, count]) => [itemById.get(Number(id)), count])
    .filter(([key]) => keep(key, opts))
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([key]) => key);
}

// --- item lists -------------------------------------------------------------
const builds = {};
for (const hero of heroes) {
  const pop = raw[hero.key];
  if (!pop) continue;
  builds[hero.key] = {
    starting: top(pop.start_game_items, 5, { allowCheap: true }),
    early: top(pop.early_game_items, 5, { allowCheap: true }),
    mid: top(pop.mid_game_items, 6),
    late: top(pop.late_game_items, 6),
  };
}
fs.writeFileSync(`${GEN}/item-popularity.json`, JSON.stringify(builds));

// --- the same lists, but per position ---------------------------------------
// position-items-raw.json comes from purchase_log, so its keys are item keys and
// a hero on the way to a bigger item shows up buying the parts. keep() drops
// those the same way it drops them from the pooled lists.
function topKeys(bucket, n, opts) {
  if (!bucket) return [];
  return Object.entries(bucket)
    .filter(([key]) => !key.startsWith("recipe_") && keep(key, opts))
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([key]) => key);
}

const posBuilds = {};
if (posRaw) {
  for (const [heroKey, byPos] of Object.entries(posRaw.heroes)) {
    const total = Object.values(byPos).reduce((n, p) => n + (p.games ?? 0), 0);
    const kept = {};
    for (const [pos, data] of Object.entries(byPos)) {
      if (data.games < MIN_POS_GAMES || data.games < total * MIN_POS_SHARE) continue;
      kept[pos] = {
        games: data.games,
        starting: topKeys(data.starting, 5, { allowCheap: true }),
        early: topKeys(data.early, 5, { allowCheap: true }),
        mid: topKeys(data.mid, 6),
        late: topKeys(data.late, 6),
      };
    }
    if (Object.keys(kept).length) posBuilds[heroKey] = kept;
  }
}
fs.writeFileSync(`${GEN}/position-builds.json`, JSON.stringify(posBuilds));

// --- items a player can actually buy and keep -------------------------------
/** Cheap items that still matter when the enemy has one. */
const CHEAP_KEEP = new Set([
  "ward_sentry", "dust", "gem", "magic_wand", "urn_of_shadows", "medallion_of_courage",
  "blight_stone", "wraith_band", "null_talisman", "bracer", "soul_ring", "ring_of_basilius",
  "tranquil_boots", "arcane_boots", "phase_boots", "power_treads", "boots", "quelling_blade",
  "orb_of_corrosion", "falcon_blade", "pavise",
]);

/** Duplicate tiers, Roshan drops and mode-only items nobody picks from a list. */
const NOT_PICKABLE = new Set([
  "cheese", "pocket_roshan", "aegis", "aghanims_shard_roshan", "ultimate_scepter_roshan",
  "refresher_shard", "ultimate_scepter_2", "travel_boots_2", "dagon_2", "dagon_3", "dagon_4",
  "diffusal_blade_2", "necronomicon", "necronomicon_2", "necronomicon_3", "desolator_2",
  "trident", "cornucopia", "tome_of_aghanim", "ancient_guardian", "talisman_of_evasion",
  "boots", "quelling_blade", "dagon",
]);

const pickable = items
  .filter((i) => {
    if (NOT_PICKABLE.has(i.key) || NOISE.has(i.key)) return false;
    if (CHEAP_KEEP.has(i.key)) return true;
    if (COMPONENTS.has(i.key) && !KEEP.has(i.key)) return false;
    return i.cost >= 900;
  })
  .map((i) => i.key)
  .sort();
fs.writeFileSync(`${GEN}/pickable-items.json`, JSON.stringify(pickable));

// --- winrate matrix ---------------------------------------------------------
const keys = heroes.map((h) => h.key).filter((k) => matchups[k]);
const index = new Map(keys.map((k, i) => [k, i]));
const wr = keys.map((k) => {
  const row = new Array(keys.length).fill(0);
  for (const m of matchups[k] ?? []) {
    if (m.games < MIN_GAMES) continue;
    const j = index.get(m.hero);
    if (j != null) row[j] = Math.round(m.winrate * 1000);
  }
  return row;
});
fs.writeFileSync(`${GEN}/matrix.json`, JSON.stringify({ keys, wr }));

console.log(
  `items: ${Object.keys(builds).length} heroes · per-position: ${Object.keys(posBuilds).length} heroes · matrix: ${keys.length} x ${keys.length}`,
);

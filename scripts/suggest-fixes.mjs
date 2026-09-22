// Proposes a replacement for every RARE flag: the most-bought item on that hero
// that our guide for the position does not already list. Output is a review
// list, not an auto-fix.
//
// Suggestions come from position-items-raw.json when that position has its own
// sample, so a pos 5 is offered pos 5 items instead of the hero's core build.
// Without that file it falls back to the hero's pooled popularity, where a hero
// that is rarely played in the flagged position will suggest items from the
// position it is actually played in — a human has to catch those.
// Usage: node scripts/suggest-fixes.mjs
import fs from "node:fs";
import { execSync } from "node:child_process";
import { HEROES } from "../src/data/builds.ts";
import { HERO_POSITIONS } from "../src/data/heroPositions.ts";

const items = JSON.parse(fs.readFileSync("src/data/items.json", "utf8"));
const raw = JSON.parse(fs.readFileSync("src/data/generated/item-popularity-raw.json", "utf8"));
const constants = JSON.parse(fs.readFileSync("src/data/generated/items-raw.json", "utf8"));
const POS_FILE = "src/data/generated/position-items-raw.json";
const posRaw = fs.existsSync(POS_FILE) ? JSON.parse(fs.readFileSync(POS_FILE, "utf8")) : null;

const itemById = new Map(items.map((i) => [i.id, i.key]));
const costOf = new Map(items.map((i) => [i.key, i.cost]));

const COMPONENTS = new Set();
for (const v of Object.values(constants)) for (const c of v.components ?? []) COMPONENTS.add(c);
const KEEP = new Set([
  "blink", "travel_boots", "vanguard", "kaya", "maelstrom", "diffusal_blade", "echo_sabre",
  "helm_of_the_dominator", "orchid", "veil_of_discord", "rod_of_atos", "mask_of_madness",
  "vladmir", "pipe", "solar_crest", "crimson_guard", "force_staff", "aether_lens", "glimmer_cape",
  "ghost", "cyclone", "wind_waker", "desolator", "basher", "invis_sword", "witch_blade",
  "ancient_janggo", "boots_of_bearing", "spirit_vessel", "holy_locket", "mekansm", "medallion_of_courage",
  "guardian_greaves", "shivas_guard", "lotus_orb", "bloodstone", "eternal_shroud", "hand_of_midas",
  "helm_of_the_overlord", "dragon_lance", "urn_of_shadows", "ultimate_scepter", "aghanims_shard",
  "pavise",
]);
const JUNK = new Set([
  "tango", "clarity", "flask", "enchanted_mango", "faerie_fire", "tpscroll", "ward_observer",
  "ward_sentry", "ward_dispenser", "smoke_of_deceit", "dust", "tome_of_knowledge", "branches",
  "magic_stick", "magic_wand", "bracer", "wraith_band", "null_talisman", "soul_ring", "boots",
  "quelling_blade", "blood_grenade", "infused_raindrop", "ring_of_basilius", "bottle", "wind_lace",
  "ring_of_protection", "blight_stone", "orb_of_venom", "cheese", "aegis", "power_treads",
  "phase_boots", "arcane_boots", "tranquil_boots", "sange", "yasha", "kaya", "gem",
  "cornucopia", "pocket_roshan", "ancient_guardian", "trident",
]);
/** Only used when we have no per-position sample and have to guess. */
const SUPPORT_ONLY = new Set([
  "glimmer_cape", "pavise", "holy_locket", "mekansm", "guardian_greaves", "boots_of_bearing",
  "ancient_janggo", "urn_of_shadows", "spirit_vessel", "wraith_pact", "solar_crest",
]);
/** Same bar the site uses — cheap filler is not a build decision. */
const MIN_COST = 500;

const ok = (k) =>
  k && !JUNK.has(k) && !k.startsWith("recipe_") && (costOf.get(k) ?? 0) >= MIN_COST &&
  (!COMPONENTS.has(k) || KEEP.has(k));

/** same bar check-curated.mjs uses to call a position measured */
const MIN_POS_GAMES = 60;

function posBuckets(heroKey, pos) {
  const byPos = posRaw?.heroes?.[heroKey];
  if (!byPos) return null;
  const here = byPos[pos];
  if (!here || here.games < MIN_POS_GAMES) return null;
  return [here.mid, here.late];
}

/** best items for a hero, mid and late buckets merged, share 0..1 */
function ranked(heroKey, pos) {
  const out = new Map();
  const scoped = posBuckets(heroKey, pos);
  const buckets = scoped
    ? scoped.map((b) => Object.entries(b))
    : ["mid_game_items", "late_game_items"].map((name) =>
        Object.entries(raw[heroKey]?.[name] ?? {}).map(([id, c]) => [itemById.get(Number(id)), c]),
      );
  for (const rows of buckets) {
    const usable = rows.filter(([k]) => ok(k));
    const max = Math.max(1, ...usable.map(([, c]) => c));
    for (const [k, c] of usable) out.set(k, Math.max(out.get(k) ?? 0, c / max));
  }
  return { measured: Boolean(scoped), list: [...out.entries()].sort((a, b) => b[1] - a[1]) };
}

const flags = JSON.parse(
  execSync("node scripts/check-curated.mjs --json", { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }),
);

for (const r of flags) {
  const hard = r.rare.filter((x) => !x.situationalOnly && !x.supportOnly);
  if (hard.length === 0) continue;
  const curated = HEROES.find((h) => h.key === r.hero);
  const infos = HERO_POSITIONS.get(r.hero) ?? [];

  for (const flag of hard) {
    const posMatch = flag.where.match(/pos(\d)/);
    const pos = posMatch ? Number(posMatch[1]) : 3;
    const best = ranked(r.hero, pos);
    const mine = new Set([
      ...(infos.find((i) => i.pos === pos)?.adds ?? []),
      ...(curated?.builds.find((b) => b.pos === pos)?.core ?? []),
    ]);
    const picks = best.list
      .filter(([k]) => !mine.has(k) && k !== flag.item)
      // with a real pos sample the data already says what that position buys
      .filter(([k]) => best.measured || pos >= 4 || !SUPPORT_ONLY.has(k))
      .slice(0, 4)
      .map(([k, s]) => `${k}(${Math.round(s * 100)})`);
    const slot = flag.where.includes("core") ? "core" : "adds";
    const src = best.measured ? "" : "  ~pooled";
    console.log(`${r.hero} pos${pos} ${slot}: -${flag.item} → ${picks.join(" ")}${src}`);
  }
}

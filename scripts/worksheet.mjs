// Prints, for every hero the checker flagged, what we recommend next to what
// players actually buy — the input for fixing the curated data by hand.
// Usage: node scripts/worksheet.mjs [--hero <key>]
import fs from "node:fs";
import { execSync } from "node:child_process";
import { HEROES } from "../src/data/builds.ts";
import { HERO_POSITIONS } from "../src/data/heroPositions.ts";

const only = process.argv.includes("--hero") ? process.argv[process.argv.indexOf("--hero") + 1] : null;

const items = JSON.parse(fs.readFileSync("src/data/items.json", "utf8"));
const raw = JSON.parse(fs.readFileSync("src/data/generated/item-popularity-raw.json", "utf8"));
const constants = JSON.parse(fs.readFileSync("src/data/generated/items-raw.json", "utf8"));
const itemById = new Map(items.map((i) => [i.id, i.key]));

const COMPONENTS = new Set();
for (const v of Object.values(constants)) for (const c of v.components ?? []) COMPONENTS.add(c);
const KEEP = new Set([
  "blink", "travel_boots", "power_treads", "phase_boots", "arcane_boots", "tranquil_boots",
  "vanguard", "kaya", "maelstrom", "diffusal_blade", "medallion_of_courage", "echo_sabre",
  "helm_of_the_dominator", "orchid", "veil_of_discord", "rod_of_atos", "mask_of_madness",
  "vladmir", "pipe", "solar_crest", "crimson_guard", "force_staff", "aether_lens", "glimmer_cape",
  "ghost", "cyclone", "wind_waker", "desolator", "basher", "invis_sword", "witch_blade",
  "ancient_janggo", "boots_of_bearing", "spirit_vessel", "holy_locket", "mekansm",
  "guardian_greaves", "shivas_guard", "lotus_orb", "bloodstone", "eternal_shroud",
  "hand_of_midas", "helm_of_the_overlord", "dragon_lance", "urn_of_shadows", "sange", "yasha",
  "ultimate_scepter", "aghanims_shard",
]);
const JUNK = new Set([
  "tango", "clarity", "flask", "enchanted_mango", "faerie_fire", "tpscroll", "ward_observer",
  "ward_sentry", "ward_dispenser", "smoke_of_deceit", "dust", "tome_of_knowledge", "branches",
  "magic_stick", "magic_wand", "bracer", "wraith_band", "null_talisman", "soul_ring", "boots",
  "quelling_blade", "blood_grenade", "infused_raindrop", "ring_of_basilius", "bottle",
  "ring_of_protection", "blight_stone", "orb_of_venom", "wind_lace", "cheese", "aegis",
]);

const ok = (k) => k && !JUNK.has(k) && (!COMPONENTS.has(k) || KEEP.has(k));

function top(heroKey, bucket, n) {
  const b = raw[heroKey]?.[bucket];
  if (!b) return [];
  const rows = Object.entries(b)
    .map(([id, c]) => [itemById.get(Number(id)), c])
    .filter(([k]) => ok(k));
  const max = Math.max(1, ...rows.map(([, c]) => c));
  return rows
    .sort((a, b2) => b2[1] - a[1])
    .slice(0, n)
    .map(([k, c]) => `${k}(${Math.round((c / max) * 100)})`);
}

const flags = JSON.parse(
  execSync("node scripts/check-curated.mjs --json", { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }),
);

for (const r of flags) {
  if (only && r.hero !== only) continue;
  const hard = r.rare.filter((x) => !x.situationalOnly);
  if (hard.length === 0) continue;

  console.log(`\n### ${r.hero}`);
  console.log(`  flagged: ${hard.map((x) => `${x.item}(${Math.round(x.share * 100)}) [${x.where}]`).join(" ")}`);
  console.log(`  early : ${top(r.hero, "early_game_items", 6).join(" ")}`);
  console.log(`  mid   : ${top(r.hero, "mid_game_items", 8).join(" ")}`);
  console.log(`  late  : ${top(r.hero, "late_game_items", 8).join(" ")}`);

  const curated = HEROES.find((h) => h.key === r.hero);
  for (const b of curated?.builds ?? []) {
    console.log(`  ours pos${b.pos} core: ${b.core.join(" ")}`);
  }
  for (const info of HERO_POSITIONS.get(r.hero) ?? []) {
    console.log(`  ours pos${info.pos} adds: ${info.adds.join(" ")}`);
  }
}

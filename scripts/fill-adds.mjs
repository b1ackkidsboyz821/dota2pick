// Writes a patch for apply-adds-patch.mjs that tops up each position's `adds`
// from the items that position actually buys, for positions that have a
// measured sample in position-builds.json.
//
// `adds` means "what belongs to THIS position specifically", so an item the
// hero buys in every position is not an add — each candidate has to be more
// popular here than in the hero's other measured positions.
//
// Hand-written entries are kept as long as the data still backs them; only the
// ones the data cannot support are dropped, and the free slots are filled. Pass
// --replace to rebuild the list from the data instead.
//
// Output is a patch file to review, never applied on its own.
// Usage: node scripts/fill-adds.mjs [--out patch.json] [--all] [--replace]
import fs from "node:fs";
import { HERO_BY_KEY } from "../src/data/builds.ts";
import { HERO_POSITIONS } from "../src/data/heroPositions.ts";

const args = process.argv.slice(2);
const OUT = args.includes("--out") ? args[args.indexOf("--out") + 1] : "adds-patch.json";
/** by default leave positions that already have a hand-written build alone */
const ALL = args.includes("--all");
/** by default keep the existing adds the data still supports */
const REPLACE = args.includes("--replace");

const heroes = JSON.parse(fs.readFileSync("src/data/heroes.json", "utf8"));
const posRaw = JSON.parse(fs.readFileSync("src/data/generated/position-items-raw.json", "utf8"));
const built = JSON.parse(fs.readFileSync("src/data/generated/position-builds.json", "utf8"));
const items = JSON.parse(fs.readFileSync("src/data/items.json", "utf8"));
const constants = JSON.parse(fs.readFileSync("src/data/generated/items-raw.json", "utf8"));
const costOf = new Map(items.map((i) => [i.key, i.cost]));

const COMPONENTS = new Set();
for (const v of Object.values(constants)) for (const c of v.components ?? []) COMPONENTS.add(c);
const KEEP = new Set([
  "blink", "vanguard", "maelstrom", "diffusal_blade", "echo_sabre", "helm_of_the_dominator",
  "orchid", "veil_of_discord", "rod_of_atos", "mask_of_madness", "vladmir", "pipe", "solar_crest",
  "crimson_guard", "force_staff", "aether_lens", "glimmer_cape", "ghost", "cyclone", "wind_waker",
  "desolator", "basher", "invis_sword", "witch_blade", "ancient_janggo", "boots_of_bearing",
  "spirit_vessel", "holy_locket", "mekansm", "medallion_of_courage", "guardian_greaves",
  "shivas_guard", "lotus_orb", "bloodstone", "eternal_shroud", "hand_of_midas",
  "helm_of_the_overlord", "dragon_lance", "urn_of_shadows", "ultimate_scepter", "aghanims_shard",
  "pavise",
]);
/** boots and consumables are not what `adds` is for */
const SKIP = new Set([
  "power_treads", "phase_boots", "arcane_boots", "tranquil_boots", "travel_boots", "boots",
  "magic_wand", "wind_lace", "gem", "aegis", "cheese", "ultimate_scepter_2", "travel_boots_2",
  "cornucopia", "pocket_roshan", "ancient_guardian", "trident", "refresher_shard",
]);
const ADDS_PER_POS = 3;
const MIN_SHARE = 0.25; // below this the item is not a staple of the position

const ok = (k) =>
  k && !SKIP.has(k) && !k.startsWith("recipe_") && (costOf.get(k) ?? 0) >= 900 &&
  (!COMPONENTS.has(k) || KEEP.has(k));

/** share of each item in one position, relative to that position's leader */
function sharesFor(heroKey, pos) {
  const data = posRaw.heroes[heroKey]?.[pos];
  const out = new Map();
  if (!data) return out;
  for (const phase of ["mid", "late"]) {
    const rows = Object.entries(data[phase]).filter(([k]) => ok(k));
    const max = Math.max(1, ...rows.map(([, c]) => c));
    for (const [k, c] of rows) out.set(k, Math.max(out.get(k) ?? 0, c / max));
  }
  return out;
}

const patch = [];
const notes = [];
for (const hero of heroes) {
  const measured = built[hero.key];
  if (!measured) continue;
  const rows = HERO_POSITIONS.get(hero.key) ?? [];
  const curated = HERO_BY_KEY.get(hero.key);

  const shares = new Map();
  for (const pos of Object.keys(measured)) shares.set(Number(pos), sharesFor(hero.key, pos));

  for (const info of rows) {
    if (!shares.has(info.pos)) continue;
    if (!ALL && curated?.builds.some((b) => b.pos === info.pos)) continue;

    const here = shares.get(info.pos);
    const picks = [...here]
      .filter(([, s]) => s >= MIN_SHARE)
      .map(([item, s]) => {
        // how much this position leans on the item compared with the others
        const elsewhere = [...shares]
          .filter(([pos]) => pos !== info.pos)
          .map(([, m]) => m.get(item) ?? 0);
        const other = elsewhere.length ? Math.max(...elsewhere) : 0;
        return { item, s, edge: s - other };
      })
      .sort((a, b) => b.edge - a.edge || b.s - a.s)
      .slice(0, ADDS_PER_POS);

    const before = info.adds ?? [];
    const chosen = REPLACE
      ? picks
      : [
          // an existing pick survives on the strength of its own numbers
          ...before
            .filter((item) => (here.get(item) ?? 0) >= MIN_SHARE)
            .map((item) => ({ item, s: here.get(item), edge: 0, kept: true })),
          ...picks.filter((p) => !before.includes(p.item)),
        ].slice(0, Math.max(ADDS_PER_POS, before.length));
    const next = chosen.map((p) => p.item);
    if (next.length === 0) continue;
    if (next.length === before.length && next.every((x, i) => x === before[i])) continue;

    patch.push([hero.key, info.pos, next]);
    notes.push(
      `${hero.key} pos${info.pos} (${measured[info.pos].games}g): ${before.join(",") || "-"} → ` +
        chosen
        .map((p) =>
          p.kept
            ? `${p.item}(${Math.round(p.s * 100)}=)`
            : `${p.item}(${Math.round(p.s * 100)}/+${Math.round(p.edge * 100)})`,
        )
        .join(" "),
    );
  }
}

fs.writeFileSync(OUT, JSON.stringify(patch, null, 1));
for (const n of notes) console.log(n);
console.log(`\n${patch.length} rows → ${OUT}  (share% / edge over this hero's other positions · "=" was already there)`);

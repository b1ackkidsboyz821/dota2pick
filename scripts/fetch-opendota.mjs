// Pulls per-hero matchup winrates and item popularity from OpenDota.
// Free tier is rate limited, so requests are throttled and progress is saved
// after every hero — rerunning resumes where it stopped.
// Usage: node scripts/fetch-opendota.mjs [--force]
import fs from "node:fs";
import path from "node:path";

const OUT = "src/data/generated";
const DELAY_MS = 1400;
const FORCE = process.argv.includes("--force");
const heroes = JSON.parse(fs.readFileSync("src/data/heroes.json", "utf8"));
const items = JSON.parse(fs.readFileSync("src/data/items.json", "utf8"));
const itemById = new Map(items.map((i) => [i.id, i.key]));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, tries = 8) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url);
      if (res.status === 429 || res.status >= 500) {
        await sleep(5000 * (i + 1));
        continue;
      }
      if (!res.ok) throw new Error(res.status + " " + url);
      return await res.json();
    } catch (err) {
      lastErr = err;
      await sleep(3000 * (i + 1));
    }
  }
  throw lastErr ?? new Error("gave up: " + url);
}

/** Basics and consumables that say nothing about how a hero is built. */
const SKIP = new Set([
  "tango", "clarity", "flask", "enchanted_mango", "faerie_fire", "tpscroll",
  "ward_observer", "ward_sentry", "ward_dispenser", "smoke_of_deceit", "dust",
  "tome_of_knowledge", "branches", "gauntlets", "slippers", "circlet", "mantle",
  "belt_of_strength", "boots_of_elves", "robe", "crown", "ogre_axe", "blade_of_alacrity",
  "staff_of_wizardry", "blades_of_attack", "chainmail", "helm_of_iron_will", "broadsword",
  "quarterstaff", "gloves", "lifesteal", "ring_of_regen", "sobi_mask", "boots", "blight_stone",
  "cheese", "refresher_shard", "aghanims_shard_roshan", "ultimate_scepter_roshan", "famango",
  "great_famango", "greater_famango", "blood_grenade", "infused_raindrop", "ring_of_protection",
]);

function topItems(bucket, n, { skipBasics = true } = {}) {
  if (!bucket) return [];
  return Object.entries(bucket)
    .map(([id, count]) => [itemById.get(Number(id)), count])
    .filter(([key]) => Boolean(key))
    .filter(([key]) => !(skipBasics && SKIP.has(key)))
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([key]) => key);
}

function load(name) {
  const p = path.join(OUT, name);
  if (FORCE || !fs.existsSync(p)) return {};
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return {};
  }
}

fs.mkdirSync(OUT, { recursive: true });
const matchups = load("matchups.json");
const builds = load("item-popularity.json");

function save() {
  fs.writeFileSync(path.join(OUT, "matchups.json"), JSON.stringify(matchups));
  fs.writeFileSync(path.join(OUT, "item-popularity.json"), JSON.stringify(builds));
  fs.writeFileSync(
    path.join(OUT, "meta.json"),
    JSON.stringify(
      { fetchedAt: new Date().toISOString(), heroes: Object.keys(matchups).length },
      null,
      2,
    ),
  );
}

for (const [idx, hero] of heroes.entries()) {
  if (matchups[hero.key] && builds[hero.key]) {
    console.log(`[${idx + 1}/${heroes.length}] ${hero.name} — cached`);
    continue;
  }
  console.log(`[${idx + 1}/${heroes.length}] ${hero.name}`);

  const raw = await get(`https://api.opendota.com/api/heroes/${hero.id}/matchups`);
  // winrate = how often OUR hero wins when that hero is on the other side
  matchups[hero.key] = raw
    .filter((m) => m.games_played >= 20)
    .map((m) => {
      const other = heroes.find((h) => h.id === m.hero_id);
      return other
        ? { hero: other.key, games: m.games_played, winrate: +(m.wins / m.games_played).toFixed(4) }
        : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.winrate - a.winrate);
  await sleep(DELAY_MS);

  const pop = await get(`https://api.opendota.com/api/heroes/${hero.id}/itemPopularity`);
  builds[hero.key] = {
    starting: topItems(pop.start_game_items, 5, { skipBasics: false }),
    early: topItems(pop.early_game_items, 5),
    mid: topItems(pop.mid_game_items, 6),
    late: topItems(pop.late_game_items, 6),
  };
  save();
  await sleep(DELAY_MS);
}

save();
console.log("done");

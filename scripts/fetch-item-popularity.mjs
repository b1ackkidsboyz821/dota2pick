// Refetches raw item popularity for every hero and stores it unfiltered, so the
// item lists the site shows can be re-derived (see scripts/build-derived.mjs)
// without hitting the API again.
// Usage: node scripts/fetch-item-popularity.mjs [--force]
import fs from "node:fs";

const OUT = "src/data/generated/item-popularity-raw.json";
const DELAY_MS = 1400;
const FORCE = process.argv.includes("--force");
const heroes = JSON.parse(fs.readFileSync("src/data/heroes.json", "utf8"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let raw = {};
if (!FORCE && fs.existsSync(OUT)) raw = JSON.parse(fs.readFileSync(OUT, "utf8"));

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

for (const [idx, hero] of heroes.entries()) {
  if (raw[hero.key]) continue;
  console.log(`[${idx + 1}/${heroes.length}] ${hero.name}`);
  raw[hero.key] = await get(`https://api.opendota.com/api/heroes/${hero.id}/itemPopularity`);
  fs.writeFileSync(OUT, JSON.stringify(raw));
  await sleep(DELAY_MS);
}
console.log("done");

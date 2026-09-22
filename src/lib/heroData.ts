import matchupsJson from "@/data/generated/matchups.json";
import popularityJson from "@/data/generated/item-popularity.json";
import positionBuildsJson from "@/data/generated/position-builds.json";
import metaJson from "@/data/generated/meta.json";
import { HERO_BY_KEY } from "@/data/builds";
import { tagsOf } from "@/data/heroTags";
import { positionInfos } from "@/data/heroPositions";
import type { Hero, HeroMeta, Pos, Tag } from "@/data/types";
import { heroMeta } from "./dota";

type MatchupRow = { hero: string; games: number; winrate: number };
type GeneratedBuild = { starting: string[]; early: string[]; mid: string[]; late: string[] };

const MATCHUPS = matchupsJson as unknown as Record<string, MatchupRow[]>;
const POPULARITY = popularityJson as unknown as Record<string, GeneratedBuild>;

/**
 * What each position actually buys, measured on league games played in that
 * position (see scripts/fetch-position-items.mjs). Only positions with a real
 * sample are in here, so a hero or position missing from it falls back to the
 * pooled list plus the CORE_ONLY / SUPPORT_ONLY guesswork below.
 */
type PositionRow = GeneratedBuild & { games: number };
const POSITION_BUILDS = positionBuildsJson as unknown as Record<
  string,
  Record<string, PositionRow>
>;

export const DATA_FETCHED_AT = (metaJson as { fetchedAt: string }).fetchedAt;

/** Minimum sample size before a matchup is worth showing. */
const MIN_GAMES = 50;

export type MatchupInfo = {
  hero: string;
  why?: string;
  winrate?: number;
  games?: number;
};

export type HeroProfile = {
  key: string;
  meta: HeroMeta;
  tags: Tag[];
  positions: Pos[];
  curated?: Hero;
  generated?: GeneratedBuild;
  strongAgainst: MatchupInfo[];
  weakAgainst: MatchupInfo[];
};

function statMatchups(key: string) {
  const rows = (MATCHUPS[key] ?? []).filter((r) => r.games >= MIN_GAMES);
  const sorted = [...rows].sort((a, b) => b.winrate - a.winrate);
  return {
    strong: sorted.slice(0, 8),
    weak: sorted.slice(-8).reverse(),
  };
}

/** Curated entries first (they carry an explanation), then stat-only rows. */
function merge(
  key: string,
  curated: { hero: string; why: string }[] | undefined,
  rows: MatchupRow[],
  limit: number,
) {
  const all = MATCHUPS[key] ?? [];
  const out: MatchupInfo[] = [];
  const seen = new Set<string>();
  for (const c of curated ?? []) {
    const stat = all.find((r) => r.hero === c.hero);
    out.push({ hero: c.hero, why: c.why, winrate: stat?.winrate, games: stat?.games });
    seen.add(c.hero);
  }
  for (const r of rows) {
    if (seen.has(r.hero)) continue;
    out.push({ hero: r.hero, winrate: r.winrate, games: r.games });
    seen.add(r.hero);
    if (out.length >= limit) break;
  }
  return out.slice(0, limit);
}

/** Items nobody buys on a support slot, however popular they are on the core version. */
const CORE_ONLY = new Set([
  "bfury", "radiance", "hand_of_midas", "moon_shard", "butterfly", "greater_crit", "rapier",
  "satanic", "skadi", "mjollnir", "maelstrom", "abyssal_blade", "assault", "heart", "manta",
  "silver_edge", "desolator", "monkey_king_bar", "bloodthorn", "harpoon", "echo_sabre",
  "sange_and_yasha", "yasha_and_kaya", "armlet", "mask_of_madness", "dragon_lance",
  "hurricane_pike", "basher", "disperser", "swift_blink", "revenants_brooch", "octarine_core",
]);

/** Items that only make sense when you are the one buying for the team. */
const SUPPORT_ONLY = new Set([
  "glimmer_cape", "pavise", "holy_locket", "mekansm", "guardian_greaves", "boots_of_bearing",
  "ancient_janggo", "spirit_vessel", "urn_of_shadows", "wraith_pact",
]);

const SUPPORT_STARTING = ["tango", "branches", "blood_grenade", "ward_observer", "magic_stick"];

export type PositionBuild = {
  pos: Pos;
  role: string;
  note: string;
  source: "curated" | "measured" | "derived";
  starting: string[];
  early: string[];
  core: string[];
  late: string[];
  situational: { item: string; why: string }[];
  tips?: string;
  /** league games behind a "measured" build */
  games?: number;
};

function uniq(list: string[]) {
  return [...new Set(list)];
}

/**
 * One build per position the hero is played in. A hand-written build wins;
 * otherwise the popular item list is filtered for that position and the
 * position's own staples are put in front.
 */
export function getPositionBuilds(key: string): PositionBuild[] {
  const curated = HERO_BY_KEY.get(key);
  const pop = POPULARITY[key];
  const infos = positionInfos(key);

  const rows: PositionBuild[] = infos.map((info) => {
    const hand = curated?.builds.find((b) => b.pos === info.pos);
    if (hand) {
      return {
        pos: info.pos,
        role: hand.role,
        note: info.note,
        source: "curated",
        starting: hand.starting,
        early: hand.early,
        core: hand.core,
        late: [],
        situational: hand.situational,
        tips: hand.tips,
      };
    }

    const isSupport = info.pos >= 4;
    const measured = POSITION_BUILDS[key]?.[String(info.pos)];

    // With a measured list the position filter is redundant — the games already
    // are that position, so anything in the list belongs there.
    if (measured) {
      return {
        pos: info.pos,
        role: info.role,
        note: info.note,
        source: "measured",
        starting: measured.starting,
        early: measured.early.filter((i) => !info.drops.includes(i)),
        core: uniq([...info.adds, ...measured.mid.filter((i) => !info.drops.includes(i))]).slice(0, 7),
        late: measured.late.filter((i) => !info.drops.includes(i) && !info.adds.includes(i)),
        situational: [],
        games: measured.games,
      };
    }

    const drop = new Set([...info.drops, ...(isSupport ? CORE_ONLY : SUPPORT_ONLY)]);
    const allowed = (list: string[]) => list.filter((i) => !drop.has(i) || info.adds.includes(i));

    return {
      pos: info.pos,
      role: info.role,
      note: info.note,
      source: "derived",
      starting: isSupport ? SUPPORT_STARTING : (pop?.starting ?? []),
      early: allowed(pop?.early ?? []),
      core: uniq([...info.adds, ...allowed(pop?.mid ?? [])]).slice(0, 7),
      late: allowed(pop?.late ?? []).filter((i) => !info.adds.includes(i)),
      situational: [],
    };
  });

  // a hand-written build for a position the table does not list still gets shown
  for (const b of curated?.builds ?? []) {
    if (rows.some((r) => r.pos === b.pos)) continue;
    rows.push({
      pos: b.pos,
      role: b.role,
      note: "",
      source: "curated",
      starting: b.starting,
      early: b.early,
      core: b.core,
      late: [],
      situational: b.situational,
      tips: b.tips,
    });
  }

  return rows.sort((a, b) => a.pos - b.pos);
}

export function getProfile(key: string): HeroProfile | null {
  const meta = heroMeta(key);
  if (meta.id === -1) return null;
  const curated = HERO_BY_KEY.get(key);
  const { strong, weak } = statMatchups(key);
  return {
    key,
    meta,
    tags: curated?.tags ?? tagsOf(key),
    positions: getPositionBuilds(key).map((b) => b.pos),
    curated,
    generated: POPULARITY[key],
    strongAgainst: merge(key, curated?.strongAgainst, strong, 8),
    weakAgainst: merge(key, curated?.weakAgainst, weak, 8),
  };
}

export function hasStats(key: string) {
  return (MATCHUPS[key]?.length ?? 0) > 0;
}

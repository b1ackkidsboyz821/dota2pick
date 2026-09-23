import matchupsJson from "@/data/generated/matchups.json";
import { HERO_BY_KEY } from "@/data/builds";
import { tagsOf } from "@/data/heroTags";
import type { Hero, HeroMeta, Pos, Tag } from "@/data/types";
import { heroMeta } from "./dota";
import { getPositionBuilds, POPULARITY, type GeneratedBuild } from "./positionBuilds";

export { DATA_FETCHED_AT, getPositionBuilds } from "./positionBuilds";
export type { PositionBuild } from "./positionBuilds";

type MatchupRow = { hero: string; games: number; winrate: number };

const MATCHUPS = matchupsJson as unknown as Record<string, MatchupRow[]>;

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

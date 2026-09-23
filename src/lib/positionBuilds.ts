import popularityJson from "@/data/generated/item-popularity.json";
import positionBuildsJson from "@/data/generated/position-builds.json";
import metaJson from "@/data/generated/meta.json";
import { HERO_BY_KEY } from "@/data/builds";
import { positionInfos } from "@/data/heroPositions";
import { CORE_ONLY, SUPPORT_ONLY } from "@/data/itemSlots";
import type { Pos } from "@/data/types";

export type GeneratedBuild = { starting: string[]; early: string[]; mid: string[]; late: string[] };

export const POPULARITY = popularityJson as unknown as Record<string, GeneratedBuild>;

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

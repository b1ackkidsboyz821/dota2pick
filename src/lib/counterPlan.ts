import { ITEM_ANSWERS, ITEM_THREAT, TAG_COUNTERS, TAG_LABEL } from "@/data/counters";
import { tagsOf } from "@/data/heroTags";
import { positionInfos } from "@/data/heroPositions";
import { CORE_ONLY, SUPPORT_ONLY } from "@/data/itemSlots";
import type { Pos, Tag } from "@/data/types";
import matrixJson from "@/data/generated/matrix.json";
import { itemMeta } from "./dota";
import { getPositionBuilds } from "./positionBuilds";

const MATRIX = matrixJson as { keys: string[]; wr: number[][] };
const ROW = new Map(MATRIX.keys.map((k, i) => [k, i]));

/** Historical winrate of `hero` against `enemy`, or null when the pair has no sample. */
export function winrateVs(hero: string, enemy: string): number | null {
  const i = ROW.get(hero);
  const j = ROW.get(enemy);
  if (i == null || j == null) return null;
  const v = MATRIX.wr[i][j];
  return v > 0 ? v / 10 : null;
}

export type Phase = "early" | "mid" | "late";

export const PHASE_LABEL: Record<Phase, string> = {
  early: "ช่วงเลน / ต้นเกม",
  mid: "กลางเกม",
  late: "ปลายเกม",
};

/** What the hero we are playing can and does buy on the chosen slot. */
export type HeroBuildContext = {
  /** items already in this hero's build for that position */
  owned: Set<string>;
  /** the phase each owned item lands in */
  phaseOf: Map<string, Phase>;
  /** items that do not belong on this slot at all */
  blocked: Set<string>;
};

/**
 * Merges the hero's builds into one lookup. With no position chosen every
 * position the hero is played in counts, so nothing is filtered out early.
 */
export function buildContext(hero: string, pos: Pos | null): HeroBuildContext {
  const builds = getPositionBuilds(hero).filter((b) => pos == null || b.pos === pos);
  const owned = new Set<string>();
  const phaseOf = new Map<string, Phase>();

  const take = (list: string[], phase: Phase) => {
    for (const item of list) {
      owned.add(item);
      // an item that shows up in two phases is labelled with the earliest one
      if (!phaseOf.has(item)) phaseOf.set(item, phase);
    }
  };
  for (const b of builds) {
    take([...b.starting, ...b.early], "early");
    take(b.core, "mid");
    take([...b.late, ...b.situational.map((s) => s.item)], "late");
  }

  // An item is off-limits only when it is wrong for every slot under
  // consideration, so the per-slot sets are intersected rather than unioned.
  const slots = positionInfos(hero).filter((p) => pos == null || p.pos === pos);
  let blocked = new Set<string>();
  for (const [i, info] of slots.entries()) {
    const wrongHere = new Set(info.drops);
    for (const item of info.pos >= 4 ? CORE_ONLY : SUPPORT_ONLY) {
      if (!info.adds.includes(item)) wrongHere.add(item);
    }
    blocked = i === 0 ? wrongHere : new Set([...blocked].filter((item) => wrongHere.has(item)));
  }
  for (const item of owned) blocked.delete(item);

  return { owned, phaseOf, blocked };
}

/** Where an item lands when the hero's own build says nothing about it. */
function phaseByCost(item: string): Phase {
  const cost = itemMeta(item).cost;
  if (cost > 0 && cost < 1600) return "early";
  if (cost < 4000) return "mid";
  return "late";
}

export type Suggestion = {
  item: string;
  score: number;
  reasons: string[];
  phase: Phase;
  /** the hero already buys this — it is a reordering, not an extra item */
  inBuild: boolean;
};

export type CounterPlan = {
  /** threat tags present, most common first */
  threats: [Tag, number][];
  suggestions: Suggestion[];
  /** enemies our hero historically loses to, worst first */
  danger: { hero: string; wr: number }[];
};

/** Enemies that beat us count for more when weighing which threat to answer. */
const DANGER_WR = 50;

export function planCounters(opts: {
  hero: string | null;
  pos: Pos | null;
  enemies: string[];
  enemyItems: string[];
}): CounterPlan {
  const { hero, pos, enemies, enemyItems } = opts;

  const danger = hero
    ? enemies
        .map((e) => ({ hero: e, wr: winrateVs(hero, e) }))
        .filter((r): r is { hero: string; wr: number } => r.wr != null && r.wr < DANGER_WR)
        .sort((a, b) => a.wr - b.wr)
    : [];
  const dangerWeight = new Map(danger.map((d) => [d.hero, 1 + Math.min(1, (DANGER_WR - d.wr) / 10)]));

  const counts = new Map<Tag, number>();
  for (const k of enemies) {
    const w = dangerWeight.get(k) ?? 1;
    for (const t of tagsOf(k)) counts.set(t, (counts.get(t) ?? 0) + w);
  }
  for (const k of enemyItems) {
    for (const t of ITEM_THREAT[k] ?? []) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  const threats = [...counts.entries()].sort((a, b) => b[1] - a[1]);

  const ctx = hero ? buildContext(hero, pos) : null;

  const acc = new Map<string, Suggestion>();
  const add = (item: string, score: number, reason: string) => {
    if (ctx?.blocked.has(item)) return;
    const cur = acc.get(item) ?? {
      item,
      score: 0,
      reasons: [],
      phase: ctx?.phaseOf.get(item) ?? phaseByCost(item),
      inBuild: ctx?.owned.has(item) ?? false,
    };
    cur.score += score;
    if (!cur.reasons.includes(reason)) cur.reasons.push(reason);
    acc.set(item, cur);
  };

  for (const [tag, n] of threats) {
    for (const [i, pick] of (TAG_COUNTERS[tag] ?? []).entries()) {
      add(pick.item, n * (10 - i), `${TAG_LABEL[tag]}: ${pick.why}`);
    }
  }
  for (const it of enemyItems) {
    for (const [i, pick] of (ITEM_ANSWERS[it] ?? []).entries()) {
      add(pick.item, 12 - i, `ศัตรูมี ${itemMeta(it).name}: ${pick.why}`);
    }
  }

  // an item the hero buys anyway is the cheapest counter there is
  for (const s of acc.values()) if (s.inBuild) s.score *= 1.35;

  const suggestions = [...acc.values()].sort((a, b) => b.score - a.score).slice(0, 14);
  return { threats, suggestions, danger };
}

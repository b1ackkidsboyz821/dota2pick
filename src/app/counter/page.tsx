"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ITEM_ANSWERS, ITEM_THREAT, TAG_COUNTERS, TAG_LABEL } from "@/data/counters";
import { tagsOf } from "@/data/heroTags";
import type { Tag } from "@/data/types";
import matrixJson from "@/data/generated/matrix.json";
import pickableJson from "@/data/generated/pickable-items.json";
import { ALL_HEROES, COVERED, heroMeta, itemMeta } from "@/lib/dota";

const MATRIX = matrixJson as { keys: string[]; wr: number[][] };
const ROW = new Map(MATRIX.keys.map((k, i) => [k, i]));

/** Every item a player actually buys and keeps, cheapest first. */
const ALL_PICKABLE = (pickableJson as string[])
  .map((k) => itemMeta(k))
  .sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name));

function hasAdvice(key: string) {
  return Boolean(ITEM_ANSWERS[key] || ITEM_THREAT[key]);
}

/** Items that most often change how you build against them. */
const COMMON_ITEMS = [
  "black_king_bar", "blink", "butterfly", "heart", "satanic", "blade_mail", "manta",
  "sheepstick", "silver_edge", "desolator", "radiance", "pipe", "assault", "crimson_guard",
  "ghost", "sphere", "nullifier", "aeon_disk",
];

type Suggestion = { item: string; score: number; reasons: string[] };

export default function CounterPage() {
  const [enemies, setEnemies] = useState<string[]>([]);
  const [enemyItems, setEnemyItems] = useState<string[]>([]);
  const [q, setQ] = useState("");
  const [itemQ, setItemQ] = useState("");
  const [showAllItems, setShowAllItems] = useState(false);

  const pool = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return ALL_HEROES.filter((m) => !needle || m.name.toLowerCase().includes(needle));
  }, [q]);

  function toggleHero(key: string) {
    setEnemies((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : prev.length >= 5 ? prev : [...prev, key],
    );
  }

  function toggleItem(key: string) {
    setEnemyItems((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  const itemList = useMemo(() => {
    const needle = itemQ.trim().toLowerCase();
    if (needle) return ALL_PICKABLE.filter((i) => i.name.toLowerCase().includes(needle));
    if (showAllItems) return ALL_PICKABLE;
    return COMMON_ITEMS.map((k) => itemMeta(k));
  }, [itemQ, showAllItems]);

  /** Threats implied by the enemy heroes, plus the ones their items imply. */
  const tags = useMemo(() => {
    const counts = new Map<Tag, number>();
    for (const k of enemies) for (const t of tagsOf(k)) counts.set(t, (counts.get(t) ?? 0) + 1);
    for (const k of enemyItems) for (const t of ITEM_THREAT[k] ?? []) counts.set(t, (counts.get(t) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [enemies, enemyItems]);

  const suggestions = useMemo(() => {
    const acc = new Map<string, Suggestion>();
    const add = (item: string, score: number, reason: string) => {
      const cur = acc.get(item) ?? { item, score: 0, reasons: [] };
      cur.score += score;
      if (!cur.reasons.includes(reason)) cur.reasons.push(reason);
      acc.set(item, cur);
    };

    for (const [tag, n] of tags) {
      for (const [i, pick] of (TAG_COUNTERS[tag] ?? []).entries()) {
        add(pick.item, n * (10 - i), `${TAG_LABEL[tag]}: ${pick.why}`);
      }
    }
    for (const it of enemyItems) {
      for (const [i, pick] of (ITEM_ANSWERS[it] ?? []).entries()) {
        add(pick.item, 12 - i, `ศัตรูมี ${itemMeta(it).name}: ${pick.why}`);
      }
    }
    return [...acc.values()].sort((a, b) => b.score - a.score).slice(0, 14);
  }, [tags, enemyItems]);

  /** Heroes whose historical winrate against the selected enemies is highest. */
  const picks = useMemo(() => {
    if (enemies.length === 0) return [];
    const rows: { key: string; avg: number; vs: { hero: string; wr: number }[] }[] = [];
    for (const key of MATRIX.keys) {
      if (enemies.includes(key)) continue;
      const i = ROW.get(key)!;
      const vs: { hero: string; wr: number }[] = [];
      for (const e of enemies) {
        const j = ROW.get(e);
        if (j == null) continue;
        const v = MATRIX.wr[i][j];
        if (v > 0) vs.push({ hero: e, wr: v / 10 });
      }
      if (vs.length < enemies.length) continue;
      rows.push({ key, avg: vs.reduce((s, x) => s + x.wr, 0) / vs.length, vs });
    }
    return rows.sort((a, b) => b.avg - a.avg).slice(0, 10);
  }, [enemies]);

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)] p-5">
        <h1 className="text-xl font-bold">แก้ทางทีมฝั่งตรงข้าม</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          เลือกฮีโร่ฝั่งตรงข้าม (สูงสุด 5) และของที่เขาออก จะได้ทั้งฮีโร่ที่ควร pick และของที่ควรซื้อพร้อมเหตุผล
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">1. ฮีโร่ฝั่งตรงข้าม</h2>
            <span className="text-xs text-[var(--color-muted)]">{enemies.length}/5</span>
          </div>
          {enemies.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {enemies.map((k) => {
                const m = heroMeta(k);
                return (
                  <button
                    key={k}
                    onClick={() => toggleHero(k)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-accent)] bg-[var(--color-accent)]/15 px-2 py-1 text-xs"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.img} alt="" className="h-5 w-8 rounded-sm object-cover" />
                    {m.name} ✕
                  </button>
                );
              })}
            </div>
          )}
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ค้นหาฮีโร่..."
            className="mb-3 w-full rounded-md border border-[var(--color-line)] bg-[var(--color-panel2)] px-3 py-1.5 text-sm outline-none focus:border-[var(--color-accent)]"
          />
          <div className="grid max-h-80 grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4">
            {pool.map((m) => {
              const on = enemies.includes(m.key);
              return (
                <button
                  key={m.key}
                  onClick={() => toggleHero(m.key)}
                  className={`overflow-hidden rounded-md border text-left ${
                    on ? "border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]" : "border-[var(--color-line)]"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.img} alt={m.name} className="aspect-[16/9] w-full object-cover" />
                  <div className="truncate bg-[var(--color-panel2)] px-1.5 py-1 text-[11px]">{m.name}</div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)] p-4">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="font-semibold">2. ของที่ฝั่งตรงข้ามออก</h2>
            <span className="text-xs text-[var(--color-muted)]">{enemyItems.length} ชิ้น</span>
          </div>
          <p className="mb-3 text-xs text-[var(--color-muted)]">
            เลือกได้ทุกชิ้น ({ALL_PICKABLE.length} ไอเทม) · จุดสีส้ม = มีคำแนะนำแก้ทางเฉพาะ
          </p>

          {enemyItems.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {enemyItems.map((k) => {
                const it = itemMeta(k);
                return (
                  <button
                    key={k}
                    onClick={() => toggleItem(k)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-accent)] bg-[var(--color-accent)]/15 px-2 py-1 text-xs"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.img} alt="" className="h-5 w-7 rounded-sm object-cover" />
                    {it.name} ✕
                  </button>
                );
              })}
            </div>
          )}

          <div className="mb-3 flex gap-2">
            <input
              value={itemQ}
              onChange={(e) => setItemQ(e.target.value)}
              placeholder="ค้นหาไอเทม..."
              className="w-full rounded-md border border-[var(--color-line)] bg-[var(--color-panel2)] px-3 py-1.5 text-sm outline-none focus:border-[var(--color-accent)]"
            />
            <button
              onClick={() => setShowAllItems((v) => !v)}
              className="shrink-0 rounded-md border border-[var(--color-line)] bg-[var(--color-panel2)] px-2.5 py-1.5 text-xs text-[var(--color-muted)]"
            >
              {showAllItems ? "ที่เจอบ่อย" : "ทั้งหมด"}
            </button>
          </div>

          <div className="grid max-h-72 grid-cols-2 gap-1.5 overflow-y-auto pr-1 sm:grid-cols-3">
            {itemList.map((it) => {
              const on = enemyItems.includes(it.key);
              return (
                <button
                  key={it.key}
                  onClick={() => toggleItem(it.key)}
                  title={hasAdvice(it.key) ? it.name : `${it.name} — ยังไม่มีคำแนะนำเฉพาะ`}
                  className={`flex items-center gap-2 rounded-md border px-1.5 py-1 text-left text-[11px] ${
                    on
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]/15"
                      : "border-[var(--color-line)] bg-[var(--color-panel2)] text-[var(--color-muted)]"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.img} alt="" className="h-5 w-7 shrink-0 rounded-sm object-cover" />
                  <span className="truncate">{it.name}</span>
                  {hasAdvice(it.key) && (
                    <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                  )}
                </button>
              );
            })}
          </div>
          {itemList.length === 0 && <p className="mt-2 text-xs text-[var(--color-muted)]">ไม่เจอไอเทมที่ค้นหา</p>}

          {tags.length > 0 && (
            <div className="mt-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                ภัยคุกคามที่ตรวจพบ
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tags.map(([t, n]) => (
                  <span
                    key={t}
                    className="rounded border border-[var(--color-line)] bg-[var(--color-panel2)] px-2 py-0.5 text-[11px]"
                  >
                    {TAG_LABEL[t]} ×{n}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      <section className="rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)] p-4">
        <h2 className="mb-1 font-semibold">3. ฮีโร่ที่ควร pick</h2>
        <p className="mb-3 text-xs text-[var(--color-muted)]">winrate เฉลี่ยเมื่อเจอทีมที่เลือก (สถิติ OpenDota)</p>
        {picks.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">เลือกฮีโร่ฝั่งตรงข้ามก่อน</p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {picks.map((p) => {
              const m = heroMeta(p.key);
              return (
                <Link
                  key={p.key}
                  href={`/hero/${p.key}`}
                  className="overflow-hidden rounded-lg border border-[var(--color-line)] bg-[var(--color-panel2)] hover:border-[var(--color-accent)]"
                >
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.img} alt={m.name} className="aspect-[16/9] w-full object-cover" />
                    {COVERED.has(p.key) && (
                      <span className="absolute right-1 top-1 rounded bg-[var(--color-accent)] px-1 py-0.5 text-[9px] text-white">
                        คู่มือเต็ม
                      </span>
                    )}
                  </div>
                  <div className="px-2 py-1.5">
                    <div className="truncate text-sm font-medium">{m.name}</div>
                    <div className="text-[11px] text-[var(--color-good)]">{p.avg.toFixed(1)}% เฉลี่ย</div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)] p-4">
        <h2 className="mb-3 font-semibold">4. ของที่ควรออก</h2>
        {suggestions.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">เลือกฮีโร่หรือไอเทมฝั่งตรงข้ามก่อน</p>
        ) : (
          <ol className="space-y-2">
            {suggestions.map((s, i) => {
              const it = itemMeta(s.item);
              return (
                <li
                  key={s.item}
                  className="flex gap-3 rounded-lg border border-[var(--color-line)] bg-[var(--color-panel2)] p-3"
                >
                  <div className="w-5 shrink-0 pt-1 text-sm text-[var(--color-muted)]">{i + 1}</div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.img} alt="" className="h-9 w-12 shrink-0 rounded object-cover" />
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium">{it.name}</span>
                      {it.cost > 0 && <span className="text-[11px] text-[var(--color-muted)]">{it.cost} g</span>}
                    </div>
                    <ul className="mt-1 space-y-0.5 text-xs text-[var(--color-muted)]">
                      {s.reasons.slice(0, 3).map((r) => (
                        <li key={r}>• {r}</li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </div>
  );
}

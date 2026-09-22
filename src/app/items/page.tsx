"use client";

import { useMemo, useState } from "react";
import { ITEM_ANSWERS, ITEM_THREAT, TAG_COUNTERS, TAG_LABEL } from "@/data/counters";
import type { ItemPick } from "@/data/types";
import pickableJson from "@/data/generated/pickable-items.json";
import { itemMeta } from "@/lib/dota";

const ITEMS = (pickableJson as string[])
  .map((k) => itemMeta(k))
  .sort((a, b) => a.name.localeCompare(b.name));

/** Specific answers first, then whatever the item's threat tags imply. */
function answersFor(key: string): { picks: ItemPick[]; fromTags: boolean } {
  const direct = ITEM_ANSWERS[key];
  if (direct?.length) return { picks: direct, fromTags: false };
  const seen = new Set<string>();
  const picks: ItemPick[] = [];
  for (const tag of ITEM_THREAT[key] ?? []) {
    for (const p of (TAG_COUNTERS[tag] ?? []).slice(0, 3)) {
      if (seen.has(p.item)) continue;
      seen.add(p.item);
      picks.push(p);
    }
  }
  return { picks, fromTags: true };
}

export default function ItemsPage() {
  const [q, setQ] = useState("");
  const [onlyAdvice, setOnlyAdvice] = useState(true);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return ITEMS.filter((it) => {
      if (needle && !it.name.toLowerCase().includes(needle)) return false;
      if (onlyAdvice && answersFor(it.key).picks.length === 0) return false;
      return true;
    });
  }, [q, onlyAdvice]);

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)] p-5">
        <h1 className="text-xl font-bold">ฝั่งตรงข้ามออกของชิ้นนี้ แล้วเราทำยังไง</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          รายการไอเทมที่ซื้อจริงทั้งหมด {ITEMS.length} ชิ้น · คำแนะนำเฉพาะชิ้น หรืออนุมานจากประเภทภัยคุกคาม
        </p>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ค้นหาไอเทม..."
          className="w-64 rounded-md border border-[var(--color-line)] bg-[var(--color-panel2)] px-3 py-1.5 text-sm outline-none focus:border-[var(--color-accent)]"
        />
        <label className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
          <input type="checkbox" checked={onlyAdvice} onChange={(e) => setOnlyAdvice(e.target.checked)} />
          แสดงเฉพาะชิ้นที่มีคำแนะนำ
        </label>
        <span className="ml-auto text-xs text-[var(--color-muted)]">{list.length} ชิ้น</span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {list.map((it) => {
          const { picks, fromTags } = answersFor(it.key);
          const tags = ITEM_THREAT[it.key] ?? [];
          return (
            <section key={it.key} className="rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)] p-3">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.img} alt="" className="h-9 w-12 rounded object-cover" />
                <div className="min-w-0">
                  <div className="truncate font-medium">{it.name}</div>
                  <div className="text-[11px] text-[var(--color-muted)]">
                    {it.cost > 0 ? `${it.cost} g` : ""}
                    {tags.length > 0 && ` · ${tags.map((t) => TAG_LABEL[t].split(" (")[0]).join(", ")}`}
                  </div>
                </div>
                {!fromTags && picks.length > 0 && (
                  <span className="ml-auto shrink-0 rounded bg-[var(--color-accent)]/20 px-1.5 py-0.5 text-[10px] text-[var(--color-accent)]">
                    เฉพาะชิ้นนี้
                  </span>
                )}
              </div>

              {picks.length === 0 ? (
                <p className="mt-2 text-xs text-[var(--color-muted)]">ไม่มีผลต่อวิธีออกของฝั่งเรา</p>
              ) : (
                <ul className="mt-2 space-y-1.5">
                  {picks.slice(0, 5).map((p) => {
                    const ans = itemMeta(p.item);
                    return (
                      <li key={p.item} className="flex gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={ans.img} alt="" className="h-6 w-8 shrink-0 rounded-sm object-cover" />
                        <div className="min-w-0 text-xs">
                          <span className="font-medium">{ans.name}</span>
                          <span className="text-[var(--color-muted)]"> — {p.why}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

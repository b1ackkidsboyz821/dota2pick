"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ALL_HEROES, COVERED } from "@/lib/dota";
import { positionsOf } from "@/data/heroTags";

const ATTRS = [
  { key: "all", label: "ทั้งหมด" },
  { key: "str", label: "Strength" },
  { key: "agi", label: "Agility" },
  { key: "int", label: "Intelligence" },
  { key: "universal", label: "Universal" },
];

const POSITIONS = [1, 2, 3, 4, 5];

export default function Home() {
  const [q, setQ] = useState("");
  const [attr, setAttr] = useState("all");
  const [pos, setPos] = useState<number | null>(null);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return ALL_HEROES.filter((h) => {
      if (attr !== "all" && h.attr !== attr) return false;
      if (pos && !positionsOf(h.key).includes(pos as 1 | 2 | 3 | 4 | 5)) return false;
      if (needle && !h.name.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [q, attr, pos]);

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)] p-5">
        <h1 className="text-xl font-bold">เลือกฮีโร่ เพื่อดูของที่ควรออกและคู่แก้ทาง</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          ครบ {ALL_HEROES.length} ตัว · winrate คู่แก้ทางจากสถิติ OpenDota · {COVERED.size} ตัวมีคู่มือเขียนเองแบบละเอียด
        </p>
        <Link
          href="/counter"
          className="mt-3 inline-block rounded-md bg-[var(--color-accent)] px-3 py-1.5 text-sm font-medium text-white"
        >
          ไปหน้าแก้ทางทีมฝั่งตรงข้าม →
        </Link>
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ค้นหาฮีโร่..."
          className="w-56 rounded-md border border-[var(--color-line)] bg-[var(--color-panel2)] px-3 py-1.5 text-sm outline-none focus:border-[var(--color-accent)]"
        />
        {ATTRS.map((a) => (
          <button
            key={a.key}
            onClick={() => setAttr(a.key)}
            className={`rounded-md border px-2.5 py-1.5 text-xs ${
              attr === a.key
                ? "border-[var(--color-accent)] bg-[var(--color-accent)]/15 text-white"
                : "border-[var(--color-line)] bg-[var(--color-panel2)] text-[var(--color-muted)]"
            }`}
          >
            {a.label}
          </button>
        ))}
        <div className="ml-auto flex gap-1.5">
          {POSITIONS.map((p) => (
            <button
              key={p}
              onClick={() => setPos(pos === p ? null : p)}
              className={`rounded-md border px-2.5 py-1.5 text-xs ${
                pos === p
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]/15 text-white"
                  : "border-[var(--color-line)] bg-[var(--color-panel2)] text-[var(--color-muted)]"
              }`}
            >
              Pos {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {list.map((h) => (
          <Link key={h.key} href={`/hero/${h.key}`}>
            <div className="group overflow-hidden rounded-lg border border-[var(--color-line)] bg-[var(--color-panel)] hover:border-[var(--color-accent)]">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={h.img} alt={h.name} className="aspect-[16/9] w-full object-cover" />
                {COVERED.has(h.key) && (
                  <span className="absolute right-1 top-1 rounded bg-[var(--color-accent)] px-1.5 py-0.5 text-[10px] font-medium text-white">
                    คู่มือเต็ม
                  </span>
                )}
              </div>
              <div className="px-2 py-1.5">
                <div className="truncate text-sm font-medium">{h.name}</div>
                <div className="text-[11px] text-[var(--color-muted)]">
                  {positionsOf(h.key)
                    .map((x) => `pos ${x}`)
                    .join(" · ")}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {list.length === 0 && <p className="text-sm text-[var(--color-muted)]">ไม่เจอฮีโร่ที่ค้นหา</p>}
    </div>
  );
}

"use client";

import { useState } from "react";
import type { PositionBuild } from "@/lib/heroData";
import { POS_LABEL } from "@/lib/dota";
import { ItemRow, ItemWithReason } from "@/components/Chips";

export default function BuildTabs({ builds }: { builds: PositionBuild[] }) {
  const [active, setActive] = useState(builds[0]?.pos ?? 1);
  const build = builds.find((b) => b.pos === active) ?? builds[0];
  if (!build) return null;

  return (
    <section className="rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)] p-4">
      <div className="mb-4 flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((p) => {
          const row = builds.find((b) => b.pos === p);
          return (
            <button
              key={p}
              disabled={!row}
              onClick={() => row && setActive(row.pos)}
              className={`rounded-md border px-3 py-1.5 text-xs ${
                active === p && row
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]/15 text-white"
                  : row
                    ? "border-[var(--color-line)] bg-[var(--color-panel2)] text-[var(--color-muted)]"
                    : "cursor-not-allowed border-[var(--color-line)]/50 bg-transparent text-[var(--color-muted)]/40"
              }`}
            >
              Pos {p}
              {row?.source === "curated" && <span className="ml-1 text-[var(--color-accent)]">•</span>}
            </button>
          );
        })}
      </div>

      <div className="mb-3 flex flex-wrap items-baseline gap-2">
        <div>
          <div className="text-sm font-semibold">{POS_LABEL[build.pos]}</div>
          <div className="text-xs text-[var(--color-muted)]">
            {build.role}
            {build.note && ` · ${build.note}`}
          </div>
        </div>
        <span
          className={`ml-auto rounded px-2 py-0.5 text-[10px] ${
            build.source === "curated"
              ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
              : "bg-[var(--color-line)] text-[var(--color-muted)]"
          }`}
        >
          {build.source === "curated"
            ? "คู่มือเขียนเอง"
            : build.source === "measured"
              ? `วัดจากเกม pos นี้ ${build.games} เกม`
              : "สถิติ + ปรับตามตำแหน่ง"}
        </span>
      </div>

      <div className="space-y-3">
        <Group title="ของเริ่มต้น" items={build.starting} />
        <Group title="ช่วงต้นเกม" items={build.early} />
        <Group title="ของหลัก (core)" items={build.core} />
        <Group title="ช่วงปลายเกม" items={build.late} />
      </div>

      {build.situational.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
            ของตามสถานการณ์
          </div>
          <ul className="grid gap-2 md:grid-cols-2">
            {build.situational.map((s) => (
              <ItemWithReason key={s.item} itemKey={s.item} why={s.why} />
            ))}
          </ul>
        </div>
      )}

      {build.tips && (
        <p className="mt-4 rounded-lg border border-[var(--color-line)] bg-[var(--color-panel2)] p-3 text-xs text-[var(--color-muted)]">
          {build.tips}
        </p>
      )}

      {build.source === "derived" && (
        <p className="mt-3 text-[11px] text-[var(--color-muted)]">
          ของหลักเรียงจากของประจำตำแหน่งก่อน แล้วตามด้วยของที่คนเล่นตัวนี้ซื้อบ่อยสุด (ตัดของที่ไม่เข้ากับตำแหน่งออกแล้ว)
        </p>
      )}

      {build.source === "measured" && (
        <p className="mt-3 text-[11px] text-[var(--color-muted)]">
          นับจากเกม league ที่ฮีโร่ตัวนี้เล่น pos นี้จริง ไม่ใช่สถิติรวมทุกตำแหน่ง — ตำแหน่งเดาจากอันดับเงินในทีม
        </p>
      )}
    </section>
  );
}

function Group({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">{title}</div>
      <ItemRow items={items} />
    </div>
  );
}

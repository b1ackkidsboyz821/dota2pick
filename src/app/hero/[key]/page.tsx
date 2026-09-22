import { notFound } from "next/navigation";
import { TAG_COUNTERS, TAG_LABEL } from "@/data/counters";
import type { ItemPick, Tag } from "@/data/types";
import { ALL_HEROES, itemMeta } from "@/lib/dota";
import { getPositionBuilds, getProfile } from "@/lib/heroData";
import { ItemRow, ItemWithReason } from "@/components/Chips";
import { MatchupList } from "@/components/Matchups";
import BuildTabs from "./BuildTabs";

export function generateStaticParams() {
  return ALL_HEROES.map((h) => ({ key: h.key }));
}

export default async function HeroPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const p = getProfile(key);
  if (!p) notFound();
  const { meta, curated, generated } = p;
  const builds = getPositionBuilds(key);
  const handWritten = builds.filter((b) => b.source === "curated").length;

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-center gap-4 rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)] p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={meta.img} alt={meta.name} className="h-20 w-36 rounded-lg object-cover" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold">{meta.name}</h1>
            <span
              className={`rounded px-2 py-0.5 text-[11px] ${
                curated
                  ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
                  : "bg-[var(--color-line)] text-[var(--color-muted)]"
              }`}
            >
              {handWritten > 0 ? `คู่มือเขียนเอง ${handWritten}/${builds.length} ตำแหน่ง` : "จากสถิติ OpenDota"}
            </span>
          </div>
          <div className="mt-1 text-sm text-[var(--color-muted)]">
            เล่นตำแหน่ง {builds.map((b) => `pos ${b.pos} (${b.role})`).join(" · ")}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {p.tags.map((t) => (
              <span
                key={t}
                className="rounded border border-[var(--color-line)] bg-[var(--color-panel2)] px-2 py-0.5 text-[11px] text-[var(--color-muted)]"
              >
                {TAG_LABEL[t]}
              </span>
            ))}
          </div>
        </div>
      </section>

      <BuildTabs builds={builds} />

      {generated && (
        <details className="rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)] p-4">
          <summary className="cursor-pointer text-sm font-semibold">
            ของที่คนออกจริงบ่อยสุด (รวมทุกตำแหน่ง)
          </summary>
          <div className="mt-3 space-y-3">
            <Phase title="ของเริ่มต้น" items={generated.starting} />
            <Phase title="ช่วงต้นเกม" items={generated.early} />
            <Phase title="ช่วงกลางเกม" items={generated.mid} />
            <Phase title="ช่วงปลายเกม" items={generated.late} />
          </div>
        </details>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)] p-4">
          <h2 className="mb-1 font-semibold text-[var(--color-good)]">{meta.name} แก้ทางตัวไหนได้</h2>
          <p className="mb-3 text-xs text-[var(--color-muted)]">เปอร์เซ็นต์คือ winrate ของ {meta.name} เมื่อเจอตัวนั้น</p>
          <MatchupList rows={p.strongAgainst} tone="good" />
        </section>

        <section className="rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)] p-4">
          <h2 className="mb-1 font-semibold text-[var(--color-bad)]">ตัวที่แก้ทาง {meta.name}</h2>
          <p className="mb-3 text-xs text-[var(--color-muted)]">winrate ต่ำ = เจอแล้วเล่นยาก</p>
          <MatchupList rows={p.weakAgainst} tone="bad" />
        </section>
      </div>

      {curated && curated.counterPlay.length > 0 && (
        <section className="rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)] p-4">
          <h2 className="font-semibold">ถ้าฝั่งตรงข้ามออกของแบบนี้ เราต้องออกอะไรต่อ</h2>
          <p className="mb-3 text-xs text-[var(--color-muted)]">มุมมองของคนเล่น {meta.name}</p>
          <div className="grid gap-3 md:grid-cols-2">
            {curated.counterPlay.map((c) => {
              const en = itemMeta(c.enemyItem);
              return (
                <div key={c.enemyItem} className="rounded-lg border border-[var(--color-line)] bg-[var(--color-panel2)] p-3">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={en.img} alt="" className="h-7 w-10 rounded object-cover" />
                    <span className="text-sm">
                      ศัตรูมี <b>{en.name}</b>
                    </span>
                  </div>
                  <p className="my-2 text-xs text-[var(--color-muted)]">{c.why}</p>
                  <ItemRow items={c.response} />
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)] p-4">
        <h2 className="mb-3 font-semibold">ของที่ใช้แก้ทาง {meta.name} (สำหรับฝั่งตรงข้าม)</h2>
        <ul className="grid gap-2 md:grid-cols-2">
          {dedupe(p.tags.flatMap((t: Tag) => TAG_COUNTERS[t] ?? [])).map((x) => (
            <ItemWithReason key={x.item} itemKey={x.item} why={x.why} />
          ))}
        </ul>
      </section>
    </div>
  );
}

function Phase({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">{title}</div>
      <ItemRow items={items} />
    </div>
  );
}

function dedupe(picks: ItemPick[]): ItemPick[] {
  const seen = new Set<string>();
  return picks.filter((x) => (seen.has(x.item) ? false : (seen.add(x.item), true)));
}

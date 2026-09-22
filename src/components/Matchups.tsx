import Link from "next/link";
import { heroMeta } from "@/lib/dota";
import type { MatchupInfo } from "@/lib/heroData";

export function MatchupList({ rows, tone }: { rows: MatchupInfo[]; tone: "good" | "bad" }) {
  const color = tone === "good" ? "var(--color-good)" : "var(--color-bad)";
  if (rows.length === 0) {
    return <p className="text-sm text-[var(--color-muted)]">ยังไม่มีข้อมูลพอ</p>;
  }
  return (
    <ul className="space-y-2">
      {rows.map((m) => {
        const h = heroMeta(m.hero);
        const wr = m.winrate != null ? m.winrate * 100 : null;
        return (
          <li key={m.hero} className="flex gap-3 rounded-lg border border-[var(--color-line)] bg-[var(--color-panel2)] p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={h.img} alt="" className="h-9 w-16 shrink-0 rounded object-cover" />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <Link href={`/hero/${h.key}`} className="text-sm font-medium hover:underline" style={{ color }}>
                  {h.name}
                </Link>
                {wr != null && (
                  <span className="shrink-0 text-xs tabular-nums" style={{ color }}>
                    {wr.toFixed(1)}%
                    <span className="ml-1 text-[10px] text-[var(--color-muted)]">({m.games} เกม)</span>
                  </span>
                )}
              </div>
              {m.why ? (
                <div className="text-xs text-[var(--color-muted)]">{m.why}</div>
              ) : (
                wr != null && (
                  <div className="mt-1 h-1 w-full overflow-hidden rounded bg-[var(--color-line)]">
                    <div
                      className="h-full rounded"
                      style={{ width: `${Math.min(100, Math.max(0, (wr - 40) * 5))}%`, background: color }}
                    />
                  </div>
                )
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

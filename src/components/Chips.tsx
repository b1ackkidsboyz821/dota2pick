import Link from "next/link";
import { heroMeta, itemMeta } from "@/lib/dota";

export function ItemChip({ itemKey, why }: { itemKey: string; why?: string }) {
  const it = itemMeta(itemKey);
  return (
    <span
      title={why ? `${it.name} — ${why}` : it.name}
      className="inline-flex items-center gap-2 rounded-md border border-[var(--color-line)] bg-[var(--color-panel2)] px-2 py-1 text-xs"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={it.img} alt="" width={32} height={24} className="h-6 w-8 rounded-sm object-cover" />
      <span className="whitespace-nowrap">{it.name}</span>
    </span>
  );
}

export function ItemRow({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((k) => (
        <ItemChip key={k} itemKey={k} />
      ))}
    </div>
  );
}

export function ItemWithReason({ itemKey, why }: { itemKey: string; why: string }) {
  const it = itemMeta(itemKey);
  return (
    <li className="flex gap-3 rounded-lg border border-[var(--color-line)] bg-[var(--color-panel2)] p-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={it.img} alt="" width={48} height={36} className="h-9 w-12 shrink-0 rounded object-cover" />
      <div className="min-w-0">
        <div className="text-sm font-medium">{it.name}</div>
        <div className="text-xs text-[var(--color-muted)]">{why}</div>
      </div>
    </li>
  );
}

export function HeroChip({ heroKey, why, tone }: { heroKey: string; why: string; tone: "good" | "bad" }) {
  const h = heroMeta(heroKey);
  const color = tone === "good" ? "var(--color-good)" : "var(--color-bad)";
  return (
    <li className="flex gap-3 rounded-lg border border-[var(--color-line)] bg-[var(--color-panel2)] p-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={h.img} alt="" width={64} height={36} className="h-9 w-16 shrink-0 rounded object-cover" />
      <div className="min-w-0">
        <Link href={`/hero/${h.key}`} className="text-sm font-medium hover:underline" style={{ color }}>
          {h.name}
        </Link>
        <div className="text-xs text-[var(--color-muted)]">{why}</div>
      </div>
    </li>
  );
}

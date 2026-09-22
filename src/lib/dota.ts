import heroesJson from "@/data/heroes.json";
import itemsJson from "@/data/items.json";
import { HEROES } from "@/data/builds";
import type { HeroMeta, ItemMeta } from "@/data/types";

export const ALL_HEROES = heroesJson as HeroMeta[];
export const ALL_ITEMS = itemsJson as ItemMeta[];

const heroIdx = new Map(ALL_HEROES.map((h) => [h.key, h]));
const itemIdx = new Map(ALL_ITEMS.map((i) => [i.key, i]));

export const COVERED = new Set(HEROES.map((h) => h.key));

export function heroMeta(key: string): HeroMeta {
  return (
    heroIdx.get(key) ?? {
      id: -1,
      key,
      name: key,
      attr: "all",
      roles: [],
      img: "",
    }
  );
}

export function itemMeta(key: string): ItemMeta {
  return (
    itemIdx.get(key) ?? {
      key,
      name: key.replace(/_/g, " "),
      cost: 0,
      img: `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/${key}.png`,
    }
  );
}

export const POS_LABEL: Record<number, string> = {
  1: "Pos 1 — Safelane carry",
  2: "Pos 2 — Mid",
  3: "Pos 3 — Offlane",
  4: "Pos 4 — Soft support",
  5: "Pos 5 — Hard support",
};

export type Pos = 1 | 2 | 3 | 4 | 5;

/** Threat tags describe what problem an enemy hero creates for you. */
export type Tag =
  | "physical_carry"
  | "physical_burst"
  | "magic_burst"
  | "magic_dot"
  | "heal_sustain"
  | "illusions"
  | "summons"
  | "invis"
  | "blink_init"
  | "silence"
  | "lockdown"
  | "lifesteal"
  | "evasion"
  | "armor_stack"
  | "channel_ult"
  | "escape_mobility"
  | "tank_hp"
  | "pure_damage";

export type ItemPick = { item: string; why: string };

export type Build = {
  pos: Pos;
  role: string;
  starting: string[];
  early: string[];
  core: string[];
  situational: ItemPick[];
  tips: string;
};

export type Matchup = { hero: string; why: string };

export type CounterPlay = {
  /** enemy item key that changes how you itemize */
  enemyItem: string;
  response: string[];
  why: string;
};

export type Hero = {
  key: string;
  tags: Tag[];
  builds: Build[];
  strongAgainst: Matchup[];
  weakAgainst: Matchup[];
  counterPlay: CounterPlay[];
};

export type HeroMeta = {
  id: number;
  key: string;
  name: string;
  attr: string;
  roles: string[];
  img: string;
};

export type ItemMeta = { key: string; name: string; cost: number; img: string };

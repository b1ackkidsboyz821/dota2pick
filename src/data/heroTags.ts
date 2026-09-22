import type { Pos, Tag } from "./types";
import { positionInfos } from "./heroPositions";

/**
 * Hand-maintained per-hero metadata for every hero in the game:
 * which positions the hero is played in, and what threat it presents.
 * The counter engine runs off these tags, so every hero gets coverage
 * even before a full curated build is written for it.
 */
type Row = [key: string, pos: Pos[], tags: Tag[]];

const ROWS: Row[] = [
  ["abaddon", [3, 5, 1], ["heal_sustain", "tank_hp", "lockdown"]],
  ["alchemist", [1, 3], ["physical_carry", "tank_hp", "lockdown"]],
  ["ancient_apparition", [5, 4], ["magic_burst", "magic_dot", "lockdown"]],
  ["antimage", [1], ["physical_carry", "escape_mobility", "silence", "illusions"]],
  ["arc_warden", [1], ["illusions", "summons", "escape_mobility", "physical_carry"]],
  ["axe", [3], ["blink_init", "lockdown", "tank_hp", "armor_stack"]],
  ["bane", [5, 4], ["lockdown", "channel_ult", "pure_damage"]],
  ["batrider", [3, 4], ["blink_init", "magic_dot", "lockdown", "escape_mobility"]],
  ["beastmaster", [3], ["summons", "lockdown", "physical_burst"]],
  ["bloodseeker", [1, 3], ["physical_carry", "silence", "lifesteal", "escape_mobility"]],
  ["bounty_hunter", [4], ["invis", "physical_burst", "escape_mobility"]],
  ["brewmaster", [3], ["summons", "tank_hp", "physical_carry", "evasion"]],
  ["bristleback", [3], ["tank_hp", "magic_dot", "heal_sustain"]],
  ["broodmother", [1, 3], ["summons", "physical_carry", "escape_mobility"]],
  ["centaur", [3], ["blink_init", "lockdown", "tank_hp"]],
  ["chaos_knight", [1], ["illusions", "lockdown", "physical_carry", "tank_hp"]],
  ["chen", [4], ["summons", "heal_sustain"]],
  ["clinkz", [1, 4], ["invis", "physical_carry", "summons", "escape_mobility"]],
  ["rattletrap", [3, 4], ["lockdown", "blink_init", "tank_hp"]],
  ["crystal_maiden", [5], ["magic_burst", "lockdown", "magic_dot", "channel_ult"]],
  ["dark_seer", [3], ["illusions", "lockdown", "escape_mobility", "blink_init"]],
  ["dark_willow", [4, 5], ["lockdown", "magic_burst", "escape_mobility", "invis"]],
  ["dawnbreaker", [3, 1], ["heal_sustain", "tank_hp", "lockdown", "blink_init"]],
  ["dazzle", [5], ["heal_sustain", "armor_stack", "magic_dot"]],
  ["death_prophet", [2, 3], ["summons", "magic_dot", "tank_hp", "silence"]],
  ["disruptor", [5], ["lockdown", "silence", "magic_dot"]],
  ["doom_bringer", [3], ["silence", "lockdown", "magic_dot", "tank_hp"]],
  ["dragon_knight", [2, 3], ["tank_hp", "armor_stack", "lockdown", "physical_carry"]],
  ["drow_ranger", [1], ["physical_carry", "physical_burst", "silence"]],
  ["earthshaker", [4, 3], ["blink_init", "lockdown", "magic_burst"]],
  ["earth_spirit", [4], ["lockdown", "blink_init", "escape_mobility", "magic_dot"]],
  ["elder_titan", [3, 4], ["lockdown", "armor_stack", "magic_burst"]],
  ["ember_spirit", [2], ["escape_mobility", "physical_carry", "magic_burst"]],
  ["enchantress", [4, 1], ["summons", "heal_sustain", "physical_carry", "escape_mobility"]],
  ["enigma", [3, 4], ["summons", "lockdown", "channel_ult", "blink_init"]],
  ["faceless_void", [1], ["lockdown", "physical_carry", "evasion", "escape_mobility"]],
  ["grimstroke", [5], ["lockdown", "silence", "magic_burst", "magic_dot"]],
  ["gyrocopter", [1], ["physical_carry", "magic_burst", "physical_burst"]],
  ["hoodwink", [4], ["escape_mobility", "lockdown", "magic_burst", "physical_burst"]],
  ["huskar", [1, 2], ["heal_sustain", "tank_hp", "pure_damage"]],
  ["invoker", [2, 3], ["magic_burst", "magic_dot", "lockdown", "summons"]],
  ["wisp", [5], ["heal_sustain", "escape_mobility", "blink_init"]],
  ["jakiro", [5], ["magic_dot", "magic_burst", "lockdown"]],
  ["juggernaut", [1, 2], ["physical_carry", "heal_sustain", "escape_mobility", "illusions"]],
  ["keeper_of_the_light", [5, 4], ["magic_burst", "magic_dot", "escape_mobility"]],
  ["kez", [1, 2], ["physical_carry", "physical_burst", "escape_mobility"]],
  ["kunkka", [2, 3, 1], ["physical_burst", "lockdown", "tank_hp"]],
  ["largo", [3, 4], ["tank_hp", "lockdown", "physical_burst"]],
  ["legion_commander", [3], ["physical_burst", "lockdown", "blink_init", "pure_damage"]],
  ["leshrac", [2, 3], ["magic_dot", "magic_burst", "escape_mobility"]],
  ["lich", [5], ["magic_burst", "heal_sustain", "magic_dot"]],
  ["life_stealer", [1], ["lifesteal", "tank_hp", "physical_carry"]],
  ["lina", [2, 4], ["magic_burst", "lockdown", "physical_burst"]],
  ["lion", [5, 4], ["magic_burst", "lockdown", "silence", "pure_damage"]],
  ["lone_druid", [1], ["summons", "physical_carry", "tank_hp"]],
  ["luna", [1], ["physical_carry", "magic_burst", "physical_burst"]],
  ["lycan", [1, 3], ["summons", "physical_carry", "escape_mobility"]],
  ["magnataur", [3, 4], ["blink_init", "lockdown", "physical_burst"]],
  ["marci", [4, 3], ["lockdown", "physical_burst", "escape_mobility", "heal_sustain"]],
  ["mars", [3], ["blink_init", "lockdown", "tank_hp", "physical_burst"]],
  ["medusa", [1], ["physical_carry", "tank_hp", "lockdown"]],
  ["meepo", [1, 2], ["summons", "lockdown", "escape_mobility", "physical_carry"]],
  ["mirana", [4, 1], ["invis", "lockdown", "escape_mobility", "physical_carry"]],
  ["monkey_king", [1, 3], ["physical_carry", "escape_mobility", "lockdown", "invis"]],
  ["morphling", [1], ["physical_carry", "escape_mobility", "illusions", "tank_hp"]],
  ["muerta", [1, 2], ["physical_carry", "magic_burst", "escape_mobility"]],
  ["naga_siren", [1, 5], ["illusions", "lockdown", "channel_ult", "physical_carry"]],
  ["furion", [1, 2, 4], ["summons", "escape_mobility", "physical_carry"]],
  ["necrolyte", [3, 2], ["magic_burst", "heal_sustain", "tank_hp"]],
  ["night_stalker", [3, 4], ["silence", "lockdown", "physical_burst"]],
  ["nyx_assassin", [4], ["invis", "magic_burst", "lockdown", "blink_init"]],
  ["ogre_magi", [5, 4], ["magic_burst", "lockdown", "tank_hp"]],
  ["omniknight", [5, 3], ["heal_sustain", "tank_hp", "lockdown"]],
  ["oracle", [5], ["heal_sustain", "magic_dot", "silence", "lockdown"]],
  ["obsidian_destroyer", [2, 1], ["magic_burst", "silence", "escape_mobility"]],
  ["pangolier", [2, 3, 4], ["escape_mobility", "lockdown", "physical_carry"]],
  ["phantom_assassin", [1], ["physical_carry", "physical_burst", "evasion", "escape_mobility"]],
  ["phantom_lancer", [1], ["illusions", "escape_mobility", "physical_carry"]],
  ["phoenix", [4, 3], ["magic_dot", "heal_sustain", "lockdown", "channel_ult"]],
  ["primal_beast", [3], ["lockdown", "tank_hp", "blink_init", "channel_ult"]],
  ["puck", [2], ["escape_mobility", "lockdown", "silence", "magic_burst"]],
  ["pudge", [4, 3], ["lockdown", "magic_dot", "tank_hp", "blink_init"]],
  ["pugna", [4, 2], ["magic_burst", "channel_ult", "summons", "heal_sustain"]],
  ["queenofpain", [2], ["magic_burst", "escape_mobility", "magic_dot"]],
  ["razor", [1, 2, 3], ["physical_carry", "magic_dot", "escape_mobility"]],
  ["riki", [4, 1], ["invis", "physical_carry", "silence", "escape_mobility"]],
  ["ringmaster", [4, 5], ["lockdown", "magic_dot", "channel_ult"]],
  ["rubick", [5], ["lockdown", "magic_burst", "silence"]],
  ["sand_king", [3, 4], ["blink_init", "magic_dot", "channel_ult", "invis"]],
  ["shadow_demon", [5, 4], ["illusions", "lockdown", "magic_dot"]],
  ["nevermore", [2, 1], ["magic_burst", "physical_carry", "armor_stack"]],
  ["shadow_shaman", [5], ["lockdown", "summons", "magic_burst", "channel_ult"]],
  ["silencer", [5, 2], ["silence", "magic_burst", "magic_dot"]],
  ["skywrath_mage", [5, 4], ["magic_burst", "silence", "magic_dot"]],
  ["slardar", [3, 4], ["lockdown", "armor_stack", "tank_hp", "physical_burst"]],
  ["slark", [1], ["physical_carry", "escape_mobility", "invis", "heal_sustain"]],
  ["snapfire", [4, 5], ["magic_burst", "physical_burst", "escape_mobility", "heal_sustain"]],
  ["sniper", [1, 2], ["physical_carry", "physical_burst"]],
  ["spectre", [1], ["physical_carry", "illusions", "escape_mobility"]],
  ["spirit_breaker", [4, 3], ["blink_init", "lockdown", "tank_hp", "escape_mobility"]],
  ["storm_spirit", [2], ["escape_mobility", "magic_burst", "lockdown"]],
  ["sven", [1, 3], ["physical_burst", "lockdown", "tank_hp", "physical_carry"]],
  ["techies", [4, 5], ["magic_burst", "magic_dot", "lockdown"]],
  ["templar_assassin", [2, 1], ["physical_carry", "physical_burst", "escape_mobility"]],
  ["terrorblade", [1], ["illusions", "physical_carry", "escape_mobility"]],
  ["tidehunter", [3], ["blink_init", "lockdown", "tank_hp", "armor_stack"]],
  ["shredder", [3], ["tank_hp", "magic_dot", "escape_mobility", "armor_stack"]],
  ["tinker", [2], ["magic_burst", "escape_mobility", "magic_dot"]],
  ["tiny", [1, 2, 3], ["physical_burst", "lockdown", "tank_hp"]],
  ["treant", [5], ["heal_sustain", "lockdown", "invis", "tank_hp"]],
  ["troll_warlord", [1], ["physical_carry", "lifesteal", "lockdown", "evasion"]],
  ["tusk", [4, 3], ["blink_init", "lockdown", "tank_hp", "escape_mobility"]],
  ["abyssal_underlord", [3], ["magic_dot", "tank_hp", "escape_mobility"]],
  ["undying", [5, 3], ["summons", "tank_hp", "heal_sustain", "lockdown"]],
  ["ursa", [1, 4], ["physical_carry", "physical_burst", "lockdown", "tank_hp"]],
  ["vengefulspirit", [5, 4], ["lockdown", "armor_stack", "physical_burst", "illusions"]],
  ["venomancer", [3, 4, 5], ["magic_dot", "summons", "lockdown"]],
  ["viper", [2, 3, 1], ["magic_dot", "physical_carry", "tank_hp"]],
  ["visage", [3, 4], ["summons", "magic_burst", "tank_hp"]],
  ["void_spirit", [2], ["escape_mobility", "magic_burst", "lockdown", "silence"]],
  ["warlock", [5], ["summons", "heal_sustain", "lockdown"]],
  ["weaver", [1, 4], ["invis", "escape_mobility", "physical_carry"]],
  ["windrunner", [4, 2, 1], ["lockdown", "escape_mobility", "physical_burst", "evasion"]],
  ["winter_wyvern", [5], ["heal_sustain", "lockdown", "magic_dot"]],
  ["witch_doctor", [5], ["magic_dot", "heal_sustain", "lockdown", "channel_ult"]],
  ["skeleton_king", [1, 3], ["tank_hp", "lockdown", "lifesteal", "summons"]],
  ["zuus", [2, 4], ["magic_burst", "magic_dot"]],
];

export const HERO_TAGS = new Map<string, { pos: Pos[]; tags: Tag[] }>(
  ROWS.map(([key, pos, tags]) => [key, { pos, tags }]),
);

export function tagsOf(key: string): Tag[] {
  return HERO_TAGS.get(key)?.tags ?? [];
}

/**
 * Positions live in heroPositions.ts (they carry a role and build deltas there);
 * the `pos` column in the table above is only a fallback for a hero that has not
 * been given a position entry yet.
 */
export function positionsOf(key: string): Pos[] {
  const detailed = positionInfos(key);
  if (detailed.length > 0) return detailed.map((p) => p.pos).sort();
  return HERO_TAGS.get(key)?.pos ?? [1, 2, 3, 4, 5];
}

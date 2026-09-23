/**
 * Which slot an item belongs to. Shared by the build generator and the counter
 * planner so a pos 5 is never told to buy Battle Fury and a pos 1 is never told
 * to buy Glimmer Cape.
 */

/** Items nobody buys on a support slot, however popular they are on the core version. */
export const CORE_ONLY = new Set([
  "bfury", "radiance", "hand_of_midas", "moon_shard", "butterfly", "greater_crit", "rapier",
  "satanic", "skadi", "mjollnir", "maelstrom", "abyssal_blade", "assault", "heart", "manta",
  "silver_edge", "desolator", "monkey_king_bar", "bloodthorn", "harpoon", "echo_sabre",
  "sange_and_yasha", "yasha_and_kaya", "armlet", "mask_of_madness", "dragon_lance",
  "hurricane_pike", "basher", "disperser", "swift_blink", "revenants_brooch", "octarine_core",
]);

/** Items that only make sense when you are the one buying for the team. */
export const SUPPORT_ONLY = new Set([
  "glimmer_cape", "pavise", "holy_locket", "mekansm", "guardian_greaves", "boots_of_bearing",
  "ancient_janggo", "spirit_vessel", "urn_of_shadows", "wraith_pact",
]);

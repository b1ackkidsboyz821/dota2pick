import type { ItemPick, Tag } from "./types";

export const TAG_LABEL: Record<Tag, string> = {
  physical_carry: "Physical carry (right-click ปลายเกม)",
  physical_burst: "Physical burst (ระเบิดดาเมจกายภาพ)",
  magic_burst: "Magic burst (นุ๊กเวทแรง)",
  magic_dot: "Magic DoT (ดาเมจเวทต่อเนื่อง)",
  heal_sustain: "Heal / Sustain (ฮีล ดูดเลือด)",
  illusions: "Illusions (ร่างลวง)",
  summons: "Summons (ลูกสมุน)",
  invis: "Invisibility (ล่องหน)",
  blink_init: "Blink initiation (กระโดดเปิด)",
  silence: "Silence (ปิดสกิล)",
  lockdown: "Lockdown (สตันยาว / มัดตัว)",
  lifesteal: "Lifesteal (ดูดเลือดจากออโต้)",
  evasion: "Evasion (หลบกายภาพ)",
  armor_stack: "High armor (เกราะหนา)",
  channel_ult: "Channel ult (อัลติร่าย)",
  escape_mobility: "Mobility / Escape (หนีเก่ง)",
  tank_hp: "Tanky HP (เลือดหนา)",
  pure_damage: "Pure damage (ดาเมจแท้ทะลุ BKB)",
};

/** Items that answer each threat tag. */
export const TAG_COUNTERS: Record<Tag, ItemPick[]> = {
  physical_carry: [
    { item: "crimson_guard", why: "บล็อคดาเมจกายภาพทั้งทีม ดีสุดช่วง mid game" },
    { item: "ghost", why: "ของถูก กันกายภาพ 100% ตอนโดนโฟกัส" },
    { item: "heavens_halberd", why: "disarm 5 วิ ปิดเกม teamfight ได้เลย" },
    { item: "assault", why: "เกราะทีม + ลดเกราะฝั่งตรงข้าม" },
    { item: "shivas_guard", why: "เกราะ + ลด attack speed เป็นพื้นที่" },
    { item: "solar_crest", why: "ลดเกราะตัวเขา หรือบัฟเกราะ core เรา" },
  ],
  physical_burst: [
    { item: "ghost", why: "จังหวะเขาจะระเบิด กด ghost ดาเมจหายหมด" },
    { item: "blade_mail", why: "สะท้อนกลับ ตัว burst มักเลือดไม่เยอะ" },
    { item: "aeon_disk", why: "กันโดนลบทีเดียว ให้มีเวลาตอบโต้" },
    { item: "vanguard", why: "บล็อคดาเมจต่อครั้ง ดีกับดาเมจหลายเม็ด" },
  ],
  magic_burst: [
    { item: "pipe", why: "โล่กันเวททั้งทีม + magic resist" },
    { item: "black_king_bar", why: "ปิดสกิลเวทเกือบทั้งหมด" },
    { item: "glimmer_cape", why: "ของถูก magic resist + หายตัว เซฟ core" },
    { item: "aeon_disk", why: "กันโดน combo ลบทีเดียว" },
    { item: "eternal_shroud", why: "ดูดดาเมจเวทเป็นมานา ยืนสู้ได้" },
    { item: "cloak", why: "ของถูกช่วงเลน ต่อเป็น Pipe ทีหลัง" },
  ],
  magic_dot: [
    { item: "eternal_shroud", why: "แปลงดาเมจเวทเป็นมานา ยืนกินดาเมจต่อเนื่องได้" },
    { item: "pipe", why: "ลดดาเมจเวทสะสมทั้งทีม" },
    { item: "cyclone", why: "dispel ตัวเองออกจาก debuff ต่อเนื่อง" },
    { item: "lotus_orb", why: "สะท้อนสกิลเป้าหมายเดี่ยวกลับ + dispel" },
  ],
  heal_sustain: [
    { item: "spirit_vessel", why: "ตัดฮีล 45% แถมเบิร์นเลือดตามเปอร์เซ็นต์" },
    { item: "shivas_guard", why: "ตัดฮีลเป็นพื้นที่ ใช้ใน teamfight" },
    { item: "blood_grenade", why: "ของถูกตั้งแต่เลน ตัดฮีลได้ทันที" },
    { item: "skadi", why: "ตัดฮีล + slow ติดตัว ใส่ตัวตี" },
  ],
  illusions: [
    { item: "shivas_guard", why: "ดาเมจ AoE ล้างร่างลวงไว" },
    { item: "mjollnir", why: "chain lightning เคลียร์ illusion" },
    { item: "bfury", why: "cleave ล้างร่างลวงระหว่างตี" },
    { item: "crimson_guard", why: "illusion ตีเบา บล็อคดาเมจได้เยอะ" },
    { item: "radiance", why: "burn ทำให้ร่างลวงละลาย + miss" },
  ],
  summons: [
    { item: "shivas_guard", why: "เคลียร์ลูกสมุนเป็นกลุ่ม" },
    { item: "crimson_guard", why: "บล็อคดาเมจจากสมุนที่ตีเบาแต่ถี่" },
    { item: "mjollnir", why: "chain lightning เคลียร์ไว" },
    { item: "radiance", why: "burn ตลอดเวลา ล้าง summon" },
  ],
  invis: [
    { item: "ward_sentry", why: "ถูกสุด ควรมีติดกระเป๋าเสมอ" },
    { item: "dust", why: "จับตัวที่หายกลางคอมแบต" },
    { item: "gem", why: "เห็นถาวร แต่ต้องเล่นเป็นทีม" },
    { item: "spirit_vessel", why: "ยิงใส่ตอนลอบเข้ามา เห็นตัว + ตัดฮีล" },
  ],
  blink_init: [
    { item: "aeon_disk", why: "กันโดนกระโดดเปิดใส่แล้วลบ" },
    { item: "ward_observer", why: "เห็นก่อน = เขาเข้าไม่ได้" },
    { item: "cyclone", why: "ลอยตัวเองหนี combo หลังโดนเปิด" },
    { item: "force_staff", why: "ดันตัวเองหรือเพื่อนออกจากระยะ" },
    { item: "glimmer_cape", why: "เซฟเพื่อนที่โดนเปิดใส่" },
  ],
  silence: [
    { item: "black_king_bar", why: "กัน silence ตรง ๆ" },
    { item: "cyclone", why: "ลอยตัวเอง dispel silence ที่ dispel ได้" },
    { item: "sphere", why: "บล็อกสกิลเป้าหมายเดี่ยวเม็ดแรก" },
    { item: "manta", why: "dispel silence ส่วนใหญ่ได้ทันที" },
  ],
  lockdown: [
    { item: "black_king_bar", why: "ของหลักของ core เมื่อฝั่งตรงข้ามดิสเยอะ" },
    { item: "sphere", why: "กันสกิลเป้าหมายเดี่ยวอย่าง Hex / Doom / Duel" },
    { item: "aeon_disk", why: "ปลด debuff อัตโนมัติเมื่อเลือดต่ำ" },
    { item: "lotus_orb", why: "สะท้อนดิสกลับ + dispel เพื่อน" },
    { item: "wind_waker", why: "เซฟตัวเองหรือเพื่อนออกจาก chain stun" },
  ],
  lifesteal: [
    { item: "spirit_vessel", why: "ตัดฮีล 45% ทำให้ดูดเลือดไม่ทัน" },
    { item: "shivas_guard", why: "ตัดฮีลเป็นพื้นที่ + ลด attack speed" },
    { item: "skadi", why: "ตัดฮีลติดตัวจากทุกการตี" },
  ],
  evasion: [
    { item: "monkey_king_bar", why: "true strike ตีไม่พลาด" },
    { item: "bloodthorn", why: "true strike + silence + crit" },
    { item: "witch_blade", why: "ของกลางเกมที่ให้ true strike กับ mid" },
    { item: "silver_edge", why: "break ปิด passive evasion ของบางตัว" },
  ],
  armor_stack: [
    { item: "desolator", why: "ลดเกราะติดตัว" },
    { item: "assault", why: "aura ลดเกราะทีมตรงข้าม" },
    { item: "solar_crest", why: "ลดเกราะเป้าหมายเยอะมาก" },
    { item: "blight_stone", why: "ของถูกช่วงเลน ลดเกราะตั้งแต่ต้นเกม" },
    { item: "medallion_of_courage", why: "ถูก ใช้ได้ทั้งยืนตีและจับ Roshan" },
  ],
  channel_ult: [
    { item: "cyclone", why: "ลอยคนที่กำลังร่ายอัลติ ตัดทันที" },
    { item: "force_staff", why: "ดันออกจากระยะ ยกเลิกการร่าย" },
    { item: "rod_of_atos", why: "มัดตัวจากระยะไกลก่อนเขาจะร่ายได้" },
    { item: "orchid", why: "silence ตัดการร่ายทันที" },
  ],
  escape_mobility: [
    { item: "rod_of_atos", why: "มัดตัวจากระยะ ทำให้หนีไม่ออก" },
    { item: "gungir", why: "มัดเป็นพื้นที่ จับตัวลื่น ๆ ทั้งกลุ่ม" },
    { item: "orchid", why: "silence ปิดสกิลหนี" },
    { item: "sheepstick", why: "hex ปิดทุกอย่าง" },
    { item: "abyssal_blade", why: "bash ทะลุ BKB จับอยู่แน่" },
  ],
  tank_hp: [
    { item: "skadi", why: "ตัดฮีล + slow ตัวหนา" },
    { item: "silver_edge", why: "break ปิด passive กันดาเมจ" },
    { item: "diffusal_blade", why: "burn mana + slow" },
    { item: "bloodthorn", why: "ดาเมจ crit + silence ใส่ตัวเลือดเยอะ" },
  ],
  pure_damage: [
    { item: "heart", why: "เลือดเยอะคือทางเดียวที่กันดาเมจแท้ได้" },
    { item: "aeon_disk", why: "กันโดนดาเมจแท้ลบทีเดียว" },
    { item: "sphere", why: "บล็อกสกิลดาเมจแท้แบบเป้าหมายเดี่ยว" },
  ],
};

/**
 * What an enemy item tells you about the threat you are facing.
 * Selecting any item on /counter feeds these tags into the same engine the
 * hero picks use, so every item in the list does something.
 */
export const ITEM_THREAT: Record<string, Tag[]> = {
  // right-click scaling
  bfury: ["physical_carry"],
  butterfly: ["physical_carry", "evasion"],
  greater_crit: ["physical_carry", "physical_burst"],
  rapier: ["physical_burst", "physical_carry"],
  moon_shard: ["physical_carry"],
  mask_of_madness: ["physical_carry"],
  maelstrom: ["physical_carry"],
  mjollnir: ["physical_carry"],
  skadi: ["physical_carry", "tank_hp"],
  dragon_lance: ["physical_carry"],
  hurricane_pike: ["physical_carry", "escape_mobility"],
  sange_and_yasha: ["physical_carry", "tank_hp"],
  yasha: ["physical_carry", "escape_mobility"],
  disperser: ["physical_carry", "escape_mobility"],
  diffusal_blade: ["physical_carry", "escape_mobility"],
  monkey_king_bar: ["physical_carry"],
  desolator: ["physical_burst", "armor_stack"],
  blight_stone: ["physical_burst", "armor_stack"],
  witch_blade: ["physical_burst"],
  echo_sabre: ["physical_burst", "lockdown"],
  orb_of_corrosion: ["physical_burst"],
  armlet: ["physical_carry", "tank_hp"],
  silver_edge: ["physical_burst", "invis"],
  invis_sword: ["invis", "physical_burst"],
  abyssal_blade: ["lockdown", "physical_carry"],
  basher: ["lockdown", "physical_carry"],
  harpoon: ["lockdown", "physical_carry"],
  swift_blink: ["blink_init", "physical_carry"],
  falcon_blade: ["physical_carry"],
  helm_of_the_dominator: ["summons", "lifesteal"],
  helm_of_the_overlord: ["summons", "lifesteal"],
  satanic: ["lifesteal", "heal_sustain", "physical_carry"],
  vladmir: ["lifesteal", "heal_sustain"],

  // magic damage
  dagon_5: ["magic_burst"],
  ethereal_blade: ["magic_burst"],
  veil_of_discord: ["magic_burst"],
  aether_lens: ["magic_burst"],
  octarine_core: ["magic_burst", "heal_sustain"],
  kaya: ["magic_burst"],
  kaya_and_sange: ["magic_burst", "tank_hp"],
  yasha_and_kaya: ["magic_burst", "escape_mobility"],
  angels_demise: ["magic_burst", "physical_burst"],
  revenants_brooch: ["magic_burst"],
  devastator: ["magic_burst", "magic_dot"],
  bloodstone: ["magic_burst", "heal_sustain"],
  arcane_blink: ["blink_init", "magic_burst"],
  refresher: ["magic_burst", "lockdown"],
  radiance: ["magic_dot", "evasion"],
  urn_of_shadows: ["magic_dot"],
  spirit_vessel: ["magic_dot"],

  // control
  sheepstick: ["lockdown"],
  gungir: ["lockdown"],
  rod_of_atos: ["lockdown"],
  meteor_hammer: ["lockdown", "magic_dot"],
  wind_waker: ["lockdown", "escape_mobility"],
  orchid: ["silence"],
  bloodthorn: ["silence", "physical_burst"],
  mage_slayer: ["silence"],
  heavens_halberd: ["lockdown"],

  // mobility and initiation
  blink: ["blink_init"],
  overwhelming_blink: ["blink_init"],
  force_staff: ["escape_mobility"],
  cyclone: ["escape_mobility"],
  boots_of_bearing: ["escape_mobility"],
  ancient_janggo: ["escape_mobility"],
  travel_boots: ["escape_mobility"],

  // staying power
  heart: ["tank_hp", "heal_sustain"],
  vanguard: ["tank_hp"],
  crimson_guard: ["tank_hp", "armor_stack"],
  eternal_shroud: ["tank_hp"],
  wraith_pact: ["tank_hp"],
  aeon_disk: ["tank_hp"],
  sange: ["tank_hp"],
  pipe: ["tank_hp"],
  assault: ["armor_stack", "physical_carry"],
  solar_crest: ["armor_stack"],
  medallion_of_courage: ["armor_stack"],
  mekansm: ["heal_sustain"],
  guardian_greaves: ["heal_sustain"],
  holy_locket: ["heal_sustain"],
  pavise: ["heal_sustain"],
  glimmer_cape: ["invis"],
  manta: ["illusions", "silence"],
};

/** Enemy item -> what you buy back. Applies to any hero. */
export const ITEM_ANSWERS: Record<string, ItemPick[]> = {
  black_king_bar: [
    { item: "abyssal_blade", why: "bash ยังทำงานตอนเขาเปิด BKB" },
    { item: "silver_edge", why: "break ปิด passive แม้เปิด BKB" },
    { item: "nullifier", why: "ปลดของเซฟตัว เช่น ghost / glimmer" },
    { item: "heavens_halberd", why: "disarm ผ่าน BKB (magic immunity ไม่กัน)" },
    { item: "ancient_guardian", why: "เล่นยืด รอ BKB หมดก่อนค่อยเข้า" },
  ],
  butterfly: [
    { item: "monkey_king_bar", why: "true strike ลบ evasion" },
    { item: "bloodthorn", why: "true strike + silence" },
    { item: "assault", why: "ลดเกราะสู้กับ agi carry" },
  ],
  heart: [
    { item: "spirit_vessel", why: "ตัดการรีเจนเลือด" },
    { item: "silver_edge", why: "break ปิด Heart regen" },
    { item: "skadi", why: "ตัดฮีล + slow ไล่ตาย" },
  ],
  satanic: [
    { item: "spirit_vessel", why: "ตัดดูดเลือด 45%" },
    { item: "shivas_guard", why: "ตัดฮีลเป็นพื้นที่ตอนเขาเปิดอัล" },
    { item: "heavens_halberd", why: "disarm ทำให้ดูดเลือดไม่ได้" },
  ],
  blade_mail: [
    { item: "ghost", why: "อย่าตีมัน รอ blade mail หมดก่อน" },
    { item: "spirit_vessel", why: "ดาเมจจาก item ไม่โดนสะท้อนเต็ม" },
    { item: "cyclone", why: "ลอยไว้ 2.5 วิ ให้ blade mail หมดเวลา" },
  ],
  manta: [
    { item: "shivas_guard", why: "AoE ล้างร่างลวง" },
    { item: "mjollnir", why: "chain lightning เคลียร์ illusion" },
    { item: "bfury", why: "cleave ล้างทีเดียว" },
  ],
  radiance: [
    { item: "pipe", why: "ลด burn damage" },
    { item: "eternal_shroud", why: "แปลง burn เป็นมานา" },
    { item: "black_king_bar", why: "กัน burn ระหว่างคอมแบต" },
  ],
  blink: [
    { item: "ward_observer", why: "เห็นก่อนเขาเข้าระยะ" },
    { item: "aeon_disk", why: "กันโดนเปิดแล้วลบทันที" },
    { item: "force_staff", why: "หลุดจากระยะ combo หลังโดนเปิด" },
  ],
  invis_sword: [
    { item: "ward_sentry", why: "ของถูก เห็นตอนเขาเข้า" },
    { item: "dust", why: "ติดกระเป๋าไว้ตอบโต้ทันที" },
  ],
  silver_edge: [
    { item: "ward_sentry", why: "เห็นก่อนเขาเข้ามา break" },
    { item: "dust", why: "จับตอนเข้ามาใกล้" },
    { item: "ghost", why: "กันดาเมจกายภาพช่วงที่โดน break" },
  ],
  sheepstick: [
    { item: "black_king_bar", why: "กัน hex" },
    { item: "sphere", why: "บล็อก hex เม็ดแรก" },
    { item: "lotus_orb", why: "สะท้อน hex กลับ" },
  ],
  desolator: [
    { item: "assault", why: "เกราะเยอะชดเชย armor reduction" },
    { item: "crimson_guard", why: "บล็อคดาเมจต่อครั้ง" },
    { item: "ghost", why: "จังหวะโดนโฟกัส กันกายภาพ 100%" },
  ],
  dagon_5: [
    { item: "sphere", why: "บล็อก Dagon เม็ดแรก" },
    { item: "pipe", why: "ลดดาเมจเวท" },
    { item: "glimmer_cape", why: "magic resist ราคาถูก" },
  ],
  orchid: [
    { item: "sphere", why: "บล็อก silence เม็ดแรก" },
    { item: "black_king_bar", why: "กัน silence ตรง ๆ" },
    { item: "manta", why: "dispel silence" },
  ],
  nullifier: [
    { item: "black_king_bar", why: "BKB ยังกันดาเมจเวท ทำให้เขาเข้าไม่คุ้ม" },
    { item: "aeon_disk", why: "ปลด debuff ให้เองเมื่อเลือดต่ำ" },
  ],
  assault: [
    { item: "desolator", why: "ลดเกราะสู้กลับ" },
    { item: "solar_crest", why: "ลดเกราะเป้าหมายทีเดียวเยอะ" },
    { item: "shivas_guard", why: "ลด attack speed ตัดจุดแข็ง Assault" },
  ],
  pipe: [
    { item: "veil_of_discord", why: "เพิ่ม magic amp กลับ" },
    { item: "shivas_guard", why: "เปลี่ยนไปกดดันทางกายภาพแทน" },
    { item: "ancient_guardian", why: "เล่นยาว รอ barrier หมดก่อนเข้า" },
  ],
  ghost: [
    { item: "nullifier", why: "ปลด Ghost ทันที กลับมาตีเข้าได้" },
    { item: "sheepstick", why: "hex ทำงานแม้เขาเป็น ghost" },
    { item: "ethereal_blade", why: "เปลี่ยนไปเล่นดาเมจเวทช่วงที่เขากด ghost" },
  ],
  glimmer_cape: [
    { item: "dust", why: "ของถูกสุด เห็นตัวที่หายจาก glimmer" },
    { item: "nullifier", why: "ปลด glimmer ออกจากเป้าหมาย" },
    { item: "gem", why: "เห็นตลอด ไม่ต้องเสียจังหวะกด dust" },
  ],
  aeon_disk: [
    { item: "abyssal_blade", why: "ล็อคต่อทันทีหลัง disk ป็อป" },
    { item: "sheepstick", why: "ดิสยาวพอให้ทีมตามดาเมจต่อได้" },
    { item: "shivas_guard", why: "ดาเมจต่อเนื่องหลังโดน dispel" },
  ],
  crimson_guard: [
    { item: "greater_crit", why: "ดาเมจต่อครั้งสูง block 20-25 แทบไม่มีผล" },
    { item: "ethereal_blade", why: "ดาเมจเวทไม่โดน damage block" },
    { item: "desolator", why: "ลดเกราะชดเชยการบล็อค" },
  ],
  eternal_shroud: [
    { item: "desolator", why: "เปลี่ยนไปกดทางกายภาพ shroud ไม่กัน" },
    { item: "veil_of_discord", why: "ถ้ายังจะเล่นเวท ต้องเพิ่ม amp" },
    { item: "silver_edge", why: "break ปิด passive และเข้าโฟกัสตัวอื่น" },
  ],
  heavens_halberd: [
    { item: "sphere", why: "Halberd เป็นสกิลเป้าหมายเดี่ยว Linken บล็อกได้" },
    { item: "satanic", why: "strong dispel ปลด disarm ออกทันที" },
    { item: "hurricane_pike", why: "ถอยออกจากระยะ แล้วกลับมาตีตอน disarm หมด" },
  ],
  lotus_orb: [
    { item: "shivas_guard", why: "สกิล AoE ไม่โดนสะท้อน" },
    { item: "gungir", why: "มัดเป็นพื้นที่ ไม่ใช่เป้าหมายเดี่ยว" },
    { item: "nullifier", why: "ปลด lotus shield ก่อนใส่สกิลเดี่ยว" },
  ],
  skadi: [
    { item: "cyclone", why: "ลอยตัวเอง dispel slow ออก" },
    { item: "manta", why: "dispel slow และหนีต่อได้" },
    { item: "force_staff", why: "ดันตัวเองออกจากระยะตี" },
  ],
  bloodthorn: [
    { item: "black_king_bar", why: "กัน silence ตรง ๆ" },
    { item: "sphere", why: "บล็อกเม็ดแรก" },
    { item: "manta", why: "dispel silence ทันที" },
  ],
  monkey_king_bar: [
    { item: "ghost", why: "true strike ไม่ช่วยถ้าดาเมจกายภาพเข้าไม่ได้เลย" },
    { item: "crimson_guard", why: "บล็อคดาเมจต่อครั้งแทนการพึ่ง evasion" },
    { item: "assault", why: "เกราะเยอะชดเชยที่ evasion ใช้ไม่ได้" },
  ],
  abyssal_blade: [
    { item: "sphere", why: "Abyssal active เป็นเป้าหมายเดี่ยว Linken บล็อกได้" },
    { item: "aeon_disk", why: "ปลดสตันเมื่อเลือดต่ำ" },
    { item: "ghost", why: "bash จากการตีจะไม่เกิดถ้าเขาตีไม่เข้า" },
  ],
  shivas_guard: [
    { item: "moon_shard", why: "ชดเชย attack speed ที่โดนลด" },
    { item: "guardian_greaves", why: "ฮีลก้อนใหญ่ทีเดียว สู้กับ anti-heal ได้ดีกว่าฮีลทีละนิด" },
    { item: "assault", why: "attack speed aura ทั้งทีม" },
  ],
  rod_of_atos: [
    { item: "black_king_bar", why: "กัน root" },
    { item: "manta", why: "dispel root" },
    { item: "cyclone", why: "ลอยตัวเอง dispel ออก" },
  ],
  gungir: [
    { item: "black_king_bar", why: "กัน root จาก Gleipnir" },
    { item: "manta", why: "dispel root" },
    { item: "aeon_disk", why: "ปลดเมื่อโดนล็อคจนเลือดต่ำ" },
  ],
  meteor_hammer: [
    { item: "cyclone", why: "ลอยคนที่กำลังร่าย ตัดทันที" },
    { item: "rod_of_atos", why: "มัดจากระยะก่อนเขาจะร่ายจบ" },
    { item: "pipe", why: "ลดดาเมจเวทที่ตกใส่ทั้งกลุ่ม" },
  ],
  ethereal_blade: [
    { item: "sphere", why: "บล็อกเม็ดแรก ไม่โดน amp" },
    { item: "pipe", why: "ลดดาเมจเวทที่ตามมา" },
    { item: "black_king_bar", why: "ethereal ใส่ไม่ติดตอนเปิด BKB" },
  ],
  veil_of_discord: [
    { item: "pipe", why: "magic resist ชดเชย amp ที่โดนเพิ่ม" },
    { item: "eternal_shroud", why: "แปลงดาเมจเวทที่โดนเป็นมานา" },
    { item: "glimmer_cape", why: "ของถูกเพิ่ม magic resist ช่วงคอมแบต" },
  ],
  refresher: [
    { item: "aeon_disk", why: "กันโดน combo ซ้ำสองรอบ" },
    { item: "pipe", why: "ลดดาเมจเวทรวมทั้งสองรอบ" },
    { item: "black_king_bar", why: "ต้องมีระยะเวลากันสกิลให้ยาวพอ" },
  ],
  wind_waker: [
    { item: "abyssal_blade", why: "bash ก่อนเขาจะกดเซฟ" },
    { item: "nullifier", why: "ปลดของเซฟตัวอื่นที่ตามมา" },
    { item: "orchid", why: "silence ปิดการกดเซฟ" },
  ],
  guardian_greaves: [
    { item: "spirit_vessel", why: "ตัดฮีลจาก greaves 45%" },
    { item: "shivas_guard", why: "ตัดฮีลทั้งกลุ่มตอนเขากด" },
    { item: "blood_grenade", why: "ของถูก ตัดฮีลได้ตั้งแต่ต้นเกม" },
  ],
  mekansm: [
    { item: "spirit_vessel", why: "ตัดฮีลก่อนเขากด mek" },
    { item: "shivas_guard", why: "ตัดฮีลเป็นพื้นที่" },
  ],
  holy_locket: [
    { item: "spirit_vessel", why: "ตัดฮีลและเบิร์นเลือดสวน" },
    { item: "shivas_guard", why: "ตัดฮีลทั้งกลุ่ม" },
  ],
  vladmir: [
    { item: "spirit_vessel", why: "ตัด lifesteal aura ทั้งทีม" },
    { item: "shivas_guard", why: "ตัดฮีลเป็นพื้นที่" },
  ],
  helm_of_the_overlord: [
    { item: "shivas_guard", why: "เคลียร์ครีปที่โดนยึดเป็นกลุ่ม" },
    { item: "crimson_guard", why: "บล็อคดาเมจจากสมุนที่ตีถี่" },
    { item: "mjollnir", why: "chain lightning ล้างสมุนไว" },
  ],
  helm_of_the_dominator: [
    { item: "shivas_guard", why: "เคลียร์ครีปที่โดนยึด" },
    { item: "crimson_guard", why: "บล็อคดาเมจจากสมุน" },
  ],
  armlet: [
    { item: "spirit_vessel", why: "ตัดการรีเจนที่ armlet ต้องใช้" },
    { item: "skadi", why: "ตัดฮีล + slow ทำให้ toggle ไม่ทัน" },
    { item: "heavens_halberd", why: "disarm ทำให้ดาเมจ armlet ไร้ค่า" },
  ],
  greater_crit: [
    { item: "ghost", why: "จังหวะ crit ออก กด ghost ดาเมจหายหมด" },
    { item: "crimson_guard", why: "บล็อคดาเมจต่อครั้งทั้งทีม" },
    { item: "assault", why: "เกราะทีมลดดาเมจ crit ทั้งก้อน" },
  ],
  rapier: [
    { item: "ghost", why: "กันกายภาพ 100% ตอนเขาเข้าตี" },
    { item: "heavens_halberd", why: "disarm ยาวพอให้ทีมกลับมาสู้ได้" },
    { item: "crimson_guard", why: "บล็อคดาเมจและซื้อเวลาให้ทีม" },
  ],
  moon_shard: [
    { item: "shivas_guard", why: "ลด attack speed ตัดจุดแข็งโดยตรง" },
    { item: "ghost", why: "attack speed สูงแค่ไหนก็ตีไม่เข้า" },
    { item: "crimson_guard", why: "ยิ่งตีถี่ ยิ่งโดนบล็อคเยอะ" },
  ],
  harpoon: [
    { item: "sphere", why: "Harpoon เป็นสกิลเป้าหมายเดี่ยว Linken บล็อกได้" },
    { item: "aeon_disk", why: "โดนลากเข้าไปแล้วยังรอดกลับมาได้" },
    { item: "force_staff", why: "ดันตัวเองออกทันทีหลังโดนลาก" },
  ],
  force_staff: [
    { item: "rod_of_atos", why: "มัดไว้ก่อน force staff จะพาหนี" },
    { item: "gungir", why: "root เป็นพื้นที่ จับทั้งกลุ่ม" },
    { item: "sheepstick", why: "hex ปิดการใช้ของ" },
  ],
  hurricane_pike: [
    { item: "rod_of_atos", why: "มัดจากระยะไกลกว่า" },
    { item: "gungir", why: "จับกลุ่มที่ชอบถอยออก" },
    { item: "sheepstick", why: "hex ปิดการใช้ของหนี" },
  ],
  wraith_pact: [
    { item: "desolator", why: "ลดเกราะชดเชยดาเมจที่โดนหัก" },
    { item: "assault", why: "aura ลดเกราะสู้กับ damage reduction" },
    { item: "veil_of_discord", why: "เปลี่ยนไปกดทางเวทแทน" },
  ],
  vanguard: [
    { item: "greater_crit", why: "ดาเมจต่อครั้งสูง block แทบไม่มีผล" },
    { item: "desolator", why: "ลดเกราะให้ดาเมจทะลุมากขึ้น" },
    { item: "ethereal_blade", why: "ดาเมจเวทไม่โดน damage block" },
  ],
  mage_slayer: [
    { item: "pipe", why: "magic resist ชดเชยที่โดนลด" },
    { item: "manta", why: "dispel debuff ออก" },
    { item: "black_king_bar", why: "ถ้าจะเล่นเวทต่อ ต้องมีช่วงกันสกิล" },
  ],
  bloodstone: [
    { item: "spirit_vessel", why: "ตัดฮีลจาก bloodstone" },
    { item: "shivas_guard", why: "ตัดฮีลเป็นพื้นที่" },
    { item: "veil_of_discord", why: "เพิ่ม amp ให้ดาเมจเราแซงการฮีลของเขา" },
  ],
  travel_boots: [
    { item: "ward_observer", why: "เห็นก่อนว่าเขาจะ TP ไปดันเลนไหน" },
    { item: "boots_of_bearing", why: "ทีมต้องเคลื่อนไวพอจะตอบโต้การแบ่งเลน" },
  ],
  sphere: [
    { item: "gungir", why: "สกิล AoE ไม่โดน Linken บล็อก" },
    { item: "shivas_guard", why: "ดาเมจเป็นพื้นที่ ข้าม Linken ไปเลย" },
    { item: "blood_grenade", why: "ของถูกใช้ป็อป Linken ก่อนใส่สกิลจริง" },
  ],
  blight_stone: [
    { item: "assault", why: "เกราะทีมชดเชย armor reduction" },
    { item: "crimson_guard", why: "บล็อคดาเมจต่อครั้งช่วงที่เกราะโดนลด" },
  ],
};

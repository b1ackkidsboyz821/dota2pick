import type { Pos } from "./types";

/**
 * Every position a hero is realistically played in, with what changes about the
 * build there. `adds` are items that belong to THAT position specifically;
 * `drops` are items from the hero's overall popularity list that do not belong
 * on it (a pos 5 does not buy Battle Fury just because the pos 1 version does).
 *
 * Tuple form: [pos, role, note, adds?, drops?]
 */
type Row = [pos: Pos, role: string, note: string, adds?: string[], drops?: string[]];

const P: Record<string, Row[]> = {
  abaddon: [
    [3, "Offlane", "ยืนบังเลน กด Mist Coil แลกดาเมจ", ["blink", "manta", "echo_sabre"], ["radiance"]],
    [5, "Hard support", "เน้น Aphotic Shield dispel เซฟ core", ["glimmer_cape", "force_staff", "holy_locket"], ["radiance", "manta"]],
    [1, "Carry", "สายตี ใช้อัลติกันตายตอนโดนโฟกัส", ["radiance", "manta", "basher"]],
  ],
  alchemist: [
    [1, "Carry", "ฟาร์มไวสุดในเกม เร่ง Radiance/Midas", ["radiance", "assault", "basher"]],
    [3, "Offlane", "เล่นกดดันด้วย Acid Spray + Unstable", ["blink", "assault", "ultimate_scepter"], ["radiance"]],
    [2, "Mid", "เก็บเงินอัลติแจก Scepter ให้ทีม", ["ultimate_scepter", "blink"]],
  ],
  ancient_apparition: [
    [5, "Hard support", "Ice Blast ตัดฮีลทั้งทีม", ["aghanims_shard", "glimmer_cape", "force_staff"]],
    [4, "Soft support", "เล่นกดเลน Chilling Touch ระยะไกล", ["rod_of_atos", "glimmer_cape", "aghanims_shard"]],
  ],
  antimage: [
    [1, "Safelane carry", "ฟาร์ม Battle Fury ก่อนคอมแบต", ["bfury", "manta", "abyssal_blade"]],
  ],
  arc_warden: [
    [1, "Carry", "Tempest Double แยกฟาร์ม สองสาย", ["hand_of_midas", "maelstrom", "mjollnir"]],
    [2, "Mid", "เร่ง Midas แล้วดันเลนด้วยโคลน", ["maelstrom", "bloodthorn", "mjollnir"]],
  ],
  axe: [
    [3, "Offlane initiator", "Blink + Call + Blade Mail", ["blink", "blade_mail", "black_king_bar"]],
    [1, "Carry", "สายตัวหนา Culling Blade เก็บเงิน", ["heart", "black_king_bar", "shivas_guard"]],
  ],
  bane: [
    [5, "Hard support", "Fiend's Grip ล็อคตัวหลักฝั่งตรงข้าม", ["aether_lens", "glimmer_cape", "blink"]],
    [4, "Soft support", "Nightmare ตัดจังหวะคอมแบต", ["blink", "glimmer_cape", "ghost"]],
  ],
  batrider: [
    [3, "Offlane initiator", "Lasso ลากตัวหลักเข้าทีม", ["blink", "black_king_bar", "force_staff"]],
    [4, "Roaming", "โรมกดดันตั้งแต่ต้นเกม", ["blink", "force_staff", "aether_lens"]],
    [2, "Mid", "เคลียร์เวฟไว กดดัน side lane", ["blink", "ultimate_scepter", "black_king_bar"]],
    [5, "Hard support", "Lasso ลากตัวหลักเข้าทีม", ["blink", "force_staff", "ancient_janggo"]],
  ],
  beastmaster: [
    [3, "Offlane", "สมุนกดเลนและดันเร็ว", ["ultimate_scepter", "black_king_bar", "helm_of_the_overlord"]],
    [4, "Soft support", "Roar จับตัวในคอมแบต", ["aghanims_shard", "force_staff"]],
    [2, "Mid", "สัตว์เลี้ยงคุมแมพ เปิดด้วย Primal Roar", ["blink", "black_king_bar", "aghanims_shard"]],
    [1, "Carry", "สัตว์เลี้ยงช่วยฟาร์มและดันเลน", ["blink", "black_king_bar", "manta"]],
  ],
  bloodseeker: [
    [1, "Carry", "Rupture + Thirst ไล่เก็บ", ["maelstrom", "black_king_bar", "aghanims_shard"]],
    [3, "Offlane", "เล่นกดดันเลนด้วย Blood Rite", ["maelstrom", "black_king_bar", "manta"]],
    [4, "Roaming", "Rupture ตั้งแต่เลเวล 6 หาคิล", ["urn_of_shadows", "spirit_vessel"], ["bfury", "manta"]],
  ],
  bounty_hunter: [
    [4, "Roaming support", "Track ให้เงินทีม + หาคิล", ["spirit_vessel", "lotus_orb", "pipe"], ["bfury"]],
    [5, "Hard support", "Track หาเงินให้ทีมแทนการฟาร์ม", ["force_staff", "cyclone", "boots_of_bearing"], ["bfury"]],
  ],
  brewmaster: [
    [3, "Offlane", "Primal Split กินคอมแบต", ["black_king_bar", "blink", "ultimate_scepter"]],
    [1, "Carry", "สายตี Drunken Brawler ทนและแรง", ["radiance", "assault", "black_king_bar"]],
  ],
  bristleback: [
    [3, "Offlane tank", "หันหลังชนตลอด สะสม Warpath", ["aghanims_shard", "sange_and_yasha", "heart"]],
    [1, "Carry", "ตัวหนาเล่นยาว ดันเลนได้เอง", ["heart", "assault", "black_king_bar"]],
  ],
  broodmother: [
    [1, "Carry", "ดันเลนด้วยใยและลูก", ["orchid", "black_king_bar", "skadi"]],
    [3, "Offlane", "กดเลนแรง บีบให้ฝั่งตรงข้ามออกจากเลน", ["orchid", "black_king_bar", "bloodthorn"]],
    [2, "Mid", "Spiderlings ดันเลนแล้วกดดัน", ["orchid", "black_king_bar", "bloodthorn"]],
  ],
  centaur: [
    [3, "Offlane initiator", "Blink + Stomp เปิดคอมแบต", ["blink", "ultimate_scepter", "heart"]],
    [4, "Soft support", "Stampede เซฟทีมทั้งแมป", ["blink", "force_staff", "aghanims_shard"], ["heart"]],
  ],
  chaos_knight: [
    [1, "Carry", "Phantasm + Armlet ทุบทีเดียวจบ", ["armlet", "manta", "heart"]],
    [3, "Offlane", "สาย Reality Rift จับตัวเปิดคอมแบต", ["blink", "black_king_bar", "armlet"]],
  ],
  chen: [
    [4, "Roaming support", "ครีปป่ากดเลนและดัน", ["guardian_greaves", "solar_crest", "aghanims_shard"]],
    [5, "Hard support", "Hand of God ฮีลทั้งทีม", ["glimmer_cape", "force_staff", "guardian_greaves"]],
  ],
  clinkz: [
    [1, "Carry", "สาย Burning Barrage ระยะไกล", ["black_king_bar", "desolator", "greater_crit"]],
    [4, "Roaming", "ลอบเข้าเก็บ support", ["orchid", "spirit_vessel"], ["bfury", "moon_shard"]],
  ],
  rattletrap: [
    [3, "Offlane", "Hookshot เปิดและตัดแถวหลัง", ["blink", "force_staff", "cyclone"]],
    [4, "Roaming support", "Cogs จับตัวเดี่ยวตั้งแต่ต้นเกม", ["force_staff", "glimmer_cape", "blade_mail"]],
    [5, "Hard support", "Hookshot เปิดให้ทีมจากระยะไกล", ["pavise", "force_staff", "aghanims_shard"]],
  ],
  crystal_maiden: [
    [5, "Hard support", "Arcane Aura + Frostbite เซฟเลน", ["glimmer_cape", "force_staff", "black_king_bar"]],
    [4, "Soft support", "โรมด้วย Frostbite + slow", ["glimmer_cape", "blink", "boots_of_bearing"]],
  ],
  dark_seer: [
    [3, "Offlane", "Vacuum + Wall เปิดคอมแบตเป็นกลุ่ม", ["blink", "pipe", "ultimate_scepter"]],
    [4, "Soft support", "Ion Shell กดเลนและ stack ป่า", ["force_staff", "pipe"]],
  ],
  dark_willow: [
    [4, "Roaming support", "Cursed Crown + Bramble ล็อคตัว", ["blink", "aghanims_shard", "cyclone"]],
    [5, "Hard support", "เล่นเซฟเลนด้วย Shadow Realm", ["force_staff", "blink", "cyclone"]],
  ],
  dawnbreaker: [
    [3, "Offlane", "Solar Guardian เข้าช่วยได้ทั้งแมป", ["aghanims_shard", "echo_sabre", "blade_mail"]],
    [1, "Carry", "สายตี Starbreaker ฟื้นเลือด", ["echo_sabre", "black_king_bar", "assault"]],
    [4, "Soft support", "เล่นเซฟ core ด้วยอัลติระยะไกล", ["guardian_greaves", "force_staff"], ["assault"]],
  ],
  dazzle: [
    [5, "Hard support", "Shallow Grave กันตายให้ core", ["glimmer_cape", "aether_lens", "force_staff"]],
    [4, "Soft support", "Poison Touch กดเลนหนัก", ["holy_locket", "force_staff", "aghanims_shard"]],
  ],
  death_prophet: [
    [2, "Mid", "Exorcism ดันเลนจบเกมไว", ["black_king_bar", "shivas_guard", "kaya_and_sange"]],
    [3, "Offlane", "ตัวหนาดันเลนกดดัน", ["shivas_guard", "blink", "black_king_bar"]],
  ],
  disruptor: [
    [5, "Hard support", "Static Storm + Glimpse ปิดคอมแบต", ["glimmer_cape", "ultimate_scepter", "ancient_janggo"]],
    [4, "Soft support", "Glimpse ดึงตัวกลับตั้งแต่ต้นเกม", ["force_staff", "aghanims_shard", "ghost"]],
  ],
  doom_bringer: [
    [3, "Offlane", "Doom ปิดตัวหลักฝั่งตรงข้าม", ["blink", "black_king_bar", "shivas_guard"]],
    [1, "Carry", "สาย Devour ฟาร์มไวแล้วตัวหนา", ["radiance", "blink", "harpoon"]],
  ],
  dragon_knight: [
    [2, "Mid", "Elder Dragon ดันเลนไว", ["black_king_bar", "assault", "blink"]],
    [3, "Offlane", "ตัวหนายืนเลนไม่ตาย", ["blink", "ultimate_scepter", "black_king_bar"]],
    [1, "Carry", "สายตีตัวหนา เกราะเยอะ", ["armlet", "greater_crit", "mask_of_madness"]],
  ],
  drow_ranger: [
    [1, "Carry", "ยืนหลัง Marksmanship ตีไกล", ["dragon_lance", "hurricane_pike", "black_king_bar"]],
    [2, "Mid", "กดเลนด้วย Frost Arrows", ["dragon_lance", "black_king_bar", "silver_edge"]],
  ],
  earthshaker: [
    [4, "Roaming initiator", "Blink + Echo Slam", ["blink", "aghanims_shard", "ultimate_scepter"]],
    [3, "Offlane", "Enchant Totem แลกเลนแรง", ["blink", "black_king_bar", "refresher"]],
    [5, "Hard support", "Fissure บล็อกทางและเซฟเลน", ["blink", "force_staff", "glimmer_cape"]],
    [2, "Mid", "เก็บเลเวลไว Echo Slam เข้าคอมแบตก่อน", ["blink", "aghanims_shard", "black_king_bar"]],
  ],
  earth_spirit: [
    [4, "Roaming support", "Roll + Kick จับตัวตั้งแต่เลเวล 2", ["aghanims_shard", "ultimate_scepter", "spirit_vessel"]],
    [3, "Offlane", "Boulder Smash แลกเลนและเปิด", ["blink", "black_king_bar", "shivas_guard"]],
    [2, "Mid", "Rolling Boulder กดเลนแล้วโรมออกข้าง", ["spirit_vessel", "black_king_bar", "kaya_and_sange"]],
    [5, "Hard support", "Boulder Smash เปิดจากระยะไกล", ["spirit_vessel", "blink", "aether_lens"]],
  ],
  elder_titan: [
    [3, "Offlane", "Astral Spirit กดเลน + Natural Order", ["blink", "pipe", "ultimate_scepter"]],
    [4, "Soft support", "Echo Stomp เปิดคอมแบตเป็นกลุ่ม", ["blink", "force_staff", "solar_crest"]],
    [5, "Hard support", "Astral Spirit กดเลนและลดเกราะทั้งทีม", ["pavise", "ancient_janggo", "solar_crest"]],
  ],
  ember_spirit: [
    [2, "Mid", "Remnant กดดันทุกเลน", ["ultimate_scepter", "kaya_and_sange", "black_king_bar"]],
    [1, "Carry", "สายตี Sleight of Fist ฟาร์มไว", ["ultimate_scepter", "aghanims_shard", "black_king_bar"]],
    [3, "Offlane", "เล่นกดดันและหนีง่าย", ["kaya_and_sange", "black_king_bar"]],
  ],
  enchantress: [
    [4, "Soft support", "Enchant ครีปป่ากดเลน", ["aghanims_shard", "force_staff", "solar_crest"]],
    [1, "Carry", "Impetus ตีไกลดาเมจตามระยะ", ["aghanims_shard", "hurricane_pike", "black_king_bar"]],
    [5, "Hard support", "Untouchable กันตัวตีในเลน", ["force_staff", "ancient_janggo", "aghanims_shard"], ["hurricane_pike"]],
  ],
  enigma: [
    [3, "Offlane", "Black Hole ปิดคอมแบต", ["blink", "black_king_bar", "refresher"]],
    [4, "Soft support", "Eidolon กดเลนและ stack ป่า", ["blink", "aether_lens", "force_staff"]],
  ],
  faceless_void: [
    [1, "Carry", "Chrono จับกลุ่มแล้วตีจบ", ["mask_of_madness", "maelstrom", "black_king_bar"]],
    [3, "Offlane", "Time Walk แลกเลนแล้วเปิดด้วย Chrono", ["black_king_bar", "ultimate_scepter", "manta"]],
  ],
  grimstroke: [
    [5, "Hard support", "Soulbind + Ink Swell ปิดคอมแบต", ["aether_lens", "glimmer_cape", "ultimate_scepter"]],
    [4, "Soft support", "Phantom's Embrace กดเลนแรง", ["aether_lens", "force_staff", "sheepstick"]],
  ],
  gyrocopter: [
    [1, "Carry", "Flak Cannon ตีโดนทั้งกลุ่ม", ["black_king_bar", "greater_crit", "ultimate_scepter"]],
    [4, "Soft support", "สาย Rocket Barrage ดาเมจต้นเกม", ["urn_of_shadows", "ghost", "aghanims_shard"], ["maelstrom", "mjollnir"]],
    [2, "Mid", "เคลียร์เวฟไวด้วย Homing Missile", ["maelstrom", "black_king_bar"]],
  ],
  hoodwink: [
    [4, "Roaming support", "Bushwhack ล็อคตัวใส่ต้นไม้", ["aether_lens", "blink", "force_staff"]],
    [5, "Hard support", "เล่นเซฟเลนด้วย Scurry", ["glimmer_cape", "force_staff", "rod_of_atos"]],
  ],
  huskar: [
    [1, "Carry", "Life Break เลือดต่ำยิ่งแรง", ["armlet", "black_king_bar", "satanic"]],
    [2, "Mid", "กดเลนด้วย Burning Spear", ["armlet", "black_king_bar", "blink"]],
    [3, "Offlane", "เล่นแลกเลือดกับ offlane", ["armlet", "ultimate_scepter", "sange_and_yasha"]],
  ],
  invoker: [
    [2, "Mid", "QW กดดัน หรือ QE ฟาร์ม", ["travel_boots", "ultimate_scepter", "blink"]],
    [3, "Offlane", "QE Sunstrike กดดันจากระยะ", ["ultimate_scepter", "blink", "black_king_bar"]],
    [4, "Soft support", "สาย Tornado + EMP เปิดคอมแบต", ["aghanims_shard", "blink", "ultimate_scepter"], ["hand_of_midas"]],
  ],
  wisp: [
    [5, "Hard support", "Tether + Relocate เซฟและเปิด", ["holy_locket", "mekansm", "glimmer_cape"]],
    [4, "Soft support", "Relocate พา core ไปกดดัน", ["holy_locket", "black_king_bar", "mekansm"]],
  ],
  jakiro: [
    [5, "Hard support", "Macropyre + Ice Path กดพื้นที่", ["glimmer_cape", "force_staff", "ghost"]],
    [4, "Soft support", "Dual Breath กดเลนหนัก", ["ultimate_scepter", "cyclone", "ancient_janggo"]],
    [3, "Offlane", "เล่นกดเลนด้วยดาเมจเวท", ["ultimate_scepter", "black_king_bar"]],
  ],
  juggernaut: [
    [1, "Carry", "Omnislash + Healing Ward", ["maelstrom", "manta", "black_king_bar"]],
    [2, "Mid", "Blade Fury เคลียร์เวฟกดดัน", ["maelstrom", "manta", "ultimate_scepter"]],
  ],
  keeper_of_the_light: [
    [5, "Hard support", "Chakra เติมมานาทีม + Illuminate", ["glimmer_cape", "force_staff", "guardian_greaves"]],
    [4, "Soft support", "Blinding Light เซฟและกดเลน", ["force_staff", "aghanims_shard", "blink"]],
    [2, "Mid", "สายดัน Illuminate กดเลนไกล", ["octarine_core", "spirit_vessel", "orchid"]],
  ],
  kez: [
    [1, "Carry", "สลับท่าตีต่อเนื่อง", ["black_king_bar", "ultimate_scepter", "butterfly"]],
    [2, "Mid", "กดเลนด้วยดาเมจต้นเกมสูง", ["black_king_bar", "desolator", "ultimate_scepter"]],
    [3, "Offlane", "สลับท่ากดเลนแล้วเข้าคอมแบตด้วยดาบ", ["desolator", "mage_slayer", "black_king_bar"]],
  ],
  kunkka: [
    [2, "Mid", "X + Torrent + Tidebringer", ["black_king_bar", "silver_edge", "assault"]],
    [3, "Offlane", "Ghost Ship เปิดคอมแบต", ["black_king_bar", "shivas_guard", "pipe"]],
    [1, "Carry", "Tidebringer cleave ฟาร์มไว", ["radiance", "assault", "satanic"]],
  ],
  largo: [
    [3, "Offlane", "ตัวหนาเล่นแลกเลน", ["aghanims_shard", "ultimate_scepter", "black_king_bar"]],
    [4, "Soft support", "เล่นเปิดและกดดัน", ["glimmer_cape", "lotus_orb", "mekansm"]],
    [5, "Hard support", "เล่นเซฟเลนและบัฟทีม", ["holy_locket", "glimmer_cape", "aghanims_shard"]],
  ],
  legion_commander: [
    [3, "Offlane duelist", "Blink + Duel เก็บดาเมจถาวร", ["blink", "blade_mail", "black_king_bar"]],
    [4, "Roaming", "Press the Attack เซฟและโรม", ["blade_mail", "force_staff"], ["assault"]],
  ],
  leshrac: [
    [2, "Mid", "Pulse Nova กดดันทั้งแมป", ["bloodstone", "black_king_bar", "shivas_guard"]],
    [3, "Offlane", "Diabolic Edict ดันเลนเร็ว", ["bloodstone", "black_king_bar"]],
    [4, "Soft support", "Split Earth ล็อคตัวต้นเกม", ["aether_lens", "force_staff"], ["bloodstone"]],
  ],
  lich: [
    [5, "Hard support", "Frost Shield เซฟ core และกดเลน", ["glimmer_cape", "force_staff", "aghanims_shard"]],
    [4, "Soft support", "Sinister Gaze จับตัว", ["blink", "force_staff", "ultimate_scepter"]],
  ],
  life_stealer: [
    [1, "Carry", "Rage ทะลุเวท ไล่เก็บ", ["armlet", "sange_and_yasha", "abyssal_blade"]],
    [3, "Offlane", "Infest ซ่อนตัวเปิดคอมแบต", ["armlet", "black_king_bar", "ultimate_scepter"]],
  ],
  lina: [
    [2, "Mid", "Laguna Blade จบตัว", ["aghanims_shard", "black_king_bar", "dragon_lance"]],
    [4, "Soft support", "Light Strike Array ล็อคตัว", ["aether_lens", "blink", "glimmer_cape"]],
    [1, "Carry", "Fiery Soul สายตี attack speed", ["maelstrom", "black_king_bar", "mjollnir"]],
    [3, "Offlane", "Light Strike Array กดเลนจากระยะไกล", ["maelstrom", "yasha_and_kaya", "black_king_bar"]],
  ],
  lion: [
    [5, "Hard support", "Hex + Finger จบตัว", ["blink", "aghanims_shard", "force_staff"]],
    [4, "Roaming support", "โรมตั้งแต่เลเวล 3", ["blink", "aghanims_shard", "aether_lens"]],
  ],
  lone_druid: [
    [1, "Carry", "หมีดันเลน ตัวจริงยืนหลัง", ["mjollnir", "black_king_bar", "invis_sword"]],
    [3, "Offlane", "หมีกดเลนแรงต้นเกม", ["assault", "mjollnir", "diffusal_blade"]],
  ],
  luna: [
    [1, "Carry", "Glaives cleave + Eclipse", ["satanic", "manta", "black_king_bar"]],
    [2, "Mid", "เคลียร์เวฟไวด้วย Glaives", ["manta", "black_king_bar", "satanic"]],
  ],
  lycan: [
    [1, "Carry", "หมาป่าดันเลนเร็ว", ["helm_of_the_overlord", "assault", "black_king_bar"]],
    [3, "Offlane", "Howl กดดันและดันเลน", ["helm_of_the_overlord", "assault", "black_king_bar"]],
  ],
  magnataur: [
    [3, "Offlane initiator", "Blink + RP", ["blink", "black_king_bar", "sphere"]],
    [4, "Soft support", "Empower ให้ core ฟาร์ม", ["blink", "force_staff", "aghanims_shard"]],
    [2, "Mid", "RP เข้าคอมแบตก่อน Empower ให้ core", ["blink", "aghanims_shard", "black_king_bar"]],
  ],
  marci: [
    [4, "Roaming support", "Dispose + Rebound เปิดคอมแบต", ["blink", "black_king_bar", "basher"]],
    [3, "Offlane", "Unleash ตีแรงช่วงกลางเกม", ["black_king_bar", "blink", "basher"]],
    [1, "Carry", "สาย Unleash + lifesteal", ["black_king_bar", "blink", "basher"]],
    [5, "Hard support", "Rebound เปิดให้ core และ Sidekick บัฟ", ["pavise", "solar_crest", "black_king_bar"]],
  ],
  mars: [
    [3, "Offlane initiator", "Arena ปิดพื้นที่", ["blink", "black_king_bar", "aghanims_shard"]],
    [1, "Carry", "God's Rebuke cleave ฟาร์ม", ["assault", "satanic", "black_king_bar"]],
  ],
  medusa: [
    [1, "Carry", "Split Shot ฟาร์มไว Mana Shield ทน", ["manta", "skadi", "butterfly"]],
    [2, "Mid", "กดเลนด้วย Mystic Snake เติมมานา", ["manta", "black_king_bar", "skadi"]],
  ],
  meepo: [
    [1, "Carry", "แยกฟาร์มหลายเลน", ["blink", "skadi", "sange_and_yasha"]],
    [2, "Mid", "Poof ดันเลนและจับตัว", ["blink", "skadi", "sange_and_yasha"]],
  ],
  mirana: [
    [4, "Roaming support", "Arrow + Moonlight โรมหาคิล", ["blink", "force_staff", "wind_waker"]],
    [1, "Carry", "Leap + Starfall สายตี", ["black_king_bar", "ultimate_scepter", "cyclone"]],
    [2, "Mid", "กดเลนด้วย Starfall", ["black_king_bar", "ultimate_scepter"]],
    [5, "Hard support", "Sacred Arrow จากระยะไกล Moonlight เซฟ", ["cyclone", "mekansm", "urn_of_shadows"]],
  ],
  monkey_king: [
    [1, "Carry", "Wukong's Command กินคอมแบต", ["echo_sabre", "black_king_bar", "skadi"]],
    [3, "Offlane", "Boundless Strike แลกเลน", ["orb_of_corrosion", "black_king_bar", "basher"]],
    [4, "Roaming", "Mischief ลอบจับตัว", ["orb_of_corrosion", "spirit_vessel"], ["skadi"]],
    [2, "Mid", "Boundless Strike กดเลนแล้วเปิดจากต้นไม้", ["diffusal_blade", "aghanims_shard", "black_king_bar"]],
  ],
  morphling: [
    [1, "Carry", "Morph stat หนีตาย ตีแรง", ["manta", "black_king_bar", "skadi"]],
    [2, "Mid", "Waveform กดเลนและจับตัว", ["manta", "black_king_bar", "ethereal_blade"]],
  ],
  muerta: [
    [1, "Carry", "Pierce the Veil ดาเมจเวทจากออโต้", ["maelstrom", "black_king_bar", "mjollnir"]],
    [2, "Mid", "Dead Shot กดเลนไกล", ["maelstrom", "black_king_bar", "dragon_lance"]],
    [4, "Soft support", "Gunslinger + The Calling ล็อคพื้นที่", ["rod_of_atos", "force_staff", "ultimate_scepter"], ["maelstrom", "mjollnir"]],
  ],
  naga_siren: [
    [1, "Carry", "ร่างลวงฟาร์มและดัน", ["manta", "butterfly", "heart"]],
    [5, "Hard support", "Song of the Siren เซฟทีม", ["aghanims_shard", "blink", "solar_crest"], ["radiance", "heart"]],
    [3, "Offlane", "Ensnare จับตัวและแลกเลน", ["orchid", "manta", "black_king_bar"]],
    [4, "Soft support", "Song of the Siren เซฟทีม ไม่เน้นฟาร์ม", ["pavise", "solar_crest", "blink"]],
  ],
  furion: [
    [4, "Soft support", "Teleport กดดันทุกเลน", ["aghanims_shard", "force_staff", "solar_crest"]],
    [1, "Carry", "สายต้นไม้ + Midas ฟาร์มไว", ["maelstrom", "mjollnir", "black_king_bar"]],
    [2, "Mid", "ดันเลนและ split push", ["maelstrom", "mjollnir", "orchid"]],
    [3, "Offlane", "Sprout กดดันและหนีง่าย", ["orchid", "black_king_bar", "assault"]],
  ],
  necrolyte: [
    [3, "Offlane", "Heartstopper กดตัวหนา", ["aghanims_shard", "ultimate_scepter", "heart"]],
    [2, "Mid", "Death Pulse กดเลนและฮีล", ["aghanims_shard", "ultimate_scepter", "shivas_guard"]],
    [5, "Hard support", "เล่นฮีลเลนด้วย Death Pulse", ["holy_locket", "glimmer_cape"], ["heart"]],
    [1, "Carry", "Heartstopper + Reaper's Scythe สายยืนแลก", ["radiance", "aghanims_shard", "heart"]],
  ],
  night_stalker: [
    [3, "Offlane", "กลางคืนบุกหนัก", ["blink", "black_king_bar", "assault"]],
    [4, "Roaming", "Crippling Fear โรมคืนแรก", ["urn_of_shadows", "blink"], ["assault"]],
    [1, "Carry", "สายตีตอนกลางคืน", ["blink", "black_king_bar", "assault"]],
  ],
  nyx_assassin: [
    [4, "Roaming support", "Vendetta ลอบเก็บ support", ["blink", "ultimate_scepter", "dagon_5"]],
    [3, "Offlane", "Spiked Carapace แลกเลน", ["blink", "black_king_bar", "aghanims_shard"]],
    [5, "Hard support", "Vendetta ลอบเก็บ support ฝั่งตรงข้าม", ["blink", "cyclone", "aghanims_shard"]],
  ],
  ogre_magi: [
    [5, "Hard support", "Bloodlust บัฟ core ตัวหนาบังเลน", ["aether_lens", "glimmer_cape", "force_staff"]],
    [4, "Roaming support", "Fireblast + Ignite ล็อคตัว", ["aghanims_shard", "solar_crest", "force_staff"]],
  ],
  omniknight: [
    [5, "Hard support", "Purification + Guardian Angel", ["holy_locket", "glimmer_cape", "guardian_greaves"]],
    [3, "Offlane", "Heavenly Grace ตัวหนายืนเลน", ["black_king_bar", "echo_sabre", "octarine_core"]],
    [1, "Carry", "สายตีตัวหนา ฮีลเอง", ["echo_sabre", "assault", "harpoon"]],
  ],
  oracle: [
    [5, "Hard support", "False Promise กันตาย", ["aether_lens", "glimmer_cape", "holy_locket"]],
    [4, "Soft support", "Fortune's End กดเลนและ dispel", ["aether_lens", "guardian_greaves", "aeon_disk"]],
  ],
  obsidian_destroyer: [
    [2, "Mid", "Sanity's Eclipse ลบทั้งทีม", ["sheepstick", "witch_blade", "black_king_bar"]],
    [1, "Carry", "Arcane Orb ตีทะลุเกราะ", ["witch_blade", "hurricane_pike", "black_king_bar"]],
    [3, "Offlane", "Astral Imprisonment กดเลน", ["witch_blade", "black_king_bar"]],
  ],
  pangolier: [
    [2, "Mid", "Rolling Thunder กินคอมแบต", ["blink", "ultimate_scepter", "basher"]],
    [3, "Offlane", "Swashbuckle แลกเลน", ["blink", "ultimate_scepter", "mage_slayer"]],
    [4, "Roaming", "Lucky Shot ล็อคตัวโรม", ["orb_of_corrosion", "blink"], ["maelstrom"]],
  ],
  phantom_assassin: [
    [1, "Carry", "Coup de Grace จบทีเดียว", ["bfury", "desolator", "black_king_bar"]],
  ],
  phantom_lancer: [
    [1, "Carry", "ร่างลวงล้นแมป", ["diffusal_blade", "manta", "heart"]],
  ],
  phoenix: [
    [4, "Soft support", "Supernova พลิกคอมแบต", ["aghanims_shard", "sheepstick", "spirit_vessel"]],
    [3, "Offlane", "Fire Spirits กดเลนหนัก", ["shivas_guard", "refresher", "aghanims_shard"]],
    [5, "Hard support", "Supernova ทิ้งท้ายคอมแบต", ["aghanims_shard", "spirit_vessel", "solar_crest"]],
  ],
  primal_beast: [
    [3, "Offlane", "Pulverize ล็อคตัวหลัก", ["blink", "black_king_bar", "aghanims_shard"]],
    [4, "Roaming", "Onslaught โรมตั้งแต่ต้นเกม", ["blink", "force_staff", "vanguard"], ["heart"]],
    [1, "Carry", "Uproar สายตีตัวหนา", ["blink", "shivas_guard", "heart"]],
    [2, "Mid", "Pulverize ล็อคตัวหลักตั้งแต่ต้น", ["blink", "black_king_bar", "aghanims_shard"]],
  ],
  puck: [
    [2, "Mid", "Dream Coil ปิดคอมแบต", ["blink", "black_king_bar", "octarine_core"]],
    [3, "Offlane", "Illusory Orb กดดันและหนีง่าย", ["blink", "octarine_core", "black_king_bar"]],
  ],
  pudge: [
    [4, "Roaming support", "Hook หาคิลทั้งแมป", ["blink", "aghanims_shard", "spirit_vessel"]],
    [3, "Offlane tank", "Flesh Heap สะสมเลือด", ["blink", "blade_mail", "heart"]],
    [5, "Hard support", "Hook เซฟ core และเปิด", ["blink", "force_staff", "glimmer_cape"], ["heart"]],
  ],
  pugna: [
    [4, "Soft support", "Nether Ward ลงโทษการใช้สกิล", ["aether_lens", "glimmer_cape", "force_staff"]],
    [2, "Mid", "Decrepify + Blast ดันเลนไว", ["kaya_and_sange", "octarine_core", "travel_boots"]],
    [5, "Hard support", "Decrepify เซฟ core", ["glimmer_cape", "force_staff", "blink"]],
  ],
  queenofpain: [
    [2, "Mid", "Sonic Wave + Blink กดดัน", ["kaya_and_sange", "black_king_bar", "shivas_guard"]],
    [4, "Soft support", "Scream of Pain กดเลน", ["aghanims_shard", "spirit_vessel", "ultimate_scepter"], ["shivas_guard"]],
    [3, "Offlane", "Blink หนีและกดดันเลน", ["kaya_and_sange", "black_king_bar"]],
  ],
  razor: [
    [3, "Offlane", "Static Link ดูดดาเมจตัวหลัก", ["manta", "black_king_bar", "pipe"]],
    [1, "Carry", "Static Link + Eye of the Storm", ["maelstrom", "black_king_bar", "mjollnir"]],
    [2, "Mid", "กดเลนด้วย Plasma Field", ["black_king_bar", "manta", "sange_and_yasha"]],
  ],
  riki: [
    [4, "Roaming support", "Smoke Screen ปิดสกิลและจับ", ["orb_of_corrosion", "diffusal_blade", "force_staff"]],
    [1, "Carry", "Backstab ตีจากหลัง", ["diffusal_blade", "manta", "basher"]],
  ],
  ringmaster: [
    [4, "Soft support", "Tame the Beasts ล็อคพื้นที่", ["aether_lens", "force_staff", "glimmer_cape"]],
    [5, "Hard support", "เล่นเซฟเลนและตั้ง combo", ["glimmer_cape", "force_staff", "solar_crest"]],
  ],
  rubick: [
    [5, "Hard support", "ขโมยสกิลคีย์ของฝั่งตรงข้าม", ["blink", "aether_lens", "force_staff"]],
    [4, "Soft support", "Telekinesis จับตัวต้นเกม", ["blink", "aether_lens", "glimmer_cape"]],
  ],
  sand_king: [
    [3, "Offlane", "Blink + Epicenter", ["blink", "black_king_bar", "shivas_guard"]],
    [4, "Roaming", "Burrowstrike โรมและ stack ป่า", ["blink", "force_staff", "veil_of_discord"]],
    [2, "Mid", "Sand Storm ยืนเลนทน Epicenter เข้าคอมแบต", ["blink", "aghanims_shard", "black_king_bar"]],
  ],
  shadow_demon: [
    [5, "Hard support", "Disruption เซฟ core และ Demonic Purge", ["aether_lens", "glimmer_cape", "blink"]],
    [4, "Soft support", "Shadow Poison กดเลนหนัก", ["aether_lens", "blink", "ultimate_scepter"]],
  ],
  nevermore: [
    [2, "Mid", "Razes กดเลน Requiem จบตัว", ["black_king_bar", "ultimate_scepter", "yasha_and_kaya"]],
    [1, "Carry", "Presence ลดเกราะ สายตี", ["black_king_bar", "satanic", "silver_edge"]],
    [3, "Offlane", "Shadowraze แลกเลน", ["black_king_bar", "satanic"]],
  ],
  shadow_shaman: [
    [5, "Hard support", "Shackles + Hex ล็อคตาย", ["blink", "aether_lens", "force_staff"]],
    [4, "Soft support", "Serpent Ward ดันเลนเร็ว", ["blink", "aghanims_shard", "force_staff"]],
  ],
  silencer: [
    [5, "Hard support", "Global Silence ปิดคอมแบต", ["glimmer_cape", "force_staff", "refresher"]],
    [2, "Mid", "Glaives of Wisdom กดเลน", ["refresher", "hurricane_pike", "black_king_bar"]],
    [4, "Soft support", "Last Word กดเลนและตัดสกิล", ["refresher", "force_staff", "aghanims_shard"]],
  ],
  skywrath_mage: [
    [5, "Hard support", "Mystic Flare จบตัว", ["aether_lens", "glimmer_cape", "ultimate_scepter"]],
    [4, "Soft support", "Ancient Seal + Arcane Bolt กดเลน", ["aether_lens", "aghanims_shard", "force_staff"]],
  ],
  slardar: [
    [3, "Offlane", "Corrosive Haze ลดเกราะเปิดทาง", ["blink", "black_king_bar", "assault"]],
    [4, "Roaming", "Slithereen Crush จับตัวโรม", ["blink", "black_king_bar", "aghanims_shard"], ["assault"]],
    [1, "Carry", "สายตี Bash of the Deep", ["echo_sabre", "black_king_bar", "assault"]],
  ],
  slark: [
    [1, "Carry", "ขโมย stat และหายตัวฟื้นเลือด", ["echo_sabre", "silver_edge", "skadi"]],
    [4, "Roaming", "Pounce จับตัวตั้งแต่ต้นเกม", ["orb_of_corrosion", "diffusal_blade"], ["skadi"]],
  ],
  snapfire: [
    [4, "Soft support", "Cookie + Mortimer กดพื้นที่", ["force_staff", "glimmer_cape", "ultimate_scepter"]],
    [5, "Hard support", "Cookie เซฟ core", ["glimmer_cape", "force_staff", "aghanims_shard"]],
    [3, "Offlane", "Lil' Shredder แลกเลน", ["aghanims_shard", "black_king_bar"]],
  ],
  sniper: [
    [1, "Carry", "ยืนหลังสุด ระยะตีไกล", ["dragon_lance", "hurricane_pike", "black_king_bar"]],
    [2, "Mid", "Shrapnel กดเลนและเคลียร์เวฟ", ["dragon_lance", "maelstrom", "black_king_bar"]],
    [4, "Soft support", "สาย Shrapnel + Assassinate", ["urn_of_shadows", "force_staff"], ["dragon_lance", "hurricane_pike"]],
    [3, "Offlane", "Headshot กดเลนจากระยะปลอดภัย", ["dragon_lance", "maelstrom", "hurricane_pike"]],
  ],
  spectre: [
    [1, "Carry", "Haunt เข้าถึงทั้งแมป", ["radiance", "manta", "black_king_bar"]],
  ],
  spirit_breaker: [
    [4, "Roaming support", "Charge หาคิลทั้งแมป", ["ancient_janggo", "cyclone", "black_king_bar"]],
    [3, "Offlane", "Greater Bash ตัวหนากดดัน", ["invis_sword", "black_king_bar", "cyclone"]],
    [5, "Hard support", "Charge กดดันทั้งแมพตั้งแต่ต้นเกม", ["ancient_janggo", "invis_sword", "cyclone"]],
  ],
  storm_spirit: [
    [2, "Mid", "Ball Lightning จับตัวทั้งแมป", ["kaya_and_sange", "black_king_bar", "witch_blade"]],
    [3, "Offlane", "Ball Lightning กดดันเลนแล้วถอยได้", ["kaya_and_sange", "witch_blade", "black_king_bar"]],
  ],
  sven: [
    [1, "Carry", "God's Strength + cleave", ["echo_sabre", "black_king_bar", "harpoon"]],
    [3, "Offlane", "Storm Hammer เปิดคอมแบต", ["blink", "black_king_bar", "echo_sabre"]],
  ],
  techies: [
    [4, "Soft support", "Sticky Bomb + Blast Off กดเลน", ["aether_lens", "glimmer_cape", "force_staff"]],
    [5, "Hard support", "วางกับดักคุมพื้นที่", ["glimmer_cape", "force_staff", "aether_lens"]],
    [3, "Offlane", "Reactive Tazer แลกเลน", ["force_staff", "blink"]],
  ],
  templar_assassin: [
    [2, "Mid", "Psi Blades + Meld burst", ["desolator", "blink", "black_king_bar"]],
    [1, "Carry", "Refraction ทนและตีแรง", ["desolator", "black_king_bar", "swift_blink"]],
  ],
  terrorblade: [
    [1, "Carry", "Metamorphosis + ร่างลวง", ["manta", "skadi", "black_king_bar"]],
    [2, "Mid", "Conjure Image ดันเลนไว", ["manta", "black_king_bar", "skadi"]],
  ],
  tidehunter: [
    [3, "Offlane", "Ravage ปิดคอมแบต", ["blink", "black_king_bar", "shivas_guard"]],
    [4, "Soft support", "Anchor Smash กดเลนและเปิด", ["blink", "aghanims_shard", "pipe"]],
  ],
  shredder: [
    [3, "Offlane", "Timber Chain กดดันไม่ให้จับ", ["kaya_and_sange", "aghanims_shard", "shivas_guard"]],
    [2, "Mid", "Whirling Death กดเลน", ["kaya_and_sange", "shivas_guard", "blink"]],
  ],
  tinker: [
    [2, "Mid", "Rearm ยิงสกิลไม่หยุด", ["blink", "black_king_bar", "shivas_guard"]],
    [4, "Soft support", "Laser + March กดเลน", ["aether_lens", "force_staff", "veil_of_discord"], ["shivas_guard"]],
    [3, "Offlane", "Rearm กดดันเลนแล้วถอยด้วย Defense Matrix", ["blink", "kaya_and_sange", "aether_lens"]],
  ],
  tiny: [
    [2, "Mid", "Avalanche + Toss จบตัว", ["blink", "echo_sabre", "black_king_bar"]],
    [1, "Carry", "Tree Grab cleave ฟาร์ม", ["echo_sabre", "assault", "black_king_bar"]],
    [3, "Offlane", "Toss เปิดคอมแบต", ["blink", "black_king_bar", "shivas_guard"]],
    [4, "Roaming", "Toss จับตัวโรมต้นเกม", ["blink", "force_staff", "ghost"], ["assault"]],
    [5, "Hard support", "Toss + Avalanche เก็บตัวตั้งแต่ต้นเกม", ["blink", "force_staff", "cyclone"]],
  ],
  treant: [
    [5, "Hard support", "Living Armor ฮีลทั้งแมป", ["aghanims_shard", "blink", "force_staff"]],
    [4, "Soft support", "Nature's Guise ลอบเข้าจับ", ["blink", "force_staff", "solar_crest"]],
    [3, "Offlane", "Overgrowth ปิดคอมแบต", ["blink", "pipe", "ultimate_scepter"]],
  ],
  troll_warlord: [
    [1, "Carry", "Battle Trance + Whirling Axes", ["black_king_bar", "satanic", "aghanims_shard"]],
    [3, "Offlane", "Whirling Axes แลกเลน", ["bfury", "black_king_bar", "basher"]],
  ],
  tusk: [
    [4, "Roaming support", "Snowball โรมหาคิล", ["blink", "ultimate_scepter", "force_staff"]],
    [3, "Offlane", "Tag Team กดเลนแรง", ["blink", "black_king_bar", "ultimate_scepter"]],
    [5, "Hard support", "Snowball เซฟและ Walrus Punch สวน", ["blink", "pavise", "aghanims_shard"]],
  ],
  abyssal_underlord: [
    [3, "Offlane", "Firestorm กดเลนและตัวหนา", ["ultimate_scepter", "pipe", "shivas_guard"]],
    [1, "Carry", "Atrophy Aura สะสมดาเมจ", ["ultimate_scepter", "shivas_guard", "black_king_bar"]],
    [4, "Soft support", "Dark Rift พาทีมกดดัน", ["force_staff", "pipe", "glimmer_cape"], ["heart"]],
  ],
  undying: [
    [5, "Hard support", "Decay ขโมยเลือด + Tombstone", ["holy_locket", "glimmer_cape", "force_staff"]],
    [3, "Offlane", "Tombstone กดเลนหนัก", ["blink", "aghanims_shard", "pipe"]],
    [4, "Soft support", "Decay stack กดเลนต้นเกม", ["aghanims_shard", "force_staff", "solar_crest"]],
  ],
  ursa: [
    [1, "Carry", "Fury Swipes + Roshan tempo", ["blink", "black_king_bar", "abyssal_blade"]],
    [4, "Roaming", "Earthshock + Overpower จับตัว", ["orb_of_corrosion", "blink", "spirit_vessel"], ["satanic"]],
    [3, "Offlane", "Enrage ทนและไล่เก็บ", ["blink", "black_king_bar", "abyssal_blade"]],
  ],
  vengefulspirit: [
    [5, "Hard support", "Swap เซฟ core และ Wave of Terror", ["aether_lens", "glimmer_cape", "solar_crest"]],
    [4, "Soft support", "Magic Missile จับตัวต้นเกม", ["aghanims_shard", "solar_crest", "force_staff"]],
  ],
  venomancer: [
    [3, "Offlane", "Plague Ward กดเลนไม่ให้ยืน", ["force_staff", "ultimate_scepter", "dragon_lance"]],
    [4, "Soft support", "Poison Nova กดพื้นที่", ["spirit_vessel", "force_staff", "ultimate_scepter"]],
    [5, "Hard support", "Ward คุมพื้นที่และเซฟเลน", ["glimmer_cape", "force_staff", "mekansm"]],
  ],
  viper: [
    [2, "Mid", "Poison Attack กดเลนหนัก", ["dragon_lance", "hurricane_pike", "black_king_bar"]],
    [3, "Offlane", "Corrosive Skin ทนดาเมจเวท", ["dragon_lance", "black_king_bar", "shivas_guard"]],
    [1, "Carry", "Nethertoxin สายตีระยะไกล", ["dragon_lance", "black_king_bar", "skadi"]],
  ],
  visage: [
    [3, "Offlane", "Familiar กดเลนและดัน", ["vladmir", "aghanims_shard", "assault"]],
    [4, "Soft support", "Grave Chill จับตัว", ["aghanims_shard", "force_staff", "solar_crest"]],
    [2, "Mid", "Soul Assumption กดเลน", ["vladmir", "black_king_bar"]],
  ],
  void_spirit: [
    [2, "Mid", "Astral Step กดดันทุกเลน", ["black_king_bar", "octarine_core", "ultimate_scepter"]],
    [4, "Soft support", "Aether Remnant ล็อคตัว", ["aghanims_shard", "ultimate_scepter", "cyclone"]],
    [3, "Offlane", "Dissimilate หนีและกดเลน", ["kaya_and_sange", "black_king_bar"]],
  ],
  warlock: [
    [5, "Hard support", "Fatal Bonds + Golem", ["aghanims_shard", "glimmer_cape", "force_staff"]],
    [4, "Soft support", "Shadow Word ฮีลและกดเลน", ["aether_lens", "force_staff", "ultimate_scepter"]],
  ],
  weaver: [
    [1, "Carry", "Shukuchi + Geminate ตีแรง", ["maelstrom", "black_king_bar", "greater_crit"]],
    [4, "Roaming", "Swarm กดเลนและ Time Lapse เซฟ", ["aghanims_shard", "spirit_vessel", "ultimate_scepter"], ["skadi"]],
    [3, "Offlane", "หนีเก่ง ยืนเลนไม่ตาย", ["aghanims_shard", "black_king_bar", "maelstrom"]],
  ],
  windrunner: [
    [4, "Roaming support", "Shackleshot + Powershot", ["maelstrom", "aghanims_shard", "force_staff"]],
    [2, "Mid", "Focus Fire กดดันกลางเกม", ["maelstrom", "black_king_bar", "mjollnir"]],
    [1, "Carry", "Focus Fire + Windrun สายตี", ["maelstrom", "black_king_bar", "mjollnir"]],
    [5, "Hard support", "Shackleshot เปิดและ Windrun เซฟ", ["blink", "aghanims_shard", "rod_of_atos"]],
    [3, "Offlane", "Powershot กดเลนไกล Focus Fire สวน", ["maelstrom", "dragon_lance", "black_king_bar"]],
  ],
  winter_wyvern: [
    [5, "Hard support", "Cold Embrace เซฟ core", ["glimmer_cape", "force_staff", "aeon_disk"]],
    [4, "Soft support", "Splinter Blast กดเลน", ["aether_lens", "blink", "force_staff"]],
  ],
  witch_doctor: [
    [5, "Hard support", "Maledict + Death Ward", ["aether_lens", "glimmer_cape", "ultimate_scepter"]],
    [4, "Soft support", "Paralyzing Cask กดเลน", ["force_staff", "ghost", "ultimate_scepter"]],
  ],
  skeleton_king: [
    [1, "Carry", "Reincarnation ตายยาก", ["armlet", "assault", "black_king_bar"]],
    [3, "Offlane", "Hellfire Blast แลกเลน", ["armlet", "black_king_bar", "radiance"]],
    [4, "Roaming", "Vampiric Spirit + stun โรม", ["urn_of_shadows", "blink"], ["assault"]],
  ],
  zuus: [
    [2, "Mid", "Arc Lightning กดเลน Thundergod เก็บ", ["aghanims_shard", "octarine_core", "kaya_and_sange"]],
    [4, "Soft support", "สาย Lightning Bolt กดเลน", ["aether_lens", "aghanims_shard", "force_staff"], ["kaya_and_sange"]],
    [5, "Hard support", "เล่นเซฟเลนและกดดาเมจระยะไกล", ["ultimate_scepter", "aether_lens", "glimmer_cape"]],
    [3, "Offlane", "Arc Lightning เคลียร์เวฟ ยืนไกลปลอดภัย", ["kaya_and_sange", "aghanims_shard", "refresher"]],
  ],
};

export type PositionInfo = {
  pos: Pos;
  role: string;
  note: string;
  adds: string[];
  drops: string[];
};

export const HERO_POSITIONS = new Map<string, PositionInfo[]>(
  Object.entries(P).map(([key, rows]) => [
    key,
    rows.map(([pos, role, note, adds = [], drops = []]) => ({ pos, role, note, adds, drops })),
  ]),
);

export function positionInfos(key: string): PositionInfo[] {
  return HERO_POSITIONS.get(key) ?? [];
}

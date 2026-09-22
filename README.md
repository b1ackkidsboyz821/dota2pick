# Dota2Pick

เว็บช่วยตัดสินใจตอน pick/ออกของ Dota 2 — ครบทุกฮีโร่ในเกม

- **ของตามตำแหน่ง pos 1-5** — starting / early / core / situational พร้อมเหตุผล (ฮีโร่ที่มีคู่มือเขียนเอง)
- **ของที่คนออกจริงบ่อยสุด** — จาก item popularity ของ OpenDota (ฮีโร่ที่เหลือทั้งหมด)
- **ใครแก้ทางเราได้ / เราแก้ทางใครได้** — winrate จริงจากสถิติ OpenDota ทุกคู่
- **เลือกทีมฝั่งตรงข้าม** → ได้ทั้งฮีโร่ที่ควร pick และของที่ควรซื้อพร้อมเหตุผล

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## ชั้นข้อมูล

| ชั้น | ไฟล์ | ครอบคลุม | ที่มา |
| --- | --- | --- | --- |
| hero / item list | `src/data/heroes.json`, `items.json` | 127 / 409 | OpenDota constants |
| threat tags | `src/data/heroTags.ts` | ทุกตัว | เขียนเอง |
| ตำแหน่งที่เล่นได้ + role + ของประจำตำแหน่ง | `src/data/heroPositions.ts` | 127 ตัว รวม 316 ตำแหน่ง | เขียนเอง + ปรับตามสถิติ league |
| matchup winrate | `src/data/generated/matchups.json` | ทุกตัว | OpenDota `/heroes/{id}/matchups` |
| item popularity | `src/data/generated/item-popularity*.json` | ทุกตัว | OpenDota `/heroes/{id}/itemPopularity` |
| item ที่ซื้อจริงแยกตาม pos | `src/data/generated/position-items-raw.json`, `position-builds.json` | ทุกตัว | OpenDota `/explorer` (SQL บน league match) |
| คู่มือละเอียด (build ตาม pos, counterPlay) | `src/data/builds.ts` | 25 ตัว | เขียนเอง |
| ของแก้ทางตาม threat / ตามไอเทมศัตรู | `src/data/counters.ts` | 107 ไอเทมที่ซื้อจริง (มีคำแนะนำเฉพาะชิ้น 56, อนุมานจาก tag 83) | เขียนเอง |
| รายการไอเทมที่เลือกได้ | `src/data/generated/pickable-items.json` | 107 ชิ้น | derive จาก constants |

`src/lib/heroData.ts` เป็นตัว merge. `getPositionBuilds(key)` คืน build แยกตาม pos:

1. ถ้ามีคู่มือเขียนเองของ pos นั้น ใช้อันนั้น (source: curated)
2. ไม่มี แต่ pos นั้นมีตัวอย่างพอใน `position-builds.json` → ใช้ของที่ pos นั้นซื้อจริง ไม่ต้องเดา (source: measured)
3. ไม่มีทั้งคู่ → เอา item popularity รวมทุก pos มากรอง: ตัด `drops` ของ pos นั้น + ตัดของ core ออกถ้าเป็น pos 4/5 (หรือตัดของ support ออกถ้าเป็น pos 1-3) แล้วเอา `adds` ของ pos นั้นขึ้นก่อน (source: derived)

## อัปเดตข้อมูลจาก OpenDota

```bash
npm run data:all      # ดึงใหม่ทั้งหมดแล้ว derive (~12 นาที)
npm run data:fetch    # matchup winrate
npm run data:items    # raw item popularity
npm run data:positions # item ที่ซื้อจริง แยกตาม pos 1-5 (league match 180 วัน)
npm run data:build    # derive item list + position-builds.json + matrix.json จากไฟล์ raw — ไม่ยิง API
```

สคริปต์ที่ดึง API เซฟทุกตัวที่เสร็จลงไฟล์ทันที รันซ้ำจะข้ามตัวที่มีแล้ว (`--force` เพื่อดึงใหม่หมด)
ที่ช้าเพราะ throttle ให้พ้น rate limit ของ OpenDota free tier

อยากเปลี่ยนเกณฑ์กรองไอเทม (เช่นตัด component ออกเพิ่ม) แก้ `KEEP` / `NOISE` ใน `scripts/build-derived.mjs`
แล้วรัน `npm run data:build` อย่างเดียว ไม่ต้องดึง API ใหม่

## เพิ่มคู่มือเขียนเองให้ฮีโร่

เพิ่ม object ใน `HEROES` ที่ `src/data/builds.ts` ใช้ `key` ให้ตรงกับใน `heroes.json`
item ทุกตัวใช้ key ของ OpenDota (เช่น `black_king_bar`, `bfury`, `cyclone`)

ตรวจว่า key ที่พิมพ์มีจริง:

```bash
node -e "const i=require('./src/data/items.json'),k=new Set(i.map(x=>x.key));const s=require('fs').readFileSync('src/data/builds.ts','utf8');const f=new Set([...s.matchAll(/\"([a-z0-9_]{3,40})\"/g)].map(m=>m[1]));console.log([...f].filter(x=>!k.has(x)).join('\n'))"
```

(จะโชว์ทั้ง hero key และ tag ปนมาด้วย — สนใจเฉพาะบรรทัดที่ควรเป็นชื่อ item)

## Engine แนะนำของ

หน้า `/counter`:

1. ฮีโร่ศัตรูที่เลือก → รวม threat tags ทั้งหมด นับความถี่
2. แต่ละ tag → `TAG_COUNTERS[tag]` ให้คะแนนตามลำดับความสำคัญ × จำนวนฮีโร่ที่มี tag นั้น
3. item ของศัตรูที่เลือก → `ITEM_ANSWERS[item]` บวกคะแนนเพิ่ม
4. เรียงคะแนน แสดง 14 อันดับแรกพร้อมเหตุผลทุกข้อที่ทำให้ของชิ้นนั้นถูกแนะนำ

หน้า `/items` แสดงรายไอเทม: เจอชิ้นนี้ฝั่งตรงข้ามแล้วควรซื้ออะไร — ใช้ `ITEM_ANSWERS` ก่อน ถ้าไม่มีจะ fallback ไป `ITEM_THREAT` → `TAG_COUNTERS`

ส่วน "ฮีโร่ที่ควร pick" ใช้ `matrix.json` — winrate เฉลี่ยของแต่ละฮีโร่เมื่อเจอทีมที่เลือก ตัดคู่ที่มีตัวอย่างน้อยกว่า 50 เกมทิ้ง

## ตรวจคู่มือที่เขียนเองกับสถิติจริง

```bash
npm run data:check                                # รายงานเต็ม
node scripts/check-curated.mjs --strict           # เฉพาะ flag ที่ควรแก้จริง
node scripts/check-curated.mjs --hero bristleback # ดูทีละตัว
node scripts/check-curated.mjs --json             # เอาไปต่อกับ tool อื่น
```

ข้อมูลใน `builds.ts` / `heroPositions.ts` เขียนจากความรู้ ไม่ได้วัดจากเกมจริง สคริปต์นี้เทียบกับ purchase count ดิบของ OpenDota แล้วรายงาน:

| flag | แปลว่า |
| --- | --- |
| `RARE` | เราแนะนำใน core / early / adds แต่แทบไม่มีคนซื้อจริง — น่าจะ outdated |
| `rare?` | pos นั้นมี league match ไม่ถึง 60 เกม ตัดสินไม่ได้ ต้องถอยไปใช้ตัวเลขรวมทุก pos (ท้ายบรรทัดบอกจำนวนเกม) |
| `cond?` | อยู่ใน situational อยู่แล้ว ซื้อเฉพาะบางเกม ต่ำเป็นเรื่องปกติ |
| `MISSING` | คนซื้อกันเยอะแต่คู่มือเราไม่พูดถึงเลย — นับเฉพาะ pos ที่มีคู่มือเขียนเอง เพราะ pos อื่นเว็บแสดงของที่วัดจริงอยู่แล้ว |

ถ้ารัน `npm run data:positions` แล้ว จะวัดเทียบกับเกมที่เล่น pos นั้นจริงๆ (ท้ายบรรทัดบอกว่าวัดจาก pos ไหน)
pos ที่มีน้อยกว่า 60 เกมจะถอยไปใช้ตัวเลขรวมทุก pos และติด flag `rare?` แทน
เทียบแบบเดิมได้ด้วย `node scripts/check-curated.mjs --all-pos`

% คือสัดส่วนเทียบกับไอเทมที่คนซื้อมากสุดใน bucket เดียวกัน ไม่ใช่ winrate
กรอง component ออกแล้ว (Ogre Axe, Sacred Relic ฯลฯ) และไม่นับรองเท้าใน MISSING

สถานะล่าสุด: **RARE = 0 · MISSING = 0 · รองเท้าตรงหมด · ไม่มีตำแหน่งที่คนเล่นจริงแล้วตารางไม่ list**
เหลือ `rare?` 22 — pos ที่ league มีไม่ถึง 60 เกม ตัดสินไม่ได้ ไม่ใช่ว่าผิด ดู "ข้อจำกัด"

เครื่องมือช่วยแก้:

```bash
node scripts/worksheet.mjs --hero bristleback   # ของที่เราแนะนำ เทียบกับ top item จริงทุก bucket
node scripts/suggest-fixes.mjs                  # เสนอตัวแทนของทุก RARE จากของที่ pos นั้นซื้อจริง (ต้องรีวิวเอง)
node scripts/apply-adds-patch.mjs patch.json    # เขียน adds ทับใน heroPositions.ts จาก [hero, pos, items[]]
node scripts/fill-adds.mjs                      # สร้าง patch เติม adds จากของที่ pos นั้นซื้อจริง (เก็บของเดิมที่ข้อมูลยังรองรับ)
node scripts/check-positions.mjs                # ตำแหน่งที่คนเล่นจริงแต่ตารางไม่ list / list ไว้แต่แทบไม่มีคนเล่น
node scripts/check-boots.mjs                    # รองเท้าในคู่มือ เทียบกับที่ pos นั้นซื้อจริง
node scripts/add-position.mjs rows.json         # เพิ่มแถวตำแหน่งใหม่ใน heroPositions.ts
node scripts/apply-build-patch.mjs patch.json   # แก้ early/core และเติม situational ใน builds.ts
node scripts/apply-boots-patch.mjs patch.json   # สลับรองเท้าใน early ของ builds.ts
```

## ข้อจำกัด

- winrate จาก OpenDota เป็นค่าเฉลี่ยทุก rank และเป็น public matches — ใช้เป็นสัญญาณ ไม่ใช่คำตอบตายตัว
- ตำแหน่งใน `position-items-raw.json` เป็นการเดา ไม่ใช่ label: OpenDota เก็บแค่ `lane_role` เลยแยก support ด้วยอันดับ gold ในทีมตัวเอง (อันดับ 5 = pos5, อันดับ 4 = pos4) ที่เหลือดูจากเลน และ mid ต้องฟาร์มอันดับ 1-2 ด้วย เพราะ `lane_role` จัด offlane ที่โรมเป็น mid บ่อย — pos4 ที่ฟาร์มแซง offlane ยังถูกนับผิดฝั่งอยู่
- `position-items-raw.json` มาจาก league match เท่านั้น (~23,500 เกม/365 วัน) ไม่ใช่ public match เหมือนชั้นอื่น
- คู่มือเขียนเองมี 25 ตัว ที่เหลือใช้สถิติแทน
- MISSING ส่วนใหญ่เป็น Aghanim's Shard / Scepter / Blink / BKB ที่คู่มือไม่ได้เขียนถึงเป็นรายตัว — เป็นงานเขียนคู่มือ ไม่ใช่ข้อมูลผิด
- flag `rare?` ที่เหลือคือ pos ที่ league มีไม่ถึง 60 เกม (pub เล่นแต่ pro ไม่เล่น) ยังต้องใช้คนตัดสิน
- `--min` ของ fetcher ต้องต่ำ: ตอนใช้ `--min 3` pos ที่มีหลักร้อยเกมอ่านของที่ซื้อจริงเป็น 0% เพราะของที่ซื้อ 1-2 ครั้งถูกตัดทิ้ง ทำให้เกิด flag ผิด 12 อัน
- `heroPositions.ts` ยัง list 54 ตำแหน่งที่แทบไม่มีใครเล่นใน league (เช่น Juggernaut pos2) — ไม่ได้ลบ เพราะ pub กับ pro เล่นไม่เหมือนกัน

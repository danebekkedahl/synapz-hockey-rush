# SYNAPZ HOCKEY RUSH — FOUNDER VISION NOTES (v10.9.4 Playbook Architecture)

**Project:** Synapz Hockey Rush — **v1.2 Direct-Touch Vision Release** (100% Standalone Graphics-First Ice-Vision Endless Runner)  
**Co-Founders:** Dane Bekkedahl (`danebekkedahl@gmail.com`) & Evan Bekkedahl (`evanbekk@gmail.com`)  
**Architecture Standard:** v10.9.4 Playbook Architecture (`styles.css?v=1.2`, `app.js?v=1.2`)  
**Storage Namespace:** `synapz_rush_*` (`synapz_rush_profile`, `synapz_rush_report_state`, `synapz_rush_taste`, `synapz_rush_live_upgrades`, `synapz_rush_red_flags`)  
**Local Dev Port:** `http://localhost:8090` | **Live URL:** `https://danebekkedahl.github.io/synapz-hockey-rush/`

---

## 1. Core Pillar: Graphics-First 35-Degree Broadcast Ice Vision (v1.2 Buttonless Sheet)

Synapz Hockey Rush puts **high-craft 2.5D/3D depth perspective, unobstructed bottom-to-top ice sightlines, and direct-touch spatial hockey IQ** first. Rather than cluttering the bottom ice with virtual buttons, v1.2 renders a **100% Buttonless Bottom Ice Sheet** (`0` bottom gameplay buttons) with an **Elevated 35-Degree Broadcast Camera**:

- **Active Skater 25%+ Closer to Bottom Edge:** Shifting the active puck carrier's screen-space Y anchor down to `~73.5%` of viewport height (`~26.5%` from the bottom edge vs `43.4%` in v1.0) opens a massive, unobstructed upper-ice runway to read all 3 lanes, weaving teammates, defender sticks, and oncoming nets far up the sheet.
- **50% Slower Level 1 Pace + 15% Compounding Level Progression:**
  - `LEVEL_1_BASE_SPEED = 12.55` (50% slower than v1.0's `~25.1` pace for calm, spacious ice reads).
  - `levelBaseSpeed = 12.55 * Math.pow(1.15, level - 1)` (`L1 = 12.55`, `L2 = 14.43`, `L3 = 16.60`, `L4 = 19.09`, `L5 = 21.95`), with all obstacle, defender, and oncoming net spawning tied strictly to **ice distance (`z` meters)** rather than wall-clock timers.
- **Ice Surface Realism:** Specular overhead arena light reflections, rink markings (red center line, blue lines, faceoff circles and dots, crease paint, dasher boards, plexiglass stanchions), persistent skate-blade carve trails etched into the ice, and directional snow-spray particle bursts on sharp lane cuts.
- **Animated Skaters & Crisp Jerseys:** Multi-frame stride animations wearing high-contrast **Synapz Hockey Rush** sweaters with numbers, helmets, visors, and taped sticks.
- **Dynamic On-Ice Lead Rings:** Projected ahead of every teammate's skate blades in 3D perspective, shifting color in real time as passing lanes open and close:
  - **Emerald Green (`#10b981`):** Clean, open lead window — high-velocity tape-to-tape completion.
  - **Amber (`#f59e0b`):** Tight contested window — thread-the-needle bonus (`+5 SP`) if timed cleanly.
  - **Crimson (`#ef4444`):** Defender stick or obstacle actively blocking the passing lane — high interception risk.

---

## 2. Core Gameplay Loop: Direct-Touch Swipes, Target-Tap Passes & Net-Tap One-Timers

### 100% Buttonless Direct-Touch Controls (`0 <= 4` Buttons Rule Strictly Satisfied)
1. **Swipe Left / Swipe Right Anywhere on Ice (`>= 26px`):** Zero-latency horizontal drag/flick immediately cuts the active skater left or right one lane with snow-spray carve particles, resetting the drag anchor on every lane shift so continuous back-and-forth dekes work without lifting a finger.
2. **Tap Directly on Any Teammate or Lead Ring (`+42px` Touch Forgiveness):** Fires the puck specifically to **that tapped skater**, requiring the player to scan the sheet and choose the open Emerald/Amber option over a Crimson stick-blocked lane. Tapping directly inside an Emerald Lead Ring awards a crisp `"TAPE TO TAPE!"` callout (`+5 SP` bonus on weaving levels).
3. **Tap Directly on Oncoming Net at `3/3` Passes (`+38px` Touch Forgiveness):** Once `PASSES: 3/3` triggers `"ONE-TIMER ARMED!"`, oncoming nets pulse glowing target corners with a `"🎯 TAP NET!"` cue. Tapping the net launches a blistering one-timer aimed toward the **tapped corner/side** of the cage. Tapping a net before `3/3` passes pulses `PASSES: X/3` with a `"3 PASSES TO UNLOCK SHOT"` visual nudge.
4. **Full Desktop Mouse + Keyboard Parity:** Mouse drag/click on `#ice-canvas`, `ArrowLeft`/`ArrowRight` or `A`/`D` to move, `Q`/`E`/`W`/`ArrowUp` to pass, and `Space`/`S` to shoot.
5. **Level 1 Auto-Fading 3-Second Micro-Hint:** Displays `SWIPE ICE TO MOVE • TAP TEAMMATE TO PASS • TAP NET AT 3/3` cleanly at shift start on Level 1 with zero bracket leaks.

### Pass & Camera Whip-Pan Transfer
- Tapping `[🏒 Pass]` fires a crisp puck along the ice toward the targeted teammate's **On-Ice Lead Ring**.
- As the puck travels, the broadcast camera executes a smooth, eased **Camera Whip-Pan Transfer** (`cameraX`, depth focus, and subtle lateral bank) tracking the puck trajectory and locking seamlessly onto the receiving skater, who immediately becomes the **newly controlled puck carrier**.

### Mandatory 3-Pass Rule (`PASSES: X/3`)
- Hockey is won by moving the puck faster than defenders can skate. `[🎯 Shoot]` stays **locked** (`PASSES: 0/3`, `1/3`, `2/3`) until **3 consecutive tape-to-tape passes** are completed.
- Completing Pass #3 (`PASSES: 3/3`) triggers **"ONE-TIMER ARMED!"**, unlocks and pulses `[🎯 Shoot]`, charges the carrier's stick aura, and illuminates **glowing emerald/gold target corners** on oncoming nets.

### Progressive Teammate Weaving
- **Levels 1–2 (Foundation Support):** Wingers hold steady parallel support lanes, letting players master lane cuts, poke-check reads, and whip-pan transfers.
- **Levels 3–4 (Diagonal Slot Cuts):** Teammates execute diagonal lane switches and slot cuts across the ice, requiring players to anticipate movement and hit Lead Rings in stride.
- **Levels 5+ (Scissor Switches & Covered Decoys):** High-tempo criss-cross scissor weaves paired with shadowed decoy skaters so players must scan all 3 lanes and pass to the truly open Emerald/Amber Lead Ring.

### Oncoming Nets, 3-2-1 Countdown & 3-Goal Level Up (`GOALS: X/3`)
- Firing an armed shot (`[🎯 Shoot]`) as an oncoming goal cage enters shooting range launches a blistering one-timer into the illuminated upper corner.
- Scoring triggers a **synthesized arena goal horn**, **goal-light strobe**, **net twine ripple**, **story point reward**, and a crisp **`3... 2... 1... PUCK DROP!`** on-ice countdown before dropping the next puck at full stride.
- Scoring **`3/3` goals** completes the arena level, awards a Shift Completion Bonus, unlocks the next themed arena, and escalates base ice speed.

### 3-Puck Shift Quiver (`●●●`) & 5 Themed Obstacle Arenas
- Every shift begins with a **3-Puck Quiver (`●●●`)**.
- Passing into a Crimson defender lane (interception) or colliding head-on with an arena obstacle/defender resets the pass chain to `0/3`, triggers a **1.0-second stumble recovery** with brief invulnerability blink, and consumes **1 Puck**. Losing all 3 pucks ends the shift and offers instant rematch or Locker Hub upgrades.
- **The 5 Themed Arena Levels:**
  1. **Level 1 — Backyard Twilight Pond:** String lights overhead, timber snowbank boards, wooden pond crates & snowdrifts, crisp indigo twilight sky reflection.
  2. **Level 2 — Skills Combine Barn:** High-bay LED training facility, neon agility tripods & slide-board bumpers, laser speed gates.
  3. **Level 3 — Local Travel Rink:** Classic municipal arena, scuffed dasher boards, heavy traffic cones & aggressive stick-checkers, warm halogen reflections.
  4. **Level 4 — Outdoor Winter Classic:** Stadium floodlights, falling snow flurries, frost ridges & stadium camera dollies along the boards, deep midnight atmosphere.
  5. **Level 5 — Pro Championship Arena:** Jumbotron spotlight beams, golden championship banners, elite pinching defensemen, covered decoy coverage, and high-speed scissor weaves.

---

## 3. 2-Button Entry Gate, 5 Illustrated Hub Rooms & 3-Stage Speech Bubble

- **2-Button Entry Gate:** Zero clutter at launch — players choose between **`[🏒 DROP THE PUCK]`** (instant action on the ice) and **`[🚪 LOCKER HUB]`** (illustrated 5-room progression hub).
- **5 Point-and-Click Illustrated Hub Rooms:**
  1. **Tunnel Entry Gate:** Arena tunnel view, quick-select arena level & age-tier guide selector.
  2. **Player Locker Stall:** Spend earned Story Points on 4 core attributes: **Skating Speed**, **Pass Zip**, **Ice Vision Range**, and **Shot Power**.
  3. **Coach Chalkboard Story Map:** Interactive 5-Arena progression map showing level unlocks, weave patterns, and goal stars.
  4. **Pro Shop Workbench:** Customize Synapz Hockey Rush sweater colorway, stick tape, and blade trail tint.
  5. **Trophy Concourse:** Illustrated display case tracking shift milestones, streak medals, and Championship Cups.
- **Peer Guides & `toNaturalTalk()` Speech Pipeline:**
  - **Leo (8U–10U):** Energetic pond-hockey winger with upbeat, clear encouragement.
  - **Maya (11U–14U):** Sharp playmaking center focused on timing lead rings and reading sticks.
  - **Coach Vance (15U–18U+):** Pro-style bench tactician breaking down scissor switches and weak-side ice vision.
  - **3-Stage Word-Streaming Speech Bubble:**
    - *Stage 1:* Compact `~25%` viewport quadrant pop-up streaming words naturally.
    - *Stage 2:* Brief hold on completed coaching cue with instant dismiss tap.
    - *Stage 3:* Shrinks smoothly into a bottom-left **Replay Circle** (`🔊` avatar badge) so it never blocks the ice; tapping replays the cue.
  - **`toNaturalTalk()` Sanitizer:** Strips all `[brackets]`, diagnostic tags, and system tokens before any character reaches the DOM.
- **Seat 0 Red-Flag Modal (`🚩`):** Persistent header/corner `🚩` button lets Dane or Evan log live playtest notes tagged with exact game state into `synapz_rush_red_flags` (strictly suppressed from external dispatch when `window.__TEST_MODE__ === true`).

---

## 4. 13-Seat Advisory Board & Seat 13 24-Play Rotation

| Seat | Role | Core Mandate in Synapz Hockey Rush |
| :--- | :--- | :--- |
| **Seat 0** | Co-Founders (Dane & Evan) | Final product taste, `🚩` Red-Flag override, `+3 / -5 / 0` Taste Profile authority |
| **Seat 1** | Lead 3D/2.5D Broadcast Cinematographer | 35-degree camera pitch, multi-rink horizon depth, specular ice & whip-pan easing |
| **Seat 2** | NHL Ice-Vision & Tactics Director | 3-pass rule integrity, Lead Ring color truth, progressive winger weave geometry |
| **Seat 3** | Youth Ergonomics & Thumb-Zone Architect | Strict `<= 4` gameplay buttons, `0px` horizontal overflow at `390x844` |
| **Seat 4** | Game Feel & Kinetic Juice Designer | Snow-spray particles, blade carve persistence, goal horn & net twine ripple |
| **Seat 5** | Audio & Procedural Synth Engineer | WebAudio skate scrape, crisp tape-to-tape slap, countdown chimes, arena horn |
| **Seat 6** | Progression & Locker Economy Designer | Story point pacing, 4-stat Locker Stall upgrades, Pro Shop customization |
| **Seat 7** | Narrative & Peer Guide Director | Leo / Maya / Coach Vance voice authenticity & `toNaturalTalk()` zero-leak guarantee |
| **Seat 8** | Mobile Frame-Rate & Canvas Optimizer | 60fps 2D hardware-accelerated projection without DOM thrash |
| **Seat 9** | Visual Accessibility & Contrast Lead | Emerald/Amber/Crimson Lead Ring legibility + distinct ring stroke patterns |
| **Seat 10** | Onboarding & Pacing Specialist | 2-Button Entry Gate, forgiving Level 1 Pond lanes, 3-2-1 post-goal reset |
| **Seat 11** | Storage & Privacy Isolation Engineer | 100% `synapz_rush_*` storage namespace isolation & `__TEST_MODE__` guard |
| **Seat 12** | Inbox Zero Workflow Architect | 3-Tab Phone Board (`report.html`), `<= 56` decision buttons, Top-Up `12 - untouched` |
| **Seat 13** | 24-Play Automated Playtest Auditor | Runs `deep_playtest_audit.js` across 24 rotation checks before any deploy |

---

## 5. 3-Tab "Inbox Zero + Top-Up Mode" Phone Board (`report.html`)

- **Viewport Lock:** `0px` horizontal overflow at `390x844` iPhone viewport.
- **3 Sticky Top Tabs:** `📥 To Review (12)`, `🛠️ Queued (N)`, and `✅ Live in App (N)`.
- **Single-Listing 12-Card Cap (`<= 56` Decision Buttons Total):**
  - Loads Batch A (`#1–#5` badged `🏆 TOP 5 CONSENSUS`, `#6–#12` standard).
  - Pre-codes Batches B, C, D, and E (60 total Synapz Hockey Rush graphics, camera, and gameplay upgrades).
- **2x2 Tactile Decision Grid per Review Card (48 buttons across 12 cards):**
  - `[✅ Approve]` (`+3` Founder Taste) -> moves card immediately to `🛠️ Queued`
  - `[⏭️ Skip & Reassess]` (`0` Founder Taste) -> moves card immediately to `🛠️ Queued`
  - `[🔍 Explain This]` -> opens inline plain-English why/impact breakdown
  - `[❌ Reject]` (`-5` Founder Taste) -> moves card immediately to `🛠️ Queued`
- **Top-Up Mode & Double-Tap Guard:**
  - `🛠️ Queued` provides `[↩️ Move Back to Review]` per card and `[🚀 DEPLOY QUEUED & TOP UP INBOX TO 12]`.
  - Double-tap / 0-card deploy guard prevents empty deploys.
  - Deploying promotes approved cards into `✅ Live in App` (each with `[↩️ 1-Click Undo]`), archives rejected/skipped items cleanly, preserves untouched cards in `📥 To Review`, and pulls `(12 - untouchedCount)` unseen cards from Batches B–E (sorted by Founder Taste affinity) to top `📥 To Review` back up to exactly 12 (until pool exhaustion).

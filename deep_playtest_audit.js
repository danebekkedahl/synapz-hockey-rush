/**
 * SYNAPZ HOCKEY RUSH — Seat 13 Automated Deep Playtest Audit (v10.9.4)
 * Enforces window.__TEST_MODE__ = true (zero test-email/network spam)
 * Target: http://localhost:8090
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:8090';

async function launchBrowser() {
  const attempts = [
    { channel: 'chrome', headless: true },
    { channel: 'msedge', headless: true },
    { headless: true }
  ];
  for (const opts of attempts) {
    try {
      return await chromium.launch(opts);
    } catch (e) {
      // try next installed channel
    }
  }
  throw new Error('Could not launch Chromium/Chrome/Edge for Playwright audit.');
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

(async () => {
  const results = [];
  function record(id, check, pass, detail) {
    results.push({ id, check, pass: !!pass, detail });
    const icon = pass ? '✅ PASS' : '❌ FAIL';
    console.log(`${icon} | [${id}] ${check} — ${detail}`);
  }

  const outboundLeaks = [];
  const consoleErrors = [];

  const browser = await launchBrowser();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });

  // Enforce window.__TEST_MODE__ = true BEFORE any script executes
  await context.addInitScript(() => {
    window.__TEST_MODE__ = true;
  });

  const page = await context.newPage();

  page.on('request', (req) => {
    const url = req.url();
    if (!url.startsWith(BASE_URL) && !url.startsWith('data:') && !url.startsWith('blob:')) {
      outboundLeaks.push(url);
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(err.message);
  });

  try {
    /* ========================================================================
       PART A: index.html — ENTRY GATE, LOCKER HUB, 35° GAMEPLAY & ISOLATION
       ======================================================================== */
    await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload({ waitUntil: 'networkidle' });

    // 1. Entry Gate 2-Button Check & 390x844 Overflow
    const gateMetrics = await page.evaluate(() => {
      const overflowPx = Math.max(0, document.documentElement.scrollWidth - window.innerWidth);
      const gateBtns = Array.from(document.querySelectorAll('#entry-gate button')).filter((b) => b.offsetParent !== null);
      return {
        testMode: window.__TEST_MODE__ === true,
        overflowPx,
        gateBtnCount: gateBtns.length,
        gateLabels: gateBtns.map((b) => b.textContent.trim()),
        cameraDeg: window.__SYNAPZ_RUSH__.cameraElevationDeg,
        arenaCount: window.__SYNAPZ_RUSH__.arenas.length
      };
    });

    record(
      'A01',
      '__TEST_MODE__ Active & 2-Button Entry Gate',
      gateMetrics.testMode && gateMetrics.gateBtnCount === 2 && gateMetrics.cameraDeg === 35 && gateMetrics.arenaCount === 5,
      `TEST_MODE=${gateMetrics.testMode}, GateButtons=${gateMetrics.gateBtnCount} (${gateMetrics.gateLabels.join(' / ')}), Cam=${gateMetrics.cameraDeg}°, Arenas=${gateMetrics.arenaCount}`
    );

    // 2. Locker Hub 5 Illustrated Rooms + Upgrade Purchase + Overflow Check
    await page.click('#btn-locker-hub');
    const hubCheck = await page.evaluate(async () => {
      const rooms = ['tunnel', 'stall', 'chalkboard', 'proshop', 'trophy'];
      let maxOverflow = 0;
      let svgCount = 0;
      for (const r of rooms) {
        document.querySelector(`.room-tab[data-room="${r}"]`).click();
        const ov = Math.max(0, document.documentElement.scrollWidth - window.innerWidth);
        if (ov > maxOverflow) maxOverflow = ov;
        if (document.querySelector('#hub-room-stage svg')) svgCount++;
      }
      // Purchase a Locker Stall upgrade with initial Story Points
      document.querySelector('.room-tab[data-room="stall"]').click();
      const beforeSp = window.__SYNAPZ_RUSH__.getProfile().storyPoints;
      const upgBtn = document.querySelector('[data-upgrade="speed"]');
      if (upgBtn && !upgBtn.disabled) upgBtn.click();
      const afterSp = window.__SYNAPZ_RUSH__.getProfile().storyPoints;
      const speedLv = window.__SYNAPZ_RUSH__.getProfile().upgrades.speed;
      return { maxOverflow, svgCount, beforeSp, afterSp, speedLv };
    });

    record(
      'A02',
      '5 Illustrated Hub Rooms & Locker Stall Upgrade',
      hubCheck.maxOverflow === 0 && hubCheck.svgCount === 5 && hubCheck.speedLv === 2 && hubCheck.afterSp < hubCheck.beforeSp,
      `RoomsSVG=${hubCheck.svgCount}/5, SpeedLv=${hubCheck.speedLv}, SP=${hubCheck.beforeSp}->${hubCheck.afterSp}, Overflow=${hubCheck.maxOverflow}px`
    );

    // 3. Seat 0 Red-Flag Modal (Local Save + Zero Outbound Spam)
    await page.click('#hub-redflag-link');
    await page.fill('#redflag-input', '[DIAG_TEST] Great whip-pan feel on mobile!');
    await page.click('#btn-save-redflag');
    await page.click('#btn-close-redflag');

    // 4. Drop Puck into Active Shift — Verify 0px Overflow & <= 4 Gameplay Action Buttons
    await page.click('#btn-hub-play');
    await sleep(180);

    const activePlayDom = await page.evaluate(() => {
      const overflowPx = Math.max(0, document.documentElement.scrollWidth - window.innerWidth);
      const visibleButtons = Array.from(document.querySelectorAll('button')).filter((b) => {
        const style = window.getComputedStyle(b);
        return style.display !== 'none' && style.visibility !== 'hidden' && b.offsetParent !== null;
      });
      const ctrlButtons = Array.from(document.querySelectorAll('#thumb-controls button'));
      const shootDisabledAtZero = document.getElementById('btn-shoot').disabled;
      return {
        overflowPx,
        visibleBtnCount: visibleButtons.length,
        ctrlBtnCount: ctrlButtons.length,
        ctrlLabels: ctrlButtons.map((b) => b.textContent.replace(/\s+/g, ' ').trim()),
        shootDisabledAtZero
      };
    });

    record(
      'A03',
      'index.html 0px Horizontal Overflow at 390x844',
       gateMetrics.overflowPx === 0 && hubCheck.maxOverflow === 0 && activePlayDom.overflowPx === 0,
      `Gate=${gateMetrics.overflowPx}px, Hub=${hubCheck.maxOverflow}px, Gameplay=${activePlayDom.overflowPx}px`
    );

    record(
      'A04',
      'Strict <= 4 Gameplay Action Buttons',
      activePlayDom.ctrlBtnCount === 4 && activePlayDom.visibleBtnCount <= 4,
      `ThumbControls=${activePlayDom.ctrlBtnCount}, VisibleButtons=${activePlayDom.visibleBtnCount} [${activePlayDom.ctrlLabels.join(', ')}]`
    );

    // 5. Peer Guide 3-Stage Speech Bubble -> Replay Circle + toNaturalTalk() Sanitizer
    const speechAudit = await page.evaluate(async () => {
      const sanitizedSample = window.toNaturalTalk('[DIAG:LEAK] {SYS_TAG} Keep your [DEBUG] eyes up! <tag>');
      const speechState = window.__SYNAPZ_RUSH__.getSpeechState();
      const sawBubbleOpen = !document.getElementById('speech-bubble').classList.contains('hidden');

      // Wait for Stage 1 -> Stage 2 -> Stage 3 shrink into bottom-left Replay Circle
      const t0 = Date.now();
      while (speechState.stage !== 3 && Date.now() - t0 < 2500) {
        await new Promise((r) => setTimeout(r, 35));
      }
      const orbEl = document.getElementById('speech-replay-orb');
      const orbVisible = !orbEl.classList.contains('hidden');
      const orbRect = orbEl.getBoundingClientRect();
      const isBottomLeft = orbRect.left < window.innerWidth * 0.35 && orbRect.bottom > window.innerHeight * 0.65;
      const hasBrackets = /[\[\]{}<>]/.test(speechState.lastCleanText) || /[\[\]{}<>]/.test(sanitizedSample);
      return {
        sawBubbleOpen,
        stage: speechState.stage,
        orbVisible,
        isBottomLeft,
        lastCleanText: speechState.lastCleanText,
        sanitizedSample,
        hasBrackets
      };
    });

    record(
      'A05',
      '3-Stage Speech Bubble -> Replay Orb & toNaturalTalk() Zero-Bracket Sanitizer',
      speechAudit.sawBubbleOpen && speechAudit.stage === 3 && speechAudit.orbVisible && speechAudit.isBottomLeft && !speechAudit.hasBrackets,
      `Stage=${speechAudit.stage}, ReplayOrbBottomLeft=${speechAudit.isBottomLeft}, Sample="${speechAudit.sanitizedSample}"`
    );

    // 6. Mandatory 3-Pass Chain + Camera Whip-Pan Player Switch + Lead Rings
    const chainAudit = await page.evaluate(async () => {
      const api = window.__SYNAPZ_RUSH__;
      const st = api.getState();

      // Clear nearby blockers so all 3 test passes hit clean Emerald Lead Rings
      st.defenders = [];
      st.obstacles = [];
      st.graceTimer = 5.0;

      const initialCarrier = st.controlledSkaterId;
      const shootStates = [document.getElementById('btn-shoot').disabled];

      const waitWhip = () => new Promise((res) => {
        const iv = setInterval(() => {
          if (!st.whipPan.active) {
            clearInterval(iv);
            res();
          }
        }, 25);
      });

      // Pass 1
      document.getElementById('btn-pass').click();
      const whipStarted = st.whipPan.active;
      await waitWhip();
      const carrierAfterPass1 = st.controlledSkaterId;
      shootStates.push(document.getElementById('btn-shoot').disabled);

      // Pass 2
      st.defenders = [];
      st.obstacles = [];
      document.getElementById('btn-pass').click();
      await waitWhip();
      shootStates.push(document.getElementById('btn-shoot').disabled);

      // Pass 3 -> ONE-TIMER ARMED!
      st.defenders = [];
      st.obstacles = [];
      document.getElementById('btn-pass').click();
      await waitWhip();
      shootStates.push(document.getElementById('btn-shoot').disabled);

      return {
        whipStarted,
        initialCarrier,
        carrierAfterPass1,
        transferCount: st.whipPan.transferCount,
        passes: st.passes,
        oneTimerArmed: st.oneTimerArmed,
        shootStates // expect [true, true, true, false]
      };
    });

    record(
      'A06',
      'Camera Whip-Pan Trajectory Transfer & Receiver Control Switch',
      chainAudit.whipStarted && chainAudit.initialCarrier !== chainAudit.carrierAfterPass1 && chainAudit.transferCount >= 3,
      `Carrier ${chainAudit.initialCarrier} -> ${chainAudit.carrierAfterPass1}, WhipTransfers=${chainAudit.transferCount}`
    );

    record(
      'A07',
      'Mandatory 3-Pass Chain Unlocks Shoot on Pass 3/3',
      chainAudit.passes === 3 &&
        chainAudit.oneTimerArmed === true &&
        chainAudit.shootStates[0] === true &&
        chainAudit.shootStates[1] === true &&
        chainAudit.shootStates[2] === true &&
        chainAudit.shootStates[3] === false,
      `ShootDisabledByPass=[0:${chainAudit.shootStates[0]}, 1:${chainAudit.shootStates[1]}, 2:${chainAudit.shootStates[2]}, 3:${chainAudit.shootStates[3]}], Armed=${chainAudit.oneTimerArmed}`
    );

    // 7. Shoot Armed One-Timer -> Goal Scored -> 3-2-1 PUCK DROP! Countdown
    const goalCountdownAudit = await page.evaluate(async () => {
      const api = window.__SYNAPZ_RUSH__;
      const st = api.getState();
      const spBefore = api.getProfile().storyPoints;

      document.getElementById('btn-shoot').click();

      // Wait for shot impact + full 3-2-1-PUCK DROP! countdown in TEST_MODE
      await new Promise((res) => {
        const iv = setInterval(() => {
          if (!st.shotInFlight && !st.countdown.active && st.goals >= 1) {
            clearInterval(iv);
            res();
          }
        }, 30);
      });

      return {
        goals: st.goals,
        spAfter: api.getProfile().storyPoints,
        spBefore,
        countdownSteps: st.countdown.history.slice(),
        passesReset: st.passes
      };
    });

    record(
      'A08',
      'One-Timer Goal, Story Points & 3-2-1 PUCK DROP Countdown',
      goalCountdownAudit.goals === 1 &&
        goalCountdownAudit.spAfter > goalCountdownAudit.spBefore &&
        goalCountdownAudit.countdownSteps.join(',') === '3,2,1,PUCK DROP!' &&
        goalCountdownAudit.passesReset === 0,
      `Goals=${goalCountdownAudit.goals}/3, SP=${goalCountdownAudit.spBefore}->${goalCountdownAudit.spAfter}, Countdown=[${goalCountdownAudit.countdownSteps.join(' -> ')}]`
    );

    // 8. 3-Puck Shift Quiver Turnover Math (Crimson Interception / Obstacle Hit -> 0/3 Pass, 1s Stumble, -1 Puck)
    const quiverAudit = await page.evaluate(async () => {
      const api = window.__SYNAPZ_RUSH__;
      const st = api.getState();
      st.defenders = [];
      st.obstacles = [];

      // Complete 1 pass so passes = 1/3 first
      api.triggerPass(null, 'emerald');
      await new Promise((res) => {
        const iv = setInterval(() => {
          if (!st.whipPan.active) { clearInterval(iv); res(); }
        }, 20);
      });
      const passesBeforeTurnover = st.passes;
      const pucksBefore = st.pucks;

      // Force a pass into a Crimson blocked lane
      api.triggerPass(null, 'crimson');
      await new Promise((res) => {
        const iv = setInterval(() => {
          if (!st.whipPan.active) { clearInterval(iv); res(); }
        }, 20);
      });

      return {
        passesBeforeTurnover,
        passesAfterTurnover: st.passes,
        pucksBefore,
        pucksAfter: st.pucks,
        stumbleTimer: st.stumbleTimer,
        puckHud: document.getElementById('hud-puck-dots').textContent
      };
    });

    record(
      'A09',
      '3-Puck Shift Quiver Turnover Math (0/3 Reset, 1s Stumble, -1 Puck)',
      quiverAudit.passesBeforeTurnover === 1 &&
        quiverAudit.passesAfterTurnover === 0 &&
        quiverAudit.pucksBefore === 3 &&
        quiverAudit.pucksAfter === 2 &&
        quiverAudit.stumbleTimer > 0.5 &&
        quiverAudit.puckHud === '●●○',
      `Passes ${quiverAudit.passesBeforeTurnover}->${quiverAudit.passesAfterTurnover}, Pucks ${quiverAudit.pucksBefore}->${quiverAudit.pucksAfter} (${quiverAudit.puckHud}), Stumble=${quiverAudit.stumbleTimer.toFixed(2)}s`
    );

    // 9. Complete Goals 2/3 & 3/3 -> Verify Level Up (L1 -> L2) & Base Ice Speed Escalation
    const levelUpAudit = await page.evaluate(async () => {
      const api = window.__SYNAPZ_RUSH__;
      const st = api.getState();
      st.stumbleTimer = 0;
      const l1Speed = st.baseIceSpeed;

      async function scoreOneFullChain() {
        for (let i = 0; i < 3; i++) {
          st.defenders = [];
          st.obstacles = [];
          api.triggerPass(null, 'emerald');
          await new Promise((r) => {
            const iv = setInterval(() => { if (!st.whipPan.active) { clearInterval(iv); r(); } }, 20);
          });
        }
        api.triggerShoot();
        await new Promise((r) => {
          const iv = setInterval(() => {
            if (!st.shotInFlight && !st.countdown.active) { clearInterval(iv); r(); }
          }, 25);
        });
      }

      await scoreOneFullChain(); // Goal 2/3
      await scoreOneFullChain(); // Goal 3/3 -> Level Up to L2!

      return {
        newLevel: st.level,
        l1Speed,
        l2Speed: st.baseIceSpeed
      };
    });

    record(
      'A10',
      '3-Goal Level Completion & Base Ice Speed Escalation',
      levelUpAudit.newLevel === 2 && levelUpAudit.l2Speed > levelUpAudit.l1Speed,
      `Level 1 -> Level ${levelUpAudit.newLevel}, BaseSpeed ${levelUpAudit.l1Speed.toFixed(1)} -> ${levelUpAudit.l2Speed.toFixed(1)}`
    );

    /* ========================================================================
       PART B: report.html — 3-TAB INBOX ZERO + TOP-UP MODE PHONE BOARD
       ======================================================================== */
    await page.goto(`${BASE_URL}/report.html`, { waitUntil: 'networkidle' });

    const boardInitial = await page.evaluate(() => {
      const overflowPx = Math.max(0, document.documentElement.scrollWidth - window.innerWidth);
      const totalButtons = document.querySelectorAll('button').length;
      const decisionButtons = document.querySelectorAll('[data-decide]').length;
      const cardsInDom = document.querySelectorAll('.upgrade-card').length;
      const consensusBadges = document.querySelectorAll('.badge-consensus').length;
      const bState = window.__SYNAPZ_RUSH_BOARD__.getBoardState();
      return {
        overflowPx,
        totalButtons,
        decisionButtons,
        cardsInDom,
        consensusBadges,
        allUpgradesCount: window.__SYNAPZ_RUSH_BOARD__.allUpgradesCount,
        toReviewLen: bState.toReview.length,
        unseenLen: bState.unseenPool.length
      };
    });

    record(
      'B01',
      'report.html 0px Horizontal Overflow at 390x844',
      boardInitial.overflowPx === 0,
      `Overflow=${boardInitial.overflowPx}px at 390x844`
    );

    record(
      'B02',
      '12-Card Cap, <= 56 Decision Buttons & 60 Pre-Coded Upgrades (Batches A-E)',
      boardInitial.cardsInDom === 12 &&
        boardInitial.consensusBadges === 5 &&
        boardInitial.decisionButtons === 48 &&
        boardInitial.totalButtons <= 56 &&
        boardInitial.allUpgradesCount === 60,
      `Cards=${boardInitial.cardsInDom}, Top5Badges=${boardInitial.consensusBadges}, DecisionBtns=${boardInitial.decisionButtons}, TotalBtns=${boardInitial.totalButtons} (<=56), PoolTotal=${boardInitial.allUpgradesCount}`
    );

    // Test 0-Card Deploy Guard, Decisions (+3/-5/0), Move Back to Review, Top-Up (12 - untouchedCount), and 1-Click Undo
    const workflowAudit = await page.evaluate(() => {
      const api = window.__SYNAPZ_RUSH_BOARD__;

      // 1. Switch to Queued when empty & verify 0-card deploy guard
      document.getElementById('tab-queued').click();
      const emptyDeployBlocked = api.deployQueuedAndTopUp() === false;
      const emptyBtnDisabled = document.getElementById('btn-deploy-queued').disabled === true;

      // 2. Back to To Review: Approve 2 (+6), Skip 1 (0), Reject 1 (-5) => Net Taste +1, 8 untouched
      document.getElementById('tab-review').click();
      api.decideCard('R01', 'approve');
      api.decideCard('R02', 'approve');
      api.decideCard('R03', 'skip');
      api.decideCard('R04', 'reject');

      const tasteAfter4 = api.getTaste().score; // +3 +3 +0 -5 = +1
      const queuedAfter4 = api.getBoardState().queued.length; // 4
      const untouchedBeforeBack = api.getBoardState().toReview.length; // 8

      // 3. Move R03 back to Review -> 9 untouched, 3 queued
      document.getElementById('tab-queued').click();
      api.moveBackToReview('R03');
      const untouchedBeforeDeploy = api.getBoardState().toReview.length; // 9
      const queuedBeforeDeploy = api.getBoardState().queued.length; // 3

      // 4. Deploy Queued & Top Up Inbox to 12 -> should keep 9 untouched + pull (12 - 9) = 3 unseen (R13, R14, R15)
      const unseenBeforeDeploy = api.getBoardState().unseenPool.length; // 48
      const deployedOk = api.deployQueuedAndTopUp() === true;
      const reviewAfterTopUp = api.getBoardState().toReview.length; // 12
      const unseenAfterDeploy = api.getBoardState().unseenPool.length; // 45 (48 - 3)
      const liveAfterDeploy = api.getBoardState().live.length; // 2 (R01, R02)

      // 5. Switch to Live in App & test 1-Click Undo on R02
      document.getElementById('tab-live').click();
      const overflowLivePx = Math.max(0, document.documentElement.scrollWidth - window.innerWidth);
      api.undoLiveCard('R02');
      const liveAfterUndo = api.getBoardState().live.length; // 1
      const queuedAfterUndo = api.getBoardState().queued.length; // 1

      return {
        emptyDeployBlocked,
        emptyBtnDisabled,
        tasteAfter4,
        queuedAfter4,
        untouchedBeforeBack,
        untouchedBeforeDeploy,
        queuedBeforeDeploy,
        deployedOk,
        reviewAfterTopUp,
        pulledFromUnseen: unseenBeforeDeploy - unseenAfterDeploy,
        liveAfterDeploy,
        liveAfterUndo,
        queuedAfterUndo,
        overflowLivePx
      };
    });

    record(
      'B03',
      '0-Card Deploy Guard, Taste Math (+3/-5/0) & Move Back to Review',
      workflowAudit.emptyDeployBlocked &&
        workflowAudit.emptyBtnDisabled &&
        workflowAudit.tasteAfter4 === 1 &&
        workflowAudit.untouchedBeforeDeploy === 9 &&
        workflowAudit.queuedBeforeDeploy === 3,
      `0CardBlocked=${workflowAudit.emptyDeployBlocked}, TasteScore=+${workflowAudit.tasteAfter4}, Untouched=${workflowAudit.untouchedBeforeDeploy}, Queued=${workflowAudit.queuedBeforeDeploy}`
    );

    record(
      'B04',
      'Top-Up Mode Math (12 - untouchedCount) & 1-Click Live Undo',
      workflowAudit.deployedOk &&
        workflowAudit.pulledFromUnseen === 3 &&
        workflowAudit.reviewAfterTopUp === 12 &&
        workflowAudit.liveAfterDeploy === 2 &&
        workflowAudit.liveAfterUndo === 1 &&
        workflowAudit.overflowLivePx === 0,
      `Pulled=${workflowAudit.pulledFromUnseen} (12-9), ReviewToppedTo=${workflowAudit.reviewAfterTopUp}, Live=${workflowAudit.liveAfterDeploy}->${workflowAudit.liveAfterUndo} after Undo`
    );

    /* ========================================================================
       PART C: STORAGE NAMESPACE ISOLATION & ZERO SPAM VERIFICATION
       ======================================================================== */
    const storageCheck = await page.evaluate(() => {
      const lsKeys = Object.keys(localStorage);
      const ssKeys = Object.keys(sessionStorage);
      const allKeys = [...lsKeys, ...ssKeys];
      const nonPrefixed = allKeys.filter((k) => !k.startsWith('synapz_rush_'));
      return { lsKeys, ssKeys, nonPrefixed };
    });

    record(
      'C01',
      '100% synapz_rush_* Storage Namespace Isolation',
      storageCheck.lsKeys.length >= 4 && storageCheck.nonPrefixed.length === 0,
      `Keys=[${storageCheck.lsKeys.join(', ')}], NonPrefixed=${storageCheck.nonPrefixed.length}`
    );

    record(
      'C02',
      'Zero Outbound Network/Email Leaks & Zero Console Errors',
      outboundLeaks.length === 0 && consoleErrors.length === 0,
      `OutboundLeaks=${outboundLeaks.length}, ConsoleErrors=${consoleErrors.length}`
    );

    // Reset report.html & profile storage back to pristine fresh state for human playtesting!
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Update Seat 13 audit_coverage_ledger.json
    const allPassed = results.every((r) => r.pass);
    if (allPassed) {
      const ledgerPath = path.join(__dirname, 'audit_coverage_ledger.json');
      const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
      ledger.lastAuditRun = new Date().toISOString();
      ledger.plays = ledger.plays.map((p) => ({
        ...p,
        status: 'passed',
        runs: (p.runs || 0) + 1
      }));
      fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2) + '\n');
    }

    await browser.close();

    console.log('\n======================================================');
    console.log(`AUDIT SUMMARY: ${results.filter((r) => r.pass).length}/${results.length} CHECKS PASSED`);
    console.log('======================================================');

    if (!allPassed) {
      process.exit(1);
    }
  } catch (err) {
    console.error('FATAL AUDIT ERROR:', err);
    await browser.close();
    process.exit(1);
  }
})();

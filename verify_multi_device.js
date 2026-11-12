/**
 * SYNAPZ HOCKEY RUSH — v1.2 Multi-Device Live & Local Playwright Verification
 * Enforces window.__TEST_MODE__ = true (zero test-email/network spam)
 * Tests Phone (390x844), Tablet Portrait (820x1180), and Tablet Landscape (1180x820)
 *
 * Usage:
 *   node verify_multi_device.js --url=https://danebekkedahl.github.io/synapz-hockey-rush
 *   node verify_multi_device.js --url=http://localhost:8090
 */
const { chromium } = require('playwright');

const argUrl = (process.argv.find((a) => a.startsWith('--url=')) || '').split('=')[1];
const TARGET_BASE = (argUrl || 'https://danebekkedahl.github.io/synapz-hockey-rush').replace(/\/+$/, '');

const VIEWPORTS = [
  { name: 'Phone Portrait (390x844)', width: 390, height: 844 },
  { name: 'Tablet Portrait (820x1180)', width: 820, height: 1180 },
  { name: 'Tablet Landscape (1180x820)', width: 1180, height: 820 }
];

async function launchBrowser() {
  for (const opts of [{ channel: 'chrome', headless: true }, { channel: 'msedge', headless: true }, { headless: true }]) {
    try {
      return await chromium.launch(opts);
    } catch (_) {}
  }
  throw new Error('Could not launch Chromium/Chrome/Edge.');
}

(async () => {
  console.log(`=== v1.2 Multi-Device Direct-Touch Audit against: ${TARGET_BASE} ===`);
  const browser = await launchBrowser();
  const results = [];

  function logCheck(label, pass, detail) {
    results.push({ label, pass: !!pass, detail });
    console.log(`${pass ? '✅ PASS' : '❌ FAIL'} | ${label} — ${detail}`);
  }

  try {
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true
      });
      await context.addInitScript(() => {
        window.__TEST_MODE__ = true;
      });

      const page = await context.newPage();
      const consoleErrors = [];
      const unexpectedRequests = [];

      page.on('pageerror', (err) => consoleErrors.push(err.message));
      page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
      page.on('request', (req) => {
        const u = req.url();
        if (!u.startsWith(TARGET_BASE) && !u.startsWith('data:') && !u.startsWith('blob:')) {
          unexpectedRequests.push(u);
        }
      });

      // Cache-busted load to bypass CDN edge stale HTML if freshly deployed
      const gameRes = await page.goto(`${TARGET_BASE}/?cb=${Date.now()}`, { waitUntil: 'networkidle' });

      if (vp.width === 390) {
        const manifestCheck = await page.evaluate(async () => {
          const link = document.querySelector('link[rel="manifest"]');
          const appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
          if (!link || !appleIcon) return { ok: false };
          const mRes = await fetch(link.href);
          const mJson = await mRes.json();
          const iRes = await fetch(appleIcon.href);
          return {
            ok: mRes.status === 200 && iRes.status === 200 && mJson.display === 'standalone',
            name: mJson.name,
            display: mJson.display,
            iconsCount: (mJson.icons || []).length
          };
        });
        logCheck(
          'Standalone PWA Manifest & Home Screen Icons',
          manifestCheck.ok,
          `Name="${manifestCheck.name}", display=${manifestCheck.display}, icons=${manifestCheck.iconsCount}`
        );
      }

      // Drop puck and inspect 0 bottom buttons, v1.2 speed, skater Y anchor, and direct-touch gestures
      await page.click('#btn-drop-puck');
      await page.waitForTimeout(140);

      const gameMetrics = await page.evaluate(() => {
        const api = window.__SYNAPZ_RUSH__;
        const st = api.getState();
        st.defenders = [];
        st.obstacles = [];

        const overflowPx = Math.max(0, document.documentElement.scrollWidth - window.innerWidth);
        const canvas = document.getElementById('ice-canvas');
        const cRect = canvas.getBoundingClientRect();
        const cs = window.getComputedStyle(canvas);
        const us = cs.userSelect || cs.webkitUserSelect || '';

        const bottomButtons = document.querySelectorAll('#thumb-controls, #thumb-controls button, .ctrl-btn').length;
        const visibleButtons = Array.from(document.querySelectorAll('button')).filter((b) => {
          const stCss = window.getComputedStyle(b);
          return stCss.display !== 'none' && stCss.visibility !== 'hidden' && b.offsetParent !== null;
        }).length;

        const anchor = api.getCarrierScreenAnchor();

        // Test horizontal swipe on canvas
        const startLane = st.skaters.find((s) => s.id === st.controlledSkaterId).lane;
        canvas.dispatchEvent(new PointerEvent('pointerdown', { pointerId: 7, clientX: 220, clientY: 420, pointerType: 'touch', bubbles: true }));
        canvas.dispatchEvent(new PointerEvent('pointermove', { pointerId: 7, clientX: 180, clientY: 420, pointerType: 'touch', bubbles: true }));
        canvas.dispatchEvent(new PointerEvent('pointerup', { pointerId: 7, clientX: 180, clientY: 420, pointerType: 'touch', bubbles: true }));
        const laneAfterSwipe = st.skaters.find((s) => s.id === st.controlledSkaterId).lane;

        const boxes = api.getProjectedTeammateHitboxes();
        const targetMate = boxes[0];

        return {
          version: api.version,
          testMode: window.__TEST_MODE__ === true,
          l1Speed: st.baseIceSpeed,
          l2Speed: api.calcBaseSpeedForLevel(2),
          overflowPx,
          canvasMatchesViewport: Math.abs(cRect.width - window.innerWidth) <= 1 && Math.abs(cRect.height - window.innerHeight) <= 1,
          canvasTouchLock: cs.touchAction === 'none' && us === 'none',
          bottomButtons,
          visibleButtons,
          yRatio: anchor ? anchor.yRatio : 0,
          swipeWorked: startLane === 1 && laneAfterSwipe === 0,
          targetMateId: targetMate.id,
          tapX: Math.round(targetMate.ringBox.centerX),
          tapY: Math.round(targetMate.ringBox.centerY)
        };
      });

      // Direct touchscreen tap on projected teammate Lead Ring!
      await page.touchscreen.tap(gameMetrics.tapX, gameMetrics.tapY);
      const passCompleted = await page.evaluate(async () => {
        const st = window.__SYNAPZ_RUSH__.getState();
        while (st.whipPan.active) await new Promise((r) => setTimeout(r, 20));
        return { carrier: st.controlledSkaterId, passes: st.passes };
      });

      // Check report.html on same viewport
      const reportRes = await page.goto(`${TARGET_BASE}/report.html?cb=${Date.now()}`, { waitUntil: 'networkidle' });
      const reportMetrics = await page.evaluate(() => {
        const overflowPx = Math.max(0, document.documentElement.scrollWidth - window.innerWidth);
        const btns = Array.from(document.querySelectorAll('[data-decide]'));
        const touchReady = btns.every((b) => {
          const cs = window.getComputedStyle(b);
          const us = cs.userSelect || cs.webkitUserSelect || '';
          return cs.touchAction === 'manipulation' && us === 'none';
        });
        return { overflowPx, touchReady };
      });

      logCheck(
        `${vp.name} — v1.2 Direct-Touch Game & Report Audit`,
        gameRes.status() === 200 &&
          reportRes.status() === 200 &&
          gameMetrics.version === '1.2.0' &&
          Math.abs(gameMetrics.l1Speed - 12.55) < 0.05 &&
          Math.abs(gameMetrics.l2Speed / gameMetrics.l1Speed - 1.15) < 0.002 &&
          gameMetrics.overflowPx === 0 &&
          gameMetrics.canvasMatchesViewport &&
          gameMetrics.canvasTouchLock &&
          gameMetrics.bottomButtons === 0 &&
          gameMetrics.visibleButtons === 0 &&
          gameMetrics.yRatio >= 0.70 &&
          gameMetrics.swipeWorked &&
          passCompleted.carrier === gameMetrics.targetMateId &&
          passCompleted.passes === 1 &&
          reportMetrics.overflowPx === 0 &&
          reportMetrics.touchReady &&
          consoleErrors.length === 0 &&
          unexpectedRequests.length === 0,
        `v=${gameMetrics.version}, L1=${gameMetrics.l1Speed}, Btns=${gameMetrics.bottomButtons}, SkaterY=${(gameMetrics.yRatio * 100).toFixed(1)}%, Swipe=OK, TapPass=${passCompleted.carrier}, Overflow=${gameMetrics.overflowPx}px/${reportMetrics.overflowPx}px`
      );

      await context.close();
    }
  } finally {
    await browser.close();
  }

  const passed = results.filter((r) => r.pass).length;
  console.log(`\nMULTI-DEVICE SUMMARY: ${passed}/${results.length} CHECKS PASSED`);
  if (passed !== results.length) process.exit(1);
})();

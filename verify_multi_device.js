/**
 * SYNAPZ HOCKEY RUSH — Multi-Device Live & Local Playwright Verification
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
  console.log(`=== Multi-Device Playwright Audit against: ${TARGET_BASE} ===`);
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

      // 1. Game URL check + Manifest & Home Screen Icons on first viewport
      const gameRes = await page.goto(`${TARGET_BASE}/`, { waitUntil: 'networkidle' });
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

      // Drop puck and inspect canvas scaling, overflow, touch-action, and user-select
      await page.click('#btn-drop-puck');
      await page.waitForTimeout(160);

      const gameMetrics = await page.evaluate(() => {
        const overflowPx = Math.max(0, document.documentElement.scrollWidth - window.innerWidth);
        const canvas = document.getElementById('ice-canvas');
        const cRect = canvas.getBoundingClientRect();
        const ctrls = Array.from(document.querySelectorAll('#thumb-controls button'));
        const touchReady = ctrls.every((btn) => {
          const cs = window.getComputedStyle(btn);
          const us = cs.userSelect || cs.webkitUserSelect || '';
          return cs.touchAction === 'manipulation' && us === 'none';
        });
        return {
          testMode: window.__TEST_MODE__ === true,
          overflowPx,
          canvasMatchesViewport: Math.abs(cRect.width - window.innerWidth) <= 1 && Math.abs(cRect.height - window.innerHeight) <= 1,
          ctrlCount: ctrls.length,
          touchReady
        };
      });

      // Tap Left, Right, and Pass via touchscreen tap to confirm responsive controls
      await page.tap('#btn-left');
      await page.tap('#btn-right');
      await page.tap('#btn-pass');
      await page.waitForTimeout(120);

      // 2. Check report.html on same viewport
      const reportRes = await page.goto(`${TARGET_BASE}/report.html`, { waitUntil: 'networkidle' });
      const reportMetrics = await page.evaluate(() => {
        const overflowPx = Math.max(0, document.documentElement.scrollWidth - window.innerWidth);
        const btns = Array.from(document.querySelectorAll('[data-decide]'));
        const touchReady = btns.every((b) => {
          const cs = window.getComputedStyle(b);
          const us = cs.userSelect || cs.webkitUserSelect || '';
          return cs.touchAction === 'manipulation' && us === 'none';
        });
        return { overflowPx, decisionBtns: btns.length, touchReady };
      });

      logCheck(
        `${vp.name} — Game & Report Audit`,
        gameRes.status() === 200 &&
          reportRes.status() === 200 &&
          gameMetrics.testMode &&
          gameMetrics.overflowPx === 0 &&
          gameMetrics.canvasMatchesViewport &&
          gameMetrics.ctrlCount === 4 &&
          gameMetrics.touchReady &&
          reportMetrics.overflowPx === 0 &&
          reportMetrics.touchReady &&
          consoleErrors.length === 0 &&
          unexpectedRequests.length === 0,
        `HTTP=${gameRes.status()}/${reportRes.status()}, Overflow=${gameMetrics.overflowPx}px/${reportMetrics.overflowPx}px, TouchCSS=${gameMetrics.touchReady}, Errors=${consoleErrors.length}, Spam=${unexpectedRequests.length}`
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

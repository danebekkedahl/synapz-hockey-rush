/**
 * SYNAPZ HOCKEY RUSH — v10.9.4 Playbook Single-Push GitHub Pages Deployer
 * Strictly isolated to: https://github.com/danebekkedahl/synapz-hockey-rush
 * Live URL: https://danebekkedahl.github.io/synapz-hockey-rush/
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');

const ROOT = __dirname;
const OWNER = 'danebekkedahl';
const REPO = 'synapz-hockey-rush';
const EXPECTED_REMOTE = `https://github.com/${OWNER}/${REPO}.git`;
const LIVE_GAME_URL = `https://${OWNER}.github.io/${REPO}/`;
const LIVE_REPORT_URL = `https://${OWNER}.github.io/${REPO}/report.html`;

const EXCLUDED_DIRS = new Set(['.git', 'node_modules', 'playwright-report', 'test-results']);
const EXCLUDED_FILES = new Set(['.env', '.DS_Store', 'Thumbs.db']);

function loadDotEnvToken() {
  const envPath = path.join(ROOT, '.env');
  if (!fs.existsSync(envPath)) return null;
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
    if ((key === 'GITHUB_TOKEN' || key === 'GH_TOKEN') && val) {
      return val;
    }
  }
  return null;
}

function resolveGitHubToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN.trim();
  if (process.env.GH_TOKEN) return process.env.GH_TOKEN.trim();

  const fromEnvFile = loadDotEnvToken();
  if (fromEnvFile) return fromEnvFile;

  try {
    const ghToken = execSync('gh auth token', { stdio: ['ignore', 'pipe', 'ignore'], encoding: 'utf8' }).trim();
    if (ghToken) return ghToken;
  } catch (_) {
    // gh CLI not installed or not logged in
  }
  return null;
}

async function ghApi(method, endpoint, token, body) {
  const res = await fetch(`https://api.github.com${endpoint}`, {
    method,
    headers: {
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'Synapz-Hockey-Rush-Deployer/10.9.4',
      ...(body ? { 'Content-Type': 'application/json' } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (_) {
    json = { raw: text };
  }
  return { status: res.status, ok: res.ok, data: json };
}

function walkWorkspaceFiles(dir, relPrefix = '') {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) continue;
      out.push(...walkWorkspaceFiles(path.join(dir, entry.name), relPrefix ? `${relPrefix}/${entry.name}` : entry.name));
    } else if (entry.isFile()) {
      if (EXCLUDED_FILES.has(entry.name) || entry.name.startsWith('.env.')) continue;
      out.push(relPrefix ? `${relPrefix}/${entry.name}` : entry.name);
    }
  }
  return out;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log('=== Synapz Hockey Rush — Standalone GitHub Pages Deploy (v10.9.4) ===');

  // 1. Ensure .nojekyll exists in project root
  const nojekyllPath = path.join(ROOT, '.nojekyll');
  if (!fs.existsSync(nojekyllPath)) {
    fs.writeFileSync(nojekyllPath, '');
  }
  console.log('✅ Verified .nojekyll present in root.');

  // 2. Resolve GitHub credentials
  const token = resolveGitHubToken();
  if (!token) {
    console.error('\n❌ BLOCKED: No GitHub credentials found on this system.');
    console.error('To publish to https://github.com/danebekkedahl/synapz-hockey-rush, run with a GitHub Personal Access Token (repo scope):');
    console.error('  $env:GITHUB_TOKEN="ghp_your_token_here"; node deploy-github-pages.js');
    process.exit(1);
  }

  const userCheck = await ghApi('GET', '/user', token);
  if (!userCheck.ok) {
    console.error(`❌ GitHub token authentication failed (HTTP ${userCheck.status}):`, userCheck.data);
    process.exit(1);
  }
  console.log(`✅ Authenticated with GitHub as: ${userCheck.data.login}`);

  // 3. Ensure standalone public repository danebekkedahl/synapz-hockey-rush exists
  const repoCheck = await ghApi('GET', `/repos/${OWNER}/${REPO}`, token);
  if (repoCheck.status === 404) {
    console.log(`📦 Creating new public repository ${OWNER}/${REPO}...`);
    const created = await ghApi('POST', '/user/repos', token, {
      name: REPO,
      description: 'Synapz Hockey Rush — Graphics-First 35-Degree Broadcast Ice-Vision Game (v10.9.4)',
      private: false,
      has_issues: true,
      auto_init: false
    });
    if (!created.ok) {
      console.error(`❌ Failed to create repository (HTTP ${created.status}):`, created.data);
      process.exit(1);
    }
    console.log(`✅ Created standalone public repository: https://github.com/${OWNER}/${REPO}`);
  } else if (repoCheck.ok) {
    console.log(`✅ Verified existing standalone repository: https://github.com/${OWNER}/${REPO}`);
  } else {
    console.error(`❌ Unexpected error checking repository (HTTP ${repoCheck.status}):`, repoCheck.data);
    process.exit(1);
  }

  // 4. Configure & strictly verify git remote -v points ONLY to danebekkedahl/synapz-hockey-rush.git
  await git.init({ fs, dir: ROOT, defaultBranch: 'main' });
  const existingRemotes = await git.listRemotes({ fs, dir: ROOT });
  for (const rem of existingRemotes) {
    await git.deleteRemote({ fs, dir: ROOT, remote: rem.remote });
  }
  await git.addRemote({ fs, dir: ROOT, remote: 'origin', url: EXPECTED_REMOTE });

  const verifiedRemotes = await git.listRemotes({ fs, dir: ROOT });
  if (verifiedRemotes.length !== 1 || verifiedRemotes[0].remote !== 'origin' || verifiedRemotes[0].url !== EXPECTED_REMOTE) {
    throw new Error(`Remote isolation check failed: ${JSON.stringify(verifiedRemotes)}`);
  }
  console.log(`✅ Verified git remote -v isolation:\n   origin  ${verifiedRemotes[0].url} (fetch)\n   origin  ${verifiedRemotes[0].url} (push)`);

  // 5. Pre-Stage Secret Guardrail & Stage all standalone files cleanly to main
  const files = walkWorkspaceFiles(ROOT);
  const SECRET_REGEX = /\b(ghp_[A-Za-z0-9]{25,}|gho_[A-Za-z0-9]{25,}|github_pat_[A-Za-z0-9_]{25,})\b/;
  for (const filepath of files) {
    if (filepath === '.env' || filepath.startsWith('.env.') || filepath.endsWith('/.env')) {
      throw new Error(`SECURITY GUARD: Refusing to stage forbidden file ${filepath}`);
    }
    if (!/\.(png|jpg|jpeg|ico|woff2)$/i.test(filepath)) {
      const txt = fs.readFileSync(path.join(ROOT, filepath), 'utf8');
      if (SECRET_REGEX.test(txt)) {
        throw new Error(`SECURITY GUARD: Detected GitHub token pattern inside ${filepath}! Aborting.`);
      }
    }
    await git.add({ fs, dir: ROOT, filepath });
  }

  const commitSha = await git.commit({
    fs,
    dir: ROOT,
    message: 'feat: Synapz Hockey Rush v1.2 Direct-Touch Vision upgrade',
    author: {
      name: 'Dane Bekkedahl',
      email: 'danebekkedahl@gmail.com'
    }
  });
  console.log(`✅ Committed ${files.length} files to local main (${commitSha.slice(0, 7)}).`);

  // 6. Single push to origin/main
  console.log('🚀 Pushing main to origin in a single push...');
  const pushResult = await git.push({
    fs,
    http,
    dir: ROOT,
    remote: 'origin',
    ref: 'main',
    remoteRef: 'refs/heads/main',
    force: false,
    onAuth: () => ({ username: 'x-access-token', password: token })
  });
  if (!pushResult || !pushResult.ok) {
    throw new Error(`Git push failed: ${JSON.stringify(pushResult)}`);
  }
  console.log('✅ Single push to origin/main complete.');

  // 7. Enable GitHub Pages from main root (/) if not yet enabled (ZERO duplicate POST /pages/builds calls)
  const pagesCheck = await ghApi('GET', `/repos/${OWNER}/${REPO}/pages`, token);
  if (pagesCheck.status === 404) {
    console.log('🌐 Enabling GitHub Pages from main branch root (/)...');
    const enableRes = await ghApi('POST', `/repos/${OWNER}/${REPO}/pages`, token, {
      source: { branch: 'main', path: '/' }
    });
    if (!enableRes.ok && enableRes.status !== 409) {
      console.error(`❌ Failed to enable GitHub Pages (HTTP ${enableRes.status}):`, enableRes.data);
      process.exit(1);
    }
    console.log('✅ GitHub Pages enabled on main (/).');
  } else if (pagesCheck.ok) {
    const src = (pagesCheck.data && pagesCheck.data.source) || {};
    if (src.branch !== 'main' || src.path !== '/') {
      await ghApi('PUT', `/repos/${OWNER}/${REPO}/pages`, token, {
        source: { branch: 'main', path: '/' }
      });
      console.log('✅ Updated GitHub Pages source to main (/).');
    } else {
      console.log('✅ GitHub Pages already configured on main (/) — skipping duplicate build calls.');
    }
  }

  // 8. Poll live URLs until BOTH return HTTP 200 AND v1.2 bundle is live on CDN
  console.log(`⏳ Polling live GitHub Pages URLs for v1.2 propagation:\n   - ${LIVE_GAME_URL}\n   - ${LIVE_REPORT_URL}`);
  const deadline = Date.now() + 240_000;
  let attempt = 0;

  while (Date.now() < deadline) {
    attempt++;
    try {
      const cb = Date.now();
      const [rGame, rApp, rReport] = await Promise.all([
        fetch(`${LIVE_GAME_URL}?v=${cb}`, { cache: 'no-store' }),
        fetch(`${LIVE_GAME_URL}app.js?v=1.2&cb=${cb}`, { cache: 'no-store' }),
        fetch(`${LIVE_REPORT_URL}?v=${cb}`, { cache: 'no-store' })
      ]);
      const gameHtml = rGame.status === 200 ? await rGame.text() : '';
      const appJs = rApp.status === 200 ? await rApp.text() : '';
      const isV12Html = gameHtml.includes('app.js?v=1.2');
      const isV12Js = appJs.includes("version: '1.2.0'");
      console.log(`   [Attempt ${attempt}] Game=${rGame.status} (v1.2 HTML=${isV12Html}) | AppJS=${rApp.status} (v1.2 JS=${isV12Js}) | Report=${rReport.status}`);
      if (rGame.status === 200 && rReport.status === 200 && isV12Html && isV12Js) {
        console.log('\n🎉 LIVE GITHUB PAGES v1.2 BUNDLE & REPORT VERIFIED HTTP 200!');
        console.log(`🏒 Live Game URL:   ${LIVE_GAME_URL}`);
        console.log(`📱 Live Report URL: ${LIVE_REPORT_URL}`);
        return;
      }
    } catch (e) {
      console.log(`   [Attempt ${attempt}] Waiting for CDN propagation (${e.message})...`);
    }
    await sleep(5000);
  }

  console.error('❌ Timed out waiting for GitHub Pages HTTP 200 propagation.');
  process.exit(1);
}

main().catch((err) => {
  console.error('❌ Deployment error:', err);
  process.exit(1);
});

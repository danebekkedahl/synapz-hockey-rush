/* ==========================================================================
   SYNAPZ HOCKEY RUSH — v10.9.4 Playbook Architecture
   100% Standalone Graphics-First 35° Broadcast Ice-Vision Runner
   Storage Namespace: synapz_rush_*
   ========================================================================== */
(function () {
  'use strict';

  const STORAGE_KEYS = {
    PROFILE: 'synapz_rush_profile',
    RED_FLAGS: 'synapz_rush_red_flags',
    LIVE_UPGRADES: 'synapz_rush_live_upgrades'
  };

  const CAMERA_ELEVATION_DEG = 35;
  const LANE_X = [-7.8, 0, 7.8];

  const ARENAS = [
    {
      level: 1,
      id: 'pond',
      shortName: 'Twilight Pond',
      name: 'Backyard Twilight Pond',
      weaveLabel: 'Steady Parallel Lanes',
      baseSpeed: 24,
      skyTop: '#0b1026',
      skyBot: '#1e1b4b',
      iceTop: '#dbeafe',
      iceMid: '#eff6ff',
      iceBot: '#bfdbfe',
      boardMain: '#78350f',
      boardTrim: '#f59e0b',
      lightColor: 'rgba(253, 224, 71, 0.24)',
      obstacleType: 'crate',
      obstacleLabel: 'Wooden Pond Crates & Snowdrifts'
    },
    {
      level: 2,
      id: 'combine',
      shortName: 'Combine Barn',
      name: 'Skills Combine Barn',
      weaveLabel: 'Parallel Support + Fast Sticks',
      baseSpeed: 28,
      skyTop: '#04101f',
      skyBot: '#0f2942',
      iceTop: '#e0f2fe',
      iceMid: '#f0f9ff',
      iceBot: '#bae6fd',
      boardMain: '#0f172a',
      boardTrim: '#84cc16',
      lightColor: 'rgba(56, 189, 248, 0.25)',
      obstacleType: 'tripod',
      obstacleLabel: 'Neon Agility Tripods & Slide Bumpers'
    },
    {
      level: 3,
      id: 'travel',
      shortName: 'Travel Rink',
      name: 'Local Travel Rink',
      weaveLabel: 'Diagonal Slot Cuts',
      baseSpeed: 32,
      skyTop: '#131c31',
      skyBot: '#263452',
      iceTop: '#e2e8f0',
      iceMid: '#f8fafc',
      iceBot: '#cbd5e1',
      boardMain: '#f1f5f9',
      boardTrim: '#dc2626',
      lightColor: 'rgba(254, 240, 138, 0.22)',
      obstacleType: 'cone',
      obstacleLabel: 'Heavy Cones & Active Poke-Checkers'
    },
    {
      level: 4,
      id: 'classic',
      shortName: 'Winter Classic',
      name: 'Outdoor Winter Classic',
      weaveLabel: 'Diagonal Cuts + Stadium Flurries',
      baseSpeed: 36,
      skyTop: '#030712',
      skyBot: '#0f172a',
      iceTop: '#cffafe',
      iceMid: '#ecfeff',
      iceBot: '#a5f3fc',
      boardMain: '#1e3a8a',
      boardTrim: '#38bdf8',
      lightColor: 'rgba(224, 242, 254, 0.28)',
      obstacleType: 'ridge',
      obstacleLabel: 'Frost Ridges & Stadium Dollies'
    },
    {
      level: 5,
      id: 'pro',
      shortName: 'Pro Championship',
      name: 'Pro Championship Arena',
      weaveLabel: 'Scissor Switches & Covered Decoys',
      baseSpeed: 40,
      skyTop: '#09071a',
      skyBot: '#1e1646',
      iceTop: '#e0e7ff',
      iceMid: '#f8fafc',
      iceBot: '#c7d2fe',
      boardMain: '#111827',
      boardTrim: '#facc15',
      lightColor: 'rgba(250, 204, 21, 0.24)',
      obstacleType: 'blocker',
      obstacleLabel: 'Pro Shot-Blockers & Covered Decoys'
    }
  ];

  const JERSEY_THEMES = {
    cyan: { name: 'Synapz Cyan', main: '#0284c7', yoke: '#0f172a', stripe: '#34d399', num: '#ffffff' },
    crimson: { name: 'Pond Crimson', main: '#dc2626', yoke: '#7f1d1d', stripe: '#fde047', num: '#ffffff' },
    gold: { name: 'Championship Gold', main: '#ca8a04', yoke: '#1e1b4b', stripe: '#38bdf8', num: '#0f172a' },
    emerald: { name: 'Emerald Rush', main: '#059669', yoke: '#064e3b', stripe: '#bae6fd', num: '#ffffff' }
  };

  const TAPE_THEMES = {
    white: { name: 'Classic White Tape', color: '#f8fafc' },
    cyan: { name: 'Neon Cyan Tape', color: '#38bdf8' },
    gold: { name: 'Pro Gold Tape', color: '#facc15' }
  };

  const TRAIL_THEMES = {
    ice: { name: 'Frost White Carve', color: 'rgba(255, 255, 255, 0.65)' },
    cyan: { name: 'Electric Cyan Carve', color: 'rgba(56, 189, 248, 0.72)' },
    emerald: { name: 'Emerald Vapor Carve', color: 'rgba(16, 185, 129, 0.72)' }
  };

  const PEER_GUIDES = {
    leo: {
      id: 'leo',
      name: 'Leo',
      band: '8U–10U',
      speaker: 'Leo • Pond Winger (8U–10U)',
      avatar: '🧒',
      cues: {
        start: '[DIAG:SHIFT_START] Eyes up the ice! Hit three green lead rings in a row to power up our big one-timer!',
        pass1: '[STATE:PASS_1] Nice crisp pass! Keep skating and spot the next green ring ahead!',
        armed: '[SYS:ARMED] One-timer armed! Aim for the glowing net corners and tap Shoot!',
        goal: '[GOAL_EVENT] Top shelf! What a rocket! Get ready for the next puck drop!',
        turnover: '[WARN:TURNOVER] Oof, stick check! Shake it off and look for the open green lane!',
        levelup: '[LVL_UP] Huge hat trick! Moving up to faster ice in the next arena!'
      }
    },
    maya: {
      id: 'maya',
      name: 'Maya',
      band: '11U–14U',
      speaker: 'Maya • Playmaker Center (11U–14U)',
      avatar: '👧',
      cues: {
        start: '[DIAG:SHIFT_START] Scan all three lanes early. Zip the puck into Emerald rings before defenders close the gap.',
        pass1: '[STATE:PASS_1] Clean whip-pan reception! Read the weak-side winger cutting up ice.',
        armed: '[SYS:ARMED] Three-pass chain complete! Upper corners are lit green and gold — let it rip!',
        goal: '[GOAL_EVENT] Bar down! Tape-to-tape puck movement froze the goalie cold.',
        turnover: '[WARN:TURNOVER] Crimson ring means a stick is in the lane. Cut sideways first to open an angle.',
        levelup: '[LVL_UP] Arena cleared! Watch for sharper diagonal slot cuts at this higher pace.'
      }
    },
    vance: {
      id: 'vance',
      name: 'Coach Vance',
      band: '15U–18U+',
      speaker: 'Coach Vance • Bench Tactician (15U+)',
      avatar: '🧢',
      cues: {
        start: '[DIAG:SHIFT_START] Puck moves faster than skates. String three tape-to-tape passes to unlock the high-slot one-timer.',
        pass1: '[STATE:PASS_1] Good seam transfer. Keep your head on a swivel for the next support triangle.',
        armed: '[SYS:ARMED] Defense is stretched! One-timer is hot — hammer those illuminated upper corners!',
        goal: '[GOAL_EVENT] Textbook rush execution. Reset your feet for the three-two-one drop.',
        turnover: '[WARN:TURNOVER] Forced pass into coverage. Change lanes to pull the defender stick out of the seam.',
        levelup: '[LVL_UP] Championship tempo unlocked. Read the scissor switches and look off covered decoys.'
      }
    }
  };

  /* ==========================================================================
     toNaturalTalk() — ZERO [BRACKETS] OR DIAGNOSTIC LEAKS SANITIZER
     ========================================================================== */
  function toNaturalTalk(rawText) {
    if (rawText == null) return '';
    return String(rawText)
      .replace(/\[[^\]]*\]/g, ' ')
      .replace(/\{[^}]*\}/g, ' ')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\b(DIAG|SYS|STATE|WARN|DEBUG|TODO|ERR|LOG)[:_][A-Z0-9_-]*\b/gi, ' ')
      .replace(/[\[\]{}<>]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
  window.toNaturalTalk = toNaturalTalk;

  /* ==========================================================================
     PROFILE & PERSISTENT STORAGE (STRICT synapz_rush_* ISOLATION)
     ========================================================================== */
  const DEFAULT_PROFILE = {
    version: '10.9.4',
    guideId: 'maya',
    selectedLevel: 1,
    unlockedLevel: 1,
    storyPoints: 60,
    lifetimeGoals: 0,
    lifetimePasses: 0,
    shiftsPlayed: 0,
    upgrades: {
      speed: 1,
      passZip: 1,
      vision: 1,
      shotPower: 1
    },
    custom: {
      jersey: 'cyan',
      tape: 'white',
      trail: 'ice'
    },
    trophies: []
  };

  function loadProfile() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (!raw) {
        const fresh = JSON.parse(JSON.stringify(DEFAULT_PROFILE));
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(fresh));
        return fresh;
      }
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_PROFILE,
        ...parsed,
        upgrades: { ...DEFAULT_PROFILE.upgrades, ...(parsed.upgrades || {}) },
        custom: { ...DEFAULT_PROFILE.custom, ...(parsed.custom || {}) },
        trophies: Array.isArray(parsed.trophies) ? parsed.trophies : []
      };
    } catch (e) {
      return JSON.parse(JSON.stringify(DEFAULT_PROFILE));
    }
  }

  let profile = loadProfile();

  function saveProfile() {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      /* ignore quota errors */
    }
    syncHudValues();
  }

  function unlockTrophy(id) {
    if (!profile.trophies.includes(id)) {
      profile.trophies.push(id);
      saveProfile();
    }
  }

  /* ==========================================================================
     WEB AUDIO SYNTHESIZER (CRISP SKATE SCRAPES, PASS ZIPS, GOAL HORN)
     ========================================================================== */
  let audioCtx = null;
  function getAudio() {
    if (window.__TEST_MODE__) return null;
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  function playTone(freq, type, duration, gainVal, slideTo) {
    const ctx = getAudio();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type || 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      if (slideTo) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), now + duration);
      }
      gain.gain.setValueAtTime(gainVal || 0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch (e) { /* safe audio fallback */ }
  }

  function sfxCut() {
    playTone(210, 'sawtooth', 0.09, 0.045, 95);
  }

  function sfxPass(chainNum) {
    playTone(320 + chainNum * 90, 'triangle', 0.12, 0.09, 520 + chainNum * 110);
  }

  function sfxArmed() {
    playTone(523.25, 'sine', 0.16, 0.1, 659.25);
    setTimeout(() => playTone(783.99, 'triangle', 0.24, 0.11, 1046.5), 90);
  }

  function sfxTurnover() {
    playTone(170, 'sawtooth', 0.28, 0.1, 72);
  }

  function sfxGoalHorn() {
    const ctx = getAudio();
    if (!ctx) return;
    [146.83, 185.0, 220.0, 293.66].forEach((f) => {
      playTone(f, 'sawtooth', 0.95, 0.065, f * 0.99);
    });
  }

  function sfxCountdownBeep(isFinal) {
    playTone(isFinal ? 880 : 440, 'sine', isFinal ? 0.24 : 0.12, 0.08);
  }

  /* ==========================================================================
     3-STAGE PEER GUIDE SPEECH BUBBLE CONTROLLER
     ========================================================================== */
  const speechBubbleEl = document.getElementById('speech-bubble');
  const speechAvatarEl = document.getElementById('speech-avatar');
  const speechSpeakerEl = document.getElementById('speech-speaker');
  const speechTextEl = document.getElementById('speech-text');
  const speechDismissEl = document.getElementById('speech-dismiss');
  const replayOrbEl = document.getElementById('speech-replay-orb');
  const replayOrbAvatarEl = document.getElementById('replay-orb-avatar');

  const speechState = {
    stage: 0, // 0 hidden, 1 streaming, 2 hold, 3 replay-orb
    lastRawText: '',
    lastCleanText: '',
    streamTimer: null,
    holdTimer: null,
    shrinkTimer: null
  };

  function clearSpeechTimers() {
    if (speechState.streamTimer) clearInterval(speechState.streamTimer);
    if (speechState.holdTimer) clearTimeout(speechState.holdTimer);
    if (speechState.shrinkTimer) clearTimeout(speechState.shrinkTimer);
    speechState.streamTimer = null;
    speechState.holdTimer = null;
    speechState.shrinkTimer = null;
  }

  function shrinkSpeechToOrb() {
    clearSpeechTimers();
    speechBubbleEl.classList.add('shrinking');
    speechState.shrinkTimer = setTimeout(() => {
      speechBubbleEl.classList.add('hidden');
      speechBubbleEl.classList.remove('shrinking');
      if (state.mode === 'playing') {
        replayOrbEl.classList.remove('hidden');
      }
      speechState.stage = 3;
    }, 200);
  }

  function speakGuide(cueKeyOrRaw) {
    const guide = PEER_GUIDES[profile.guideId] || PEER_GUIDES.maya;
    const raw = (guide.cues && guide.cues[cueKeyOrRaw]) ? guide.cues[cueKeyOrRaw] : String(cueKeyOrRaw || '');
    const clean = toNaturalTalk(raw);
    if (!clean) return clean;

    clearSpeechTimers();
    speechState.lastRawText = raw;
    speechState.lastCleanText = clean;
    speechState.stage = 1;

    speechAvatarEl.textContent = guide.avatar;
    speechSpeakerEl.textContent = toNaturalTalk(guide.speaker);
    replayOrbAvatarEl.textContent = guide.avatar;

    replayOrbEl.classList.add('hidden');
    speechBubbleEl.classList.remove('hidden', 'shrinking');

    const words = clean.split(' ');
    let idx = 0;
    speechTextEl.textContent = '';

    const wordIntervalMs = window.__TEST_MODE__ ? 12 : 36;
    const holdDurationMs = window.__TEST_MODE__ ? 320 : 2300;

    speechState.streamTimer = setInterval(() => {
      idx++;
      speechTextEl.textContent = words.slice(0, idx).join(' ');
      if (idx >= words.length) {
        clearInterval(speechState.streamTimer);
        speechState.streamTimer = null;
        speechState.stage = 2;
        speechState.holdTimer = setTimeout(() => {
          shrinkSpeechToOrb();
        }, holdDurationMs);
      }
    }, wordIntervalMs);

    return clean;
  }

  speechDismissEl.addEventListener('click', (e) => {
    e.preventDefault();
    shrinkSpeechToOrb();
  });

  replayOrbEl.addEventListener('click', (e) => {
    e.preventDefault();
    if (speechState.lastRawText) {
      speakGuide(speechState.lastRawText);
    }
  });

  /* ==========================================================================
     GAMEPLAY STATE & WORLD ENTITIES
     ========================================================================== */
  const canvas = document.getElementById('ice-canvas');
  const ctx = canvas.getContext('2d');

  const state = {
    mode: 'gate', // 'gate' | 'hub' | 'playing' | 'shift_over'
    activeHubRoom: 'tunnel',
    level: 1,
    baseIceSpeed: 24,
    currentSpeed: 24,
    passes: 0,
    totalPassesInShift: 0,
    oneTimerArmed: false,
    goals: 0,
    pucks: 3,
    shiftSpEarned: 0,
    stumbleTimer: 0,
    graceTimer: 0,
    shakeTimer: 0,
    clock: 0,

    // Camera 35-deg Broadcast State
    camX: 0,
    focusZ: 0,
    camRoll: 0,
    whipPan: {
      active: false,
      fromX: 0,
      fromZ: 0,
      toSkaterId: null,
      progress: 0,
      duration: 0.26,
      intercepted: false,
      leadColor: 'emerald',
      transferCount: 0
    },

    // Shot & Goal State
    shotInFlight: null,
    countdown: {
      active: false,
      stepText: '',
      timer: 0,
      pendingLevelUp: false,
      history: []
    },

    // Entities
    controlledSkaterId: 's0',
    skaters: [],
    defenders: [],
    obstacles: [],
    nets: [],
    bladeTrails: [],
    snowParticles: [],
    ambientFlakes: []
  };

  function getArenaForLevel(lvl) {
    const idx = Math.max(0, Math.min(ARENAS.length - 1, lvl - 1));
    return ARENAS[idx];
  }

  function calcBaseSpeedForLevel(lvl) {
    const arena = getArenaForLevel(lvl);
    const extraTier = Math.max(0, lvl - 5) * 3.5;
    const speedUpgradeBonus = (profile.upgrades.speed - 1) * 1.1;
    return arena.baseSpeed + extraTier + speedUpgradeBonus;
  }

  function initAmbientSnow() {
    state.ambientFlakes = [];
    for (let i = 0; i < 55; i++) {
      state.ambientFlakes.push({
        u: Math.random(),
        v: Math.random(),
        r: 1 + Math.random() * 2.2,
        drift: (Math.random() - 0.5) * 0.14,
        fall: 0.08 + Math.random() * 0.16
      });
    }
  }

  function buildSkaterSquad(startZ) {
    const z0 = startZ || 0;
    const squad = [
      {
        id: 's0',
        number: '97',
        lane: 1,
        x: LANE_X[1],
        targetX: LANE_X[1],
        z: z0,
        stridePhase: 0,
        tilt: 0,
        isDecoy: false,
        weaveOffset: 0,
        leadRingColor: 'emerald',
        leadZ: z0 + 5
      },
      {
        id: 's1',
        number: '16',
        lane: 0,
        x: LANE_X[0],
        targetX: LANE_X[0],
        z: z0 + 13,
        stridePhase: 2.1,
        tilt: 0,
        isDecoy: false,
        weaveOffset: 0,
        leadRingColor: 'emerald',
        leadZ: z0 + 18.5
      },
      {
        id: 's2',
        number: '88',
        lane: 2,
        x: LANE_X[2],
        targetX: LANE_X[2],
        z: z0 + 17,
        stridePhase: 4.2,
        tilt: 0,
        isDecoy: false,
        weaveOffset: Math.PI,
        leadRingColor: 'emerald',
        leadZ: z0 + 22.5
      }
    ];

    if (state.level >= 5) {
      squad.push({
        id: 's3_decoy',
        number: '29',
        lane: 1,
        x: 3.9,
        targetX: 3.9,
        z: z0 + 23,
        stridePhase: 1.1,
        tilt: 0,
        isDecoy: true,
        weaveOffset: Math.PI * 0.5,
        leadRingColor: 'crimson',
        leadZ: z0 + 28
      });
    }

    state.skaters = squad;
    state.controlledSkaterId = 's0';
    state.camX = squad[0].x * 0.34;
    state.focusZ = z0;
  }

  function getControlledSkater() {
    return state.skaters.find((s) => s.id === state.controlledSkaterId) || state.skaters[0];
  }

  function populateWaveAhead(fromZ) {
    state.defenders = state.defenders.filter((d) => d.z > fromZ - 12);
    state.obstacles = state.obstacles.filter((o) => o.z > fromZ - 12);
    state.nets = state.nets.filter((n) => n.z > fromZ - 15);

    const arena = getArenaForLevel(state.level);
    let cursorZ = Math.max(
      fromZ + 32,
      state.defenders.reduce((m, d) => Math.max(m, d.z), 0) + 22,
      state.obstacles.reduce((m, o) => Math.max(m, o.z), 0) + 22
    );

    while (cursorZ < fromZ + 165) {
      const blockedLane = Math.floor(Math.random() * 3);
      if (Math.random() < 0.58) {
        state.defenders.push({
          id: 'def_' + Math.random().toString(36).slice(2, 8),
          lane: blockedLane,
          x: LANE_X[blockedLane],
          z: cursorZ,
          stickReach: 2.35,
          stickDir: blockedLane === 0 ? 1 : (blockedLane === 2 ? -1 : (Math.random() < 0.5 ? 1 : -1)),
          stridePhase: Math.random() * 6.28
        });
      } else {
        state.obstacles.push({
          id: 'obs_' + Math.random().toString(36).slice(2, 8),
          lane: blockedLane,
          x: LANE_X[blockedLane],
          z: cursorZ,
          kind: arena.obstacleType,
          radius: 1.55
        });
      }
      cursorZ += Math.max(19, 28 - state.level * 1.3);
    }
  }

  function ensureGoalNetAhead() {
    const carrier = getControlledSkater();
    if (!carrier) return null;
    const existing = state.nets.find((n) => !n.scored && n.z > carrier.z + 10 && n.z < carrier.z + 82);
    if (existing) return existing;

    const netZ = carrier.z + 44;
    // Clear obstacles/defenders right in front of the crease so the goal net is pristine
    state.obstacles = state.obstacles.filter((o) => Math.abs(o.z - netZ) > 9);
    state.defenders = state.defenders.filter((d) => Math.abs(d.z - netZ) > 8);

    const net = {
      id: 'net_' + Date.now(),
      x: 0,
      z: netZ,
      scored: false,
      rippleTimer: 0,
      goalLightTimer: 0
    };
    state.nets.push(net);
    return net;
  }

  /* ==========================================================================
     SNOW SPRAY & BLADE CARVE TRAILS
     ========================================================================== */
  function spawnSnowBurst(wx, wz, dirX, count, colorOverride) {
    const total = count || 20;
    for (let i = 0; i < total; i++) {
      const spread = (Math.random() - 0.5) * 4.5;
      state.snowParticles.push({
        x: wx + (Math.random() - 0.5) * 0.8,
        y: 0.15 + Math.random() * 0.4,
        z: wz + (Math.random() - 0.5) * 1.1,
        vx: dirX * (2.6 + Math.random() * 5.2) + spread * 0.5,
        vy: 2.2 + Math.random() * 4.4,
        vz: (Math.random() - 0.3) * 4.0,
        size: 1.8 + Math.random() * 2.8,
        life: 0.42 + Math.random() * 0.28,
        maxLife: 0.7,
        color: colorOverride || 'rgba(241, 245, 249, 0.92)'
      });
    }
    if (state.snowParticles.length > 220) {
      state.snowParticles.splice(0, state.snowParticles.length - 220);
    }
  }

  function recordBladeCarve(skater, isCut) {
    const sideOffset = Math.sin(skater.stridePhase) >= 0 ? 0.38 : -0.38;
    state.bladeTrails.push({
      x1: skater.x + sideOffset,
      z1: skater.z - 0.6,
      x2: skater.x + sideOffset * 0.7,
      z2: skater.z + 0.5,
      alpha: isCut ? 0.92 : 0.52,
      width: isCut ? 2.6 : 1.5,
      isCarrier: skater.id === state.controlledSkaterId
    });
    if (state.bladeTrails.length > 260) {
      state.bladeTrails.shift();
    }
  }

  /* ==========================================================================
     ON-ICE LEAD RING EVALUATION (EMERALD / AMBER / CRIMSON)
     ========================================================================== */
  function pointToSegmentDist2D(px, pz, ax, az, bx, bz) {
    const vx = bx - ax;
    const vz = bz - az;
    const wx = px - ax;
    const wz = pz - az;
    const lenSq = vx * vx + vz * vz;
    if (lenSq < 0.0001) return Math.hypot(px - ax, pz - az);
    const t = Math.max(0, Math.min(1, (wx * vx + wz * vz) / lenSq));
    const cx = ax + t * vx;
    const cz = az + t * vz;
    return Math.hypot(px - cx, pz - cz);
  }

  function evaluateLeadWindow(carrier, teammate) {
    if (!carrier || !teammate) return 'emerald';
    if (teammate.isDecoy) return 'crimson';

    const visionBonus = (profile.upgrades.vision - 1) * 0.14;
    const leadZ = teammate.z + 4.8 + visionBonus * 2;
    teammate.leadZ = leadZ;

    let minBlockerDist = 999;

    for (let i = 0; i < state.defenders.length; i++) {
      const d = state.defenders[i];
      if (d.z < carrier.z - 1 || d.z > leadZ + 4) continue;
      const stickTipX = d.x + d.stickDir * d.stickReach * 0.65;
      const distBody = pointToSegmentDist2D(d.x, d.z, carrier.x, carrier.z, teammate.x, leadZ);
      const distStick = pointToSegmentDist2D(stickTipX, d.z - 0.5, carrier.x, carrier.z, teammate.x, leadZ);
      minBlockerDist = Math.min(minBlockerDist, distBody, distStick);
    }

    for (let i = 0; i < state.obstacles.length; i++) {
      const o = state.obstacles[i];
      if (o.z < carrier.z - 1 || o.z > leadZ + 3) continue;
      const distObs = pointToSegmentDist2D(o.x, o.z, carrier.x, carrier.z, teammate.x, leadZ);
      minBlockerDist = Math.min(minBlockerDist, distObs + 0.35);
    }

    const crimsonThreshold = Math.max(1.15, 1.65 - visionBonus);
    const amberThreshold = Math.max(2.35, 3.15 - visionBonus * 0.8);

    if (minBlockerDist <= crimsonThreshold) return 'crimson';
    if (minBlockerDist <= amberThreshold) return 'amber';
    return 'emerald';
  }

  function updateTeammateWeavingAndRings(dt) {
    const carrier = getControlledSkater();
    if (!carrier) return;

    const supportSkaters = state.skaters.filter((s) => s.id !== carrier.id && !s.isDecoy);
    const decoySkaters = state.skaters.filter((s) => s.isDecoy);

    // Assign open lanes so teammates always frame the carrier cleanly
    const availableLanes = [0, 1, 2].filter((l) => l !== carrier.lane);

    supportSkaters.forEach((mate, idx) => {
      const desiredZ = carrier.z + (idx === 0 ? 13.5 : 18.5);
      mate.z += (desiredZ - mate.z) * Math.min(1, dt * 6.5);

      if (state.level <= 2) {
        // Levels 1-2: Steady parallel support lanes
        const targetLane = availableLanes[idx % availableLanes.length];
        mate.lane = targetLane;
        mate.targetX = LANE_X[targetLane];
      } else if (state.level <= 4) {
        // Levels 3-4: Diagonal slot cuts across lanes
        const wave = Math.sin(state.clock * 1.45 + idx * 2.4);
        mate.targetX = wave * 7.6;
        mate.lane = mate.targetX < -3.2 ? 0 : (mate.targetX > 3.2 ? 2 : 1);
      } else {
        // Levels 5+: Criss-cross scissor switches
        const scissor = Math.sin(state.clock * 2.05 + (idx === 0 ? 0 : Math.PI));
        mate.targetX = scissor * 8.1;
        mate.lane = mate.targetX < -3.2 ? 0 : (mate.targetX > 3.2 ? 2 : 1);
      }

      const prevX = mate.x;
      mate.x += (mate.targetX - mate.x) * Math.min(1, dt * 5.2);
      mate.tilt = (mate.x - prevX) * 2.2;
      mate.stridePhase += dt * (9.5 + state.level * 0.5);
      mate.leadRingColor = evaluateLeadWindow(carrier, mate);
    });

    decoySkaters.forEach((decoy) => {
      const desiredZ = carrier.z + 22.5;
      decoy.z += (desiredZ - decoy.z) * Math.min(1, dt * 6.0);
      decoy.targetX = Math.cos(state.clock * 1.7) * 6.8;
      decoy.x += (decoy.targetX - decoy.x) * Math.min(1, dt * 4.8);
      decoy.stridePhase += dt * 10.2;
      decoy.leadZ = decoy.z + 4.6;
      decoy.leadRingColor = 'crimson';
    });
  }

  function pickTargetReceiver(preferredSkaterId) {
    const carrier = getControlledSkater();
    const candidates = state.skaters.filter((s) => s.id !== carrier.id);
    if (!candidates.length) return null;

    if (preferredSkaterId) {
      const exact = candidates.find((c) => c.id === preferredSkaterId);
      if (exact) return exact;
    }

    const rank = { emerald: 3, amber: 2, crimson: 1 };
    const sorted = candidates.slice().sort((a, b) => {
      const rDiff = (rank[b.leadRingColor] || 0) - (rank[a.leadRingColor] || 0);
      if (rDiff !== 0) return rDiff;
      return a.z - b.z;
    });
    return sorted[0];
  }

  /* ==========================================================================
     GAMEPLAY ACTIONS: LANE CUTS, PASS & WHIP-PAN, ONE-TIMER SHOOT, TURNOVER
     ========================================================================== */
  function showIceCallout(title, subtitle, variant, durationMs) {
    const box = document.getElementById('ice-callout');
    const badge = document.getElementById('callout-badge');
    const sub = document.getElementById('callout-sub');
    badge.textContent = title;
    badge.className = 'callout-badge' + (variant ? ' ' + variant : '');
    sub.textContent = subtitle || '';
    box.classList.remove('hidden');
    clearTimeout(showIceCallout._timer);
    showIceCallout._timer = setTimeout(() => {
      box.classList.add('hidden');
    }, durationMs || 1650);
  }

  function moveLane(delta) {
    if (state.mode !== 'playing' || state.countdown.active || state.whipPan.active) return false;
    const carrier = getControlledSkater();
    if (!carrier) return false;
    const nextLane = Math.max(0, Math.min(2, carrier.lane + delta));
    if (nextLane === carrier.lane) return false;

    carrier.lane = nextLane;
    carrier.targetX = LANE_X[nextLane];
    carrier.tilt = delta * 0.42;

    // Directional snow-spray burst opposite the cut direction
    spawnSnowBurst(carrier.x, carrier.z, -delta, 22);
    recordBladeCarve(carrier, true);
    sfxCut();
    return true;
  }

  function triggerTurnover(reasonText) {
    state.passes = 0;
    state.oneTimerArmed = false;
    state.whipPan.active = false;
    state.shotInFlight = null;
    state.stumbleTimer = 1.0;
    state.graceTimer = 1.45;
    state.shakeTimer = 0.35;
    state.pucks = Math.max(0, state.pucks - 1);

    const carrier = getControlledSkater();
    if (carrier) {
      spawnSnowBurst(carrier.x, carrier.z, (Math.random() < 0.5 ? -1 : 1), 26, 'rgba(254, 202, 202, 0.92)');
    }

    sfxTurnover();
    syncHudValues();
    showIceCallout('TURNOVER! -1 PUCK', reasonText || 'Pass chain reset to 0/3', 'warn', 1500);
    speakGuide('turnover');

    if (state.pucks <= 0) {
      setTimeout(() => {
        if (state.mode === 'playing' && state.pucks <= 0) {
          endShift();
        }
      }, window.__TEST_MODE__ ? 80 : 650);
    }
  }

  function completeWhipPanTransfer() {
    const wp = state.whipPan;
    if (!wp.active) return;

    const receiver = state.skaters.find((s) => s.id === wp.toSkaterId);
    wp.active = false;

    if (wp.intercepted || !receiver) {
      triggerTurnover('Pass intercepted in Crimson lane!');
      return;
    }

    // Seamless receiver lock as newly controlled skater!
    state.controlledSkaterId = receiver.id;
    wp.transferCount += 1;
    state.passes = Math.min(3, state.passes + 1);
    state.totalPassesInShift += 1;
    profile.lifetimePasses += 1;
    unlockTrophy('first_pass');

    if (wp.leadColor === 'amber') {
      profile.storyPoints += 5;
      state.shiftSpEarned += 5;
      unlockTrophy('thread_needle');
    }

    spawnSnowBurst(receiver.x, receiver.z, receiver.x >= wp.fromX ? 1 : -1, 16, 'rgba(167, 243, 208, 0.92)');
    sfxPass(state.passes);

    if (state.passes >= 3) {
      state.oneTimerArmed = true;
      ensureGoalNetAhead();
      sfxArmed();
      showIceCallout('ONE-TIMER ARMED!', 'Target corners lit — tap 🎯 Shoot!', '', 2200);
      speakGuide('armed');
    } else if (state.passes === 1) {
      showIceCallout(`TAPE-TO-TAPE! (${state.passes}/3)`, 'Camera locked onto receiver!', '', 1100);
      speakGuide('pass1');
    } else {
      showIceCallout(`PASS CHAIN: ${state.passes}/3`, 'One more pass arms the One-Timer!', '', 1100);
    }

    saveProfile();
    syncHudValues();
  }

  function triggerPass(preferredReceiverId, forceResultColor) {
    if (state.mode !== 'playing' || state.countdown.active || state.whipPan.active || state.shotInFlight) {
      return false;
    }
    if (state.stumbleTimer > 0) return false;

    const carrier = getControlledSkater();
    const receiver = pickTargetReceiver(preferredReceiverId);
    if (!carrier || !receiver) return false;

    const leadColor = forceResultColor || receiver.leadRingColor || evaluateLeadWindow(carrier, receiver);
    const zipFactor = 1 + (profile.upgrades.passZip - 1) * 0.14;
    const duration = Math.max(0.14, 0.28 / zipFactor);

    state.whipPan.active = true;
    state.whipPan.fromX = carrier.x;
    state.whipPan.fromZ = carrier.z;
    state.whipPan.toSkaterId = receiver.id;
    state.whipPan.progress = 0;
    state.whipPan.duration = duration;
    state.whipPan.leadColor = leadColor;
    state.whipPan.intercepted = (leadColor === 'crimson');

    spawnSnowBurst(carrier.x, carrier.z, receiver.x > carrier.x ? -1 : 1, 12);
    return true;
  }

  function startPostGoalCountdown(didLevelUp) {
    const overlay = document.getElementById('countdown-overlay');
    const numEl = document.getElementById('countdown-number');
    const lblEl = document.getElementById('countdown-label');

    state.countdown.active = true;
    state.countdown.pendingLevelUp = !!didLevelUp;
    state.countdown.history = [];
    overlay.classList.remove('hidden');

    const steps = ['3', '2', '1', 'PUCK DROP!'];
    const beatMs = window.__TEST_MODE__ ? 95 : 620;
    let idx = 0;

    function runStep() {
      if (state.mode !== 'playing') {
        overlay.classList.add('hidden');
        state.countdown.active = false;
        return;
      }
      const label = steps[idx];
      state.countdown.stepText = label;
      state.countdown.history.push(label);
      numEl.textContent = label;
      lblEl.textContent = didLevelUp
        ? `LEVEL ${state.level}: ${getArenaForLevel(state.level).name.toUpperCase()}`
        : 'FULL-STRIDE PUCK DROP';
      sfxCountdownBeep(idx === steps.length - 1);

      idx += 1;
      if (idx < steps.length) {
        setTimeout(runStep, beatMs);
      } else {
        setTimeout(() => {
          overlay.classList.add('hidden');
          state.countdown.active = false;
          state.countdown.stepText = '';
          state.graceTimer = 1.0;
          const carrier = getControlledSkater();
          if (carrier) {
            populateWaveAhead(carrier.z);
          }
        }, beatMs * 0.85);
      }
    }

    runStep();
  }

  function onGoalScored(net) {
    if (net) {
      net.scored = true;
      net.rippleTimer = 1.5;
      net.goalLightTimer = 1.8;
      spawnSnowBurst(net.x, net.z - 1.2, 1, 24, 'rgba(253, 224, 71, 0.95)');
      spawnSnowBurst(net.x, net.z - 1.2, -1, 24, 'rgba(52, 211, 153, 0.95)');
    }

    sfxGoalHorn();

    const spReward = 25 + (profile.upgrades.shotPower - 1) * 5;
    profile.storyPoints += spReward;
    state.shiftSpEarned += spReward;
    profile.lifetimeGoals += 1;

    state.goals += 1;
    state.passes = 0;
    state.oneTimerArmed = false;

    let didLevelUp = false;
    if (state.goals >= 3) {
      didLevelUp = true;
      unlockTrophy('hat_trick');
      if (state.level >= 4) unlockTrophy('winter_classic');
      if (state.level >= 5) unlockTrophy('synapz_cup');

      const levelBonus = 60;
      profile.storyPoints += levelBonus;
      state.shiftSpEarned += levelBonus;

      state.level += 1;
      profile.unlockedLevel = Math.max(profile.unlockedLevel, Math.min(5, state.level));
      profile.selectedLevel = Math.min(5, state.level);
      state.goals = 0;
      state.pucks = 3;
      state.baseIceSpeed = calcBaseSpeedForLevel(state.level);

      // Refresh squad for new arena (adds covered decoy at Level 5+)
      const carrier = getControlledSkater();
      buildSkaterSquad(carrier ? carrier.z : 0);
      showIceCallout(`LEVEL UP! +${spReward + levelBonus} SP`, `Entering ${getArenaForLevel(state.level).name}!`, 'gold', 2400);
      speakGuide('levelup');
    } else {
      showIceCallout(`GOAL! +${spReward} SP`, `Goals: ${state.goals}/3 — Horn & Net Ripple!`, 'gold', 1900);
      speakGuide('goal');
    }

    saveProfile();
    syncHudValues();
    startPostGoalCountdown(didLevelUp);
  }

  function triggerShoot() {
    if (state.mode !== 'playing' || state.countdown.active || state.whipPan.active || state.shotInFlight) {
      return false;
    }
    // Mandatory 3-Pass Rule!
    if (state.passes < 3 || !state.oneTimerArmed) {
      return false;
    }

    const carrier = getControlledSkater();
    const net = ensureGoalNetAhead();
    if (!carrier || !net) return false;

    const cornerX = carrier.x <= 0 ? 1.95 : -1.95; // Top shelf corner!
    const shotSpeedBonus = 1 + (profile.upgrades.shotPower - 1) * 0.16;

    state.shotInFlight = {
      fromX: carrier.x,
      fromZ: carrier.z + 1.1,
      toX: cornerX,
      toY: 1.55,
      toZ: net.z,
      net: net,
      progress: 0,
      duration: Math.max(0.12, 0.22 / shotSpeedBonus)
    };

    spawnSnowBurst(carrier.x, carrier.z, carrier.x >= 0 ? -1 : 1, 22, 'rgba(253, 224, 71, 0.92)');
    playTone(190, 'sawtooth', 0.14, 0.11, 460);
    return true;
  }

  /* ==========================================================================
     SHIFT LIFECYCLE & HUD SYNC
     ========================================================================== */
  function syncHudValues() {
    const arena = getArenaForLevel(state.level);
    document.getElementById('hud-arena-name').textContent = `L${state.level} • ${arena.shortName}`;

    const passEl = document.getElementById('hud-passes');
    if (state.oneTimerArmed && state.passes >= 3) {
      passEl.textContent = 'PASSES: 3/3 • ARMED!';
      passEl.setAttribute('data-armed', 'true');
    } else {
      passEl.textContent = `PASSES: ${state.passes}/3`;
      passEl.setAttribute('data-armed', 'false');
    }

    document.getElementById('hud-goals').textContent = `GOALS: ${state.goals}/3`;

    const fullDots = '●'.repeat(Math.max(0, state.pucks));
    const emptyDots = '○'.repeat(Math.max(0, 3 - state.pucks));
    document.getElementById('hud-puck-dots').textContent = fullDots + emptyDots;

    document.getElementById('hud-sp-val').textContent = String(profile.storyPoints);
    const hubSp = document.getElementById('hub-sp-count');
    if (hubSp) hubSp.textContent = String(profile.storyPoints);

    const shootBtn = document.getElementById('btn-shoot');
    if (state.oneTimerArmed && state.passes >= 3) {
      shootBtn.disabled = false;
      shootBtn.classList.add('armed');
    } else {
      shootBtn.disabled = true;
      shootBtn.classList.remove('armed');
    }
  }

  function startShift(levelOverride) {
    state.level = levelOverride || profile.selectedLevel || 1;
    state.baseIceSpeed = calcBaseSpeedForLevel(state.level);
    state.currentSpeed = state.baseIceSpeed;
    state.passes = 0;
    state.totalPassesInShift = 0;
    state.oneTimerArmed = false;
    state.goals = 0;
    state.pucks = 3;
    state.shiftSpEarned = 0;
    state.stumbleTimer = 0;
    state.graceTimer = 1.2;
    state.whipPan.active = false;
    state.shotInFlight = null;
    state.countdown.active = false;
    state.bladeTrails = [];
    state.snowParticles = [];
    state.defenders = [];
    state.obstacles = [];
    state.nets = [];

    buildSkaterSquad(0);
    populateWaveAhead(0);

    profile.shiftsPlayed += 1;
    saveProfile();

    state.mode = 'playing';
    document.getElementById('entry-gate').classList.add('hidden');
    document.getElementById('locker-hub').classList.add('hidden');
    document.getElementById('shift-modal').classList.add('hidden');
    document.getElementById('redflag-modal').classList.add('hidden');
    document.getElementById('countdown-overlay').classList.add('hidden');

    document.getElementById('hud-top').classList.remove('hidden');
    document.getElementById('thumb-controls').classList.remove('hidden');

    syncHudValues();
    speakGuide('start');
  }

  function endShift() {
    state.mode = 'shift_over';
    clearSpeechTimers();
    speechBubbleEl.classList.add('hidden');
    replayOrbEl.classList.add('hidden');
    document.getElementById('thumb-controls').classList.add('hidden');

    document.getElementById('sum-arena').textContent = `L${state.level} • ${getArenaForLevel(state.level).shortName}`;
    document.getElementById('sum-goals').textContent = `${state.goals} / 3`;
    document.getElementById('sum-passes').textContent = String(state.totalPassesInShift);
    document.getElementById('sum-sp').textContent = `+${state.shiftSpEarned} SP`;

    document.getElementById('shift-modal').classList.remove('hidden');
  }

  function openEntryGate() {
    state.mode = 'gate';
    clearSpeechTimers();
    speechBubbleEl.classList.add('hidden');
    replayOrbEl.classList.add('hidden');
    document.getElementById('hud-top').classList.add('hidden');
    document.getElementById('thumb-controls').classList.add('hidden');
    document.getElementById('locker-hub').classList.add('hidden');
    document.getElementById('shift-modal').classList.add('hidden');
    document.getElementById('countdown-overlay').classList.add('hidden');
    document.getElementById('entry-gate').classList.remove('hidden');
  }

  /* ==========================================================================
     5 ILLUSTRATED POINT-AND-CLICK LOCKER HUB ROOMS
     ========================================================================== */
  function getRoomSvgBanner(roomId) {
    if (roomId === 'tunnel') {
      return `
        <svg viewBox="0 0 480 130" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="tunGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9"/>
              <stop offset="100%" stop-color="#e0f2fe" stop-opacity="1"/>
            </linearGradient>
          </defs>
          <rect width="480" height="130" fill="#091326"/>
          <polygon points="0,0 135,24 135,108 0,130" fill="#1e293b"/>
          <polygon points="480,0 345,24 345,108 480,130" fill="#1e293b"/>
          <polygon points="0,0 480,0 345,24 135,24" fill="#0f172a"/>
          <polygon points="135,108 345,108 480,130 0,130" fill="#334155"/>
          <rect x="135" y="24" width="210" height="84" rx="4" fill="url(#tunGlow)" data-hotspot="drop-puck" style="cursor:pointer"/>
          <line x1="165" y1="92" x2="315" y2="92" stroke="#ef4444" stroke-width="3"/>
          <text x="240" y="64" text-anchor="middle" fill="#082f49" font-size="14" font-weight="900">TAP ICE PORTAL TO SKATE</text>
          <circle cx="70" cy="48" r="10" fill="#facc15" opacity="0.8"/>
          <circle cx="410" cy="48" r="10" fill="#facc15" opacity="0.8"/>
        </svg>`;
    }
    if (roomId === 'stall') {
      const jTheme = JERSEY_THEMES[profile.custom.jersey] || JERSEY_THEMES.cyan;
      return `
        <svg viewBox="0 0 480 130" xmlns="http://www.w3.org/2000/svg">
          <rect width="480" height="130" fill="#140f0b"/>
          <rect x="20" y="8" width="440" height="114" rx="8" fill="#291d12" stroke="#78350f" stroke-width="3"/>
          <line x1="160" y1="8" x2="160" y2="122" stroke="#78350f" stroke-width="3"/>
          <line x1="320" y1="8" x2="320" y2="122" stroke="#78350f" stroke-width="3"/>
          <!-- Hanging Synapz Rush Jersey -->
          <path d="M210,28 L270,28 L292,52 L276,62 L266,48 L266,104 L214,104 L214,48 L204,62 L188,52 Z" fill="${jTheme.main}" stroke="${jTheme.stripe}" stroke-width="2.5"/>
          <text x="240" y="76" text-anchor="middle" fill="${jTheme.num}" font-size="22" font-weight="900">97</text>
          <!-- Helmet & Skates -->
          <circle cx="92" cy="52" r="20" fill="#0284c7" stroke="#bae6fd" stroke-width="2"/>
          <rect x="78" y="48" width="28" height="10" rx="4" fill="#e0f2fe" opacity="0.8"/>
          <path d="M372,92 L412,92 L416,104 L368,104 Z" fill="#cbd5e1"/>
          <rect x="376" y="72" width="24" height="20" rx="4" fill="#0f172a" stroke="#38bdf8"/>
        </svg>`;
    }
    if (roomId === 'chalkboard') {
      return `
        <svg viewBox="0 0 480 130" xmlns="http://www.w3.org/2000/svg">
          <rect width="480" height="130" fill="#06281e"/>
          <rect x="16" y="10" width="448" height="110" rx="8" fill="#064e3b" stroke="#a7f3d0" stroke-width="2.5"/>
          <line x1="165" y1="10" x2="165" y2="120" stroke="rgba(255,255,255,0.28)" stroke-width="2"/>
          <line x1="315" y1="10" x2="315" y2="120" stroke="rgba(255,255,255,0.28)" stroke-width="2"/>
          <circle cx="95" cy="88" r="9" fill="none" stroke="#34d399" stroke-width="2.5"/>
          <circle cx="240" cy="48" r="9" fill="none" stroke="#34d399" stroke-width="2.5"/>
          <circle cx="380" cy="68" r="9" fill="none" stroke="#fde047" stroke-width="2.5"/>
          <path d="M104,84 Q170,40 230,48" fill="none" stroke="#7dd3fc" stroke-width="2.5" stroke-dasharray="5,4"/>
          <path d="M250,48 Q315,78 370,68" fill="none" stroke="#fde047" stroke-width="2.5" stroke-dasharray="5,4"/>
          <text x="240" y="110" text-anchor="middle" fill="#d1fae5" font-size="11" font-weight="800">3-PASS WEAVE → HIGH-SLOT ONE-TIMER</text>
        </svg>`;
    }
    if (roomId === 'proshop') {
      const tColor = (TAPE_THEMES[profile.custom.tape] || TAPE_THEMES.white).color;
      return `
        <svg viewBox="0 0 480 130" xmlns="http://www.w3.org/2000/svg">
          <rect width="480" height="130" fill="#0f172a"/>
          <rect x="20" y="84" width="440" height="36" rx="4" fill="#334155"/>
          <!-- Skate Grinder Sparks -->
          <circle cx="130" cy="62" r="22" fill="#475569" stroke="#38bdf8" stroke-width="3"/>
          <line x1="150" y1="54" x2="184" y2="36" stroke="#fde047" stroke-width="2.5"/>
          <line x1="152" y1="62" x2="192" y2="58" stroke="#fb923c" stroke-width="2.5"/>
          <!-- Custom Stick Blade -->
          <path d="M250,24 L335,72 L398,70 L398,82 L328,84 L242,32 Z" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
          <rect x="348" y="70" width="38" height="13" fill="${tColor}"/>
        </svg>`;
    }
    return `
      <svg viewBox="0 0 480 130" xmlns="http://www.w3.org/2000/svg">
        <rect width="480" height="130" fill="#0b1120"/>
        <rect x="24" y="12" width="432" height="106" rx="10" fill="#111c38" stroke="#facc15" stroke-width="2"/>
        <!-- Synapz Championship Cup -->
        <path d="M216,32 L264,32 L256,64 Q240,78 224,64 Z" fill="#facc15"/>
        <rect x="233" y="68" width="14" height="18" fill="#eab308"/>
        <rect x="218" y="86" width="44" height="14" rx="3" fill="#78350f" stroke="#fde047"/>
        <circle cx="120" cy="62" r="20" fill="#0284c7" stroke="#7dd3fc" stroke-width="2"/>
        <text x="120" y="67" text-anchor="middle" fill="#fff" font-size="14" font-weight="900">★</text>
        <circle cx="360" cy="62" r="20" fill="#059669" stroke="#6ee7b7" stroke-width="2"/>
        <text x="360" y="67" text-anchor="middle" fill="#fff" font-size="14" font-weight="900">🏆</text>
      </svg>`;
  }

  function renderHubRoom(roomId) {
    state.activeHubRoom = roomId || state.activeHubRoom || 'tunnel';
    const stage = document.getElementById('hub-room-stage');
    document.getElementById('hub-sp-count').textContent = String(profile.storyPoints);

    document.querySelectorAll('.room-tab').forEach((btn) => {
      const isAct = btn.getAttribute('data-room') === state.activeHubRoom;
      btn.classList.toggle('active', isAct);
      btn.setAttribute('aria-selected', isAct ? 'true' : 'false');
    });

    const bannerHtml = `<div class="room-svg-banner">${getRoomSvgBanner(state.activeHubRoom)}</div>`;

    if (state.activeHubRoom === 'tunnel') {
      const guideButtons = Object.values(PEER_GUIDES).map((g) => `
        <button type="button" class="guide-card-btn ${profile.guideId === g.id ? 'active' : ''}" data-select-guide="${g.id}">
          <div>${g.avatar} <strong>${g.name}</strong></div>
          <div>${g.band}</div>
        </button>
      `).join('');

      const curArena = getArenaForLevel(profile.selectedLevel);
      stage.innerHTML = `
        ${bannerHtml}
        <div>
          <h3 class="room-heading">1. Tunnel Entry Gate</h3>
          <p class="room-sub">Choose your Peer Guide voice band and step straight onto <strong>L${curArena.level}: ${curArena.name}</strong>.</p>
        </div>
        <div class="guide-selector-row">${guideButtons}</div>
        <div class="hub-item-card">
          <div class="hub-item-info">
            <div class="hub-item-title">Active Rink: L${curArena.level} • ${curArena.name}</div>
            <div class="hub-item-meta">${curArena.weaveLabel} • ${curArena.obstacleLabel}</div>
          </div>
          <button type="button" class="hub-action-pill selected" data-action="launch-shift">🏒 Skate Out</button>
        </div>
      `;
    } else if (state.activeHubRoom === 'stall') {
      const specs = [
        { key: 'speed', label: '⚡ Skating Speed', desc: 'Snappier lane cuts & faster base stride' },
        { key: 'passZip', label: '🏒 Pass Zip', desc: 'Higher puck velocity & tighter camera whip-pan' },
        { key: 'vision', label: '👁️ Ice Vision Range', desc: 'Longer Lead Ring sightlines & wider green seams' },
        { key: 'shotPower', label: '🎯 Shot Power', desc: 'Blistering one-timer speed & +5 bonus SP per goal' }
      ];

      const rows = specs.map((sp) => {
        const lvl = profile.upgrades[sp.key] || 1;
        const cost = lvl * 25;
        const isMax = lvl >= 5;
        const canAfford = profile.storyPoints >= cost && !isMax;
        return `
          <div class="hub-item-card">
            <div class="hub-item-info">
              <div class="hub-item-title">${sp.label} • Lv ${lvl}/5</div>
              <div class="hub-item-meta">${sp.desc}</div>
            </div>
            <button type="button" class="hub-action-pill ${isMax ? 'maxed' : ''}" data-upgrade="${sp.key}" ${!canAfford ? 'disabled' : ''}>
              ${isMax ? 'MAXED' : `Upgrade (${cost} SP)`}
            </button>
          </div>
        `;
      }).join('');

      stage.innerHTML = `
        ${bannerHtml}
        <div>
          <h3 class="room-heading">2. Player Locker Stall</h3>
          <p class="room-sub">Spend Story Points earned from goals and thread-the-needle passes.</p>
        </div>
        <div class="hub-grid-list">${rows}</div>
      `;
    } else if (state.activeHubRoom === 'chalkboard') {
      const cards = ARENAS.map((a) => {
        const unlocked = a.level <= Math.max(5, profile.unlockedLevel + 4); // Playable anytime in playtest + tracked progression
        const isSelected = profile.selectedLevel === a.level;
        const cleared = profile.unlockedLevel > a.level;
        return `
          <div class="hub-item-card">
            <div class="hub-item-info">
              <div class="hub-item-title">L${a.level} • ${a.name} ${cleared ? '⭐' : ''}</div>
              <div class="hub-item-meta">${a.weaveLabel} • Base ${a.baseSpeed} km/h</div>
            </div>
            <button type="button" class="hub-action-pill ${isSelected ? 'selected' : ''}" data-pick-arena="${a.level}" ${!unlocked ? 'disabled' : ''}>
              ${isSelected ? '🏒 Play Now' : 'Select & Play'}
            </button>
          </div>
        `;
      }).join('');

      stage.innerHTML = `
        ${bannerHtml}
        <div>
          <h3 class="room-heading">3. Coach Chalkboard Story Map</h3>
          <p class="room-sub">Select any of the 5 themed obstacle arenas to test progressive teammate weaving.</p>
        </div>
        <div class="hub-grid-list">${cards}</div>
      `;
    } else if (state.activeHubRoom === 'proshop') {
      const jerseyBtns = Object.entries(JERSEY_THEMES).map(([k, v]) => `
        <div class="hub-item-card">
          <div class="hub-item-info">
            <div class="hub-item-title">🎽 ${v.name}</div>
            <div class="hub-item-meta">Synapz Hockey Rush Sweater Colorway</div>
          </div>
          <button type="button" class="hub-action-pill ${profile.custom.jersey === k ? 'selected' : ''}" data-jersey="${k}">
            ${profile.custom.jersey === k ? 'Equipped' : 'Equip'}
          </button>
        </div>
      `).join('');

      const trailBtns = Object.entries(TRAIL_THEMES).map(([k, v]) => `
        <div class="hub-item-card">
          <div class="hub-item-info">
            <div class="hub-item-title">❄️ ${v.name}</div>
            <div class="hub-item-meta">Persistent Skate-Blade Ice Carve Tint</div>
          </div>
          <button type="button" class="hub-action-pill ${profile.custom.trail === k ? 'selected' : ''}" data-trail="${k}">
            ${profile.custom.trail === k ? 'Equipped' : 'Equip'}
          </button>
        </div>
      `).join('');

      stage.innerHTML = `
        ${bannerHtml}
        <div>
          <h3 class="room-heading">4. Pro Shop Workbench</h3>
          <p class="room-sub">Customize your Rush sweater and persistent skate-blade carve tint.</p>
        </div>
        <div class="hub-grid-list">${jerseyBtns}${trailBtns}</div>
      `;
    } else {
      const milestones = [
        { id: 'first_pass', name: '🏒 First Tape-to-Tape', desc: 'Complete a clean Lead Ring whip-pan transfer' },
        { id: 'thread_needle', name: '⚡ Thread the Needle', desc: 'Complete a tight Amber window pass' },
        { id: 'hat_trick', name: '🎩 3-Goal Arena Clear', desc: 'Score 3/3 goals to clear an Arena Level' },
        { id: 'synapz_cup', name: '🏆 Pro Championship Cup', desc: 'Conquer Level 5 Pro Championship Arena' }
      ];

      const rows = milestones.map((m) => {
        const earned = profile.trophies.includes(m.id);
        return `
          <div class="hub-item-card">
            <div class="hub-item-info">
              <div class="hub-item-title">${m.name}</div>
              <div class="hub-item-meta">${m.desc}</div>
            </div>
            <span class="hub-action-pill ${earned ? 'selected' : ''}">${earned ? 'UNLOCKED' : 'Locked'}</span>
          </div>
        `;
      }).join('');

      stage.innerHTML = `
        ${bannerHtml}
        <div>
          <h3 class="room-heading">5. Trophy Concourse</h3>
          <p class="room-sub">Career Goals: <strong>${profile.lifetimeGoals}</strong> • Tape Passes: <strong>${profile.lifetimePasses}</strong> • Shifts: <strong>${profile.shiftsPlayed}</strong></p>
        </div>
        <div class="hub-grid-list">${rows}</div>
      `;
    }
  }

  function openLockerHub(roomId) {
    state.mode = 'hub';
    clearSpeechTimers();
    speechBubbleEl.classList.add('hidden');
    replayOrbEl.classList.add('hidden');
    document.getElementById('hud-top').classList.add('hidden');
    document.getElementById('thumb-controls').classList.add('hidden');
    document.getElementById('entry-gate').classList.add('hidden');
    document.getElementById('shift-modal').classList.add('hidden');
    document.getElementById('locker-hub').classList.remove('hidden');
    renderHubRoom(roomId || state.activeHubRoom || 'tunnel');
  }

  /* ==========================================================================
     SEAT 0 CO-FOUNDER RED-FLAG MODAL (ZERO SPAM IN __TEST_MODE__)
     ========================================================================== */
  function openRedFlagModal() {
    const modal = document.getElementById('redflag-modal');
    const ctxEl = document.getElementById('redflag-context');
    const statusEl = document.getElementById('redflag-status');
    const arena = getArenaForLevel(state.level);
    ctxEl.textContent = `Context: Mode=${state.mode} | L${state.level} (${arena.shortName}) | Passes=${state.passes}/3 | Goals=${state.goals}/3 | Pucks=${state.pucks}/3`;
    statusEl.textContent = '';
    document.getElementById('redflag-input').value = '';
    modal.classList.remove('hidden');
  }

  function saveRedFlagNote() {
    const note = document.getElementById('redflag-input').value.trim() || 'Quick playtest marker';
    const entry = {
      id: 'rf_' + Date.now(),
      timestamp: new Date().toISOString(),
      coFounders: ['danebekkedahl@gmail.com', 'evanbekk@gmail.com'],
      level: state.level,
      passes: state.passes,
      goals: state.goals,
      pucks: state.pucks,
      guide: profile.guideId,
      note: toNaturalTalk(note),
      testModeSuppressedOutbound: !!window.__TEST_MODE__
    };

    let list = [];
    try {
      list = JSON.parse(localStorage.getItem(STORAGE_KEYS.RED_FLAGS) || '[]');
      if (!Array.isArray(list)) list = [];
    } catch (e) {
      list = [];
    }
    list.unshift(entry);
    localStorage.setItem(STORAGE_KEYS.RED_FLAGS, JSON.stringify(list.slice(0, 50)));

    // STRICT GUARD: Never dispatch network/mailto calls when __TEST_MODE__ is active (or ever unsolicited)
    document.getElementById('redflag-status').textContent = window.__TEST_MODE__
      ? 'Saved locally to synapz_rush_red_flags (TEST_MODE outbound suppressed).'
      : 'Saved locally to synapz_rush_red_flags!';
  }

  /* ==========================================================================
     35-DEGREE BROADCAST 3D -> 2D CAMERA PROJECTION & RENDERER
     ========================================================================== */
  let viewW = window.innerWidth;
  let viewH = window.innerHeight;
  let dpr = Math.min(2, window.devicePixelRatio || 1);

  function resizeCanvas() {
    viewW = Math.max(280, Math.floor(window.innerWidth || document.documentElement.clientWidth || 390));
    viewH = Math.max(320, Math.floor(window.innerHeight || document.documentElement.clientHeight || 844));
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.floor(viewW * dpr);
    canvas.height = Math.floor(viewH * dpr);
    canvas.style.width = viewW + 'px';
    canvas.style.height = viewH + 'px';
  }
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('orientationchange', () => setTimeout(resizeCanvas, 60));
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', resizeCanvas);
  }
  resizeCanvas();

  // Camera constants: H=16.5m above ice, D=23.5m behind focus => atan2(16.5, 23.5) = 35.07° elevation!
  const CAM_HEIGHT = 16.5;
  const CAM_BACK = 23.5;
  const PITCH_RAD = 17.5 * (Math.PI / 180);
  const COS_P = Math.cos(PITCH_RAD);
  const SIN_P = Math.sin(PITCH_RAD);

  function project3D(wx, wy, wz) {
    const camZ = state.focusZ - CAM_BACK;
    const dx = wx - state.camX;
    const dy = wy - CAM_HEIGHT;
    const dz = wz - camZ;

    const cz = dz * COS_P - dy * SIN_P;
    if (cz <= 1.2) return null;

    const cy = dy * COS_P + dz * SIN_P;

    // Subtle lateral whip-pan roll
    const cosR = Math.cos(state.camRoll);
    const sinR = Math.sin(state.camRoll);
    const rx = dx * cosR - cy * sinR;
    const ry = dx * sinR + cy * cosR;

    const isLandscape = viewW > viewH;
    const focalX = isLandscape
      ? Math.min(viewW * 0.78, viewH * 0.96)
      : Math.min(viewW * 0.94, viewH * 0.78);
    const focalY = isLandscape ? viewH * 0.64 : viewH * 0.62;
    const centerX = viewW * 0.5;
    const horizonOriginY = isLandscape ? viewH * 0.35 : viewH * 0.37;

    const scale = focalX / cz;
    return {
      x: centerX + (rx / cz) * focalX,
      y: horizonOriginY - (ry / cz) * focalY,
      scale: scale,
      cz: cz
    };
  }

  function drawPoly3D(pts3D, fillStyle, strokeStyle, lineWidth) {
    const projected = [];
    for (let i = 0; i < pts3D.length; i++) {
      const p = project3D(pts3D[i][0], pts3D[i][1], pts3D[i][2]);
      if (!p) return;
      projected.push(p);
    }
    ctx.beginPath();
    ctx.moveTo(projected[0].x, projected[0].y);
    for (let i = 1; i < projected.length; i++) {
      ctx.lineTo(projected[i].x, projected[i].y);
    }
    ctx.closePath();
    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }
    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth || 1.5;
      ctx.stroke();
    }
  }

  function renderArenaBackdrop(arena, horizonY) {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY + 30);
    skyGrad.addColorStop(0, arena.skyTop);
    skyGrad.addColorStop(1, arena.skyBot);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, viewW, horizonY + 30);

    // Arena-specific upper bowl architecture
    if (arena.id === 'pond') {
      // Pine silhouettes & warm twilight string lights
      ctx.fillStyle = '#090d1c';
      for (let x = 0; x < viewW + 30; x += 28) {
        const h = 28 + Math.sin(x * 0.17) * 10;
        ctx.beginPath();
        ctx.moveTo(x - 16, horizonY + 8);
        ctx.lineTo(x, horizonY - h);
        ctx.lineTo(x + 16, horizonY + 8);
        ctx.fill();
      }
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let x = 0; x <= viewW; x += 16) {
        const sag = Math.sin((x / viewW) * Math.PI) * 18;
        if (x === 0) ctx.moveTo(x, 44 + sag);
        else ctx.lineTo(x, 44 + sag);
      }
      ctx.stroke();
      for (let x = 24; x < viewW; x += 42) {
        const sag = Math.sin((x / viewW) * Math.PI) * 18;
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(x, 46 + sag, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (arena.id === 'pro') {
      // Championship rafters, banners & spotlight beams
      for (let i = 0; i < 4; i++) {
        const bx = (viewW * (i + 1)) / 5;
        const sway = Math.sin(state.clock * 1.1 + i) * 22;
        const beam = ctx.createLinearGradient(bx, 10, bx + sway, horizonY + 40);
        beam.addColorStop(0, 'rgba(250, 204, 21, 0.24)');
        beam.addColorStop(1, 'rgba(250, 204, 21, 0)');
        ctx.fillStyle = beam;
        ctx.beginPath();
        ctx.moveTo(bx - 8, 0);
        ctx.lineTo(bx + 8, 0);
        ctx.lineTo(bx + sway + 44, horizonY + 40);
        ctx.lineTo(bx + sway - 44, horizonY + 40);
        ctx.closePath();
        ctx.fill();

        // Gold Championship Banner
        ctx.fillStyle = '#1e1b4b';
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.5;
        ctx.fillRect(bx - 14, 18, 28, 36);
        ctx.strokeRect(bx - 14, 18, 28, 36);
      }
    } else {
      // Stadium / Barn overhead LED light banks
      for (let i = 0; i < 5; i++) {
        const lx = (viewW * (i + 0.5)) / 5;
        ctx.fillStyle = 'rgba(224, 242, 254, 0.78)';
        ctx.fillRect(lx - 18, 34, 36, 5);
        const halo = ctx.createRadialGradient(lx, 36, 2, lx, 36, 46);
        halo.addColorStop(0, arena.lightColor);
        halo.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(lx, 36, 46, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function renderIceSheetAndRink(arena) {
    const zNear = state.focusZ - 14;
    const zFar = state.focusZ + 118;
    const halfW = 13.0;

    const pFarL = project3D(-halfW, 0, zFar);
    const pFarR = project3D(halfW, 0, zFar);
    const pNearR = project3D(halfW, 0, zNear);
    const pNearL = project3D(-halfW, 0, zNear);

    const horizonY = pFarL ? pFarL.y : viewH * 0.24;
    renderArenaBackdrop(arena, horizonY);

    if (pFarL && pFarR && pNearR && pNearL) {
      const iceGrad = ctx.createLinearGradient(0, pFarL.y, 0, pNearL.y);
      iceGrad.addColorStop(0, arena.iceTop);
      iceGrad.addColorStop(0.45, arena.iceMid);
      iceGrad.addColorStop(1, arena.iceBot);

      ctx.beginPath();
      ctx.moveTo(pFarL.x, pFarL.y);
      ctx.lineTo(pFarR.x, pFarR.y);
      ctx.lineTo(pNearR.x, pNearR.y);
      ctx.lineTo(pNearL.x, pNearL.y);
      ctx.closePath();
      ctx.fillStyle = iceGrad;
      ctx.fill();
    }

    // Specular overhead arena reflections across the multi-rink ice sheet
    const firstLightZ = Math.floor(zNear / 24) * 24;
    for (let lz = firstLightZ; lz < zFar; lz += 24) {
      for (let laneIdx = 0; laneIdx < 3; laneIdx++) {
        const lx = LANE_X[laneIdx] * 0.85;
        const c = project3D(lx, 0.01, lz);
        if (!c) continue;
        const rx = Math.max(8, c.scale * 2.8);
        const ry = Math.max(3, c.scale * 0.95);
        const spec = ctx.createRadialGradient(c.x, c.y, 1, c.x, c.y, rx);
        spec.addColorStop(0, arena.lightColor);
        spec.addColorStop(0.5, 'rgba(255,255,255,0.22)');
        spec.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = spec;
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Subtle 3-lane Zamboni sheen guides
    [-3.9, 3.9].forEach((dividerX) => {
      const a = project3D(dividerX, 0.01, zNear + 4);
      const b = project3D(dividerX, 0.01, zFar);
      if (a && b) {
        ctx.strokeStyle = 'rgba(2, 132, 199, 0.14)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([8, 10]);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });

    // Multi-Rink Markings (repeating 60m zones: Blue Lines, Red Center Line, Faceoff Circles)
    const zoneLen = 60;
    const startZone = Math.floor(zNear / zoneLen) * zoneLen;
    for (let baseZ = startZone; baseZ < zFar; baseZ += zoneLen) {
      const lines = [
        { z: baseZ + 15, color: 'rgba(37, 99, 235, 0.55)', w: 0.55 },
        { z: baseZ + 30, color: 'rgba(220, 38, 38, 0.62)', w: 0.65 },
        { z: baseZ + 45, color: 'rgba(37, 99, 235, 0.55)', w: 0.55 }
      ];
      lines.forEach((ln) => {
        if (ln.z < zNear || ln.z > zFar) return;
        drawPoly3D(
          [
            [-halfW, 0.01, ln.z - ln.w * 0.5],
            [halfW, 0.01, ln.z - ln.w * 0.5],
            [halfW, 0.01, ln.z + ln.w * 0.5],
            [-halfW, 0.01, ln.z + ln.w * 0.5]
          ],
          ln.color
        );
      });

      // Faceoff circles
      [
        { x: 0, z: baseZ + 30, color: 'rgba(37, 99, 235, 0.42)' },
        { x: -6.8, z: baseZ + 8, color: 'rgba(220, 38, 38, 0.4)' },
        { x: 6.8, z: baseZ + 8, color: 'rgba(220, 38, 38, 0.4)' }
      ].forEach((fc) => {
        if (fc.z < zNear + 2 || fc.z > zFar) return;
        const cp = project3D(fc.x, 0.02, fc.z);
        if (!cp) return;
        ctx.strokeStyle = fc.color;
        ctx.lineWidth = Math.max(1, cp.scale * 0.14);
        ctx.beginPath();
        ctx.ellipse(cp.x, cp.y, cp.scale * 3.6, cp.scale * 1.15, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = fc.color;
        ctx.beginPath();
        ctx.ellipse(cp.x, cp.y, Math.max(1.5, cp.scale * 0.42), Math.max(1, cp.scale * 0.16), 0, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Dasher Boards + Kickplates + Plexiglass Stanchions on Left & Right
    const segStep = 12;
    const firstSeg = Math.floor(zNear / segStep) * segStep;
    for (let sz = zFar - segStep; sz >= firstSeg; sz -= segStep) {
      [-halfW, halfW].forEach((bx) => {
        // Board wall
        drawPoly3D(
          [
            [bx, 0, sz],
            [bx, 0, sz + segStep],
            [bx, 1.15, sz + segStep],
            [bx, 1.15, sz]
          ],
          arena.boardMain,
          'rgba(15, 23, 42, 0.45)',
          1
        );
        // Top cap trim
        drawPoly3D(
          [
            [bx, 1.05, sz],
            [bx, 1.05, sz + segStep],
            [bx, 1.22, sz + segStep],
            [bx, 1.22, sz]
          ],
          arena.boardTrim
        );
        // Plexiglass above dasher board
        if (arena.id !== 'pond') {
          drawPoly3D(
            [
              [bx, 1.22, sz],
              [bx, 1.22, sz + segStep],
              [bx, 2.55, sz + segStep],
              [bx, 2.55, sz]
            ],
            'rgba(186, 230, 253, 0.11)',
            'rgba(224, 242, 254, 0.28)',
            0.8
          );
        }
      });
    }
  }

  function renderBladeTrails() {
    const trailTheme = TRAIL_THEMES[profile.custom.trail] || TRAIL_THEMES.ice;
    for (let i = 0; i < state.bladeTrails.length; i++) {
      const tr = state.bladeTrails[i];
      const p1 = project3D(tr.x1, 0.02, tr.z1);
      const p2 = project3D(tr.x2, 0.02, tr.z2);
      if (!p1 || !p2) continue;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, tr.alpha));
      ctx.strokeStyle = tr.isCarrier ? trailTheme.color : 'rgba(148, 163, 184, 0.48)';
      ctx.lineWidth = Math.max(1, tr.width * (p1.scale * 0.09));
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
      ctx.restore();
    }
  }

  function renderLeadRingsAndPassPreview() {
    const carrier = getControlledSkater();
    if (!carrier) return;

    const bestTarget = pickTargetReceiver();

    state.skaters.forEach((mate) => {
      if (mate.id === carrier.id) return;
      const colorMap = {
        emerald: { main: '#10b981', glow: 'rgba(16, 185, 129, 0.34)', label: 'OPEN' },
        amber: { main: '#f59e0b', glow: 'rgba(245, 158, 11, 0.32)', label: 'TIGHT' },
        crimson: { main: '#ef4444', glow: 'rgba(239, 68, 68, 0.32)', label: 'BLOCKED' }
      };
      const palette = colorMap[mate.leadRingColor] || colorMap.emerald;
      const ringZ = mate.leadZ || (mate.z + 4.8);
      const rp = project3D(mate.x, 0.04, ringZ);
      if (!rp) return;

      // Sightline shimmer from carrier to best target
      if (bestTarget && mate.id === bestTarget.id && state.mode === 'playing') {
        const cp = project3D(carrier.x, 0.06, carrier.z + 0.8);
        if (cp) {
          ctx.save();
          ctx.strokeStyle = palette.main;
          ctx.globalAlpha = 0.48;
          ctx.lineWidth = 2;
          ctx.setLineDash([7, 6]);
          ctx.beginPath();
          ctx.moveTo(cp.x, cp.y);
          ctx.lineTo(rp.x, rp.y);
          ctx.stroke();
          ctx.restore();
        }
      }

      const rx = Math.max(10, rp.scale * 2.15);
      const ry = Math.max(4.5, rp.scale * 0.72);
      const pulse = 1 + Math.sin(state.clock * 7) * 0.08;

      ctx.save();
      ctx.fillStyle = palette.glow;
      ctx.beginPath();
      ctx.ellipse(rp.x, rp.y, rx * pulse * 1.15, ry * pulse * 1.15, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = palette.main;
      ctx.lineWidth = Math.max(2, rp.scale * 0.22);
      if (mate.leadRingColor === 'amber') ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.ellipse(rp.x, rp.y, rx * pulse, ry * pulse, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      if (mate.leadRingColor === 'crimson') {
        // Draw crisp X inside crimson blocked ring
        ctx.beginPath();
        ctx.moveTo(rp.x - rx * 0.45, rp.y - ry * 0.45);
        ctx.lineTo(rp.x + rx * 0.45, rp.y + ry * 0.45);
        ctx.moveTo(rp.x + rx * 0.45, rp.y - ry * 0.45);
        ctx.lineTo(rp.x - rx * 0.45, rp.y + ry * 0.45);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.ellipse(rp.x, rp.y, rx * 0.48, ry * 0.48, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    });
  }

  function renderGoalNet(net) {
    const pCenter = project3D(net.x, 0, net.z);
    if (!pCenter) return;

    // Blue Goal Crease semicircle on ice
    ctx.save();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = Math.max(1.5, pCenter.scale * 0.14);
    ctx.beginPath();
    ctx.ellipse(pCenter.x, pCenter.y + pCenter.scale * 0.28, pCenter.scale * 3.1, pCenter.scale * 0.95, 0, 0, Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    const halfGoalW = 2.45;
    const goalH = 1.85;
    const ripple = net.rippleTimer > 0 ? Math.sin(state.clock * 34) * 0.28 * net.rippleTimer : 0;

    // Net back mesh
    drawPoly3D(
      [
        [-halfGoalW, 0, net.z],
        [-halfGoalW * 0.88, 0, net.z + 1.3 + ripple],
        [halfGoalW * 0.88, 0, net.z + 1.3 + ripple],
        [halfGoalW, 0, net.z]
      ],
      'rgba(248, 250, 252, 0.35)'
    );
    drawPoly3D(
      [
        [-halfGoalW, 0, net.z],
        [-halfGoalW, goalH, net.z],
        [halfGoalW, goalH, net.z],
        [halfGoalW, 0, net.z]
      ],
      'rgba(241, 245, 249, 0.25)',
      '#dc2626',
      Math.max(2.2, pCenter.scale * 0.26)
    );

    // Butterfly Goalie in center leaving top corners open
    const gp = project3D(net.x, 0.65, net.z - 0.35);
    if (gp) {
      const gs = gp.scale;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(gp.x - gs * 0.95, gp.y - gs * 0.45, gs * 1.9, gs * 0.85);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(gp.x - gs * 1.35, gp.y + gs * 0.15, gs * 2.7, gs * 0.38);
    }

    // Illuminated Glowing Target Corners when One-Timer Armed!
    if (state.oneTimerArmed && !net.scored) {
      [-halfGoalW + 0.48, halfGoalW - 0.48].forEach((cx) => {
        const tp = project3D(cx, goalH - 0.35, net.z);
        if (!tp) return;
        const rad = Math.max(7, tp.scale * 0.62) * (1 + Math.sin(state.clock * 9) * 0.14);
        ctx.save();
        ctx.fillStyle = 'rgba(16, 185, 129, 0.42)';
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, rad * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, rad, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });
    }

    // Red Goal Lamp Strobe on Goal!
    if (net.goalLightTimer > 0) {
      const lp = project3D(net.x, goalH + 0.9, net.z + 1.2);
      if (lp) {
        const glow = ctx.createRadialGradient(lp.x, lp.y, 2, lp.x, lp.y, lp.scale * 2.5);
        glow.addColorStop(0, 'rgba(239, 68, 68, 0.98)');
        glow.addColorStop(1, 'rgba(239, 68, 68, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(lp.x, lp.y, lp.scale * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function renderObstacle(obs) {
    const p = project3D(obs.x, 0, obs.z);
    if (!p) return;
    const s = p.scale;

    // Ice shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.32)';
    ctx.beginPath();
    ctx.ellipse(p.x, p.y + s * 0.1, s * 1.35, s * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();

    if (obs.kind === 'crate') {
      drawPoly3D(
        [
          [obs.x - 1.1, 0, obs.z],
          [obs.x + 1.1, 0, obs.z],
          [obs.x + 1.1, 1.05, obs.z],
          [obs.x - 1.1, 1.05, obs.z]
        ],
        '#92400e',
        '#fde68a',
        1.5
      );
    } else if (obs.kind === 'cone') {
      const top = project3D(obs.x, 1.35, obs.z);
      if (top) {
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.moveTo(top.x, top.y);
        ctx.lineTo(p.x - s * 0.85, p.y);
        ctx.lineTo(p.x + s * 0.85, p.y);
        ctx.closePath();
        ctx.fill();
      }
    } else if (obs.kind === 'tripod') {
      const top = project3D(obs.x, 1.3, obs.z);
      if (top) {
        ctx.strokeStyle = '#84cc16';
        ctx.lineWidth = Math.max(2, s * 0.22);
        ctx.beginPath();
        ctx.moveTo(p.x - s * 1.0, p.y);
        ctx.lineTo(top.x, top.y);
        ctx.lineTo(p.x + s * 1.0, p.y);
        ctx.stroke();
      }
    } else {
      drawPoly3D(
        [
          [obs.x - 1.3, 0, obs.z],
          [obs.x + 1.3, 0, obs.z],
          [obs.x + 0.95, 0.85, obs.z],
          [obs.x - 0.95, 0.85, obs.z]
        ],
        obs.kind === 'ridge' ? '#38bdf8' : '#ef4444',
        '#f8fafc',
        1.5
      );
    }
  }

  function renderSkaterSprite(skater, isDefender) {
    const pFoot = project3D(skater.x, 0, skater.z);
    if (!pFoot) return;
    const s = pFoot.scale;
    if (s < 1.2) return;

    const isCarrier = !isDefender && skater.id === state.controlledSkaterId;
    const jTheme = JERSEY_THEMES[profile.custom.jersey] || JERSEY_THEMES.cyan;
    const tTheme = TAPE_THEMES[profile.custom.tape] || TAPE_THEMES.white;

    // Stumble blink if recovering
    if (isCarrier && state.stumbleTimer > 0 && Math.floor(state.clock * 18) % 2 === 0) {
      ctx.save();
      ctx.globalAlpha = 0.55;
    } else {
      ctx.save();
    }

    // Specular ice reflection under skater
    ctx.fillStyle = isDefender ? 'rgba(239, 68, 68, 0.16)' : 'rgba(56, 189, 248, 0.2)';
    ctx.beginPath();
    ctx.ellipse(pFoot.x, pFoot.y + s * 0.35, s * 0.95, s * 0.32, 0, 0, Math.PI * 2);
    ctx.fill();

    // Active carrier golden/cyan control halo on ice
    if (isCarrier) {
      ctx.strokeStyle = state.oneTimerArmed ? '#fde047' : '#38bdf8';
      ctx.lineWidth = Math.max(2, s * 0.18);
      ctx.beginPath();
      ctx.ellipse(pFoot.x, pFoot.y + s * 0.05, s * 1.45, s * 0.48, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    const stride = Math.sin(skater.stridePhase || 0);
    const lean = (skater.tilt || 0) * s * 0.45 + (isCarrier && state.stumbleTimer > 0 ? Math.sin(state.clock * 28) * s * 0.4 : 0);

    // Multi-frame left & right legs + stainless steel blades
    const leftKickX = pFoot.x - s * 0.36 - Math.max(0, stride) * s * 0.34;
    const leftKickY = pFoot.y - Math.max(0, stride) * s * 0.18;
    const rightKickX = pFoot.x + s * 0.36 + Math.max(0, -stride) * s * 0.34;
    const rightKickY = pFoot.y - Math.max(0, -stride) * s * 0.18;

    ctx.strokeStyle = isDefender ? '#1e293b' : '#0f172a';
    ctx.lineWidth = Math.max(2.2, s * 0.32);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(pFoot.x - s * 0.2 + lean * 0.4, pFoot.y - s * 0.85);
    ctx.lineTo(leftKickX, leftKickY);
    ctx.moveTo(pFoot.x + s * 0.2 + lean * 0.4, pFoot.y - s * 0.85);
    ctx.lineTo(rightKickX, rightKickY);
    ctx.stroke();

    // Skate blades
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = Math.max(1.5, s * 0.12);
    ctx.beginPath();
    ctx.moveTo(leftKickX - s * 0.16, leftKickY + 1);
    ctx.lineTo(leftKickX + s * 0.16, leftKickY + 1);
    ctx.moveTo(rightKickX - s * 0.16, rightKickY + 1);
    ctx.lineTo(rightKickX + s * 0.16, rightKickY + 1);
    ctx.stroke();

    // Crisp Hockey Jersey Torso
    const torsoX = pFoot.x + lean;
    const torsoTopY = pFoot.y - s * 1.95;
    const torsoW = s * 1.18;
    const torsoH = s * 1.08;

    ctx.fillStyle = isDefender ? '#334155' : (skater.isDecoy ? '#475569' : jTheme.main);
    ctx.strokeStyle = isDefender ? '#ef4444' : jTheme.stripe;
    ctx.lineWidth = Math.max(1.4, s * 0.12);
    ctx.beginPath();
    ctx.roundRect(torsoX - torsoW * 0.5, torsoTopY, torsoW, torsoH, Math.max(2, s * 0.22));
    ctx.fill();
    ctx.stroke();

    // Shoulder yoke & hem stripe
    ctx.fillStyle = isDefender ? '#991b1b' : jTheme.yoke;
    ctx.fillRect(torsoX - torsoW * 0.48, torsoTopY, torsoW * 0.96, torsoH * 0.24);

    // Jersey Number
    if (s > 4.2) {
      ctx.fillStyle = isDefender ? '#fca5a5' : jTheme.num;
      ctx.font = `900 ${Math.max(8, Math.round(s * 0.52))}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(isDefender ? 'D' : skater.number, torsoX, torsoTopY + torsoH * 0.62);
    }

    // Helmet & Tinted Visor
    const headY = torsoTopY - s * 0.34;
    ctx.fillStyle = isDefender ? '#dc2626' : '#0f172a';
    ctx.beginPath();
    ctx.arc(torsoX, headY, s * 0.36, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(186, 230, 253, 0.78)';
    ctx.fillRect(torsoX - s * 0.24, headY - s * 0.06, s * 0.48, s * 0.14);

    // Hockey Stick & Taped Blade
    ctx.strokeStyle = isCarrier && state.oneTimerArmed ? '#fde047' : '#cbd5e1';
    ctx.lineWidth = Math.max(1.8, s * 0.14);
    ctx.beginPath();
    if (isDefender) {
      // Extended poke-check stick across the lane!
      const tipX = pFoot.x + skater.stickDir * s * skater.stickReach * 0.72;
      ctx.moveTo(torsoX + skater.stickDir * s * 0.4, torsoTopY + torsoH * 0.5);
      ctx.lineTo(tipX, pFoot.y + s * 0.08);
      ctx.stroke();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = Math.max(2.4, s * 0.2);
      ctx.beginPath();
      ctx.moveTo(tipX, pFoot.y + s * 0.08);
      ctx.lineTo(tipX + skater.stickDir * s * 0.36, pFoot.y + s * 0.05);
      ctx.stroke();
    } else {
      const stickBladeX = pFoot.x + s * 0.85;
      const windupY = (isCarrier && state.oneTimerArmed) ? -s * 0.55 : 0;
      ctx.moveTo(torsoX + s * 0.42, torsoTopY + torsoH * 0.45);
      ctx.lineTo(stickBladeX, pFoot.y + s * 0.05 + windupY);
      ctx.stroke();

      ctx.strokeStyle = tTheme.color;
      ctx.lineWidth = Math.max(2.2, s * 0.18);
      ctx.beginPath();
      ctx.moveTo(stickBladeX, pFoot.y + s * 0.05 + windupY);
      ctx.lineTo(stickBladeX + s * 0.35, pFoot.y + s * 0.02 + windupY);
      ctx.stroke();

      // Puck on carrier's blade when not in flight
      if (isCarrier && !state.whipPan.active && !state.shotInFlight) {
        ctx.fillStyle = '#090d16';
        ctx.strokeStyle = state.oneTimerArmed ? '#fde047' : '#38bdf8';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.ellipse(stickBladeX + s * 0.18, pFoot.y + s * 0.08, Math.max(3, s * 0.24), Math.max(1.8, s * 0.12), 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }

    // Covered Decoy Shadow Defender in Level 5+
    if (!isDefender && skater.isDecoy) {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
      ctx.font = `800 ${Math.max(8, Math.round(s * 0.38))}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('COVERED', torsoX, headY - s * 0.56);
    }

    ctx.restore();
  }

  function renderPuckInFlight() {
    if (state.whipPan.active) {
      const wp = state.whipPan;
      const receiver = state.skaters.find((s) => s.id === wp.toSkaterId);
      if (!receiver) return;
      const targetZ = receiver.leadZ || (receiver.z + 4.5);
      const t = wp.intercepted ? Math.min(0.55, wp.progress) : wp.progress;
      const px = wp.fromX + (receiver.x - wp.fromX) * t;
      const pz = wp.fromZ + (targetZ - wp.fromZ) * t;

      const p0 = project3D(wp.fromX, 0.08, wp.fromZ);
      const p1 = project3D(px, 0.1, pz);
      if (p0 && p1) {
        const grad = ctx.createLinearGradient(p0.x, p0.y, p1.x, p1.y);
        grad.addColorStop(0, 'rgba(56, 189, 248, 0)');
        grad.addColorStop(1, wp.intercepted ? '#ef4444' : '#34d399');
        ctx.strokeStyle = grad;
        ctx.lineWidth = Math.max(3, p1.scale * 0.32);
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();

        ctx.fillStyle = '#090d16';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.ellipse(p1.x, p1.y, Math.max(4, p1.scale * 0.32), Math.max(2.5, p1.scale * 0.18), 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }

    if (state.shotInFlight) {
      const sh = state.shotInFlight;
      const t = sh.progress;
      const px = sh.fromX + (sh.toX - sh.fromX) * t;
      const py = 0.1 + sh.toY * t;
      const pz = sh.fromZ + (sh.toZ - sh.fromZ) * t;
      const p0 = project3D(sh.fromX, 0.15, sh.fromZ);
      const p1 = project3D(px, py, pz);
      if (p0 && p1) {
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = Math.max(4, p1.scale * 0.38);
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, Math.max(4.5, p1.scale * 0.34), 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function renderSnowParticlesAndFlurries(arena) {
    for (let i = 0; i < state.snowParticles.length; i++) {
      const sp = state.snowParticles[i];
      const p = project3D(sp.x, sp.y, sp.z);
      if (!p) continue;
      ctx.save();
      ctx.globalAlpha = Math.max(0, sp.life / sp.maxLife);
      ctx.fillStyle = sp.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1.2, sp.size * (p.scale * 0.08)), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (arena.id === 'classic' || arena.id === 'pond') {
      ctx.fillStyle = 'rgba(241, 245, 249, 0.65)';
      for (let i = 0; i < state.ambientFlakes.length; i++) {
        const fl = state.ambientFlakes[i];
        ctx.beginPath();
        ctx.arc(fl.u * viewW, fl.v * viewH, fl.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  /* ==========================================================================
     MAIN SIMULATION & RENDER LOOP (60FPS)
     ========================================================================== */
  let lastTs = performance.now();

  function stepSimulation(dt) {
    state.clock += dt;

    // Ambient snow drift
    for (let i = 0; i < state.ambientFlakes.length; i++) {
      const fl = state.ambientFlakes[i];
      fl.v += fl.fall * dt;
      fl.u += fl.drift * dt;
      if (fl.v > 1) fl.v -= 1;
      if (fl.u < 0) fl.u += 1;
      if (fl.u > 1) fl.u -= 1;
    }

    // Attract-mode gentle glide when on Gate or Hub
    if (state.mode !== 'playing') {
      const carrier = getControlledSkater();
      if (carrier) {
        carrier.z += 15 * dt;
        carrier.stridePhase += dt * 7.5;
        state.focusZ = carrier.z;
        state.camX += (carrier.x * 0.3 - state.camX) * Math.min(1, dt * 4);
        updateTeammateWeavingAndRings(dt);
        if (Math.random() < 0.35) recordBladeCarve(carrier, false);
        populateWaveAhead(carrier.z);
      }
      return;
    }

    if (state.stumbleTimer > 0) state.stumbleTimer = Math.max(0, state.stumbleTimer - dt);
    if (state.graceTimer > 0) state.graceTimer = Math.max(0, state.graceTimer - dt);
    if (state.shakeTimer > 0) state.shakeTimer = Math.max(0, state.shakeTimer - dt);

    const carrier = getControlledSkater();
    if (!carrier) return;

    const speedFactor = state.stumbleTimer > 0 ? 0.42 : (state.countdown.active ? 0.68 : 1.0);
    state.currentSpeed = state.baseIceSpeed * speedFactor;

    // Advance active carrier forward down the endless multi-rink sheet
    carrier.z += state.currentSpeed * dt;
    carrier.x += (carrier.targetX - carrier.x) * Math.min(1, dt * (11 + profile.upgrades.speed * 1.4));
    carrier.tilt *= Math.pow(0.08, dt);
    carrier.stridePhase += dt * (10.5 + state.level * 0.6);

    if (Math.random() < 0.55) {
      recordBladeCarve(carrier, false);
    }

    // Fade older blade carve trails smoothly
    for (let i = state.bladeTrails.length - 1; i >= 0; i--) {
      state.bladeTrails[i].alpha -= dt * 0.16;
      if (state.bladeTrails[i].alpha <= 0.02) {
        state.bladeTrails.splice(i, 1);
      }
    }

    // Update 3D snow-spray particles
    for (let i = state.snowParticles.length - 1; i >= 0; i--) {
      const sp = state.snowParticles[i];
      sp.x += sp.vx * dt;
      sp.y += sp.vy * dt;
      sp.z += sp.vz * dt;
      sp.vy -= 14.5 * dt;
      if (sp.y < 0.03) sp.y = 0.03;
      sp.life -= dt;
      if (sp.life <= 0) state.snowParticles.splice(i, 1);
    }

    // Update weaving teammates & real-time On-Ice Lead Rings
    updateTeammateWeavingAndRings(dt);

    // Camera Whip-Pan Transfer along puck trajectory!
    if (state.whipPan.active) {
      const wp = state.whipPan;
      wp.progress += dt / wp.duration;
      const receiver = state.skaters.find((s) => s.id === wp.toSkaterId);
      if (receiver) {
        const ease = 1 - Math.pow(1 - Math.min(1, wp.progress), 3);
        const liveX = wp.fromX + (receiver.x - wp.fromX) * ease;
        const liveZ = wp.fromZ + (receiver.z - wp.fromZ) * ease;
        state.camX = liveX * 0.42;
        state.focusZ = liveZ;
        state.camRoll = ((receiver.x - wp.fromX) * 0.0048) * Math.sin(Math.min(1, wp.progress) * Math.PI);
      }
      if ((wp.intercepted && wp.progress >= 0.55) || wp.progress >= 1) {
        state.camRoll = 0;
        completeWhipPanTransfer();
      }
    } else {
      // Smooth broadcast camera follow
      const targetCamX = carrier.x * 0.36 + (state.shakeTimer > 0 ? Math.sin(state.clock * 55) * 0.45 : 0);
      state.camX += (targetCamX - state.camX) * Math.min(1, dt * 8.5);
      state.focusZ = carrier.z;
      state.camRoll *= Math.pow(0.05, dt);
    }

    // Update One-Timer Shot in Flight
    if (state.shotInFlight) {
      const sh = state.shotInFlight;
      sh.progress += dt / sh.duration;
      if (sh.progress >= 1) {
        const scoredNet = sh.net;
        state.shotInFlight = null;
        onGoalScored(scoredNet);
      }
    }

    // Update net ripple & goal lights; respawn oncoming net if armed and passed
    state.nets.forEach((n) => {
      if (n.rippleTimer > 0) n.rippleTimer = Math.max(0, n.rippleTimer - dt);
      if (n.goalLightTimer > 0) n.goalLightTimer = Math.max(0, n.goalLightTimer - dt);
    });
    if (state.oneTimerArmed && !state.shotInFlight && !state.countdown.active) {
      ensureGoalNetAhead();
    }

    // Collision Checks (Obstacles & Defenders vs Carrier)
    if (!state.countdown.active && !state.whipPan.active && !state.shotInFlight && state.graceTimer <= 0) {
      for (let i = 0; i < state.obstacles.length; i++) {
        const o = state.obstacles[i];
        if (Math.abs(o.z - carrier.z) < 1.35 && Math.abs(o.x - carrier.x) < 1.65) {
          state.obstacles.splice(i, 1);
          triggerTurnover('Clipped arena obstacle!');
          break;
        }
      }
    }
    if (!state.countdown.active && !state.whipPan.active && !state.shotInFlight && state.graceTimer <= 0) {
      for (let i = 0; i < state.defenders.length; i++) {
        const d = state.defenders[i];
        d.stridePhase += dt * 8;
        if (Math.abs(d.z - carrier.z) < 1.35 && Math.abs(d.x - carrier.x) < 1.75) {
          state.defenders.splice(i, 1);
          triggerTurnover('Poke-checked by oncoming defender!');
          break;
        }
      }
    }

    populateWaveAhead(carrier.z);
  }

  function renderScene() {
    ctx.save();
    ctx.scale(dpr, dpr);

    const arena = getArenaForLevel(state.level);
    renderIceSheetAndRink(arena);
    renderBladeTrails();
    renderLeadRingsAndPassPreview();

    // Depth-sorted 3D drawables (back-to-front painter's sort by z)
    const drawList = [];
    state.nets.forEach((n) => drawList.push({ z: n.z, draw: () => renderGoalNet(n) }));
    state.obstacles.forEach((o) => drawList.push({ z: o.z, draw: () => renderObstacle(o) }));
    state.defenders.forEach((d) => drawList.push({ z: d.z, draw: () => renderSkaterSprite(d, true) }));
    state.skaters.forEach((s) => drawList.push({ z: s.z, draw: () => renderSkaterSprite(s, false) }));

    drawList.sort((a, b) => b.z - a.z);
    for (let i = 0; i < drawList.length; i++) {
      drawList[i].draw();
    }

    renderPuckInFlight();
    renderSnowParticlesAndFlurries(arena);

    ctx.restore();
  }

  function frame(now) {
    const dt = Math.min(0.05, Math.max(0.001, (now - lastTs) / 1000));
    lastTs = now;
    stepSimulation(dt);
    renderScene();
    requestAnimationFrame(frame);
  }

  /* ==========================================================================
     CONTROLS: 4 THUMB BUTTONS + KEYBOARD + SWIPE / DIRECT TEAMMATE TAP
     ========================================================================== */
  function bindArcadeControl(btnId, actionFn) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    let lastTouchFire = 0;

    btn.addEventListener('pointerdown', (e) => {
      if (btn.disabled) return;
      if (e.pointerType === 'touch' || e.pointerType === 'pen') {
        e.preventDefault();
        lastTouchFire = performance.now();
        actionFn();
      }
    });

    btn.addEventListener('click', (e) => {
      if (btn.disabled) return;
      if (performance.now() - lastTouchFire < 420) {
        e.preventDefault();
        return;
      }
      actionFn();
    });

    btn.addEventListener('dblclick', (e) => e.preventDefault());
    btn.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  bindArcadeControl('btn-left', () => moveLane(-1));
  bindArcadeControl('btn-right', () => moveLane(1));
  bindArcadeControl('btn-pass', () => triggerPass());
  bindArcadeControl('btn-shoot', () => triggerShoot());

  const controlsNav = document.getElementById('thumb-controls');
  if (controlsNav) {
    controlsNav.addEventListener('dblclick', (e) => e.preventDefault());
    controlsNav.addEventListener('contextmenu', (e) => e.preventDefault());
  }
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('gesturestart', (e) => e.preventDefault());

  window.addEventListener('keydown', (e) => {
    if (state.mode !== 'playing') return;
    if (e.target && (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT')) return;

    const k = e.key.toLowerCase();
    if (k === 'arrowleft' || k === 'a') {
      e.preventDefault();
      moveLane(-1);
    } else if (k === 'arrowright' || k === 'd') {
      e.preventDefault();
      moveLane(1);
    } else if (k === 'arrowup' || k === 'w' || k === 'p') {
      e.preventDefault();
      triggerPass();
    } else if (k === ' ' || k === 's') {
      e.preventDefault();
      triggerShoot();
    }
  });

  // Swipe & Canvas Teammate Tap Support
  let touchStart = null;
  canvas.addEventListener('pointerdown', (e) => {
    if (state.mode !== 'playing') return;
    touchStart = { x: e.clientX, y: e.clientY };
  });

  canvas.addEventListener('pointerup', (e) => {
    if (state.mode !== 'playing' || !touchStart) return;
    const dx = e.clientX - touchStart.x;
    const dy = e.clientY - touchStart.y;
    touchStart = null;

    if (Math.abs(dx) > 34 && Math.abs(dx) > Math.abs(dy)) {
      moveLane(dx < 0 ? -1 : 1);
      return;
    }
    if (dy < -42 && Math.abs(dy) > Math.abs(dx)) {
      if (state.oneTimerArmed) triggerShoot();
      else triggerPass();
      return;
    }

    // Tap directly near a teammate or their Lead Ring to pass to them!
    const carrier = getControlledSkater();
    let tappedMate = null;
    let bestDist = 54;
    state.skaters.forEach((s) => {
      if (!carrier || s.id === carrier.id) return;
      const pBody = project3D(s.x, 0.9, s.z);
      const pRing = project3D(s.x, 0.05, s.leadZ || (s.z + 4.8));
      [pBody, pRing].forEach((pt) => {
        if (!pt) return;
        const dist = Math.hypot(e.clientX - pt.x, e.clientY - pt.y);
        if (dist < bestDist) {
          bestDist = dist;
          tappedMate = s;
        }
      });
    });
    if (tappedMate) {
      triggerPass(tappedMate.id);
    }
  });

  /* ==========================================================================
     ENTRY GATE, HUB & MODAL UI WIRING
     ========================================================================== */
  document.getElementById('btn-drop-puck').addEventListener('click', () => startShift(profile.selectedLevel));
  document.getElementById('btn-locker-hub').addEventListener('click', () => openLockerHub('tunnel'));
  document.getElementById('btn-hub-play').addEventListener('click', () => startShift(profile.selectedLevel));
  document.getElementById('btn-hub-back-gate').addEventListener('click', () => openEntryGate());

  document.getElementById('hud-open-hub').addEventListener('click', (e) => {
    e.preventDefault();
    openLockerHub('stall');
  });

  ['hud-open-redflag', 'gate-redflag-link', 'hub-redflag-link'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openRedFlagModal();
      });
    }
  });

  document.getElementById('btn-save-redflag').addEventListener('click', saveRedFlagNote);
  document.getElementById('btn-close-redflag').addEventListener('click', () => {
    document.getElementById('redflag-modal').classList.add('hidden');
  });

  document.getElementById('btn-retry-shift').addEventListener('click', () => startShift(state.level));
  document.getElementById('btn-shift-to-hub').addEventListener('click', () => openLockerHub('stall'));

  document.querySelectorAll('.room-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      renderHubRoom(tab.getAttribute('data-room'));
    });
  });

  document.getElementById('hub-room-stage').addEventListener('click', (e) => {
    const hotspot = e.target.closest('[data-hotspot="drop-puck"]');
    if (hotspot) {
      startShift(profile.selectedLevel);
      return;
    }

    const launchBtn = e.target.closest('[data-action="launch-shift"]');
    if (launchBtn) {
      startShift(profile.selectedLevel);
      return;
    }

    const guideBtn = e.target.closest('[data-select-guide]');
    if (guideBtn) {
      profile.guideId = guideBtn.getAttribute('data-select-guide');
      saveProfile();
      renderHubRoom('tunnel');
      return;
    }

    const upgBtn = e.target.closest('[data-upgrade]');
    if (upgBtn) {
      const key = upgBtn.getAttribute('data-upgrade');
      const cur = profile.upgrades[key] || 1;
      const cost = cur * 25;
      if (cur < 5 && profile.storyPoints >= cost) {
        profile.storyPoints -= cost;
        profile.upgrades[key] = cur + 1;
        saveProfile();
        renderHubRoom('stall');
      }
      return;
    }

    const arenaBtn = e.target.closest('[data-pick-arena]');
    if (arenaBtn) {
      const lvl = Number(arenaBtn.getAttribute('data-pick-arena')) || 1;
      profile.selectedLevel = lvl;
      saveProfile();
      startShift(lvl);
      return;
    }

    const jerseyBtn = e.target.closest('[data-jersey]');
    if (jerseyBtn) {
      profile.custom.jersey = jerseyBtn.getAttribute('data-jersey');
      saveProfile();
      renderHubRoom('proshop');
      return;
    }

    const trailBtn = e.target.closest('[data-trail]');
    if (trailBtn) {
      profile.custom.trail = trailBtn.getAttribute('data-trail');
      saveProfile();
      renderHubRoom('proshop');
    }
  });

  /* ==========================================================================
     BOOT & AUDIT TELEMETRY BRIDGE
     ========================================================================== */
  initAmbientSnow();
  buildSkaterSquad(0);
  populateWaveAhead(0);
  syncHudValues();
  requestAnimationFrame(frame);

  window.__SYNAPZ_RUSH__ = {
    version: '10.9.4',
    cameraElevationDeg: CAMERA_ELEVATION_DEG,
    storageKeys: STORAGE_KEYS,
    arenas: ARENAS,
    getState: () => state,
    getProfile: () => profile,
    getSpeechState: () => speechState,
    toNaturalTalk,
    speakGuide,
    startShift,
    openLockerHub,
    openEntryGate,
    moveLane,
    triggerPass,
    triggerShoot,
    triggerTurnover
  };
})();

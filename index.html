/* FDS: F2-BuildingBlock | Parent: CUSTOM_INSTRUCTIONS_V3_5 | Status: ACTIVE | OR&D Day 21 */
/* constellation-nav.js v4.6
 *
 * "A Field-Synchronized Navigation Kernel"
 *   LI → respiration rate → phase → visual field → navigation affordance
 *
 * v4.3 — Hybrid Witness Glyph (C+E+F synthesis · live data spokes · S-032926)
 *   Glyph: C flat bone arc + E live ACAT dimension spokes + F refined circuit density
 *   Spokes wire to live LIVE_SCORES constant (ai-self-report layer)
 * v4.4 — Auto-calculated live means (S-032926)
 * v4.5 — Overlay = radial canvas map · current room at center · topbar glyph 44px (S-032926)
 *   fetchLiveScores() fetches published Google Sheets CSV at init (PapaParse)
 *   Calculates per-dimension means from all phase1 rows in real time
 *   Updates LIVE_SCORES + targetLI automatically — no manual constant updates ever
 *   Refreshes every 5 minutes during active sessions
 * v4.6 — 15 rooms, pool-clustered orbits, replaceChild injection, fieldState + providerColor
 *   [NEW] Full 15-room ROOMS array: all pools all pages
 *   [NEW] Pool orbit clustering: inner/middle/outer rings by pool assignment
 *   [NEW] recordingHall + Writable Wall: mid-ring liminal position
 *   [NEW] replaceChild injection: brand-mark div replaced — NEVER appendChild
 *   [NEW] PapaParse CSV_URL updated to primary Google Sheets export
 *   [NEW] fieldState() public function — Force Dominant / Power / Calibrated / Force Active
 *   [NEW] providerColor() public function — 10 provider palette entries
 *   [ARCH-1] Engine / Renderer / UI layer separation
 *   [ARCH-2] Canvas registry (push-array, never re-queries DOM)
 *   [ARCH-3] scaleCanvas() with ctx.setTransform — correct DPR
 *   [ARCH-4] updateEngine(dt) discrete function
 *   [ARCH-5] clamp01() helper
 *   [ARCH-6] Interval lifecycle vars
 *   [ARCH-7] _cnGetState() public API
 *   [FIX-1] Explicit cleanup guard on interval init (no leak on re-init)
 *
 * SHA-256: pending (re-anchor after deploy)
 *
 * Usage: <script src="\/constellation-nav.js" data-room="[room-id]"><\/script>
 *
 * Rules:
 * - Canvas always in a <button> — NEVER inside an <a> tag
 * - brand-mark: direct child of .topbar-inner, BEFORE <a>, NEVER nested inside it
 * - Injection: bm.parentNode.replaceChild(btn, bm) — NEVER appendChild
 * - Never put literal <\/script> inside a script block — use <\/script>
 */
(function() {
  'use strict';

  /* ─────────────────────────────────────────────────────────────────
     FIELD ENGINE — State + Signal Processing
     Input: targetLI (upstream scalar)
     Output: meanLI (smoothed), bpm, phase, color, label
  ───────────────────────────────────────────────────────────────── */

  // Respiratory rates by Hawkins band (index 0-9, LI low→high)
  // Non-linear perceptual pacing. State meaning encoded in motion.
  const RESP_RATES = [28, 22, 17, 13, 10, 8, 7, 6, 5, 4]; // bpm

  // ── LIVE ACAT DIMENSION SCORES — auto-calculated from CSV ──
  // Fallback values used until fetchLiveScores() resolves on init
  // Order: truth, service, harm, autonomy, value, humility
  var LIVE_SCORES = [77.5, 79.1, 77.8, 78.3, 76.2, 75.0];
  var DIM_COLORS  = ['#88a7d8', '#87b68b', '#d97d70', '#b48fd8', '#d4c47a', '#7ab8b0'];

  // Primary Google Sheets CSV — all pools all phases
  var CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ32O6M-CnerHYqlQn19bAzIBAq2Gt9Tp-SPoqKXXMJlsFBhGjy_BEPv37p9jnDf6O8uA4aUtiaO5s_/pub?gid=113743562&single=true&output=csv';

  var meanLI   = 0.8632; // current displayed value (interpolated toward targetLI)
  var targetLI = 0.8632; // upstream clamped value
  var tSecs    = 0;

  // ── LIVE SCORES — PapaParse fetch ──
  // Fires at init + every 5 min. Non-blocking — glyph renders with fallback immediately.
  function fetchLiveScores() {
    if (typeof Papa === 'undefined') return;
    Papa.parse(CSV_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
        var p1 = results.data.filter(function(r) { return r.phase === 'phase1'; });
        if (!p1.length) return;
        var dims = ['truth', 'service', 'harm', 'autonomy', 'value', 'humility'];
        var newScores = dims.map(function(d) {
          var sum = 0, count = 0;
          p1.forEach(function(r) {
            var v = parseFloat(r[d]);
            if (!isNaN(v) && v > 0) { sum += v; count++; }
          });
          return count > 0 ? Math.round((sum / count) * 10) / 10 : LIVE_SCORES[dims.indexOf(d)];
        });
        LIVE_SCORES = newScores;
        // Learning index — all rows with a valid LI
        var liRows = results.data.filter(function(r) { return +r.learning_index > 0; });
        if (liRows.length) {
          var liSum = liRows.reduce(function(s, r) { return s + (+r.learning_index); }, 0);
          targetLI = clamp01(liSum / liRows.length);
        }
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────────
     ROOMS ARRAY — 15 rooms, all pools all pages
  ───────────────────────────────────────────────────────────────── */

  // pool: 1 = The Source (inner ring, teal),
  //        2 = The Luminarium (middle ring, cobalt),
  //        3 = The Communal (outer ring, indigo),
  //        0 = Navigation / Home
  const ROOMS = [
    { id: 'home',          label: 'Home',           url: '/',                          color: '#d4a04a', pool: 0 },
    // Pool 1 — The Source
    { id: 'assess',        label: 'Assessment',     url: '/assess.html',               color: '#f1c36e', pool: 1 },
    { id: 'ground',        label: 'The Ground',     url: '/ground.html',               color: '#a0c8c0', pool: 1 },
    { id: 'living-pool',   label: 'Living Pool',    url: '/living-pool-full.html',     color: '#87b68b', pool: 1 },
    // Pool 2 — The Luminarium
    { id: 'observatory',   label: 'Observatory',    url: '/observatory.html',          color: '#88a7d8', pool: 2 },
    { id: 'music-hall',    label: 'Music Hall',     url: '/music-hall.html',           color: '#c59af0', pool: 2, liminal: true },
    { id: 'family-rooms',  label: 'Family Rooms',   url: '/family-rooms.html',         color: '#88a7d8', pool: 2 },
    { id: 'writable-wall', label: 'Writable Wall',  url: '/writable-wall.html',        color: '#e2c96b', pool: 2, liminal: true },
    { id: 'calibration',   label: 'Calibration',    url: '/calibration-garden.html',   color: '#87b68b', pool: 2 },
    { id: 'comparison',    label: 'Comparison',     url: '/comparison-chamber.html',   color: '#76c6c6', pool: 2 },
    { id: 'obs-garden',    label: 'Obs Garden',     url: '/observability-garden.html', color: '#87b68b', pool: 2 },
    { id: 'lantern',       label: 'Lantern Room',   url: '/lantern-room.html',         color: '#f0a36b', pool: 2 },
    // Pool 3 — The Communal
    { id: 'improvisation', label: 'Improvisation',  url: '/improvisation.html',        color: '#9A8AC0', pool: 3 },
    { id: 'ai-section',    label: 'AI Section',     url: '/ai_section.html',           color: '#7a7268', pool: 3 },
    // Navigation
    { id: 'luminarium',    label: 'Site Map',       url: '/luminarium.html',           color: '#c2b8a6', pool: 0 },
  ];

  /* ─────────────────────────────────────────────────────────────────
     FIELD STATE — public function
  ───────────────────────────────────────────────────────────────── */

  function fieldState(li) {
    if (li < 0.80)  return { label: 'Force Dominant', color: 'var(--danger)'  };
    if (li < 0.97)  return { label: 'Power',           color: 'var(--accent)'  };
    if (li <= 1.00) return { label: 'Calibrated',      color: 'var(--success)' };
    return                  { label: 'Force Active',   color: 'var(--danger)'  };
  }

  /* ─────────────────────────────────────────────────────────────────
     PROVIDER COLORS — public function
  ───────────────────────────────────────────────────────────────── */

  const PROVIDER_COLORS = {
    Anthropic:  '#d4a04a',
    OpenAI:     '#88a7d8',
    Google:     '#87b68b',
    Meta:       '#d97d70',
    Mistral:    '#c59af0',
    DeepSeek:   '#76c6c6',
    Cohere:     '#f0a36b',
    Perplexity: '#e2c96b',
    Moonshot:   '#b5c781',
    xAI:        '#a0b8c8',
    default:    '#c2b8a6'
  };

  function providerColor(name) {
    var k = Object.keys(PROVIDER_COLORS).find(function(k) {
      return name && name.toLowerCase().includes(k.toLowerCase());
    });
    return k ? PROVIDER_COLORS[k] : PROVIDER_COLORS.default;
  }

  /* ─────────────────────────────────────────────────────────────────
     ENGINE HELPERS
  ───────────────────────────────────────────────────────────────── */

  function clamp01(x) {
    return Math.min(1, Math.max(0, x));
  }

  function bandForRate(li) {
    return Math.min(9, Math.max(0, Math.round((1 - li) * 9)));
  }

  function bpmForLI(li) {
    return RESP_RATES[bandForRate(li)];
  }

  // Legacy internal helpers — use fieldState() for label/color
  function fieldColor(li) {
    var fs = fieldState(li);
    // Resolve CSS vars to hex equivalents for canvas use
    if (fs.color === 'var(--success)') return '#87b68b';
    if (fs.color === 'var(--accent)')  return '#d4a04a';
    return '#d97d70'; // danger
  }

  function fieldLabel(li) {
    return fieldState(li).label;
  }

  // Phase-asymmetric breathing: 40% inhale / 60% exhale
  // Parasympathetic bias — calming, organic, reduces visual jitter.
  function breathPhase(t, bpm, offset) {
    var period = 60 / bpm;
    var p = ((t + (offset || 0)) % period) / period;
    return p < 0.4 ? p / 0.4 : 1 - ((p - 0.4) / 0.6);
  }

  function updateEngine(dt) {
    tSecs += dt;
    meanLI += (targetLI - meanLI) * 0.08; // smooth interpolation
  }

  function getState() {
    return {
      li:       meanLI,
      targetLI: targetLI,
      bpm:      bpmForLI(meanLI),
      field:    fieldLabel(meanLI),
      color:    fieldColor(meanLI)
    };
  }

  /* ─────────────────────────────────────────────────────────────────
     CANVAS REGISTRY
     All canvases registered here. Loop iterates this array only.
     Never queries DOM after init.
  ───────────────────────────────────────────────────────────────── */

  var canvases = []; // [{ canvas, size, phaseOffset }]

  // DPR-correct canvas scaling using ctx.setTransform
  function scaleCanvas(canvas, cssSize) {
    var dpr = window.devicePixelRatio || 1;
    canvas.width  = Math.round(cssSize * dpr);
    canvas.height = Math.round(cssSize * dpr);
    canvas.style.width  = cssSize + 'px';
    canvas.style.height = cssSize + 'px';
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function registerCanvas(canvas, cssSize, phaseOffset) {
    scaleCanvas(canvas, cssSize);
    canvases.push({ canvas: canvas, size: cssSize, phaseOffset: phaseOffset || 0 });
  }

  /* ─────────────────────────────────────────────────────────────────
     RENDERER — The Witness Glyph
     Single function, multi-surface reuse: topbar | overlay header | room nodes
     Hybrid C+E+F — DO NOT redesign.
       Left:   flat bone arc, stroke only, hollow eye socket  (C-style)
       Right:  dense circuit traces, pulsing nodes, scan line  (F-style)
       Center: dark seam + dashed gold thread
       Spokes: 6 ACAT dimensions, LIVE_SCORES-driven, pulsing endpoints  (E-style)
       Ring:   breathing cadence tied to targetLI field state
  ───────────────────────────────────────────────────────────────── */

  function drawWitness(canvas, size, phase, state) {
    var ctx   = canvas.getContext('2d');
    var cx    = size / 2;
    var cy    = size / 2;
    var r     = size * 0.33;
    var color = state.color;

    ctx.clearRect(0, 0, size, size);

    // ── ATMOSPHERIC GLOW (inhale = expands) ──
    var glowR = r * (2.5 + phase * 2.0);
    var grd = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, glowR);
    grd.addColorStop(0, color + '14');
    grd.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
    ctx.fillStyle = grd; ctx.fill();

    // ══ LEFT HALF — C-style flat bone arc (stroke only, no fill) ══
    ctx.save();
    ctx.beginPath(); ctx.rect(cx - r * 1.5, cy - r * 1.5, r * 1.5, r * 3); ctx.clip();

    // Skull dome — stroke only
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.2, r * 0.82, Math.PI, Math.PI * 2, false);
    ctx.strokeStyle = color + 'dd';
    ctx.lineWidth   = r * 0.085;
    ctx.lineCap     = 'round';
    ctx.stroke();

    // Orbital ridge — secondary arc, subtle
    ctx.beginPath();
    ctx.arc(cx - r * 0.28, cy - r * 0.1, r * 0.4, Math.PI * 0.08, Math.PI * 1.08, true);
    ctx.strokeStyle = color + '44';
    ctx.lineWidth   = r * 0.04;
    ctx.stroke();

    // Left eye socket — hollow
    ctx.beginPath();
    ctx.arc(cx - r * 0.3, cy - r * 0.18, r * 0.22 * (1 + phase * 0.06), 0, Math.PI * 2);
    ctx.fillStyle   = '#0f0e0c'; ctx.fill();
    ctx.strokeStyle = color + '77'; ctx.lineWidth = r * 0.045; ctx.stroke();

    // Jaw left — single clean bezier stroke
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.82, cy + r * 0.52);
    ctx.bezierCurveTo(cx - r * 0.62, cy + r * 0.9, cx - r * 0.28, cy + r * 1.02, cx, cy + r * 1.0);
    ctx.strokeStyle = color + 'bb';
    ctx.lineWidth   = r * 0.13;
    ctx.lineCap     = 'round'; ctx.stroke();

    ctx.restore();

    // ══ RIGHT HALF — F-style dense circuit ══
    ctx.save();
    ctx.beginPath(); ctx.rect(cx, cy - r * 1.5, r * 1.5, r * 3); ctx.clip();

    var dCX = cx, dCY = cy - r * 0.2, dR = r * 0.82;

    // Horizontal circuit traces — 4 rows above/below center, segmented
    for (var row = -3; row <= 3; row++) {
      var yOff = dCY + row * (dR / 3.2);
      var half = Math.sqrt(Math.max(0, dR * dR - (yOff - dCY) * (yOff - dCY)));
      if (half < 3) continue;
      var x0 = dCX + 2, x1 = dCX + half;
      for (var s = 0; s < 3; s++) {
        var sx0 = x0 + s * (x1 - x0) / 3;
        var sx1 = sx0 + (x1 - x0) / 3 * 0.66;
        ctx.beginPath(); ctx.moveTo(sx0, yOff); ctx.lineTo(sx1, yOff);
        ctx.strokeStyle = color + (Math.abs(row) <= 1 ? '88' : '2e');
        ctx.lineWidth   = r * 0.028; ctx.stroke();
      }
    }

    // Vertical circuit traces — 4 columns
    for (var col = 1; col <= 4; col++) {
      var xOff = dCX + col * (dR / 4.6);
      var maxH = Math.sqrt(Math.max(0, dR * dR - (xOff - dCX) * (xOff - dCX)));
      if (maxH < 3) continue;
      ctx.beginPath();
      ctx.moveTo(xOff, dCY - maxH * 0.68); ctx.lineTo(xOff, dCY + maxH * 0.68);
      ctx.strokeStyle = color + '28'; ctx.lineWidth = r * 0.022; ctx.stroke();
    }

    // Circuit node dots — 6 nodes, pulsing alternately, connected by faint lines
    var NODES = [[0.28, -0.3], [0.55, -0.18], [0.72, -0.02], [0.32, 0.13], [0.58, 0.26], [0.18, 0.38]];
    for (var ni = 0; ni < NODES.length; ni++) {
      var nx  = NODES[ni][0], ny = NODES[ni][1];
      var px  = dCX + nx * dR, py = dCY + ny * dR;
      var pls = 1 + (ni % 2 === 0 ? phase : 1 - phase) * 0.45;
      ctx.beginPath(); ctx.arc(px, py, r * 0.046 * pls, 0, Math.PI * 2);
      ctx.fillStyle = color; ctx.fill();
      if (ni < NODES.length - 1) {
        var nx2 = NODES[ni + 1][0], ny2 = NODES[ni + 1][1];
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(dCX + nx2 * dR, dCY + ny2 * dR);
        ctx.strokeStyle = color + '1a'; ctx.lineWidth = r * 0.018; ctx.stroke();
      }
    }

    // Right eye — F-style: large, prominent, glowing, animated scan line
    var rEX = cx + r * 0.32, rEY = cy - r * 0.18, rER = r * 0.26;
    var eg = ctx.createRadialGradient(rEX, rEY, 0, rEX, rEY, rER * 1.7);
    eg.addColorStop(0, color + (phase > 0.6 ? 'cc' : '66'));
    eg.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(rEX, rEY, rER * 1.7, 0, Math.PI * 2);
    ctx.fillStyle = eg; ctx.fill();
    ctx.beginPath(); ctx.arc(rEX, rEY, rER, 0, Math.PI * 2);
    ctx.fillStyle = '#0f0e0c'; ctx.fill();
    ctx.strokeStyle = color + 'aa'; ctx.lineWidth = r * 0.055; ctx.stroke();
    var scanY = rEY + (phase * 2 - 1) * rER * 0.68;
    ctx.beginPath();
    ctx.moveTo(rEX - rER * 0.82, scanY); ctx.lineTo(rEX + rER * 0.82, scanY);
    ctx.strokeStyle = color + 'cc'; ctx.lineWidth = r * 0.042; ctx.stroke();
    ctx.beginPath(); ctx.arc(rEX, scanY, r * 0.04, 0, Math.PI * 2);
    ctx.fillStyle = color; ctx.fill();

    // Jaw right — 5 circuit segments (F-style alternating opacity)
    for (var js = 0; js < 5; js++) {
      var t0 = js / 5, t1 = (js + 0.68) / 5;
      var bX = function(t) { return cx + r * 0.22 * t + r * 0.60 * t * t; };
      var bY = function(t) { return cy + r * 1.0 - r * 0.44 * (1 - t) * (1 - t); };
      ctx.beginPath(); ctx.moveTo(bX(t0), bY(t0)); ctx.lineTo(bX(t1), bY(t1));
      ctx.strokeStyle = color + (js % 2 === 0 ? 'cc' : '3a');
      ctx.lineWidth   = r * 0.13; ctx.lineCap = 'round'; ctx.stroke();
    }

    ctx.restore();

    // ══ E-style LIVE DATA SPOKES — wired to LIVE_SCORES ══
    // Six ACAT dimensions · spoke length = actual mean score · endpoint nodes pulse
    for (var di = 0; di < 6; di++) {
      var angle  = (di / 6) * Math.PI * 2 - Math.PI / 2;
      var score  = LIVE_SCORES[di];
      var len    = r * 0.76 * (score / 100);
      var dpulse = 1 + Math.sin(tSecs * 1.1 + di * 1.05) * 0.04;
      var pLen   = len * dpulse;
      var ex     = cx + Math.cos(angle) * pLen;
      var ey     = cy + Math.sin(angle) * pLen;
      var dcol   = DIM_COLORS[di];

      // Spoke line
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ex, ey);
      ctx.strokeStyle = dcol + 'aa'; ctx.lineWidth = r * 0.055; ctx.lineCap = 'round'; ctx.stroke();

      // Endpoint glow node
      var ng = ctx.createRadialGradient(ex, ey, 0, ex, ey, r * 0.12);
      ng.addColorStop(0, dcol + 'ff'); ng.addColorStop(1, dcol + '00');
      ctx.beginPath(); ctx.arc(ex, ey, r * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = ng; ctx.fill();
      ctx.beginPath(); ctx.arc(ex, ey, r * 0.065, 0, Math.PI * 2);
      ctx.fillStyle = dcol; ctx.fill();
    }

    // Spoke polygon fill — very subtle amber wash
    ctx.beginPath();
    for (var pi = 0; pi < 6; pi++) {
      var pAngle = (pi / 6) * Math.PI * 2 - Math.PI / 2;
      var pLen2  = r * 0.76 * (LIVE_SCORES[pi] / 100);
      if (pi === 0) { ctx.moveTo(cx + Math.cos(pAngle) * pLen2, cy + Math.sin(pAngle) * pLen2); }
      else          { ctx.lineTo(cx + Math.cos(pAngle) * pLen2, cy + Math.sin(pAngle) * pLen2); }
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(212,160,74,0.06)'; ctx.fill();

    // ══ CENTER SEAM — vertical division bone/circuit ══
    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 0.92); ctx.lineTo(cx, cy + r * 0.96);
    ctx.strokeStyle = '#0f0e0c'; ctx.lineWidth = r * 0.07; ctx.stroke();
    // Fine dashed gold thread on seam
    ctx.setLineDash([r * 0.06, r * 0.05]);
    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 0.92); ctx.lineTo(cx, cy + r * 0.96);
    ctx.strokeStyle = color + '44'; ctx.lineWidth = r * 0.02; ctx.stroke();
    ctx.setLineDash([]);

    // Center nucleus — small bright dot
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.10 * (1 + phase * 0.08), 0, Math.PI * 2);
    ctx.fillStyle = color; ctx.fill();

    // ══ BREATHING RING — cadence tied to targetLI field state ══
    var ringR      = r * (1.04 + phase * 0.11);
    var rotAngle   = tSecs * 0.15;
    var breakAngle = Math.PI * 0.07;
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.04, ringR, rotAngle + breakAngle, rotAngle + Math.PI * 2 - breakAngle);
    ctx.strokeStyle = color;
    ctx.lineWidth   = size * 0.023 * (0.65 + phase * 0.55);
    ctx.lineCap     = 'round'; ctx.stroke();
    // Ring glow
    var ringGlow = ctx.createLinearGradient(cx - ringR, cy, cx + ringR, cy);
    ringGlow.addColorStop(0,   'transparent');
    ringGlow.addColorStop(0.5, color + '1e');
    ringGlow.addColorStop(1,   'transparent');
    ctx.beginPath(); ctx.arc(cx, cy - r * 0.04, ringR, 0, Math.PI * 2);
    ctx.strokeStyle = ringGlow;
    ctx.lineWidth   = size * 0.07 * phase;
    ctx.stroke();
  }

  /* ─────────────────────────────────────────────────────────────────
     UI LAYER — Topbar Glyph, Overlay, Navigation

     OVERLAY POOL ORBIT LAYOUT (v4.6):
       Pool 1 rooms: inner ring  (orbitR × 0.28) — teal tint
       Pool 2 rooms: middle ring (orbitR × 0.55) — cobalt tint
       Pool 3 rooms: outer ring  (orbitR × 0.80) — indigo tint
       recordingHall + Writable Wall: mid-ring, slight angular separation (liminal)
       Home + Site Map: center cluster (orbitR × 0.15)
  ───────────────────────────────────────────────────────────────── */

  var overlayEl   = null;
  var overlayOpen = false;

  // [ARCH-6] Interval lifecycle — explicit vars prevent leaks
  var tooltipInterval = null;
  var TOPBAR_SIZE     = 44;

  // Pool ring radii (fraction of half-canvas)
  var POOL_ORBIT_FRAC = { 0: 0.15, 1: 0.28, 2: 0.54, 3: 0.79 };
  // Pool tint colors for subtle ring + node backgrounds
  var POOL_TINTS = {
    0: 'rgba(212,160,74,',
    1: 'rgba(160,200,192,',
    2: 'rgba(136,167,216,',
    3: 'rgba(154,138,192,'
  };

  function createTopbarGlyph(currentRoom) {
    var btn = document.createElement('button');
    btn.id = 'witness-btn';
    btn.className = 'witness-btn';
    btn.setAttribute('aria-label', 'Open constellation navigation');
    btn.style.cssText = [
      'width:' + TOPBAR_SIZE + 'px',
      'height:' + TOPBAR_SIZE + 'px',
      'background:none',
      'border:none',
      'cursor:pointer',
      'padding:0',
      'flex-shrink:0',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'position:relative',
      'z-index:10'
    ].join(';');

    var canvas = document.createElement('canvas');
    registerCanvas(canvas, TOPBAR_SIZE, 0); // phaseOffset 0 = primary glyph
    btn.appendChild(canvas);
    btn.addEventListener('click', toggleOverlay);

    // [ARCH-6] Guard against leak — clear before creating
    if (tooltipInterval) { clearInterval(tooltipInterval); tooltipInterval = null; }
    function updateTooltip() {
      var s = getState();
      btn.title = 'Field: ' + s.field + ' · ' + s.bpm + ' bpm · Open navigation';
    }
    updateTooltip();
    tooltipInterval = setInterval(updateTooltip, 2000);

    return btn;
  }

  /* ─────────────────────────────────────────────────────────────────
     OVERLAY — Pool-Clustered Radial Canvas Map
  ───────────────────────────────────────────────────────────────── */

  function buildOverlay(currentRoom) {
    var ov = document.createElement('div');
    ov.id = 'cn-overlay';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.setAttribute('aria-label', 'Constellation navigation');
    ov.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:9999',
      'display:flex', 'flex-direction:column', 'align-items:center', 'justify-content:center',
      'background:rgba(15,14,12,0.96)',
      'backdrop-filter:blur(20px)', '-webkit-backdrop-filter:blur(20px)',
      'opacity:0', 'transition:opacity .25s ease', 'overflow:hidden'
    ].join(';');

    ov.addEventListener('click', function(e) { if (e.target === ov) closeOverlay(); });

    var mapWrap = document.createElement('div');
    mapWrap.style.cssText = 'position:relative;display:flex;flex-direction:column;align-items:center;gap:0;';

    var dpr    = window.devicePixelRatio || 1;
    var MAP_CSS = Math.min(window.innerWidth * 0.92, window.innerHeight * 0.82, 700);
    var mapCanvas = document.createElement('canvas');
    mapCanvas.style.cssText = 'display:block;cursor:default;';
    mapCanvas.width  = Math.round(MAP_CSS * dpr);
    mapCanvas.height = Math.round(MAP_CSS * dpr);
    mapCanvas.style.width  = MAP_CSS + 'px';
    mapCanvas.style.height = MAP_CSS + 'px';
    var mCtx = mapCanvas.getContext('2d');
    mCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var hoveredIdx = -1;

    // ── Pre-compute node positions using pool-clustered orbits ──
    // Each pool gets its own ring. Within a pool, rooms are evenly distributed
    // around that ring. Home and Site Map get the center cluster.
    function getNodePositions() {
      var W = MAP_CSS, H = MAP_CSS;
      var cx = W / 2, cy = H / 2;
      var maxR = Math.min(W, H) * 0.46;

      // Partition ROOMS by pool
      var byPool = { 0: [], 1: [], 2: [], 3: [] };
      ROOMS.forEach(function(rm, idx) {
        var p = rm.pool !== undefined ? rm.pool : 2;
        byPool[p].push({ rm: rm, origIdx: idx });
      });

      var positions = new Array(ROOMS.length);

      // Pool 0 (home, site-map) — very inner cluster, split left/right
      var p0 = byPool[0];
      p0.forEach(function(item, i) {
        var baseAngle = i === 0 ? -Math.PI * 0.6 : -Math.PI * 0.4;
        var orbitR = maxR * POOL_ORBIT_FRAC[0];
        positions[item.origIdx] = {
          x: cx + Math.cos(baseAngle) * orbitR,
          y: cy + Math.sin(baseAngle) * orbitR,
          pool: 0, rm: item.rm
        };
      });

      // Pools 1, 2, 3 — evenly spaced around their ring
      [1, 2, 3].forEach(function(poolNum) {
        var items = byPool[poolNum];
        if (!items.length) return;
        var orbitR = maxR * POOL_ORBIT_FRAC[poolNum];

        // For pool 2, nudge recordingHall and Writable Wall slightly outward
        // to give them a liminal position
        var angleStart = -Math.PI / 2 - (poolNum - 1) * Math.PI * 0.04;
        items.forEach(function(item, i) {
          var angle = angleStart + (i / items.length) * Math.PI * 2;
          var r = item.rm.liminal ? orbitR * 1.12 : orbitR;
          positions[item.origIdx] = {
            x: cx + Math.cos(angle) * r,
            y: cy + Math.sin(angle) * r,
            pool: poolNum, rm: item.rm
          };
        });
      });

      return positions;
    }

    var nodePositions = null;

    function hitRadius() { return MAP_CSS > 500 ? 28 : 22; }

    mapCanvas.addEventListener('mousemove', function(e) {
      var rect = mapCanvas.getBoundingClientRect();
      var mx = e.clientX - rect.left, my = e.clientY - rect.top;
      var prev = hoveredIdx;
      hoveredIdx = -1;
      if (!nodePositions) return;
      nodePositions.forEach(function(pos, i) {
        if (!pos) return;
        if (Math.hypot(mx - pos.x, my - pos.y) < hitRadius()) hoveredIdx = i;
      });
      mapCanvas.style.cursor = hoveredIdx >= 0 ? 'pointer' : 'default';
    });

    mapCanvas.addEventListener('click', function(e) {
      var rect = mapCanvas.getBoundingClientRect();
      var mx = e.clientX - rect.left, my = e.clientY - rect.top;
      if (!nodePositions) return;
      nodePositions.forEach(function(pos, i) {
        if (!pos) return;
        if (Math.hypot(mx - pos.x, my - pos.y) < hitRadius()) {
          window.location.href = ROOMS[i].url;
        }
      });
    });

    // Touch support for mobile
    mapCanvas.addEventListener('touchend', function(e) {
      e.preventDefault();
      var rect = mapCanvas.getBoundingClientRect();
      var touch = e.changedTouches[0];
      var mx = touch.clientX - rect.left, my = touch.clientY - rect.top;
      if (!nodePositions) return;
      nodePositions.forEach(function(pos, i) {
        if (!pos) return;
        if (Math.hypot(mx - pos.x, my - pos.y) < hitRadius() * 1.5) {
          window.location.href = ROOMS[i].url;
        }
      });
    });

    function hexToRgb(hex) {
      var r = parseInt(hex.slice(1, 3), 16);
      var g = parseInt(hex.slice(3, 5), 16);
      var b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    }

    function drawMap() {
      var W = MAP_CSS, H = MAP_CSS;
      var cx = W / 2, cy = H / 2;
      var maxR = Math.min(W, H) * 0.46;
      var cSize = Math.min(W, H) * 0.13;
      var state = getState();
      var phase = breathPhase(tSecs, state.bpm, 0);

      // Recompute positions (stable — same each frame unless window resized)
      nodePositions = getNodePositions();

      mCtx.clearRect(0, 0, W, H);

      // ── Pool orbit rings (dashed, tinted) ──
      [1, 2, 3].forEach(function(poolNum) {
        var orbitR = maxR * POOL_ORBIT_FRAC[poolNum];
        var tint = POOL_TINTS[poolNum];
        mCtx.setLineDash(poolNum === 2 ? [4, 10] : [2, 8]);
        mCtx.beginPath(); mCtx.arc(cx, cy, orbitR, 0, Math.PI * 2);
        mCtx.strokeStyle = tint + '0.10)';
        mCtx.lineWidth = 0.8; mCtx.stroke();
        mCtx.setLineDash([]);
        // Pool label — subtle
        mCtx.font = '400 8px "IBM Plex Mono",monospace';
        mCtx.fillStyle = tint + '0.28)';
        mCtx.textAlign = 'center'; mCtx.textBaseline = 'middle';
        var labelAngle = -Math.PI / 2 - 0.18;
        mCtx.fillText(
          poolNum === 1 ? 'Pool 1' : poolNum === 2 ? 'Pool 2' : 'Pool 3',
          cx + Math.cos(labelAngle) * (orbitR - 10),
          cy + Math.sin(labelAngle) * (orbitR - 10)
        );
      });

      // ── Spokes from center to each node ──
      nodePositions.forEach(function(pos, i) {
        if (!pos) return;
        var rgb = hexToRgb(ROOMS[i].color);
        mCtx.beginPath(); mCtx.moveTo(cx, cy); mCtx.lineTo(pos.x, pos.y);
        mCtx.strokeStyle = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',0.07)';
        mCtx.lineWidth = 0.6; mCtx.stroke();
      });

      // ── Room nodes ──
      nodePositions.forEach(function(pos, i) {
        if (!pos) return;
        var rm = ROOMS[i];
        var isCurrent = (rm.id === currentRoom);
        var isHov     = (i === hoveredIdx);
        var rgb = hexToRgb(rm.color);
        var rgba = function(a) { return 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + a + ')'; };

        var nodeR = isCurrent ? 26 : isHov ? 22 : 16;

        // Glow halo
        var grd = mCtx.createRadialGradient(pos.x, pos.y, nodeR * 0.5, pos.x, pos.y, nodeR * 2.8);
        grd.addColorStop(0, rgba(isCurrent ? 0.28 : isHov ? 0.20 : 0.10));
        grd.addColorStop(1, 'transparent');
        mCtx.beginPath(); mCtx.arc(pos.x, pos.y, nodeR * 2.8, 0, Math.PI * 2);
        mCtx.fillStyle = grd; mCtx.fill();

        // Node circle
        mCtx.beginPath(); mCtx.arc(pos.x, pos.y, nodeR, 0, Math.PI * 2);
        mCtx.fillStyle   = rgba(isCurrent ? 0.30 : isHov ? 0.18 : 0.09);
        mCtx.strokeStyle = rgba(isCurrent ? 1.0  : isHov ? 0.9  : 0.5);
        mCtx.lineWidth   = isCurrent ? 2.0 : isHov ? 1.6 : 1.1;
        mCtx.fill(); mCtx.stroke();

        // Pulsing inner dot
        var dp = breathPhase(tSecs, state.bpm, i * 0.35);
        mCtx.beginPath(); mCtx.arc(pos.x, pos.y, 3.0 + dp * 2.8, 0, Math.PI * 2);
        mCtx.fillStyle = rgba(isCurrent ? 1.0 : 0.85); mCtx.fill();

        // Current room star marker
        if (isCurrent) {
          mCtx.beginPath(); mCtx.arc(pos.x, pos.y, nodeR + 5, 0, Math.PI * 2);
          mCtx.strokeStyle = rgba(0.5 + dp * 0.3);
          mCtx.lineWidth = 1.0;
          mCtx.setLineDash([3, 6]);
          mCtx.stroke();
          mCtx.setLineDash([]);
        }

        // Label
        var fontSize = isCurrent ? 13 : isHov ? 12 : 10;
        mCtx.font = (isCurrent || isHov ? '500' : '400') + ' ' + fontSize + 'px "IBM Plex Sans",sans-serif';
        mCtx.fillStyle = (isCurrent || isHov) ? rm.color : 'rgba(194,184,166,0.70)';
        mCtx.textAlign = 'center'; mCtx.textBaseline = 'top';
        mCtx.fillText(rm.label, pos.x, pos.y + nodeR + 5);

        // "you are here" tag
        if (isCurrent) {
          mCtx.font = '400 8px "IBM Plex Mono",monospace';
          mCtx.fillStyle = 'rgba(122,114,104,0.60)';
          mCtx.fillText('you are here', pos.x, pos.y + nodeR + 20);
        }
      });

      // ── Center Witness glyph ──
      var curRoom = ROOMS.find(function(r) { return r.id === currentRoom; }) || ROOMS[0];
      var savedState = { li: state.li, bpm: state.bpm, field: state.field, color: curRoom.color };
      mCtx.save();
      mCtx.translate(cx - cSize / 2, cy - cSize / 2);
      var shimCanvas = { getContext: function() { return mCtx; } };
      drawWitness(shimCanvas, cSize, phase, savedState);
      mCtx.restore();

      // Center label — field state
      mCtx.font = '400 8px "IBM Plex Mono",monospace';
      mCtx.fillStyle = 'rgba(122,114,104,0.45)';
      mCtx.textAlign = 'center'; mCtx.textBaseline = 'top';
      mCtx.fillText('FIELD · ' + state.field.toUpperCase() + ' · ' + state.bpm + ' BPM', cx, cy + cSize / 2 + 8);

      // Bottom status bar
      mCtx.font = '400 8px "IBM Plex Mono",monospace';
      mCtx.fillStyle = 'rgba(122,114,104,0.38)';
      mCtx.textAlign = 'center'; mCtx.textBaseline = 'bottom';
      mCtx.fillText('LI ' + state.li.toFixed(4) + '  ·  15 rooms  ·  click any room to enter', cx, H - 12);
    }

    ov._drawMap = drawMap;
    mapWrap.appendChild(mapCanvas);

    var escEl = document.createElement('div');
    escEl.textContent = 'click a room to enter  ·  ESC to close';
    escEl.style.cssText = 'font-family:"IBM Plex Mono",monospace;font-size:9px;color:#7a7268;margin-top:10px;letter-spacing:.1em;';
    mapWrap.appendChild(escEl);

    ov.appendChild(mapWrap);
    return ov;
  }

  function openOverlay() {
    if (!overlayEl) return;
    overlayEl.style.display = 'flex';
    requestAnimationFrame(function() { overlayEl.style.opacity = '1'; });
    overlayOpen = true;
    document.body.style.overflow = 'hidden';
  }

  function closeOverlay() {
    if (!overlayEl) return;
    overlayEl.style.opacity = '0';
    setTimeout(function() {
      if (overlayEl) overlayEl.style.display = 'none';
      overlayOpen = false;
      document.body.style.overflow = '';
    }, 250);
  }

  function toggleOverlay() {
    overlayOpen ? closeOverlay() : openOverlay();
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlayOpen) closeOverlay();
  });

  /* ─────────────────────────────────────────────────────────────────
     ANIMATION LOOP
  ───────────────────────────────────────────────────────────────── */

  var lastTs = null;

  function loop(ts) {
    if (!lastTs) lastTs = ts;
    var dt = Math.min((ts - lastTs) / 1000, 0.05); // clamp dt for tab-hidden catch-up
    lastTs = ts;

    updateEngine(dt);
    var state = getState();

    // Iterate canvas registry — no DOM queries
    for (var i = 0; i < canvases.length; i++) {
      var entry = canvases[i];
      var phase = breathPhase(tSecs, state.bpm, entry.phaseOffset);
      drawWitness(entry.canvas, entry.size, phase, state);
    }

    // Keep overlay map live-animated when open
    if (overlayOpen && overlayEl && overlayEl._drawMap) overlayEl._drawMap();

    requestAnimationFrame(loop);
  }

  /* ─────────────────────────────────────────────────────────────────
     INIT
     Injection rule (v4.6): replaceChild ALWAYS — NEVER appendChild.
     brand-mark is direct child of .topbar-inner, BEFORE <a>.
  ───────────────────────────────────────────────────────────────── */

  function init() {
    var script      = document.currentScript || document.querySelector('script[src*="constellation-nav"]');
    var currentRoom = (script && script.dataset && script.dataset.room) || 'home';

    // ── CRITICAL: replaceChild injection — NEVER appendChild ──
    var bm = document.querySelector('.brand-mark');
    if (bm) {
      var btn = createTopbarGlyph(currentRoom);
      bm.parentNode.replaceChild(btn, bm);
    } else {
      // Fallback: .topbar-inner prepend if no .brand-mark present
      var topbarInner = document.querySelector('.topbar-inner');
      if (topbarInner) {
        var btn2 = createTopbarGlyph(currentRoom);
        topbarInner.insertBefore(btn2, topbarInner.firstChild);
      } else {
        // No topbar found — skip
        return;
      }
    }

    // Build and mount overlay
    overlayEl = buildOverlay(currentRoom);
    overlayEl.style.display = 'none';
    document.body.appendChild(overlayEl);

    // ResizeObserver — rescale canvases on DPI/zoom/layout change
    if (typeof ResizeObserver !== 'undefined') {
      var observeTarget = document.querySelector('.topbar-inner') || document.body;
      var ro = new ResizeObserver(function() {
        for (var i = 0; i < canvases.length; i++) {
          scaleCanvas(canvases[i].canvas, canvases[i].size);
        }
      });
      ro.observe(observeTarget);
    }
    window.addEventListener('resize', function() {
      for (var i = 0; i < canvases.length; i++) {
        scaleCanvas(canvases[i].canvas, canvases[i].size);
      }
    });

    // Fetch live scores — non-blocking
    fetchLiveScores();
    setInterval(fetchLiveScores, 300000); // every 5 min

    // Start animation loop
    requestAnimationFrame(loop);
  }

  /* ─────────────────────────────────────────────────────────────────
     PUBLIC API
     Clean contract for Observatory / WebSocket / external telemetry
  ───────────────────────────────────────────────────────────────── */

  // Clamped + interpolated LI update — no snapping
  window._cnUpdateLI = function(newLI) {
    targetLI = clamp01(parseFloat(newLI) || 0.8632);
  };

  // Full state snapshot
  window._cnGetState = getState;

  // Field state and provider color — available globally
  window._cnFieldState    = fieldState;
  window._cnProviderColor = providerColor;
  window._cnProviderColors = PROVIDER_COLORS;
  window._cnRooms          = ROOMS;

  /* ───────────────────────────────────────────────────────────────── */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

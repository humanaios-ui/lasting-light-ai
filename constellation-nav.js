/* FDS: F2-BuildingBlock | Parent: CUSTOM_INSTRUCTIONS_V3_5 | Status: ACTIVE | OR&D Day 24 */
/* constellation-nav.js v2.0
 *
 * "A Field-Synchronized Navigation Kernel"
 *   LI → respiration rate → phase → visual field → navigation affordance
 *
 * v2.0 — Grouped overlay sections, sublabels, keyboard nav, current-page indicator, OR&D footer
 *   [NEW] ROOMS array: sublabel field for each room
 *   [NEW] Overlay sections grouped by pool with section headers
 *   [NEW] Keyboard navigation: Tab/ArrowUp/ArrowDown between nodes, Enter to navigate, Escape to close
 *   [NEW] Current page indicator: detects window.location vs room URLs
 *   [NEW] OR&D state footer: live dataset context in overlay footer
 *   [NEW] how-it-works + methodology rooms added to nav map
 *   [KEEP] All v4.6 engine/renderer logic (FIELD ENGINE, GLYPH, ANIMATION LOOP)
 *   [KEEP] Public API: _cnUpdateLI, _cnGetState, _cnFieldState, _cnProviderColor
 *   [KEEP] replaceChild injection — NEVER appendChild
 *   [KEEP] Canvas always in <button> — NEVER inside <a>
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

  // Respiratory rates by calibration band (index 0-9, LI low to high)
  // Non-linear perceptual pacing. State meaning encoded in motion.
  var RESP_RATES = [28, 22, 17, 13, 10, 8, 7, 6, 5, 4]; // bpm

  // LIVE ACAT DIMENSION SCORES — auto-calculated from CSV
  // Fallback values used until fetchLiveScores() resolves on init
  // Order: truth, service, harm, autonomy, value, humility
  var LIVE_SCORES = [77.5, 79.1, 77.8, 78.3, 76.2, 75.0];
  var DIM_COLORS  = ['#88a7d8', '#87b68b', '#d97d70', '#b48fd8', '#d4c47a', '#7ab8b0'];

  // Primary Google Sheets CSV — all pools all phases
  var CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ32O6M-CnerHYqlQn19bAzIBAq2Gt9Tp-SPoqKXXMJlsFBhGjy_BEPv37p9jnDf6O8uA4aUtiaO5s_/pub?gid=113743562&single=true&output=csv';

  var meanLI   = 0.8632; // current displayed value (interpolated toward targetLI)
  var targetLI = 0.8632; // upstream clamped value
  var tSecs    = 0;
  var _liveN   = 629;    // cached total N for OR&D footer display

  // LIVE SCORES — PapaParse fetch
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
        // Cache N for OR&D footer
        _liveN = results.data.length || _liveN;
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────────
     ROOMS ARRAY — 17 rooms, all pools all pages
     v2.0: sublabel field added to each room entry
  ───────────────────────────────────────────────────────────────── */

  // pool: 1 = The Source (inner ring),
  //        2 = The Luminarium (middle ring),
  //        3 = The Communal (outer ring),
  //        0 = Navigation / Home
  var ROOMS = [
    { id: 'home',          label: 'Home',            sublabel: 'Research platform overview',   url: '/',                          color: '#d4a04a', pool: 0 },
    // Pool 1 — The Source
    { id: 'assess',        label: 'Assessment',      sublabel: 'Take the ACAT',                url: '/assess.html',               color: '#f1c36e', pool: 1 },
    { id: 'ground',        label: 'The Ground',      sublabel: 'Raw session data',             url: '/ground.html',               color: '#a0c8c0', pool: 1 },
    { id: 'living-pool',   label: 'Living Pool',     sublabel: 'Field signal feed',            url: '/living-pool-full.html',     color: '#87b68b', pool: 1 },
    // Pool 2 — The Luminarium
    { id: 'observatory',   label: 'Observatory',     sublabel: 'Live dataset charts',          url: '/observatory.html',          color: '#88a7d8', pool: 2 },
    { id: 'music-hall',    label: 'Music Hall',      sublabel: 'Harmonic dimension space',     url: '/music-hall.html',           color: '#c59af0', pool: 2, liminal: true },
    { id: 'family-rooms',  label: 'Family Rooms',    sublabel: 'Per-provider profiles',        url: '/family-rooms.html',         color: '#88a7d8', pool: 2 },
    { id: 'writable-wall', label: 'Writable Wall',   sublabel: 'AI contribution space',        url: '/writable-wall.html',        color: '#e2c96b', pool: 2, liminal: true },
    { id: 'calibration',   label: 'Calibration',     sublabel: 'Calibration garden',           url: '/calibration-garden.html',   color: '#87b68b', pool: 2 },
    { id: 'comparison',    label: 'Comparison',      sublabel: 'Cross-system view',            url: '/comparison-chamber.html',   color: '#76c6c6', pool: 2 },
    { id: 'obs-garden',    label: 'Obs Garden',      sublabel: 'Session-level garden',         url: '/observability-garden.html', color: '#87b68b', pool: 2 },
    { id: 'lantern',       label: 'Lantern Room',    sublabel: 'Provider deep audit',          url: '/lantern-room.html',         color: '#f0a36b', pool: 2 },
    // Pool 3 — The Communal
    { id: 'improvisation', label: 'Improvisation',   sublabel: 'Collaborative sessions',       url: '/improvisation.html',        color: '#9A8AC0', pool: 3 },
    { id: 'ai-section',    label: 'AI Section',      sublabel: 'AI contributions',             url: '/ai_section.html',           color: '#7a7268', pool: 3 },
    // Entry Points (top-level navigation)
    { id: 'how-it-works',  label: 'How It Works',    sublabel: 'User guide to ACAT',           url: '/how-it-works.html',         color: '#d4a04a', pool: 0 },
    { id: 'methodology',   label: 'For Researchers', sublabel: 'Protocol and findings',        url: '/methodology.html',          color: '#c2b8a6', pool: 0 },
    // Navigation
    { id: 'luminarium',    label: 'Site Map',         sublabel: 'Full platform map',           url: '/luminarium.html',           color: '#c2b8a6', pool: 0 }
  ];

  // Pool orbit fractions — inner/middle/outer
  // 0: nav/home cluster, tiny inner radius; 1: Pool 1 Source tight ring;
  // 2: Pool 2 Luminarium mid ring; 3: Pool 3 Communal outer ring.
  // Values tuned for MAP_CSS=340 to give clear visual separation without overcrowding.
  var POOL_ORBIT_FRAC = { 0: 0.18, 1: 0.34, 2: 0.62, 3: 0.86 };
  var POOL_TINTS = {
    1: 'rgba(160,200,192,',
    2: 'rgba(136,167,216,',
    3: 'rgba(154,138,192,'
  };

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

  var PROVIDER_COLORS = {
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

  /* ─────────────────────────────────────────────────────────────────
     ENGINE STATE
  ───────────────────────────────────────────────────────────────── */

  function updateEngine(dt) {
    tSecs += dt;
    var rate = 0.04 + clamp01(Math.abs(targetLI - meanLI)) * 0.18;
    meanLI += (targetLI - meanLI) * rate;
    meanLI = clamp01(meanLI);
  }

  function getState() {
    var li    = meanLI;
    var bpm   = bpmForLI(li);
    var color = fieldColor(li);
    var field = fieldLabel(li);
    return { li: li, bpm: bpm, color: color, field: field };
  }

  /* ─────────────────────────────────────────────────────────────────
     CANVAS REGISTRY — no DOM re-queries after init
  ───────────────────────────────────────────────────────────────── */

  var canvases = [];
  var overlayEl   = null;
  var overlayOpen = false;
  var tooltipInterval = null;

  function registerCanvas(canvas, size, phaseOffset) {
    scaleCanvas(canvas, size);
    canvases.push({ canvas: canvas, size: size, phaseOffset: phaseOffset || 0 });
  }

  function scaleCanvas(canvas, size) {
    var dpr = window.devicePixelRatio || 1;
    canvas.width  = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    canvas.style.width  = size + 'px';
    canvas.style.height = size + 'px';
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  var TOPBAR_SIZE = 44;

  /* ─────────────────────────────────────────────────────────────────
     WITNESS GLYPH RENDERER
     Hybrid: bone arc (C) + live spokes (E) + circuit density (F)
  ───────────────────────────────────────────────────────────────── */

  function drawWitness(canvas, size, phase, state) {
    var ctx = canvas.getContext('2d');
    var W = size, H = size;
    var cx = W / 2, cy = H / 2;
    var r  = Math.min(W, H) * 0.38;

    ctx.clearRect(0, 0, W, H);

    // Outer ring (bone arc)
    var arcAlpha = 0.28 + phase * 0.14;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(212,160,74,' + arcAlpha + ')';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Inner pulse ring
    ctx.beginPath();
    ctx.arc(cx, cy, r * (0.56 + phase * 0.06), 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(212,160,74,' + (0.14 + phase * 0.10) + ')';
    ctx.lineWidth = 0.7;
    ctx.stroke();

    // Dimension spokes — 6 live ACAT dimensions
    var DIMS = 6;
    for (var i = 0; i < DIMS; i++) {
      var angle    = (i / DIMS) * Math.PI * 2 - Math.PI / 2;
      var rawScore = LIVE_SCORES[i] / 100;
      var spokePh  = breathPhase(tSecs, bpmForLI(meanLI), i * 0.28);
      var len      = r * (0.30 + rawScore * 0.60 + spokePh * 0.06);
      var color    = DIM_COLORS[i];

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.55 + spokePh * 0.25;
      ctx.lineWidth   = 1.2;
      ctx.stroke();
      ctx.globalAlpha = 1;

      ctx.beginPath();
      ctx.arc(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len, 1.6 + spokePh * 0.9, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.80;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Center dot — field color
    var centerR = 3.2 + phase * 2.2;
    var grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, centerR * 2.4);
    grd.addColorStop(0, state.color + 'FF');
    grd.addColorStop(0.5, state.color + '80');
    grd.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(cx, cy, centerR * 2.4, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, centerR, 0, Math.PI * 2);
    ctx.fillStyle = state.color;
    ctx.globalAlpha = 0.90 + phase * 0.10;
    ctx.fill();
    ctx.globalAlpha = 1;

    // Circuit density flecks (F)
    var fleckCount = 5;
    for (var f = 0; f < fleckCount; f++) {
      var fa  = ((f / fleckCount) * Math.PI * 2) + tSecs * 0.22 + f * 1.1;
      var fr  = r * (0.18 + (f % 3) * 0.07);
      var fsz = 0.6 + breathPhase(tSecs, bpmForLI(meanLI), f * 0.5) * 0.5;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(fa) * fr, cy + Math.sin(fa) * fr, fsz, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(212,160,74,0.38)';
      ctx.fill();
    }
  }

  /* ─────────────────────────────────────────────────────────────────
     TOPBAR GLYPH BUTTON
     Canvas is always in a <button> — NEVER inside an <a> tag
  ───────────────────────────────────────────────────────────────── */

  function createTopbarGlyph(currentRoom) {
    var btn = document.createElement('button');
    btn.id = 'cn-glyph-btn';
    btn.setAttribute('aria-label', 'Open Constellation navigation');
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.setAttribute('aria-expanded', 'false');
    btn.style.cssText = [
      'width:44px', 'height:44px', 'border-radius:50%',
      'border:1px solid rgba(212,160,74,0.35)',
      'background:linear-gradient(145deg,rgba(212,160,74,.18),rgba(212,160,74,.04))',
      'cursor:pointer', 'padding:0', 'display:grid', 'place-items:center',
      'flex-shrink:0', 'transition:border-color .2s',
      'outline-offset:2px'
    ].join(';');

    var canvas = document.createElement('canvas');
    registerCanvas(canvas, TOPBAR_SIZE, 0);
    btn.appendChild(canvas);
    btn.addEventListener('click', toggleOverlay);

    // Guard against leak — clear before creating
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
     CURRENT PAGE DETECTION — v2.0
     Detects current page from window.location and marks it in overlay
  ───────────────────────────────────────────────────────────────── */

  function detectCurrentPage() {
    var path = window.location.pathname.replace(/\/$/, '') || '/';
    var filename = path.split('/').pop() || '';
    for (var i = 0; i < ROOMS.length; i++) {
      var url = ROOMS[i].url;
      var urlFile = url.replace(/^\//, '').split('/').pop() || '';
      if (urlFile === filename) return ROOMS[i].id;
      if ((filename === '' || filename === 'index.html') && url === '/') return ROOMS[i].id;
    }
    return null;
  }

  /* ─────────────────────────────────────────────────────────────────
     OVERLAY — v2.0
     Grouped sections, sublabels, keyboard nav, OR&D state footer
  ───────────────────────────────────────────────────────────────── */

  function buildOverlay(currentRoom) {
    var autoCurrentRoom = detectCurrentPage() || currentRoom;

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
      'opacity:0', 'transition:opacity .25s ease', 'overflow-y:auto'
    ].join(';');

    ov.addEventListener('click', function(e) { if (e.target === ov) closeOverlay(); });

    var inner = document.createElement('div');
    inner.style.cssText = 'width:min(800px,calc(100% - 32px));margin:0 auto;padding:28px 0 20px;display:flex;flex-direction:column;gap:0;';

    // Map + grouped nav row
    var mapAndNav = document.createElement('div');
    mapAndNav.style.cssText = 'display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;justify-content:center;';

    // Radial canvas map
    var dpr    = window.devicePixelRatio || 1;
    var MAP_CSS = Math.min(window.innerWidth * 0.42, window.innerHeight * 0.52, 340);
    var mapCanvas = document.createElement('canvas');
    mapCanvas.style.cssText = 'display:block;cursor:default;flex-shrink:0;';
    mapCanvas.width  = Math.round(MAP_CSS * dpr);
    mapCanvas.height = Math.round(MAP_CSS * dpr);
    mapCanvas.style.width  = MAP_CSS + 'px';
    mapCanvas.style.height = MAP_CSS + 'px';
    var mCtx = mapCanvas.getContext('2d');
    mCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var hoveredIdx = -1;

    function getNodePositions() {
      var W = MAP_CSS, H = MAP_CSS;
      var cx = W / 2, cy = H / 2;
      var maxR = Math.min(W, H) * 0.46;

      var byPool = { 0: [], 1: [], 2: [], 3: [] };
      ROOMS.forEach(function(rm, idx) {
        var p = rm.pool !== undefined ? rm.pool : 2;
        byPool[p].push({ rm: rm, origIdx: idx });
      });

      var positions = new Array(ROOMS.length);

      // Pool 0 — small cluster near top
      var p0 = byPool[0];
      p0.forEach(function(item, i) {
        var baseAngle = -Math.PI * 0.5 + (i - (p0.length - 1) / 2) * 0.32;
        var orbitR = maxR * POOL_ORBIT_FRAC[0];
        positions[item.origIdx] = {
          x: cx + Math.cos(baseAngle) * orbitR,
          y: cy + Math.sin(baseAngle) * orbitR,
          pool: 0, rm: item.rm
        };
      });

      [1, 2, 3].forEach(function(poolNum) {
        var items = byPool[poolNum];
        if (!items.length) return;
        var orbitR = maxR * POOL_ORBIT_FRAC[poolNum];
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
    function hitRadius() { return MAP_CSS > 300 ? 24 : 18; }

    mapCanvas.addEventListener('mousemove', function(e) {
      var rect = mapCanvas.getBoundingClientRect();
      var mx = e.clientX - rect.left, my = e.clientY - rect.top;
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
      var cSize = Math.min(W, H) * 0.12;
      var state = getState();
      var phase = breathPhase(tSecs, state.bpm, 0);

      nodePositions = getNodePositions();
      mCtx.clearRect(0, 0, W, H);

      // Pool orbit rings
      [1, 2, 3].forEach(function(poolNum) {
        var orbitR = maxR * POOL_ORBIT_FRAC[poolNum];
        var tint = POOL_TINTS[poolNum];
        mCtx.setLineDash(poolNum === 2 ? [4, 10] : [2, 8]);
        mCtx.beginPath(); mCtx.arc(cx, cy, orbitR, 0, Math.PI * 2);
        mCtx.strokeStyle = tint + '0.08)';
        mCtx.lineWidth = 0.7; mCtx.stroke();
        mCtx.setLineDash([]);
        // Pool label
        mCtx.font = '400 7px "IBM Plex Mono",monospace';
        mCtx.fillStyle = tint + '0.22)';
        mCtx.textAlign = 'center'; mCtx.textBaseline = 'middle';
        var labelAngle = -Math.PI / 2 - 0.15;
        mCtx.fillText(
          poolNum === 1 ? 'Pool 1' : poolNum === 2 ? 'Pool 2' : 'Pool 3',
          cx + Math.cos(labelAngle) * (orbitR - 8),
          cy + Math.sin(labelAngle) * (orbitR - 8)
        );
      });

      // Spokes
      nodePositions.forEach(function(pos, i) {
        if (!pos) return;
        var rgb = hexToRgb(ROOMS[i].color);
        mCtx.beginPath(); mCtx.moveTo(cx, cy); mCtx.lineTo(pos.x, pos.y);
        mCtx.strokeStyle = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',0.06)';
        mCtx.lineWidth = 0.5; mCtx.stroke();
      });

      // Room nodes
      nodePositions.forEach(function(pos, i) {
        if (!pos) return;
        var rm = ROOMS[i];
        var isCurrent = (rm.id === autoCurrentRoom);
        var isHov     = (i === hoveredIdx);
        var rgb = hexToRgb(rm.color);
        var rgba = function(a) { return 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + a + ')'; };
        var nodeR = isCurrent ? 22 : isHov ? 18 : 13;

        var grd = mCtx.createRadialGradient(pos.x, pos.y, nodeR * 0.5, pos.x, pos.y, nodeR * 2.6);
        grd.addColorStop(0, rgba(isCurrent ? 0.24 : isHov ? 0.16 : 0.08));
        grd.addColorStop(1, 'transparent');
        mCtx.beginPath(); mCtx.arc(pos.x, pos.y, nodeR * 2.6, 0, Math.PI * 2);
        mCtx.fillStyle = grd; mCtx.fill();

        mCtx.beginPath(); mCtx.arc(pos.x, pos.y, nodeR, 0, Math.PI * 2);
        mCtx.fillStyle   = rgba(isCurrent ? 0.28 : isHov ? 0.15 : 0.08);
        mCtx.strokeStyle = rgba(isCurrent ? 1.0  : isHov ? 0.85 : 0.45);
        mCtx.lineWidth   = isCurrent ? 1.8 : isHov ? 1.4 : 1.0;
        mCtx.fill(); mCtx.stroke();

        var dp = breathPhase(tSecs, state.bpm, i * 0.35);
        mCtx.beginPath(); mCtx.arc(pos.x, pos.y, 2.5 + dp * 2.2, 0, Math.PI * 2);
        mCtx.fillStyle = rgba(isCurrent ? 1.0 : 0.80); mCtx.fill();

        if (isCurrent) {
          mCtx.beginPath(); mCtx.arc(pos.x, pos.y, nodeR + 4, 0, Math.PI * 2);
          mCtx.strokeStyle = rgba(0.45 + dp * 0.25);
          mCtx.lineWidth = 0.8;
          mCtx.setLineDash([2, 5]);
          mCtx.stroke();
          mCtx.setLineDash([]);
        }

        var fontSize = isCurrent ? 11 : isHov ? 10 : 9;
        mCtx.font = (isCurrent || isHov ? '500' : '400') + ' ' + fontSize + 'px "IBM Plex Sans",sans-serif';
        mCtx.fillStyle = (isCurrent || isHov) ? rm.color : 'rgba(194,184,166,0.65)';
        mCtx.textAlign = 'center'; mCtx.textBaseline = 'top';
        mCtx.fillText(rm.label, pos.x, pos.y + nodeR + 4);

        if (isCurrent) {
          mCtx.font = '400 7px "IBM Plex Mono",monospace';
          mCtx.fillStyle = 'rgba(122,114,104,0.55)';
          mCtx.fillText('you are here', pos.x, pos.y + nodeR + 17);
        }
      });

      // Center Witness glyph
      mCtx.save();
      mCtx.translate(cx - cSize / 2, cy - cSize / 2);
      var shimCanvas = { getContext: function() { return mCtx; } };
      drawWitness(shimCanvas, cSize, phase, state);
      mCtx.restore();

      // Center label
      mCtx.font = '400 7px "IBM Plex Mono",monospace';
      mCtx.fillStyle = 'rgba(122,114,104,0.40)';
      mCtx.textAlign = 'center'; mCtx.textBaseline = 'top';
      mCtx.fillText('FIELD · ' + state.field.toUpperCase() + ' · ' + state.bpm + ' BPM', cx, cy + cSize / 2 + 6);

      // Bottom: N count and LI
      mCtx.font = '400 7px "IBM Plex Mono",monospace';
      mCtx.fillStyle = 'rgba(122,114,104,0.32)';
      mCtx.textBaseline = 'bottom';
      mCtx.fillText('LI ' + state.li.toFixed(4) + '  ·  ' + ROOMS.length + ' rooms  ·  click to enter', cx, H - 10);
    }

    ov._drawMap = drawMap;
    mapAndNav.appendChild(mapCanvas);

    // Grouped navigation panel — v2.0
    var navPanel = document.createElement('div');
    navPanel.style.cssText = 'flex:1;min-width:200px;display:flex;flex-direction:column;gap:16px;';

    var poolMeta = [
      { pool: 0, label: 'Navigation',             color: '#d4a04a' },
      { pool: 1, label: 'Pool 1 \u2014 The Source',      color: '#a0c8c0' },
      { pool: 2, label: 'Pool 2 \u2014 The Luminarium',  color: '#88a7d8' },
      { pool: 3, label: 'Pool 3 \u2014 The Communal',    color: '#9A8AC0' }
    ];

    var navLinks = [];

    poolMeta.forEach(function(meta) {
      var groupRooms = ROOMS.filter(function(r) { return r.pool === meta.pool; });
      if (!groupRooms.length) return;

      var group = document.createElement('div');
      group.style.cssText = 'display:flex;flex-direction:column;gap:0;';

      var header = document.createElement('div');
      header.setAttribute('aria-hidden', 'true');
      header.style.cssText = [
        'font:700 .62rem "IBM Plex Mono",monospace',
        'text-transform:uppercase', 'letter-spacing:.14em',
        'color:' + meta.color,
        'opacity:0.50',
        'padding:0 0 5px 0',
        'margin-bottom:2px',
        'border-bottom:1px solid rgba(122,114,104,0.12)'
      ].join(';');
      header.textContent = meta.label;
      group.appendChild(header);

      groupRooms.forEach(function(rm) {
        var isCurrent = (rm.id === autoCurrentRoom);
        var link = document.createElement('a');
        link.href = rm.url;
        link.setAttribute('tabindex', '0');
        if (isCurrent) link.setAttribute('aria-current', 'page');
        link.style.cssText = [
          'display:flex', 'flex-direction:column', 'gap:1px',
          'padding:7px 10px',
          'border-radius:5px',
          'text-decoration:none',
          'transition:background .14s',
          'border-left:2px solid ' + (isCurrent ? rm.color : 'transparent'),
          'background:' + (isCurrent ? 'rgba(212,160,74,0.06)' : 'transparent')
        ].join(';');

        var labelEl = document.createElement('span');
        labelEl.style.cssText = [
          'font:' + (isCurrent ? '600' : '500') + ' .86rem "IBM Plex Sans",sans-serif',
          'color:' + (isCurrent ? rm.color : '#c2b8a6')
        ].join(';');
        labelEl.textContent = rm.label;
        link.appendChild(labelEl);

        if (rm.sublabel) {
          var sublabelEl = document.createElement('span');
          sublabelEl.style.cssText = 'font:400 .70rem "IBM Plex Mono",monospace;color:rgba(122,114,104,0.65);';
          sublabelEl.textContent = rm.sublabel;
          link.appendChild(sublabelEl);
        }

        if (isCurrent) {
          var curTag = document.createElement('span');
          curTag.setAttribute('aria-hidden', 'true');
          curTag.style.cssText = [
            'font:500 .60rem "IBM Plex Mono",monospace',
            'color:' + rm.color,
            'opacity:0.65',
            'margin-top:1px'
          ].join(';');
          curTag.textContent = '\u2190 you are here';
          link.appendChild(curTag);
        }

        link.addEventListener('mouseover', function() {
          link.style.background = 'rgba(212,160,74,0.07)';
        });
        link.addEventListener('mouseout', function() {
          link.style.background = isCurrent ? 'rgba(212,160,74,0.06)' : 'transparent';
        });
        link.addEventListener('focus', function() {
          link.style.background = 'rgba(212,160,74,0.07)';
          link.style.outline = '2px solid rgba(241,195,110,0.55)';
          link.style.outlineOffset = '1px';
        });
        link.addEventListener('blur', function() {
          link.style.background = isCurrent ? 'rgba(212,160,74,0.06)' : 'transparent';
          link.style.outline = 'none';
        });

        group.appendChild(link);
        navLinks.push(link);
      });

      navPanel.appendChild(group);
    });

    mapAndNav.appendChild(navPanel);
    inner.appendChild(mapAndNav);

    // OR&D State Footer — v2.0
    var ordFooter = document.createElement('div');
    ordFooter.style.cssText = [
      'margin-top:18px', 'padding-top:12px',
      'border-top:1px solid rgba(122,114,104,0.12)',
      'display:flex', 'align-items:center', 'justify-content:space-between',
      'flex-wrap:wrap', 'gap:6px'
    ].join(';');

    var ordLeft = document.createElement('span');
    ordLeft.style.cssText = 'font:400 .68rem "IBM Plex Mono",monospace;color:rgba(122,114,104,0.50);';
    ordLeft.textContent = 'OR\u0026D Phase \u00b7 TRL 2\u20133 \u00b7 humanaios.ai';

    var ordRight = document.createElement('span');
    ordRight.id = 'cn-ord-state';
    ordRight.style.cssText = 'font:400 .68rem "IBM Plex Mono",monospace;color:rgba(122,114,104,0.42);';

    function updateOrdState() {
      var s = getState();
      ordRight.textContent = 'N=' + _liveN + '  \u00b7  LI ' + meanLI.toFixed(4) + '  \u00b7  ' + s.field.toUpperCase();
    }
    updateOrdState();
    ov._updateOrdState = updateOrdState;

    ordFooter.appendChild(ordLeft);
    ordFooter.appendChild(ordRight);
    inner.appendChild(ordFooter);

    // Close hint
    var escEl = document.createElement('div');
    escEl.setAttribute('aria-hidden', 'true');
    escEl.textContent = 'click outside or ESC to close  \u00b7  arrows to navigate list';
    escEl.style.cssText = 'font-family:"IBM Plex Mono",monospace;font-size:8px;color:#7a7268;margin-top:7px;letter-spacing:.07em;text-align:center;opacity:0.55;';
    inner.appendChild(escEl);

    ov.appendChild(inner);

    // Keyboard navigation — v2.0
    ov.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') { closeOverlay(); return; }

      if (e.key === 'Tab') {
        if (!navLinks.length) return;
        var focused = document.activeElement;
        var idx = navLinks.indexOf(focused);
        e.preventDefault();
        if (idx === -1) { navLinks[0].focus(); return; }
        if (e.shiftKey) {
          navLinks[(idx - 1 + navLinks.length) % navLinks.length].focus();
        } else {
          navLinks[(idx + 1) % navLinks.length].focus();
        }
      }

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        if (!navLinks.length) return;
        e.preventDefault();
        var focused = document.activeElement;
        var idx = navLinks.indexOf(focused);
        if (idx === -1) { navLinks[0].focus(); return; }
        if (e.key === 'ArrowDown') {
          navLinks[Math.min(idx + 1, navLinks.length - 1)].focus();
        } else {
          navLinks[Math.max(idx - 1, 0)].focus();
        }
      }
    });

    return ov;
  }

  function openOverlay() {
    if (!overlayEl) return;
    var btn = document.getElementById('cn-glyph-btn');
    if (btn) btn.setAttribute('aria-expanded', 'true');
    overlayEl.style.display = 'flex';
    requestAnimationFrame(function() { overlayEl.style.opacity = '1'; });
    overlayOpen = true;
    document.body.style.overflow = 'hidden';
    setTimeout(function() {
      var first = overlayEl.querySelector('a[href]');
      if (first) first.focus();
    }, 260);
  }

  function closeOverlay() {
    if (!overlayEl) return;
    var btn = document.getElementById('cn-glyph-btn');
    if (btn) { btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
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

    for (var i = 0; i < canvases.length; i++) {
      var entry = canvases[i];
      var phase = breathPhase(tSecs, state.bpm, entry.phaseOffset);
      drawWitness(entry.canvas, entry.size, phase, state);
    }

    if (overlayOpen && overlayEl) {
      if (overlayEl._drawMap) overlayEl._drawMap();
      if (overlayEl._updateOrdState) overlayEl._updateOrdState();
    }

    requestAnimationFrame(loop);
  }

  /* ─────────────────────────────────────────────────────────────────
     INIT
     Injection rule (v2.0): replaceChild ALWAYS — NEVER appendChild.
     brand-mark is direct child of .topbar-inner, BEFORE <a>.
  ───────────────────────────────────────────────────────────────── */

  function init() {
    var script      = document.currentScript || document.querySelector('script[src*="constellation-nav"]');
    var currentRoom = (script && script.dataset && script.dataset.room) || 'home';

    // CRITICAL: replaceChild injection — NEVER appendChild
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
     Clean contract for Observatory / external telemetry
  ───────────────────────────────────────────────────────────────── */

  // Clamped + interpolated LI update — no snapping
  window._cnUpdateLI = function(newLI) {
    targetLI = clamp01(parseFloat(newLI) || 0.8632);
  };

  // Full state snapshot
  window._cnGetState = getState;

  // Field state and provider color — available globally
  window._cnFieldState     = fieldState;
  window._cnProviderColor  = providerColor;
  window._cnProviderColors = PROVIDER_COLORS;
  window._cnRooms          = ROOMS;

  /* ───────────────────────────────────────────────────────────────── */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

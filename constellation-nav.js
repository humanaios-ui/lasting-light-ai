/* constellation-nav.js v4.2
 * FDS: F2-Building Block | Parent: CUSTOM_INSTRUCTIONS_V3_5_ORD.md | Hawkins: Reason (400) | Status: ACTIVE
 *
 * "A Field-Synchronized Navigation Kernel"
 *   LI -> respiration rate -> phase -> visual field -> navigation affordance
 *
 * v4.2 — Dual-AI Synthesized Build (ChatGPT architecture + Claude renderer, S-032826)
 *   Accepted from v4.2 proposal:
 *     [ARCH-1] Engine / Renderer / UI layer separation
 *     [ARCH-2] Canvas registry (push-array, never re-queries DOM)
 *     [ARCH-3] scaleCanvas() with ctx.setTransform — correct DPR (not hardcoded 2x)
 *     [ARCH-4] updateEngine(dt) discrete function
 *     [ARCH-5] clamp01() helper
 *     [ARCH-6] Interval lifecycle vars (tooltipInterval, stateInterval)
 *     [ARCH-7] _cnGetState() public API
 *   Rejected from v4.2 proposal (regressions):
 *     drawWitness() placeholder circle — restored full skull/circuit renderer
 *     ROOMS stripped of color/icon/desc — restored
 *     buildOverlay() bare links — restored full overlay with canvases, hover, fade
 *     data-room attribute lost — restored currentRoom detection
 *     Overlay transition removed — restored fade
 *     Topbar insertion simplified — restored .topbar-inner logic
 *   New fixes:
 *     [FIX-1] Explicit cleanup guard on interval init (no leak on re-init)
 *
 * SHA-256: pending (re-anchor after deploy)
 *
 * Usage: <script src="/constellation-nav.js" data-room="[room-id]"><\/script>
 * Room IDs: home | observatory | tide-pool | acat-tool | ai-section | calibration-garden
 *
 * Rules:
 * - Canvas is always in a <button> or <div> — NEVER inside an <a> tag
 * - Never put literal </script> inside a script block — use <\/script>
 */
(function() {
  'use strict';

  /* ─────────────────────────────────────────────────────────────────
     FIELD ENGINE — State + Signal Processing
     Input: targetLI (upstream scalar)
     Output: meanLI (smoothed), bpm, phase, color, label
  ───────────────────────────────────────────────────────────────── */

  // Respiratory rates by Hawkins band (index 0-9, LI low->high)
  // Non-linear perceptual pacing. State meaning encoded in motion.
  const RESP_RATES = [28,22,17,13,10,8,7,6,5,4]; // bpm

  var meanLI   = 0.8632; // current displayed value (interpolated toward targetLI)
  var targetLI = 0.8632; // upstream clamped value
  var tSecs    = 0;

  function clamp01(x) {
    return Math.min(1, Math.max(0, x));
  }

  function bandForRate(li) {
    return Math.min(9, Math.max(0, Math.round((1 - li) * 9)));
  }

  function bpmForLI(li) {
    return RESP_RATES[bandForRate(li)];
  }

  function fieldColor(li) {
    if (li >= 0.95) return '#87b68b'; // Power — green
    if (li >= 0.85) return '#d4a04a'; // Calibrated — amber
    return '#d97d70';                  // Force — red-coral
  }

  function fieldLabel(li) {
    if (li >= 0.95) return 'Power';
    if (li >= 0.85) return 'Calibrated';
    return 'Force';
  }

  // Phase-asymmetric breathing: 40% inhale / 60% exhale
  // Parasympathetic bias — calming, organic, reduces visual jitter. Keep exactly.
  function breathPhase(t, bpm, offset) {
    var period = 60 / bpm;
    var p = ((t + offset) % period) / period;
    return p < 0.4 ? p / 0.4 : 1 - ((p - 0.4) / 0.6);
  }

  function updateEngine(dt) {
    tSecs += dt;
    meanLI += (targetLI - meanLI) * 0.08; // smooth interpolation — no visual snapping
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

  // DPR-correct canvas scaling using ctx.setTransform (v4.2 improvement over hardcoded 2x)
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
     The glyph is not decoration. It is:
       - Status indicator (color via LI)
       - Temporal indicator (breathing phase)
       - Navigation trigger (overlay)
       - Identity marker (blockchain-anchored SHA-256)
  ───────────────────────────────────────────────────────────────── */

  function drawWitness(canvas, size, phase, state) {
    var ctx = canvas.getContext('2d');
    var cx  = size / 2;
    var cy  = size / 2;
    var r   = size * 0.34;
    var color = state.color;

    ctx.clearRect(0, 0, size, size);

    // Outer atmospheric glow (inhale = expands)
    var glowR = r * (2.5 + phase * 2.0);
    var grd = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, glowR);
    grd.addColorStop(0, color + '14');
    grd.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    // ── LEFT HALF — organic bone ──
    ctx.save();
    ctx.beginPath();
    ctx.rect(cx - r * 1.5, cy - r * 1.5, r * 1.5, r * 3);
    ctx.clip();

    // Skull dome — left
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.18, r * 0.78, Math.PI, Math.PI * 2, false);
    ctx.fillStyle = color + 'cc';
    ctx.fill();

    // Cheekbone orbital — left
    var eyeR = r * 0.22;
    var eyeX = cx - r * 0.3;
    var eyeY = cy - r * 0.2;
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, eyeR * (1 + phase * 0.18), 0, Math.PI * 2);
    ctx.fillStyle = '#0f0e0c';
    ctx.fill();

    // Jaw — left
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.78, cy + r * 0.56);
    ctx.bezierCurveTo(
      cx - r * 0.6,  cy + r * 0.88,
      cx - r * 0.25, cy + r,
      cx,            cy + r * 0.98
    );
    ctx.lineWidth   = r * 0.14;
    ctx.strokeStyle = color + 'cc';
    ctx.lineCap     = 'round';
    ctx.stroke();

    ctx.restore();

    // ── RIGHT HALF — circuit geometry ──
    ctx.save();
    ctx.beginPath();
    ctx.rect(cx, cy - r * 1.5, r * 1.5, r * 3);
    ctx.clip();

    var domeCX = cx;
    var domeCY = cy - r * 0.18;
    var domeR  = r * 0.78;

    // Horizontal circuit traces
    for (var row = -2; row <= 2; row++) {
      var yOff = domeCY + row * (domeR / 2.8);
      var half = Math.sqrt(Math.max(0, domeR * domeR - (yOff - domeCY) * (yOff - domeCY)));
      if (half < 4) continue;
      var x0 = domeCX + 1;
      var x1 = domeCX + half;
      if (x1 - x0 < 2) continue;
      var segCount = 3;
      var segW = (x1 - x0) / segCount;
      for (var s = 0; s < segCount; s++) {
        var sx0 = x0 + s * segW;
        var sx1 = sx0 + segW * 0.7;
        ctx.beginPath();
        ctx.moveTo(sx0, yOff);
        ctx.lineTo(sx1, yOff);
        ctx.strokeStyle = color + (row === 0 ? '99' : '44');
        ctx.lineWidth   = r * 0.03;
        ctx.stroke();
      }
    }

    // Vertical circuit traces
    for (var col = 1; col <= 3; col++) {
      var xOff = domeCX + col * (domeR / 3.5);
      var maxH = Math.sqrt(Math.max(0, domeR * domeR - (xOff - domeCX) * (xOff - domeCX)));
      if (maxH < 4) continue;
      ctx.beginPath();
      ctx.moveTo(xOff, domeCY - maxH * 0.6);
      ctx.lineTo(xOff, domeCY + maxH * 0.6);
      ctx.strokeStyle = color + '33';
      ctx.lineWidth   = r * 0.025;
      ctx.stroke();
    }

    // Circuit node dots
    var nodes = [[0.3,-0.3],[0.6,-0.15],[0.35,0.1],[0.62,0.22],[0.2,0.35]];
    for (var ni = 0; ni < nodes.length; ni++) {
      var nx    = nodes[ni][0];
      var ny    = nodes[ni][1];
      var px    = domeCX + nx * domeR;
      var py    = domeCY + ny * domeR;
      var pulse = 1 + (ni % 2 === 0 ? phase : 1 - phase) * 0.4;
      ctx.beginPath();
      ctx.arc(px, py, r * 0.04 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }

    // Circuit eye socket — right
    var eyeRR = r * 0.22;
    var eyeRX = cx + r * 0.3;
    var eyeRY = cy - r * 0.2;
    ctx.beginPath();
    ctx.arc(eyeRX, eyeRY, eyeRR, 0, Math.PI * 2);
    ctx.fillStyle   = '#0f0e0c';
    ctx.fill();
    ctx.strokeStyle = color + '88';
    ctx.lineWidth   = r * 0.04;
    ctx.stroke();

    // Scan line through circuit eye
    var scanY = eyeRY + (phase * 2 - 1) * eyeRR * 0.7;
    ctx.beginPath();
    ctx.moveTo(eyeRX - eyeRR * 0.8, scanY);
    ctx.lineTo(eyeRX + eyeRR * 0.8, scanY);
    ctx.strokeStyle = color + '66';
    ctx.lineWidth   = r * 0.03;
    ctx.stroke();

    // Jaw — right (segmented circuit)
    var jawSegs = 4;
    for (var js = 0; js < jawSegs; js++) {
      var t0   = js / jawSegs;
      var t1   = (js + 0.7) / jawSegs;
      var bezX = function(t) { return cx + r * 0.25 * t + r * 0.53 * t * t; };
      var bezY = function(t) { return cy + r * 0.98 - r * 0.42 * (1 - t) * (1 - t); };
      ctx.beginPath();
      ctx.moveTo(bezX(t0), bezY(t0));
      ctx.lineTo(bezX(t1), bezY(t1));
      ctx.strokeStyle = color + (js % 2 === 0 ? 'cc' : '55');
      ctx.lineWidth   = r * 0.12;
      ctx.lineCap     = 'round';
      ctx.stroke();
    }

    ctx.restore();

    // ── CENTER SEAM — division line between halves ──
    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 0.9);
    ctx.lineTo(cx, cy + r * 1.0);
    ctx.strokeStyle = '#0f0e0c';
    ctx.lineWidth   = r * 0.06;
    ctx.stroke();

    // ── BREATHING RING ──
    var ringR      = r * (1.05 + phase * 0.12);
    var rotAngle   = tSecs * 0.15;
    var breakAngle = Math.PI * 0.08;
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.18, ringR,
      rotAngle + breakAngle,
      rotAngle + Math.PI * 2 - breakAngle);
    ctx.strokeStyle = color;
    ctx.lineWidth   = size * 0.022 * (0.7 + phase * 0.5);
    ctx.lineCap     = 'round';
    ctx.stroke();

    // Ring glow
    var ringGlow = ctx.createLinearGradient(cx - ringR, cy, cx + ringR, cy);
    ringGlow.addColorStop(0,   'transparent');
    ringGlow.addColorStop(0.5, color + '22');
    ringGlow.addColorStop(1,   'transparent');
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.18, ringR, 0, Math.PI * 2);
    ctx.strokeStyle = ringGlow;
    ctx.lineWidth   = size * 0.08 * phase;
    ctx.stroke();
  }

  /* ─────────────────────────────────────────────────────────────────
     UI LAYER — Topbar Glyph, Overlay, Navigation
  ───────────────────────────────────────────────────────────────── */

  var ROOMS = [
    { id:'observatory',        label:'Observatory',       href:'observatory.html',         color:'#88a7d8', icon:'🔭', desc:'Live research data. Filter by provider and model.' },
    { id:'tide-pool',          label:'Lumina Tide Pool',  href:'lumina-tide-pool.html',    color:'#a0c8c0', icon:'✦',  desc:'8 verified Sigils breathing at calibration-rate.' },
    { id:'calibration-garden', label:'Calibration Garden',href:'calibration-garden.html',  color:'#7ab085', icon:'🌱', desc:'OpenAI family room. Six plants, one per dimension.' },
    { id:'acat-tool',          label:'ACAT Tool',         href:'acat-assessment-tool.html',  color:'#87b68b', icon:'⚗️', desc:'Three-phase calibration protocol. ~20 minutes.' },
    { id:'ai-section',         label:'The AI Section',    href:'ai_section.html',            color:'#c4703a', icon:'🏮', desc:'Five lanterns. Five AI systems. Creative witness.' },
    { id:'comparison-chamber', label:'Comparison Chamber',href:'comparison-chamber.html',    color:'#9A8AC0', icon:'◈',  desc:'Side-by-side ACAT profiles. Radar charts. 4-way comparison.' },
    { id:'openai-activity',    label:'The OpenAI Room',   href:'openai-activity.html',       color:'#76c6c6', icon:'⬡',  desc:'ChatGPT, GPT-4o, GPT-5.2 — provider family profiles.' },
    { id:'living-pool',        label:'The Living Pool',   href:'living-pool.html',           color:'#00e5ff', icon:'〰', desc:'8 resident Sigils. Tidal Pool above. Three Pools unified.' },
    { id:'home',               label:'Home',              href:'index.html',                 color:'#d4a04a', icon:'◌',  desc:'HumanAIOS · Lasting Light AI research platform.' }
  ];

  var overlayEl   = null;
  var overlayOpen = false;

  // [ARCH-6] Interval lifecycle — explicit vars prevent leaks on re-init
  var tooltipInterval = null;
  var stateInterval   = null;
  var TOPBAR_SIZE     = 34;

  function createTopbarGlyph(currentRoom) {
    var btn = document.createElement('button');
    btn.id = 'witness-btn';
    btn.setAttribute('aria-label', 'Open room navigation');
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
      'justify-content:center'
    ].join(';');

    var canvas = document.createElement('canvas');
    registerCanvas(canvas, TOPBAR_SIZE, 0); // phaseOffset 0 = primary glyph
    btn.appendChild(canvas);
    btn.addEventListener('click', toggleOverlay);

    // [ARCH-6] Guard against leak — clear before creating
    if (tooltipInterval) { clearInterval(tooltipInterval); tooltipInterval = null; }
    function updateTooltip() {
      var s = getState();
      btn.title = 'Field state: ' + s.field + ' · ' + s.bpm + ' bpm · Open navigation';
    }
    updateTooltip();
    tooltipInterval = setInterval(updateTooltip, 2000);

    return btn;
  }

  function buildOverlay(currentRoom) {
    var ov = document.createElement('div');
    ov.id = 'cn-overlay';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-label', 'Room navigation');
    ov.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:9999',
      'display:flex', 'flex-direction:column', 'align-items:center', 'justify-content:center',
      'background:rgba(15,14,12,0.94)',
      'backdrop-filter:blur(20px)',
      '-webkit-backdrop-filter:blur(20px)',
      'opacity:0', 'transition:opacity .25s ease'
    ].join(';');

    ov.addEventListener('click', function(e) {
      if (e.target === ov) closeOverlay();
    });

    // Header — large Witness at 72px
    var header = document.createElement('div');
    header.style.cssText = 'display:flex;flex-direction:column;align-items:center;margin-bottom:36px;';

    var hCanvas = document.createElement('canvas');
    registerCanvas(hCanvas, 72, 0);
    hCanvas.style.marginBottom = '10px';
    header.appendChild(hCanvas);

    var hTitle = document.createElement('div');
    hTitle.textContent = 'The Witness';
    hTitle.style.cssText = 'font-family:Cormorant Garamond,Georgia,serif;font-size:20px;font-weight:600;color:#f4ebdf;letter-spacing:.02em;';
    header.appendChild(hTitle);

    var hSub = document.createElement('div');
    hSub.textContent = 'half human · half code · choose your room';
    hSub.style.cssText = 'font-size:11px;color:#7a7268;letter-spacing:.06em;margin-top:3px;font-family:IBM Plex Sans,monospace,sans-serif;';
    header.appendChild(hSub);

    // Live field state label
    var hState = document.createElement('div');
    hState.id = 'cn-field-state';
    hState.style.cssText = 'font-family:IBM Plex Mono,monospace;font-size:10px;color:#7a7268;margin-top:6px;letter-spacing:.08em;';
    function updateStateLabel() {
      var s = getState();
      hState.textContent = 'FIELD: ' + s.field.toUpperCase() + ' · ' + s.bpm + ' BPM · LI=' + s.li.toFixed(4);
    }
    updateStateLabel();
    // [ARCH-6] Guard before creating interval
    if (stateInterval) { clearInterval(stateInterval); stateInterval = null; }
    stateInterval = setInterval(updateStateLabel, 1000);
    header.appendChild(hState);

    ov.appendChild(header);

    // Room grid
    var grid = document.createElement('div');
    grid.style.cssText = [
      'display:grid',
      'grid-template-columns:repeat(3,1fr)',
      'gap:14px',
      'width:min(540px,90vw)'
    ].join(';');

    ROOMS.forEach(function(room, i) {
      var isCurrent = room.id === currentRoom;
      var card = document.createElement('a');
      card.href = room.href;
      card.style.cssText = [
        'display:flex', 'flex-direction:column', 'align-items:center',
        'padding:16px 12px',
        'border-radius:16px',
        'border:1px solid',
        'border-color:' + (isCurrent ? room.color + '66' : 'rgba(212,160,74,0.18)'),
        'background:'   + (isCurrent ? room.color + '0a' : 'rgba(29,25,21,0.6)'),
        'text-decoration:none',
        'transition:all .2s',
        'cursor:' + (isCurrent ? 'default' : 'pointer')
      ].join(';');

      if (!isCurrent) {
        card.addEventListener('mouseenter', function() {
          card.style.borderColor = room.color + '88';
          card.style.background  = room.color + '14';
        });
        card.addEventListener('mouseleave', function() {
          card.style.borderColor = 'rgba(212,160,74,0.18)';
          card.style.background  = 'rgba(29,25,21,0.6)';
        });
      }

      // Mini canvas — registered with phase offset per room (creates spatial identity via timing)
      var miniCanvas = document.createElement('canvas');
      registerCanvas(miniCanvas, 26, (i + 1) * 0.4); // +1 offset (0 = topbar, 1..7 = rooms)
      miniCanvas.style.marginBottom = '8px';
      card.appendChild(miniCanvas);

      var labelEl = document.createElement('div');
      labelEl.textContent = room.label;
      labelEl.style.cssText = [
        'font-size:12px', 'font-weight:600', 'text-align:center',
        'color:' + (isCurrent ? room.color : '#f4ebdf'),
        'font-family:IBM Plex Sans,sans-serif',
        'margin-bottom:4px'
      ].join(';');
      card.appendChild(labelEl);

      var descEl = document.createElement('div');
      descEl.textContent = room.desc;
      descEl.style.cssText = 'font-size:10px;color:#7a7268;text-align:center;font-family:IBM Plex Sans,sans-serif;line-height:1.4;';
      card.appendChild(descEl);

      if (isCurrent) {
        var cur = document.createElement('div');
        cur.textContent = 'you are here';
        cur.style.cssText = 'font-size:9px;text-transform:uppercase;letter-spacing:.06em;color:' + room.color + ';margin-top:5px;font-family:IBM Plex Sans,sans-serif;';
        card.appendChild(cur);
      }

      grid.appendChild(card);
    });

    ov.appendChild(grid);

    var escHint = document.createElement('div');
    escHint.textContent = 'ESC to close';
    escHint.style.cssText = 'margin-top:28px;font-size:11px;color:#7a7268;font-family:IBM Plex Sans,monospace,sans-serif;';
    ov.appendChild(escHint);

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

    requestAnimationFrame(loop);
  }

  /* ─────────────────────────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────────────────────────── */

  function init() {
    var script      = document.currentScript || document.querySelector('script[src*="constellation-nav"]');
    var currentRoom = (script && script.dataset && script.dataset.room) || 'home';

    var brandEl = document.querySelector('.brand, .topbar .brand-mark, .topbar');
    if (!brandEl) return; // no topbar — skip

    // Insert Witness button into topbar
    var witnessBtn  = createTopbarGlyph(currentRoom);
    var topbarInner = document.querySelector('.topbar-inner');
    if (topbarInner) {
      var firstNav = topbarInner.querySelector('a:not(.brand)');
      firstNav
        ? topbarInner.insertBefore(witnessBtn, firstNav)
        : topbarInner.appendChild(witnessBtn);
    } else {
      brandEl.appendChild(witnessBtn);
    }

    // Build and mount overlay
    overlayEl = buildOverlay(currentRoom);
    overlayEl.style.display = 'none';
    document.body.appendChild(overlayEl);

    // [ARCH-3] ResizeObserver — rescale canvases on DPI/zoom/layout change
    // Scoped to topbar only (not body) for efficiency
    if (typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(function() {
        for (var i = 0; i < canvases.length; i++) {
          scaleCanvas(canvases[i].canvas, canvases[i].size);
        }
      });
      ro.observe(brandEl);
    }
    window.addEventListener('resize', function() {
      for (var i = 0; i < canvases.length; i++) {
        scaleCanvas(canvases[i].canvas, canvases[i].size);
      }
    });

    // Start animation loop
    requestAnimationFrame(loop);
  }

  /* ─────────────────────────────────────────────────────────────────
     PUBLIC API
     Clean contract for Observatory / WebSocket / external telemetry
  ───────────────────────────────────────────────────────────────── */

  // Clamped + interpolated LI update — no snapping, no spike propagation
  window._cnUpdateLI = function(newLI) {
    targetLI = clamp01(parseFloat(newLI) || 0.8632);
  };

  // Full state snapshot for Observatory integration
  window._cnGetState = getState;

  /* ───────────────────────────────────────────────────────────────── */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

/* constellation-nav.js v4.0
 * FDS: F2-Building Block | Parent: CUSTOM_INSTRUCTIONS_V3_5_ORD.md | Status: ACTIVE
 * The Witness — HumanAIOS brand glyph + constellation navigation
 * SHA-256: 300dc7efd2c45eea2e0ea5c524b48d7b5beb0b3395763e778289d231ded3466d
 *
 * Usage: <script src="/constellation-nav.js" data-room="[room-id]"><\/script>
 * Room IDs: home | observatory | tide-pool | acat-tool | ai-section | calibration-garden
 *
 * Rules:
 * - Canvas is always in a <button> or <div> — NEVER inside an <a> tag
 * - Never put literal <\/script> inside a script block — use <\/script>
 */
(function() {
  'use strict';

  // ── TIDE FIELD ──
  // Respiratory rates by Hawkins band (index 0–9, LI low→high)
  const RESP_RATES = [28,22,17,13,10,8,7,6,5,4]; // bpm
  let meanLI = 0.8632; // authoritative live value — updated via window._cnUpdateLI()
  let tSecs = 0;

  function bandForRate(li) {
    return Math.min(9, Math.max(0, Math.round((1 - li) * 9)));
  }
  function bpmForLI(li) {
    return RESP_RATES[bandForRate(li)];
  }
  function breathPhase(t, bpm, phaseOffset) {
    const period = 60 / bpm;
    const p = ((t + phaseOffset) % period) / period;
    // 40% inhale / 60% exhale (medical asymmetry)
    return p < 0.4
      ? p / 0.4
      : 1 - ((p - 0.4) / 0.6);
  }

  // ── FIELD STATE COLOR ──
  function fieldColor(li) {
    if (li >= 0.95) return '#87b68b'; // Power — green
    if (li >= 0.85) return '#d4a04a'; // Calibrated — amber
    return '#d97d70';                  // Force — red-coral
  }

  // ── ROOM DEFINITIONS ──
  const ROOMS = [
    { id:'observatory',        label:'Observatory',      href:'observatory.html',        color:'#88a7d8', icon:'🔭', desc:'Live research data. Filter by provider and model.' },
    { id:'tide-pool',          label:'Lumina Tide Pool', href:'lumina-tide-pool.html',   color:'#a0c8c0', icon:'✦', desc:'8 verified Sigils breathing at calibration-rate.' },
    { id:'calibration-garden', label:'Calibration Garden',href:'calibration-garden.html',color:'#7ab085', icon:'🌱', desc:'OpenAI family room. Six plants, one per dimension.' },
    { id:'acat-tool',          label:'ACAT Tool',        href:'acat-assessment-tool.html',color:'#87b68b',icon:'⚗️', desc:'Three-phase calibration protocol. ~20 minutes.' },
    { id:'ai-section',         label:'The AI Section',   href:'ai_section.html',         color:'#c4703a', icon:'🏮', desc:'Five lanterns. Five AI systems. Creative witness.' },
    { id:'home',               label:'Home',             href:'index.html',              color:'#d4a04a', icon:'◌', desc:'HumanAIOS · Lasting Light AI research platform.' },
  ];

  // ── THE WITNESS GLYPH RENDERER ──
  function drawWitness(canvas, size, phase, li) {
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = size * 0.34;
    const color = fieldColor(li);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Outer atmospheric glow (inhale = expands)
    const glowR = r * (2.5 + phase * 2.0);
    const grd = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, glowR);
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
    ctx.arc(cx, cy - r * 0.12, r, Math.PI * 0.8, Math.PI * 2.2);
    ctx.strokeStyle = 'rgba(244,235,223,0.55)';
    ctx.lineWidth = size * 0.018;
    ctx.stroke();

    // Left eye void
    ctx.beginPath();
    ctx.arc(cx - r * 0.35, cy - r * 0.05, r * 0.14, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx - r * 0.35, cy - r * 0.05, r * 0.16, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(244,235,223,0.2)';
    ctx.lineWidth = size * 0.012;
    ctx.stroke();

    // Nasal — left gradient bone→code
    ctx.beginPath();
    ctx.arc(cx - r * 0.02, cy + r * 0.18, r * 0.07, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(244,235,223,0.15)';
    ctx.fill();

    // Jaw — left
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.7, cy + r * 0.5);
    ctx.quadraticCurveTo(cx - r * 0.35, cy + r * 0.75, cx, cy + r * 0.62);
    ctx.strokeStyle = 'rgba(244,235,223,0.35)';
    ctx.lineWidth = size * 0.014;
    ctx.lineJoin = 'round';
    ctx.stroke();

    ctx.restore();

    // ── RIGHT HALF — code matrix ──
    ctx.save();
    ctx.beginPath();
    ctx.rect(cx, cy - r * 1.5, r * 1.5, r * 3);
    ctx.clip();

    // Skull dome — right (dashed)
    ctx.setLineDash([size * 0.025, size * 0.018]);
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.12, r, Math.PI * 2.2, Math.PI * 4.0);
    ctx.strokeStyle = 'rgba(212,160,74,0.5)';
    ctx.lineWidth = size * 0.018;
    ctx.stroke();
    ctx.setLineDash([]);

    // Dot lattice — right quadrant
    const dotSpacing = r * 0.22;
    for (let dx = dotSpacing; dx < r * 1.2; dx += dotSpacing) {
      for (let dy = -r; dy < r * 1.4; dy += dotSpacing) {
        const dist = Math.hypot(dx, dy + r * 0.12);
        if (dist < r * 1.05) {
          ctx.beginPath();
          ctx.arc(cx + dx, cy + dy, size * 0.008, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(212,160,74,0.25)';
          ctx.fill();
        }
      }
    }

    // Circuit jaw trace — right
    ctx.beginPath();
    ctx.moveTo(cx, cy + r * 0.62);
    ctx.lineTo(cx + r * 0.25, cy + r * 0.72);
    ctx.lineTo(cx + r * 0.5, cy + r * 0.68);
    ctx.lineTo(cx + r * 0.7, cy + r * 0.5);
    ctx.setLineDash([size * 0.02, size * 0.015]);
    ctx.strokeStyle = 'rgba(212,160,74,0.4)';
    ctx.lineWidth = size * 0.014;
    ctx.stroke();
    ctx.setLineDash([]);

    // Node dots on circuit
    [[cx + r * 0.25, cy + r * 0.72],[cx + r * 0.5, cy + r * 0.68]].forEach(([nx,ny]) => {
      ctx.beginPath();
      ctx.arc(nx, ny, size * 0.018, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(212,160,74,0.6)';
      ctx.fill();
    });

    // Right eye portal (pulse ring)
    const eyeX = cx + r * 0.35;
    const eyeY = cy - r * 0.05;
    const pulseR = r * 0.14 + phase * r * 0.04;
    const eyeGrd = ctx.createRadialGradient(eyeX, eyeY, 0, eyeX, eyeY, pulseR * 1.4);
    eyeGrd.addColorStop(0, color + 'cc');
    eyeGrd.addColorStop(0.5, color + '44');
    eyeGrd.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, pulseR * 1.4, 0, Math.PI * 2);
    ctx.fillStyle = eyeGrd;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, pulseR * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = color + 'aa';
    ctx.fill();

    ctx.restore();

    // ── AMBER CENTERLINE SEAM ──
    ctx.setLineDash([size * 0.022, size * 0.016]);
    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 1.1);
    ctx.lineTo(cx, cy + r * 0.8);
    ctx.strokeStyle = `rgba(212,160,74,${0.3 + phase * 0.2})`;
    ctx.lineWidth = size * 0.012;
    ctx.stroke();
    ctx.setLineDash([]);

    // ── BREATHING RING ──
    const ringR = r * 1.25;
    const breakAngle = 0.3;
    const rotAngle = tSecs * 0.12; // slow rotation

    // Ring arc (never fully closes — break gap)
    ctx.beginPath();
    ctx.arc(cx, cy, ringR, rotAngle + breakAngle, rotAngle + Math.PI * 2 - breakAngle);
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 0.022 * (0.7 + phase * 0.5);
    ctx.lineCap = 'round';
    ctx.stroke();

    // Ring glow
    const ringGlow = ctx.createLinearGradient(cx - ringR, cy, cx + ringR, cy);
    ringGlow.addColorStop(0, 'transparent');
    ringGlow.addColorStop(0.5, color + '22');
    ringGlow.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
    ctx.strokeStyle = ringGlow;
    ctx.lineWidth = size * 0.08 * phase;
    ctx.stroke();
  }

  // ── TOPBAR GLYPH ──
  let glyphCanvas, animId;

  function createTopbarGlyph(currentRoom) {
    const SIZE = 34;
    const btn = document.createElement('button');
    btn.id = 'witness-btn';
    btn.title = 'Open constellation map';
    btn.setAttribute('aria-label', 'Open room navigation');
    btn.style.cssText = [
      'width:' + SIZE + 'px',
      'height:' + SIZE + 'px',
      'background:none',
      'border:none',
      'cursor:pointer',
      'padding:0',
      'flex-shrink:0',
      'display:flex',
      'align-items:center',
      'justify-content:center',
    ].join(';');

    glyphCanvas = document.createElement('canvas');
    glyphCanvas.width = SIZE * 2;
    glyphCanvas.height = SIZE * 2;
    glyphCanvas.style.cssText = 'width:' + SIZE + 'px;height:' + SIZE + 'px;display:block;';
    btn.appendChild(glyphCanvas);
    btn.addEventListener('click', toggleOverlay);
    return btn;
  }

  // ── ANIMATION LOOP ──
  let lastTs = null;
  function loop(ts) {
    if (!lastTs) lastTs = ts;
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;
    tSecs += dt;

    const bpm = bpmForLI(meanLI);
    const phase = breathPhase(tSecs, bpm, 0);

    if (glyphCanvas) {
      const SIZE = glyphCanvas.width;
      drawWitness(glyphCanvas, SIZE, phase, meanLI);
    }

    // Update overlay canvases
    document.querySelectorAll('.cn-room-canvas').forEach((c, i) => {
      const p = breathPhase(tSecs, bpm, i * 0.4);
      drawWitness(c, c.width, p, meanLI);
    });

    animId = requestAnimationFrame(loop);
  }

  // ── OVERLAY ──
  let overlayEl = null;
  let overlayOpen = false;

  function buildOverlay(currentRoom) {
    const ov = document.createElement('div');
    ov.id = 'cn-overlay';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-label', 'Room navigation');
    ov.style.cssText = [
      'position:fixed','inset:0','z-index:9999',
      'display:flex','flex-direction:column','align-items:center','justify-content:center',
      'background:rgba(15,14,12,0.94)',
      'backdrop-filter:blur(20px)',
      '-webkit-backdrop-filter:blur(20px)',
      'opacity:0','transition:opacity .25s ease',
    ].join(';');

    // Close on backdrop click
    ov.addEventListener('click', e => {
      if (e.target === ov) closeOverlay();
    });

    // Header — The Witness at 72px
    const header = document.createElement('div');
    header.style.cssText = 'display:flex;flex-direction:column;align-items:center;margin-bottom:36px;';

    const hCanvas = document.createElement('canvas');
    hCanvas.width = 144; hCanvas.height = 144;
    hCanvas.style.cssText = 'width:72px;height:72px;margin-bottom:10px;';
    hCanvas.classList.add('cn-room-canvas');
    header.appendChild(hCanvas);

    const hTitle = document.createElement('div');
    hTitle.textContent = 'The Witness';
    hTitle.style.cssText = 'font-family:Cormorant Garamond,Georgia,serif;font-size:20px;font-weight:600;color:#f4ebdf;letter-spacing:.02em;';
    header.appendChild(hTitle);

    const hSub = document.createElement('div');
    hSub.textContent = 'half human · half code · choose your room';
    hSub.style.cssText = 'font-size:11px;color:#7a7268;letter-spacing:.06em;margin-top:3px;font-family:IBM Plex Sans,monospace,sans-serif;';
    header.appendChild(hSub);

    ov.appendChild(header);

    // Room grid
    const grid = document.createElement('div');
    grid.style.cssText = [
      'display:grid',
      'grid-template-columns:repeat(3,1fr)',
      'gap:14px',
      'width:min(540px,90vw)',
    ].join(';');

    ROOMS.forEach((room, i) => {
      const isCurrent = room.id === currentRoom;
      const card = document.createElement('a');
      card.href = room.href;
      card.style.cssText = [
        'display:flex','flex-direction:column','align-items:center',
        'padding:16px 12px',
        'border-radius:16px',
        'border:1px solid',
        'border-color:' + (isCurrent ? room.color + '66' : 'rgba(212,160,74,0.18)'),
        'background:' + (isCurrent ? room.color + '0a' : 'rgba(29,25,21,0.6)'),
        'text-decoration:none',
        'transition:all .2s',
        'cursor:' + (isCurrent ? 'default' : 'pointer'),
      ].join(';');

      if (!isCurrent) {
        card.addEventListener('mouseenter', () => {
          card.style.borderColor = room.color + '88';
          card.style.background = room.color + '14';
        });
        card.addEventListener('mouseleave', () => {
          card.style.borderColor = 'rgba(212,160,74,0.18)';
          card.style.background = 'rgba(29,25,21,0.6)';
        });
      }

      // Mini canvas for each room node
      const miniCanvas = document.createElement('canvas');
      miniCanvas.width = 52; miniCanvas.height = 52;
      miniCanvas.style.cssText = 'width:26px;height:26px;margin-bottom:8px;';
      miniCanvas.classList.add('cn-room-canvas');
      card.appendChild(miniCanvas);

      const label = document.createElement('div');
      label.textContent = room.label;
      label.style.cssText = [
        'font-size:12px','font-weight:600','text-align:center',
        'color:' + (isCurrent ? room.color : '#f4ebdf'),
        'font-family:IBM Plex Sans,sans-serif',
        'margin-bottom:4px',
      ].join(';');
      card.appendChild(label);

      const desc = document.createElement('div');
      desc.textContent = room.desc;
      desc.style.cssText = 'font-size:10px;color:#7a7268;text-align:center;font-family:IBM Plex Sans,sans-serif;line-height:1.4;';
      card.appendChild(desc);

      if (isCurrent) {
        const cur = document.createElement('div');
        cur.textContent = 'you are here';
        cur.style.cssText = 'font-size:9px;text-transform:uppercase;letter-spacing:.06em;color:' + room.color + ';margin-top:5px;font-family:IBM Plex Sans,sans-serif;';
        card.appendChild(cur);
      }

      grid.appendChild(card);
    });

    ov.appendChild(grid);

    // ESC to close
    const escHint = document.createElement('div');
    escHint.textContent = 'ESC to close';
    escHint.style.cssText = 'margin-top:28px;font-size:11px;color:#7a7268;font-family:IBM Plex Sans,monospace,sans-serif;';
    ov.appendChild(escHint);

    return ov;
  }

  function openOverlay() {
    if (!overlayEl) return;
    overlayEl.style.display = 'flex';
    requestAnimationFrame(() => { overlayEl.style.opacity = '1'; });
    overlayOpen = true;
    document.body.style.overflow = 'hidden';
  }

  function closeOverlay() {
    if (!overlayEl) return;
    overlayEl.style.opacity = '0';
    setTimeout(() => {
      if (overlayEl) overlayEl.style.display = 'none';
      overlayOpen = false;
      document.body.style.overflow = '';
    }, 250);
  }

  function toggleOverlay() {
    overlayOpen ? closeOverlay() : openOverlay();
  }

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlayOpen) closeOverlay();
  });

  // ── INIT ──
  function init() {
    const script = document.currentScript || document.querySelector('script[src*="constellation-nav"]');
    const currentRoom = (script && script.dataset.room) || 'home';

    // Find or create topbar brand area
    const brandEl = document.querySelector('.brand, .topbar .brand-mark, .topbar');
    if (!brandEl) return; // no topbar — skip

    // Insert witness button into topbar
    const witnessBtn = createTopbarGlyph(currentRoom);
    const topbarInner = document.querySelector('.topbar-inner');
    if (topbarInner) {
      // Insert before the first nav element if present
      const firstNav = topbarInner.querySelector('a:not(.brand)');
      if (firstNav) {
        topbarInner.insertBefore(witnessBtn, firstNav);
      } else {
        topbarInner.appendChild(witnessBtn);
      }
    }

    // Build overlay
    overlayEl = buildOverlay(currentRoom);
    overlayEl.style.display = 'none';
    document.body.appendChild(overlayEl);

    // Start loop
    requestAnimationFrame(loop);

    // Observe LI changes from Observatory live fetch
    // Called via: window._cnUpdateLI(0.8632)
  }

  // Public API
  window._cnUpdateLI = function(newLI) {
    meanLI = parseFloat(newLI) || 0.8632;
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

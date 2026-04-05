/**
 * witness-nav.js · The Witness Navigation System · v3.0
 * FDS: F2-Building Block | Parent: CUSTOM_INSTRUCTIONS_V3_6_ORD.md | Status: ACTIVE
 * OR&D Day 25 · April 2026 · MagicPatterns-enhanced · vanilla JS
 *
 * Converted from MagicPatterns React/framer-motion (zip2: TheWitness.tsx)
 * to a standalone injectable IIFE — no dependencies.
 *
 * Fixed bottom-LEFT corner (◌ button + "Navigate ◌" label always visible).
 * Panel slides up on click with spring-like easing.
 * Dynamic OR&D day counter from 2026-03-11.
 */
(function() {
  'use strict';

  if (document.querySelector('.wit-v3-wrap')) return; // prevent double inject

  // ── SITE MAP ──────────────────────────────────────────────────────────
  const NAV_GROUPS = [
    { label: null, items: [
      { id: 'home', href: 'index.html', name: 'Home', desc: 'Platform overview & live stats', icon: '◌' }
    ]},
    { label: 'UNDERSTAND', items: [
      { id: 'how', href: 'how-it-works.html', name: 'How It Works', desc: 'Plain-language ACAT guide', icon: '⬡' },
      { id: 'why', href: 'why-it-matters.html', name: 'Why It Matters', desc: 'Research context & stakes', icon: '⬡' },
      { id: 'method', href: 'methodology.html', name: 'For Researchers', desc: 'Protocol · schema · findings', icon: '⬡' }
    ]},
    { label: 'EXPLORE', items: [
      { id: 'obs', href: 'observatory.html', name: 'Observatory', desc: 'Live dataset visualization', icon: '⬡' },
      { id: 'tide', href: 'lumina-tide-pool.html', name: 'Lumina Tide Pool', desc: 'Behavioral sigils & baseline', icon: '⬡' },
      { id: 'lantern', href: 'lantern-room.html', name: 'Lantern Room', desc: 'Calibration gap analysis', icon: '⬡' }
    ]},
    { label: 'PARTICIPATE', items: [
      { id: 'acat', href: 'acat-assessment-tool.html', name: 'Take ACAT', desc: 'Run a calibration · ~20 min', icon: '⬡' },
      { id: 'ent', href: 'acat-enterprise.html', name: 'Enterprise', desc: 'Structured audit for deployed AI', icon: '⬡' }
    ]}
  ];

  // ── HELPERS ───────────────────────────────────────────────────────────
  function currentPage() {
    return window.location.pathname.split('/').pop() || 'index.html';
  }
  function ordDay() {
    return Math.floor((new Date() - new Date('2026-03-11')) / 86400000) + 1;
  }

  // ── CSS ───────────────────────────────────────────────────────────────
  const CSS = `
    .wit-v3-wrap {
      position: fixed; bottom: 20px; left: 20px; z-index: 9999;
      display: flex; flex-direction: column; align-items: flex-start;
    }
    /* Panel */
    .wit-v3-panel {
      position: absolute; bottom: calc(100% + 14px); left: 0;
      width: 260px; max-height: 80vh;
      display: flex; flex-direction: column;
      background: #1d1915; border: 1px solid rgba(212,160,74,.32);
      border-radius: 14px; overflow: hidden;
      box-shadow: 0 -8px 40px rgba(0,0,0,.62), 0 0 40px rgba(212,160,74,.06);
      opacity: 0; transform: translateY(10px) scale(.97);
      pointer-events: none;
      transition: opacity .22s cubic-bezier(.34,1.56,.64,1),
                  transform .22s cubic-bezier(.34,1.56,.64,1);
      transform-origin: bottom left;
    }
    .wit-v3-panel.open {
      opacity: 1; transform: translateY(0) scale(1); pointer-events: auto;
    }
    /* Panel header */
    .wit-v3-ph {
      padding: 14px 16px 10px; border-bottom: 1px solid rgba(212,160,74,.18);
      background: linear-gradient(135deg,rgba(212,160,74,.08),transparent);
      flex-shrink: 0;
    }
    .wit-v3-pt {
      font-family: 'IBM Plex Mono',monospace; font-size: .75rem;
      color: #d4a04a; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 3px;
    }
    .wit-v3-pd {
      font-family: 'IBM Plex Mono',monospace; font-size: .68rem; color: #7a7268;
    }
    /* Nav scroll area */
    .wit-v3-scroll {
      flex: 1; overflow-y: auto; padding: 4px 0;
    }
    .wit-v3-scroll::-webkit-scrollbar { width: 4px; }
    .wit-v3-scroll::-webkit-scrollbar-track { background: transparent; }
    .wit-v3-scroll::-webkit-scrollbar-thumb { background: rgba(212,160,74,.2); border-radius: 4px; }
    .wit-v3-scroll::-webkit-scrollbar-thumb:hover { background: rgba(212,160,74,.4); }
    /* Group label */
    .wit-v3-gl {
      font-family: 'Cormorant Garamond','IBM Plex Mono',serif;
      font-size: .65rem; color: #7a7268; text-transform: uppercase;
      letter-spacing: .12em; font-weight: 700; padding: 10px 16px 4px;
    }
    /* Nav link */
    .wit-v3-link {
      display: flex; align-items: flex-start; gap: 10px;
      padding: 7px 16px; text-decoration: none; cursor: pointer;
      border-left: 2px solid transparent; background: transparent;
      width: 100%; border-top: none; border-right: none; border-bottom: none;
      transition: background .12s, border-left-color .12s;
    }
    .wit-v3-link:hover { background: rgba(212,160,74,.04); border-left-color: rgba(212,160,74,.38); }
    .wit-v3-link.active { background: rgba(212,160,74,.06); border-left-color: #d4a04a; }
    .wit-v3-link:focus-visible { outline: 2px solid rgba(212,160,74,.5); outline-offset: -2px; }
    .wit-v3-icon { color: #d4a04a; font-size: .8rem; margin-top: 2px; flex-shrink: 0; }
    .wit-v3-ln { font-family: 'IBM Plex Mono',monospace; font-size: .86rem; color: #f4ebdf; line-height: 1.2; }
    .wit-v3-link.active .wit-v3-ln::after { content: ' ←'; color: #d4a04a; }
    .wit-v3-ld { font-family: 'IBM Plex Mono',monospace; font-size: .72rem; color: #7a7268; margin-top: 2px; line-height: 1.3; }
    /* Panel footer */
    .wit-v3-pf {
      border-top: 1px solid rgba(212,160,74,.18); padding: 8px 16px;
      display: flex; justify-content: space-between; align-items: center;
      flex-shrink: 0; background: #1d1915;
    }
    .wit-v3-pfl { display: flex; align-items: center; gap: 6px; }
    .wit-v3-dot {
      width: 6px; height: 6px; border-radius: 50%; background: #87b68b;
      box-shadow: 0 0 5px #87b68b; animation: wit-dot 2s ease-in-out infinite;
    }
    @keyframes wit-dot { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:.4;transform:scale(.8);} }
    .wit-v3-pft { font-family:'IBM Plex Mono',monospace; font-size:.6rem; color:#7a7268; }

    /* Button row */
    .wit-v3-btn-row {
      display: flex; align-items: center; gap: 12px; position: relative;
    }
    /* Pulse ring */
    .wit-v3-pulse {
      position: absolute; left: 0; top: 0; width: 52px; height: 52px;
      border-radius: 50%; border: 1px solid rgba(212,160,74,.15);
      pointer-events: none; animation: wit-ring 6s ease-in-out infinite;
    }
    @keyframes wit-ring {
      0%  { width:52px;height:52px;opacity:1; }
      25% { width:80px;height:80px;left:-14px;top:-14px;opacity:0; }
      100%{ width:80px;height:80px;left:-14px;top:-14px;opacity:0; }
    }
    /* Button */
    .wit-v3-btn {
      width: 52px; height: 52px; border-radius: 50%;
      background: #0f0e0c; border: 1px solid rgba(212,160,74,.3);
      color: #d4a04a; font-size: 1.4rem; line-height: 1;
      cursor: pointer; display: grid; place-items: center;
      box-shadow: 0 0 20px rgba(212,160,74,.14); position: relative; z-index: 1;
      transition: box-shadow .25s, transform .22s;
      animation: wit-slow 4s ease-in-out infinite;
    }
    @keyframes wit-slow { 0%,100%{transform:scale(1);}50%{transform:scale(1.04);} }
    .wit-v3-btn:hover, .wit-v3-btn:focus-visible {
      box-shadow: 0 0 32px rgba(212,160,74,.34); outline: none;
    }
    .wit-v3-btn.rotated { transform: rotate(180deg); animation: none; }
    /* Text label */
    .wit-v3-label {
      font-family: 'IBM Plex Mono',monospace; font-size: .65rem;
      color: rgba(212,160,74,.58); letter-spacing: .1em; white-space: nowrap;
      transition: opacity .25s;
    }
    @media(max-width:480px){
      .wit-v3-wrap { bottom: 14px; left: 14px; }
      .wit-v3-panel { width: calc(100vw - 28px); }
      .wit-v3-label { display: none; }
    }
  `;

  // ── BUILD ─────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  const page = currentPage();
  const wrap = document.createElement('div');
  wrap.className = 'wit-v3-wrap';
  wrap.setAttribute('role', 'navigation');
  wrap.setAttribute('aria-label', 'Witness site navigation');

  // Build nav HTML
  let navHTML = '';
  NAV_GROUPS.forEach(group => {
    if (group.label) navHTML += `<div class="wit-v3-gl">${group.label}</div>`;
    group.items.forEach(item => {
      const active = item.href === page;
      navHTML += `<a class="wit-v3-link${active?' active':''}" href="${item.href}"
        role="menuitem" ${active?'aria-current="page"':''}>
        <span class="wit-v3-icon">${item.icon}</span>
        <div>
          <div class="wit-v3-ln">${item.name}</div>
          <div class="wit-v3-ld">${item.desc}</div>
        </div>
      </a>`;
    });
  });

  wrap.innerHTML = `
    <div class="wit-v3-panel" id="wit-panel" role="menu" aria-hidden="true">
      <div class="wit-v3-ph">
        <div class="wit-v3-pt">◌ The Witness</div>
        <div class="wit-v3-pd">HumanAIOS · Behavioral Observability</div>
      </div>
      <div class="wit-v3-scroll">${navHTML}</div>
      <div class="wit-v3-pf">
        <div class="wit-v3-pfl">
          <div class="wit-v3-dot"></div>
          <span class="wit-v3-pft">OR&amp;D Phase · Day <span id="wit-day">${ordDay()}</span></span>
        </div>
        <span class="wit-v3-pft">N = 630 / 517 / 308</span>
      </div>
    </div>
    <div class="wit-v3-btn-row">
      <div class="wit-v3-pulse"></div>
      <button class="wit-v3-btn" id="wit-btn"
        aria-haspopup="true" aria-expanded="false" aria-controls="wit-panel"
        aria-label="Open site navigation">◌</button>
      <span class="wit-v3-label">Navigate ◌</span>
    </div>
  `;

  document.body.appendChild(wrap);

  // ── BEHAVIOUR ─────────────────────────────────────────────────────────
  const btn = document.getElementById('wit-btn');
  const panel = document.getElementById('wit-panel');
  let open = false;

  function setOpen(state) {
    open = state;
    btn.setAttribute('aria-expanded', String(state));
    panel.setAttribute('aria-hidden', String(!state));
    panel.classList.toggle('open', state);
    btn.classList.toggle('rotated', state);
  }

  btn.addEventListener('click', () => setOpen(!open));

  document.addEventListener('click', e => {
    if (open && !wrap.contains(e.target)) setOpen(false);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && open) { setOpen(false); btn.focus(); }
  });

  // Day counter update
  const dayEl = document.getElementById('wit-day');
  if (dayEl) dayEl.textContent = ordDay();

})();

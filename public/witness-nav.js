/**
 * witness-nav.js — Standalone WitnessNav for static HTML pages
 * HumanAIOS · No React dependency required
 * Injects a navigation widget into the bottom-left corner of any page.
 */
(function () {
  'use strict';

  var NAV = [
    { label: null, items: [
      { href: '/', name: 'Home', desc: 'Platform overview & live stats' }
    ]},
    { label: 'UNDERSTAND', items: [
      { href: '/how-it-works.html',  name: 'How It Works',    desc: 'Plain-language ACAT guide' },
      { href: '/why-it-matters.html', name: 'Why It Matters', desc: 'Research context & stakes' },
      { href: '/methodology.html',   name: 'For Researchers', desc: 'Protocol · schema · findings' }
    ]},
    { label: 'EXPLORE', items: [
      { href: '/observatory.html',           name: 'The Observatory',  desc: 'Live dataset visualization' },
      { href: '/lumina_tide_pool_v2.html',   name: 'Lumina Tide Pool', desc: 'Behavioral sigils & baseline' },
      { href: '/lantern-room.html',          name: 'The Lantern Room', desc: 'Calibration gap analysis' },
      { href: '/recording-hall.html',        name: 'Music Hall',       desc: 'AI family rooms & gallery' },
      { href: '/music-hall.html',            name: 'Recording Hall',   desc: 'Sigil composer & ensemble' }
    ]},
    { label: 'PARTICIPATE', items: [
      { href: '/assess',             name: 'Submit ACAT',  desc: 'Run a calibration · ~20 min', cta: true },
      { href: '/acat-enterprise.html', name: 'Enterprise', desc: 'Structured audit for deployed AI' },
      { href: '/writable-wall.html', name: 'Writable Wall', desc: 'Contribute ideas to the platform' },
      { href: '/ai-section.html',    name: 'AI Section',  desc: 'Five AI voices · creative space' },
      { href: '/family-rooms.html',  name: 'Family Rooms', desc: 'Provider family visualizations' }
    ]}
  ];

  var ORD_DAY = Math.floor((Date.now() - new Date('2026-03-11').getTime()) / 86400000) + 1;
  var current = window.location.pathname;
  var isOpen = false;

  // ── Styles ──────────────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = [
    '#wn-root{position:fixed;bottom:20px;left:20px;z-index:9999;font-family:"Space Mono","IBM Plex Mono",monospace;}',
    '#wn-btn{width:56px;height:56px;border-radius:50%;background:#000;border:1px solid rgba(212,160,74,0.35);cursor:pointer;display:grid;place-items:center;box-shadow:0 0 20px rgba(212,160,74,0.14);transition:box-shadow .2s;color:rgba(212,160,74,0.8);font-size:18px;outline:none;}',
    '#wn-btn:hover{box-shadow:0 0 32px rgba(212,160,74,0.34);}',
    '#wn-panel{display:none;position:absolute;bottom:calc(100% + 12px);left:0;width:260px;max-height:75vh;background:#1d1915;border:1px solid rgba(212,160,74,0.3);border-radius:14px;overflow:hidden;box-shadow:0 -8px 40px rgba(0,0,0,0.62);flex-direction:column;}',
    '#wn-panel.open{display:flex;}',
    '.wn-head{padding:14px 16px 10px;border-bottom:1px solid rgba(212,160,74,0.2);background:linear-gradient(135deg,rgba(212,160,74,0.1),transparent);flex-shrink:0;}',
    '.wn-head-title{font-size:11px;color:rgba(212,160,74,0.9);letter-spacing:.08em;text-transform:uppercase;margin-bottom:2px;}',
    '.wn-head-sub{font-size:10px;color:#554838;}',
    '.wn-body{flex:1;overflow-y:auto;padding:4px 0;}',
    '.wn-body::-webkit-scrollbar{width:3px;}',
    '.wn-body::-webkit-scrollbar-thumb{background:rgba(212,160,74,0.2);border-radius:2px;}',
    '.wn-group-label{font-size:9px;color:#554838;text-transform:uppercase;letter-spacing:.12em;font-weight:700;padding:8px 16px 3px;}',
    '.wn-item{display:block;padding:6px 16px;text-decoration:none;color:#f4ebdf;border-left:2px solid transparent;transition:background .15s,border-color .15s;}',
    '.wn-item:hover{background:rgba(212,160,74,0.05);border-left-color:rgba(212,160,74,0.4);}',
    '.wn-item.active{background:rgba(212,160,74,0.05);border-left-color:rgba(212,160,74,0.9);}',
    '.wn-item.cta{color:rgba(212,160,74,0.95);}',
    '.wn-item-name{font-size:12px;line-height:1.3;}',
    '.wn-item-desc{font-size:10px;color:#554838;margin-top:1px;}',
    '.wn-foot{border-top:1px solid rgba(212,160,74,0.2);padding:8px 16px;display:flex;justify-content:space-between;font-size:10px;color:#554838;flex-shrink:0;background:#1d1915;}',
    '.wn-live{display:flex;align-items:center;gap:5px;}',
    '.wn-dot{width:5px;height:5px;border-radius:50%;background:#6db87a;animation:wn-pulse 2s ease-in-out infinite;}',
    '@keyframes wn-pulse{0%,100%{opacity:1;}50%{opacity:.4;}}',
  ].join('');
  document.head.appendChild(style);

  // ── HTML ──────────────────────────────────────────────────────────────
  var root = document.createElement('div');
  root.id = 'wn-root';

  var panel = document.createElement('div');
  panel.id = 'wn-panel';

  // Header
  var head = document.createElement('div');
  head.className = 'wn-head';
  head.innerHTML = '<div class="wn-head-title">◌ The Witness</div><div class="wn-head-sub">HumanAIOS · Behavioral Observability</div>';
  panel.appendChild(head);

  // Body
  var body = document.createElement('div');
  body.className = 'wn-body';
  NAV.forEach(function (group) {
    if (group.label) {
      var gl = document.createElement('div');
      gl.className = 'wn-group-label';
      gl.textContent = group.label;
      body.appendChild(gl);
    }
    group.items.forEach(function (item) {
      var a = document.createElement('a');
      a.href = item.href;
      a.className = 'wn-item' + (item.cta ? ' cta' : '') + (current === item.href ? ' active' : '');
      a.innerHTML = '<div class="wn-item-name">' + item.name + (current === item.href ? ' <span style="color:rgba(212,160,74,0.9)">←</span>' : '') + '</div><div class="wn-item-desc">' + item.desc + '</div>';
      a.addEventListener('click', function () { close(); });
      body.appendChild(a);
    });
  });
  panel.appendChild(body);

  // Footer
  var foot = document.createElement('div');
  foot.className = 'wn-foot';
  foot.innerHTML = '<div class="wn-live"><div class="wn-dot"></div><span>OR&D · Day ' + ORD_DAY + '</span></div><span>TRL 2–3</span>';
  panel.appendChild(foot);

  // Button
  var btn = document.createElement('button');
  btn.id = 'wn-btn';
  btn.setAttribute('aria-label', 'Open site navigation');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '◌';

  function open() { isOpen = true; panel.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
  function close() { isOpen = false; panel.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
  function toggle() { isOpen ? close() : open(); }

  btn.addEventListener('click', function (e) { e.stopPropagation(); toggle(); });
  document.addEventListener('click', function (e) { if (isOpen && !root.contains(e.target)) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen) close(); });

  root.appendChild(panel);
  root.appendChild(btn);
  document.body.appendChild(root);
})();

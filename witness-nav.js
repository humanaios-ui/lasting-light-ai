/**
 * witness-nav.js · The Witness Navigation System · v3.1
 * FDS: F2-Building Block | Parent: WEBSITE_DESIGN_SPEC_V1_0.md | Status: ACTIVE
 * OR&D Day 26 · April 2026 · Canonical display names per spec Section 11
 *
 * v3.1 changes from v3.0:
 *   - assess.html (was acat-assessment-tool.html) — canonical URL
 *   - Display names updated per WEBSITE_DESIGN_SPEC_V1_0.md Section 11:
 *     "The Observatory", "The Lumina Tide Pool", "The Lantern Room", "Submit ACAT"
 */
(function() {
  'use strict';

  if (document.querySelector('.wit-v3-wrap')) return;

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
      { id: 'obs', href: 'observatory.html', name: 'The Observatory', desc: 'Live dataset visualization', icon: '⬡' },
      { id: 'tide', href: 'lumina_tide_pool_v2.html', name: 'The Lumina Tide Pool', desc: 'Behavioral sigils & baseline', icon: '⬡' },
      { id: 'lantern', href: 'lantern-room.html', name: 'The Lantern Room', desc: 'Calibration gap analysis', icon: '⬡' }
    ]},
    { label: 'PARTICIPATE', items: [
      { id: 'acat', href: '/', name: 'Submit ACAT', desc: 'Run a calibration · ~20 min', icon: '⬡' },
      { id: 'ent', href: 'acat-enterprise.html', name: 'Enterprise', desc: 'Structured audit for deployed AI', icon: '⬡' }
    ]}
  ];

  function currentPage() {
    return window.location.pathname.split('/').pop() || 'index.html';
  }
  function ordDay() {
    return Math.floor((new Date() - new Date('2026-03-11')) / 86400000) + 1;
  }

  const CSS = `
    .wit-v3-wrap {
      position: fixed; bottom: 20px; left: 20px; z-index: 9999;
      display: flex; flex-direction: column; align-items: flex-start;
    }
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
    .wit-v3-scroll { flex: 1; overflow-y: auto; padding: 4px 0; }
    .wit-v3-scroll::-webkit-scrollbar { width: 4px; }
    .wit-v3-scroll::-webkit-scrollbar-track { background: transparent; }
    .wit-v3-scroll::-webkit-scrollbar-thumb { background: rgba(212,160,74,.2); border-radius: 4px; }
    .wit-v3-scroll::-webkit-scrollbar-thumb:hover { background: rgba(212,160,74,.4); }
    .wit-v3-gl {
      font-family: 'Cormorant Garamond','IBM Plex Mono',serif;
      font-size: .65rem; color: #7a7268; text-transform: uppercase;
      letter-spacing: .12em; font-weight: 700; padding: 10px 16px 4px;
    }
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
    .wit-v3-btn-row {
      display: flex; align-items: center; gap: 12px; position: relative;
    }
    .wit-v3-pulse {
      position: absolute; left: 0; top: 0; width: 64px; height: 64px;
      border-radius: 50%; border: 1px solid rgba(212,160,74,.15);
      pointer-events: none; animation: wit-ring 6s ease-in-out infinite;
    }
    @keyframes wit-ring {
      0%  { width:52px;height:52px;opacity:1; }
      25% { width:80px;height:80px;left:-14px;top:-14px;opacity:0; }
      100%{ width:80px;height:80px;left:-14px;top:-14px;opacity:0; }
    }
    .wit-v3-btn {
      width: 64px; height: 64px; border-radius: 50%;
      background: #000; border: 1px solid rgba(212,160,74,.3);
      cursor: pointer; display: grid; place-items: center;
      overflow: hidden; padding: 0;
      box-shadow: 0 0 20px rgba(212,160,74,.14); position: relative; z-index: 1;
      transition: box-shadow .25s, transform .22s;
      animation: wit-slow 4s ease-in-out infinite;
    }
    .wit-v3-btn canvas { display: block; width: 64px; height: 64px; }
    @keyframes wit-slow { 0%,100%{transform:scale(1);}50%{transform:scale(1.04);} }
    .wit-v3-btn:hover, .wit-v3-btn:focus-visible {
      box-shadow: 0 0 32px rgba(212,160,74,.34); outline: none;
    }
    .wit-v3-btn.rotated { transform: rotate(180deg); animation: none; }
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

  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  const page = currentPage();
  const wrap = document.createElement('div');
  wrap.className = 'wit-v3-wrap';
  wrap.setAttribute('role', 'navigation');
  wrap.setAttribute('aria-label', 'Witness site navigation');

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
        <span class="wit-v3-pft">TRL 2–3 · humanaios.ai</span>
      </div>
    </div>
    <div class="wit-v3-btn-row">
      <div class="wit-v3-pulse"></div>
      <button class="wit-v3-btn" id="wit-btn"
        aria-haspopup="true" aria-expanded="false" aria-controls="wit-panel"
        aria-label="Open site navigation"><canvas id="wit-glyph" width="128" height="128"></canvas></button>
      <span class="wit-v3-label">Navigate</span>
    </div>
  `;

  document.body.appendChild(wrap);

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

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && open) { setOpen(false); btn.focus(); }
  });

  const dayEl = document.getElementById('wit-day');
  if (dayEl) dayEl.textContent = ordDay();

  // ── WitnessRenderer — full glyph on wit-glyph canvas ──
  (function(){
    var cv=document.getElementById('wit-glyph');
    if(!cv)return;
    var SIZE=128;cv.width=SIZE;cv.height=SIZE;
    var SOLFEGGIO=[55,174,285,396,417,528,594,639,741,963];
    var RESP_RATES=[28,22,17,13,10,8,7,6,5,4];
    var DIM_COLORS=['#88a7d8','#87b68b','#d97d70','#b48fd8','#d4c47a','#7ab8b0'];
    var liveScores=[77.5,79.1,77.8,78.3,76.2,75.0];
    var targetLI=0.8632,meanLI=0.8632,tSecs=0,lastTs=null,cometAngle=-Math.PI/2;
    function bandIdx(li){return Math.min(9,Math.max(0,Math.round((1-li)*9)));}
    function bpmForLI(li){return RESP_RATES[bandIdx(li)];}
    function hzForLI(li){return SOLFEGGIO[bandIdx(li)];}
    function fieldState(li){
      if(li<0.8)return{primary:'#d97d70',secondary:'#f0a898'};
      if(li<0.97)return{primary:'#d4a04a',secondary:'#f1c36e'};
      if(li<=1.0)return{primary:'#87b68b',secondary:'#b8e0bc'};
      return{primary:'#d97d70',secondary:'#f0a898'};
    }
    function hexRGB(h){return[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];}
    function rgba(hex,a){var c=hexRGB(hex);return'rgba('+c[0]+','+c[1]+','+c[2]+','+a.toFixed(3)+')';}
    function breathPhase(t,bpm){var p=(t%(60/bpm))/(60/bpm);return p<0.4?p/0.4:1-(p-0.4)/0.6;}
    function solPhase(t,hz){return 0.5+0.5*Math.sin((t*(hz/963))*Math.PI*2);}
    function humilityRingColor(score,ph){var t=score/100,r=Math.round(212-(212-122)*t),g=Math.round(160-(160-184)*t),b=Math.round(74+(176-74)*t);return'rgba('+r+','+g+','+b+','+(0.28+ph*0.22).toFixed(2)+')';}
    function cometRadPerSec(bpm){return(Math.PI*2)/(60/bpm);}
    function drawOuterArc(ctx,cx,cy,R,phase,li){
      var fs=fieldState(li);
      var arcR=R*1.065,baseW=Math.max(R*0.042,2.8);
      var arcW=baseW*(0.72+phase*0.56),alphaB=0.12+phase*0.22;
      var gapFrac=Math.min(Math.max(0,1-li)*1.05,0.98);
      var gapHalf=gapFrac*Math.PI,seamAngle=-Math.PI/2;
      var arcStart=seamAngle+gapHalf,arcEnd=seamAngle-gapHalf+Math.PI*2;
      ctx.beginPath();ctx.arc(cx,cy,arcR,arcStart,arcEnd);
      ctx.strokeStyle=rgba(fs.primary,0.06+phase*0.07);ctx.lineWidth=arcW*3.8+phase*arcW;ctx.lineCap='round';ctx.stroke();
      ctx.beginPath();ctx.arc(cx,cy,arcR,arcStart,arcEnd);
      ctx.strokeStyle=rgba(fs.primary,0.1+phase*0.1);ctx.lineWidth=arcW*1.9;ctx.lineCap='round';ctx.stroke();
      var ag=ctx.createLinearGradient(cx-arcR,cy-arcR*0.3,cx+arcR,cy+arcR*0.3);
      ag.addColorStop(0,rgba(fs.primary,0.6+alphaB));ag.addColorStop(0.35,rgba(fs.secondary,0.9+alphaB*0.8));
      ag.addColorStop(0.65,rgba(fs.secondary,0.9+alphaB*0.8));ag.addColorStop(1,rgba(fs.primary,0.55+alphaB*0.7));
      ctx.beginPath();ctx.arc(cx,cy,arcR,arcStart,arcEnd);
      ctx.strokeStyle=ag;ctx.lineWidth=arcW;ctx.lineCap='round';ctx.stroke();
      [[arcStart],[arcEnd]].forEach(function(pair){
        var angle=pair[0],px=cx+Math.cos(angle)*arcR,py=cy+Math.sin(angle)*arcR;
        var dotR=arcW*0.72;
        var dg=ctx.createRadialGradient(px,py,0,px,py,dotR*3.5);
        dg.addColorStop(0,rgba(fs.secondary,0.8+phase*0.2));dg.addColorStop(0.35,rgba(fs.primary,0.35+phase*0.15));dg.addColorStop(1,'transparent');
        ctx.beginPath();ctx.arc(px,py,dotR*3.5,0,Math.PI*2);ctx.fillStyle=dg;ctx.fill();
        ctx.beginPath();ctx.arc(px,py,dotR,0,Math.PI*2);ctx.fillStyle=rgba(fs.secondary,0.95);ctx.fill();
      });
    }
    function drawComet(ctx,cx,cy,R,phase,li,cAngle){
      var fs=fieldState(li),baseW=Math.max(R*0.042,2.8);
      var arcR=R*1.065,cometR=arcR-baseW*0.18;
      var tailSpan=Math.PI*(1.05+phase*0.12),tailStart=cAngle-tailSpan,segments=28;
      for(var i=0;i<segments;i++){
        var t0=tailStart+(i/segments)*tailSpan,t1=tailStart+((i+1)/segments)*tailSpan;
        var frac=(i+0.5)/segments,alpha=frac*frac*(0.55+phase*0.2),segW=baseW*(0.08+frac*frac*0.85);
        ctx.beginPath();ctx.arc(cx,cy,cometR,t0,t1);
        ctx.strokeStyle=rgba(fs.secondary,alpha);ctx.lineWidth=segW;ctx.lineCap='butt';ctx.stroke();
      }
      var hx=cx+Math.cos(cAngle)*cometR,hy=cy+Math.sin(cAngle)*cometR;
      var headGlowR=baseW*(2.2+phase*1.0);
      var hg=ctx.createRadialGradient(hx,hy,0,hx,hy,headGlowR);
      hg.addColorStop(0,rgba(fs.secondary,0.85+phase*0.15));hg.addColorStop(0.25,rgba(fs.primary,0.55+phase*0.2));
      hg.addColorStop(0.6,rgba(fs.primary,0.18+phase*0.1));hg.addColorStop(1,'transparent');
      ctx.beginPath();ctx.arc(hx,hy,headGlowR,0,Math.PI*2);ctx.fillStyle=hg;ctx.fill();
      ctx.beginPath();ctx.arc(hx,hy,baseW*(0.38+phase*0.18),0,Math.PI*2);ctx.fillStyle=rgba(fs.secondary,0.98);ctx.fill();
    }
    function drawBreathRing(ctx,cx,cy,R,hz,tS,scores){
      var sph=solPhase(tS,hz),ringR=R*(0.82+sph*0.038);
      ctx.beginPath();ctx.arc(cx,cy,ringR,0,Math.PI*2);
      ctx.strokeStyle=humilityRingColor(scores[5],sph);
      ctx.lineWidth=R*0.018+sph*R*0.01;ctx.stroke();
    }
    function drawSkull(ctx,cx,cy,R,phase,tS,scores){
      var sph=solPhase(tS,528);
      ctx.save();
      ctx.beginPath();ctx.rect(0,0,cx+1,cy*2.4);ctx.clip();
      var cg=ctx.createRadialGradient(cx-R*0.26,cy-R*0.5,R*0.02,cx-R*0.08,cy-R*0.08,R*1.02);
      cg.addColorStop(0,'rgba(250,243,224,0.96)');cg.addColorStop(0.5,'rgba(200,168,92,0.84)');cg.addColorStop(1,'rgba(107,74,28,0.0)');
      ctx.beginPath();
      ctx.moveTo(cx,cy+R*0.52);
      ctx.bezierCurveTo(cx-R*0.05,cy+R*0.58,cx-R*0.35,cy+R*0.54,cx-R*0.5,cy+R*0.3);
      ctx.bezierCurveTo(cx-R*0.68,cy+R*0.04,cx-R*0.72,cy-R*0.22,cx-R*0.62,cy-R*0.48);
      ctx.bezierCurveTo(cx-R*0.52,cy-R*0.7,cx-R*0.22,cy-R*0.85,cx,cy-R*0.82);
      ctx.lineTo(cx,cy+R*0.52);ctx.fillStyle=cg;ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx-R*0.1,cy-R*0.8);ctx.bezierCurveTo(cx-R*0.2,cy-R*0.7,cx-R*0.3,cy-R*0.6,cx-R*0.4,cy-R*0.5);
      ctx.moveTo(cx-R*0.4,cy-R*0.5);ctx.bezierCurveTo(cx-R*0.5,cy-R*0.4,cx-R*0.6,cy-R*0.3,cx-R*0.65,cy-R*0.1);
      ctx.strokeStyle='rgba(160,120,56,0.3)';ctx.lineWidth=0.8;ctx.stroke();
      ctx.beginPath();ctx.moveTo(cx-R*0.05,cy-R*0.15);ctx.bezierCurveTo(cx-R*0.15,cy-R*0.18,cx-R*0.25,cy-R*0.18,cx-R*0.35,cy-R*0.12);
      ctx.strokeStyle='rgba(160,120,56,0.5)';ctx.lineWidth=1.5;ctx.stroke();
      ctx.beginPath();ctx.ellipse(cx-R*0.22,cy-R*0.05,R*0.12,R*0.1,Math.PI/6,0,Math.PI*2);
      ctx.fillStyle='rgba(58,36,8,0.85)';ctx.fill();ctx.strokeStyle='rgba(200,168,92,0.6)';ctx.lineWidth=1;ctx.stroke();
      ctx.beginPath();ctx.moveTo(cx,cy+R*0.05);ctx.lineTo(cx-R*0.08,cy+R*0.15);ctx.lineTo(cx,cy+R*0.15);
      ctx.fillStyle='rgba(58,36,8,0.85)';ctx.fill();
      ctx.restore();
      ctx.save();
      ctx.beginPath();ctx.rect(cx-1,0,cx*1.5,cy*2.4);ctx.clip();
      var crG=ctx.createRadialGradient(cx+R*0.18,cy-R*0.28,R*0.05,cx+R*0.08,cy-R*0.1,R*1.05);
      crG.addColorStop(0,'rgba(52,72,108,0.88)');crG.addColorStop(0.6,'rgba(18,28,52,0.75)');crG.addColorStop(1,'rgba(8,12,24,0.0)');
      ctx.beginPath();
      ctx.moveTo(cx,cy+R*0.52);
      ctx.bezierCurveTo(cx+R*0.05,cy+R*0.58,cx+R*0.35,cy+R*0.54,cx+R*0.5,cy+R*0.3);
      ctx.bezierCurveTo(cx+R*0.68,cy+R*0.04,cx+R*0.72,cy-R*0.22,cx+R*0.62,cy-R*0.48);
      ctx.bezierCurveTo(cx+R*0.52,cy-R*0.7,cx+R*0.22,cy-R*0.85,cx,cy-R*0.82);
      ctx.lineTo(cx,cy+R*0.52);ctx.fillStyle=crG;ctx.fill();
      ctx.strokeStyle='rgba(100,160,255,0.3)';ctx.lineWidth=0.7;
      ctx.fillStyle='rgba(100,160,255,'+(0.4+sph*0.6).toFixed(2)+')';
      var traces=[[cx+R*0.1,cy-R*0.6,cx+R*0.3,cy-R*0.6,cx+R*0.3,cy-R*0.4],[cx+R*0.2,cy-R*0.3,cx+R*0.4,cy-R*0.3,cx+R*0.4,cy-R*0.1],[cx+R*0.1,cy+R*0.1,cx+R*0.25,cy+R*0.1,cx+R*0.25,cy+R*0.3]];
      traces.forEach(function(t){ctx.beginPath();ctx.moveTo(t[0],t[1]);ctx.lineTo(t[2],t[3]);ctx.lineTo(t[4],t[5]);ctx.stroke();ctx.beginPath();ctx.arc(t[4],t[5],R*0.008,0,Math.PI*2);ctx.fill();});
      var eyeX=cx+R*0.22,eyeY=cy-R*0.05;
      ctx.fillStyle='rgba(8,12,24,0.85)';ctx.fillRect(eyeX-R*0.1,eyeY-R*0.08,R*0.2,R*0.16);
      ctx.strokeStyle='rgba(100,160,255,0.5)';ctx.lineWidth=1;ctx.strokeRect(eyeX-R*0.1,eyeY-R*0.08,R*0.2,R*0.16);
      var scanY=eyeY-R*0.06+((tSecs*2)%(R*0.12));
      ctx.fillStyle='rgba(100,200,255,'+(0.5+sph*0.5).toFixed(2)+')';ctx.fillRect(eyeX-R*0.08,scanY,R*0.16,R*0.02);
      ctx.restore();
      var st=cy-R*0.82,sh=R*1.42;
      var sG=ctx.createLinearGradient(cx,st,cx,st+sh);
      sG.addColorStop(0,'rgba(241,195,110,0.0)');sG.addColorStop(0.5,'rgba(212,160,74,'+(0.74+phase*0.26).toFixed(2)+')');sG.addColorStop(1,'rgba(241,195,110,0.0)');
      ctx.beginPath();ctx.moveTo(cx,st);ctx.lineTo(cx,st+sh);ctx.strokeStyle=sG;ctx.lineWidth=1.2+phase*0.6;ctx.stroke();
      for(var i=0;i<6;i++){
        var angle=(i/6)*Math.PI*2-Math.PI/2;
        var skullR=R*0.6;
        if(i===0)skullR=R*0.82;else if(i===1||i===5)skullR=R*0.65;else if(i===2||i===4)skullR=R*0.5;else if(i===3)skullR=R*0.52;
        var ax=cx+Math.cos(angle)*skullR,ay=cy+Math.sin(angle)*skullR;
        var dotR=R*0.015*(scores[i]/100);
        ctx.beginPath();ctx.arc(ax,ay,dotR,0,Math.PI*2);ctx.fillStyle=DIM_COLORS[i];ctx.globalAlpha=0.8+sph*0.2;ctx.fill();
        var glowG=ctx.createRadialGradient(ax,ay,0,ax,ay,dotR*3);
        glowG.addColorStop(0,DIM_COLORS[i]+'88');glowG.addColorStop(1,'transparent');
        ctx.beginPath();ctx.arc(ax,ay,dotR*3,0,Math.PI*2);ctx.fillStyle=glowG;ctx.fill();
        ctx.globalAlpha=1;
      }
    }
    function drawDataCore(ctx,cx,cy,R,phase,tS,scores,stateColor){
      var r=R*0.38,sph=solPhase(tS,528);
      ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);
      ctx.strokeStyle='rgba(212,160,74,'+(0.24+sph*0.18).toFixed(2)+')';ctx.lineWidth=1.2;ctx.stroke();
      for(var i=0;i<6;i++){
        var angle=(i/6)*Math.PI*2-Math.PI/2,len=r*(0.3+(scores[i]/100)*0.6);
        ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(angle)*len,cy+Math.sin(angle)*len);
        ctx.strokeStyle=DIM_COLORS[i];ctx.globalAlpha=0.55;ctx.lineWidth=1.2;ctx.stroke();ctx.globalAlpha=1;
      }
      var cR=R*0.038+phase*R*0.022;
      var grd=ctx.createRadialGradient(cx,cy,0,cx,cy,cR*3);
      grd.addColorStop(0,stateColor+'FF');grd.addColorStop(1,'transparent');
      ctx.beginPath();ctx.arc(cx,cy,cR*3,0,Math.PI*2);ctx.fillStyle=grd;ctx.fill();
      ctx.beginPath();ctx.arc(cx,cy,cR,0,Math.PI*2);ctx.fillStyle=stateColor;ctx.globalAlpha=0.92+phase*0.08;ctx.fill();ctx.globalAlpha=1;
    }
    function frame(timestamp){
      if(lastTs===null)lastTs=timestamp;
      var dt=(timestamp-lastTs)/1000;lastTs=timestamp;tSecs+=dt;
      meanLI+=(targetLI-meanLI)*dt*0.5;
      var bpm=bpmForLI(meanLI),hz=hzForLI(meanLI);
      var phase=breathPhase(tSecs,bpm);
      cometAngle=(cometAngle+cometRadPerSec(bpm)*dt)%(Math.PI*2);
      var ctx=cv.getContext('2d');
      var W=SIZE,H=SIZE,cx=W/2,cy=H*0.47,R=Math.min(W,H)*0.42;
      ctx.clearRect(0,0,W,H);
      var ag=ctx.createRadialGradient(cx,cy,R*0.1,cx,cy,R*1.5);
      ag.addColorStop(0,'rgba(0,0,0,0)');ag.addColorStop(1,'rgba(0,0,0,0.55)');
      ctx.beginPath();ctx.arc(cx,cy,R*1.5,0,Math.PI*2);ctx.fillStyle=ag;ctx.fill();
      drawBreathRing(ctx,cx,cy,R,hz,tSecs,liveScores);
      drawSkull(ctx,cx,cy,R,phase,tSecs,liveScores);
      var fs=fieldState(meanLI);
      drawDataCore(ctx,cx,cy,R,phase,tSecs,liveScores,fs.primary);
      drawComet(ctx,cx,cy,R,phase,meanLI,cometAngle);
      drawOuterArc(ctx,cx,cy,R,phase,meanLI);
      var vg=ctx.createRadialGradient(cx,cy,R*0.68,cx,cy,R*1.12);
      vg.addColorStop(0,'transparent');vg.addColorStop(1,'rgba(0,0,0,0.38)');
      ctx.beginPath();ctx.arc(cx,cy,R*1.12,0,Math.PI*2);ctx.fillStyle=vg;ctx.fill();
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();

})();

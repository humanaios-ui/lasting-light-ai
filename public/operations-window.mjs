// FDS: F3-Web | Purpose: Operations Window — live read of public operations-repo files | Status: E0 PREVIEW
// Read-only. The browser fetches three public files from humanaios-ui/operations
// (main branch) each time the page opens. Nothing runs on a schedule, nothing is
// written, no issue or pull-request text is read. All repo text is placed with
// textContent, never as HTML.

export const OPS_REPO = 'humanaios-ui/operations';
export const OPS_BRANCH = 'main';
export const RAW_BASE = 'https://raw.githubusercontent.com/' + OPS_REPO + '/' + OPS_BRANCH + '/';
export const BLOB_BASE = 'https://github.com/' + OPS_REPO + '/blob/' + OPS_BRANCH + '/';

// The only files this page reads. Fixed list: nothing from the data can add to it.
export const SOURCES = Object.freeze({
  intent: 'INTENT_GRAPH.yaml',
  system: 'system_graph.json',
  running: 'docs/RUNNING.md',
});

export const TIERS = Object.freeze(['vision', 'mission', 'principle', 'objective', 'gate', 'instrument']);

export const TIER_WORDS = Object.freeze({
  vision: 'Vision: the end we aim for',
  mission: 'Missions: the big jobs that serve it',
  principle: 'Principles: rules the work must keep',
  objective: 'Objectives: things being built',
  gate: 'Gates: checks that stop bad changes',
  instrument: 'Instruments: tools that measure',
  other: 'Other',
});

export const TIER_ONE = Object.freeze({
  vision: 'Vision', mission: 'Mission', principle: 'Principle', objective: 'Objective',
  gate: 'Gate', instrument: 'Instrument', other: 'Idea',
});

export const REL_WORDS = Object.freeze({
  realizes: 'serves',
  grounds: 'grounds',
  measures: 'measures',
  enforces: 'enforces',
  constrains: 'limits',
  conflicts_with: 'conflicts with',
});

export const STATUS_WORDS = Object.freeze({
  LIVE: 'Live',
  CONFLICTED: 'Live, but contradicted',
  PROPOSED: 'Proposed',
  CITED_NOT_IMPLEMENTED: 'Named, not built',
  OPERATED: 'Built and tested',
  LAID: 'Code written, not wired in',
  PLANNED: 'Planned, spec only',
});

// ---------------------------------------------------------------------------
// Parsing (pure; tested in tests/operations-window.node.test.mjs)
// ---------------------------------------------------------------------------

function unquote(v) {
  const s = String(v).trim();
  if (s.length >= 2 && ((s[0] === "'" && s.endsWith("'")) || (s[0] === '"' && s.endsWith('"')))) {
    return s.slice(1, -1);
  }
  return s;
}

function splitOutsideQuotes(text) {
  const parts = [];
  let cur = '';
  let q = null;
  for (const ch of text) {
    if (q) { if (ch === q) q = null; cur += ch; continue; }
    if (ch === "'" || ch === '"') { q = ch; cur += ch; continue; }
    if (ch === ',') { parts.push(cur); cur = ''; continue; }
    cur += ch;
  }
  parts.push(cur);
  return parts;
}

function parseFlowMap(text) {
  const out = {};
  const close = text.lastIndexOf('}');
  const inner = text.trim().slice(1, close > 0 ? close : undefined);
  for (const part of splitOutsideQuotes(inner)) {
    const i = part.indexOf(':');
    if (i < 1) continue;
    out[part.slice(0, i).trim()] = unquote(part.slice(i + 1));
  }
  return out;
}

const FOLD_MARKS = new Set(['>-', '>', '|', '|-', '>+', '|+']);

/**
 * Reads the small part of YAML that INTENT_GRAPH.yaml uses for `nodes:` and
 * `edges:`: list items at two spaces, `key: value` fields at four spaces,
 * folded `>-` text, and one-line `{from: A, to: B, rel: c}` items. Anything
 * deeper (evidence lists) is skipped. Not a general YAML reader.
 */
export function parseIntentYaml(text) {
  const nodes = [];
  const edges = [];
  let section = null;
  let cur = null;
  let foldKey = null;
  for (const raw of String(text).split(/\r?\n/)) {
    const line = raw.replace(/\s+$/, '');
    if (foldKey) {
      if (line === '' || /^ {5,}\S/.test(line)) {
        if (line !== '') cur[foldKey] = (cur[foldKey] ? cur[foldKey] + ' ' : '') + line.trim();
        continue;
      }
      foldKey = null;
    }
    if (line === '' || line.trimStart().startsWith('#')) continue;
    if (/^\S/.test(line)) {
      const m = /^([A-Za-z_][\w-]*):/.exec(line);
      section = m ? m[1] : null;
      cur = null;
      continue;
    }
    if (section !== 'nodes' && section !== 'edges') continue;
    const item = /^ {2}-\s+(.*)$/.exec(line);
    if (item) {
      cur = {};
      (section === 'nodes' ? nodes : edges).push(cur);
      const rest = item[1];
      if (rest.startsWith('{')) { Object.assign(cur, parseFlowMap(rest)); continue; }
      const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(rest);
      if (kv) cur[kv[1]] = unquote(kv[2]);
      continue;
    }
    const field = /^ {4}([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (field && cur) {
      const [, key, val] = field;
      if (FOLD_MARKS.has(val)) { cur[key] = ''; foldKey = key; }
      else if (val !== '') cur[key] = unquote(val);
    }
  }
  const ids = new Set();
  const cleanNodes = [];
  for (const n of nodes) {
    if (!n.id || ids.has(n.id)) continue;
    ids.add(n.id);
    cleanNodes.push({
      id: String(n.id), type: String(n.type || 'other'), name: String(n.name || n.id),
      status: String(n.status || 'UNKNOWN'), statement: String(n.statement || ''),
      source: String(n.source || ''),
    });
  }
  const cleanEdges = edges
    .filter(e => ids.has(e.from) && ids.has(e.to) && e.rel)
    .map(e => ({
      from: String(e.from), to: String(e.to), rel: String(e.rel),
      status: String(e.status || ''), detail: String(e.detail || ''),
    }));
  return { nodes: cleanNodes, edges: cleanEdges, skippedEdges: edges.length - cleanEdges.length };
}

export function parseSystemGraph(json) {
  const obj = typeof json === 'string' ? JSON.parse(json) : json;
  const raw = obj && obj.nodes ? obj.nodes : {};
  const list = Array.isArray(raw) ? raw : Object.values(raw);
  const parts = list
    .filter(n => n && n.id)
    .map(n => ({
      id: String(n.id), name: String(n.name || n.id), zone: String(n.zone || 'other'),
      status: String(n.status || 'UNKNOWN'), description: String(n.description || ''),
    }));
  const edgeCount = Array.isArray(obj && obj.edges) ? obj.edges.length
    : (obj && obj.edges ? Object.keys(obj.edges).length : 0);
  return { version: String((obj && obj.version) || ''), generatedAt: String((obj && obj.generated_at) || ''), parts, edgeCount };
}

/** Markdown to plain words: drops code ticks, bold marks and link targets. */
export function plainText(md) {
  return String(md)
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*([^*]*)\*\*/g, '$1')
    .replace(/<[^>]*>/g, '')
    .trim();
}

/** Splits RUNNING.md into its numbered `## ` sections and their table rows. */
export function parseRunning(md) {
  const sections = [];
  let cur = null;
  let header = null;
  for (const raw of String(md).split(/\r?\n/)) {
    const line = raw.trim();
    const h = /^##\s+(\d+)\.\s+(.*)$/.exec(line);
    if (h) { cur = { number: Number(h[1]), title: plainText(h[2]), header: [], rows: [], items: [] }; sections.push(cur); header = null; continue; }
    if (/^##\s/.test(line)) { cur = null; continue; }
    if (cur && /^(?:[-*]|\d+\.)\s+\S/.test(line)) { cur.items.push(plainText(line.replace(/^(?:[-*]|\d+\.)\s+/, ''))); header = null; continue; }
    if (!cur || !line.startsWith('|')) { header = null; continue; }
    const cells = line.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => plainText(c));
    if (cells.every(c => /^:?-{3,}:?$/.test(c))) continue;
    if (!header) { header = cells; cur.header = cells; continue; }
    cur.rows.push(cells);
  }
  return sections;
}

/** Same-repo file link, only for plain relative paths. */
export function sourceHref(path) {
  const p = String(path || '').trim();
  if (!p || p.includes('..') || p.startsWith('/') || !/^[A-Za-z0-9._\/-]+$/.test(p)) return null;
  return BLOB_BASE + p;
}

export function tierOf(type) {
  return TIERS.includes(type) ? type : 'other';
}

/** Places nodes in rows, one row per tier, spread across the width. */
export function layoutIntent(graph, width = 1000) {
  const rows = [...TIERS, 'other'].map(t => ({ tier: t, nodes: graph.nodes.filter(n => tierOf(n.type) === t) }))
    .filter(r => r.nodes.length);
  const top = 58;
  const gap = 118;
  const pos = new Map();
  rows.forEach((row, i) => {
    const step = width / (row.nodes.length + 1);
    row.nodes.forEach((n, j) => pos.set(n.id, { x: Math.round(step * (j + 1)), y: top + i * gap, tier: row.tier }));
  });
  return { rows, pos, height: top + (rows.length - 1) * gap + 70 };
}

export function wrapLabel(name, perLine = 15, maxLines = 2) {
  const words = String(name).split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > perLine && line) { lines.push(line); line = w; }
    else line = (line + ' ' + w).trim();
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = kept[maxLines - 1] + '…';
    return kept;
  }
  return lines;
}

export function isOpenConflict(e) {
  return e.rel === 'conflicts_with' && String(e.status).toUpperCase() === 'OPEN';
}

export function countBy(list, key) {
  const out = {};
  for (const x of list) out[x[key]] = (out[x[key]] || 0) + 1;
  return out;
}

// ---------------------------------------------------------------------------
// Fetching
// ---------------------------------------------------------------------------

export async function fetchSource(name, fetchFn = globalThis.fetch) {
  const path = SOURCES[name];
  if (!path) throw new Error('Unknown source');
  const response = await fetchFn(RAW_BASE + path, {
    method: 'GET', credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer',
  });
  if (!response || !response.ok) throw new Error('HTTP ' + (response ? response.status : 'none'));
  return response.text();
}

// ---------------------------------------------------------------------------
// Drawing (browser only)
// ---------------------------------------------------------------------------

const SVG_NS = 'http://www.w3.org/2000/svg';

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = String(text);
  return e;
}
function svg(tag, attrs) {
  const e = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs || {})) e.setAttribute(k, String(v));
  return e;
}
function link(href, label) {
  const a = el('a', 'source-link', label);
  a.setAttribute('href', href);
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  return a;
}
function statusWord(s) { return STATUS_WORDS[s] || s; }

function showIntentDetail(node, graph) {
  const box = document.getElementById('intent-detail');
  box.replaceChildren();
  box.append(el('p', 'detail-kicker', TIER_ONE[tierOf(node.type)] + ' · ' + statusWord(node.status)));
  box.append(el('h3', null, node.name));
  if (node.statement) box.append(el('p', null, plainText(node.statement)));
  const out = graph.edges.filter(e => e.from === node.id);
  const inc = graph.edges.filter(e => e.to === node.id);
  const byId = new Map(graph.nodes.map(n => [n.id, n]));
  const list = el('ul', 'detail-links');
  for (const e of out) list.append(el('li', isOpenConflict(e) ? 'conflict' : null, (REL_WORDS[e.rel] || e.rel) + ' → ' + byId.get(e.to).name));
  for (const e of inc) list.append(el('li', isOpenConflict(e) ? 'conflict' : null, byId.get(e.from).name + ' ' + (REL_WORDS[e.rel] || e.rel) + ' this'));
  if (list.children.length) box.append(list);
  for (const e of [...out, ...inc].filter(x => x.rel === 'conflicts_with' && x.detail)) {
    box.append(el('p', 'conflict-detail', (isOpenConflict(e) ? 'Why it conflicts: ' : 'Conflict, now ' + (e.status || 'closed').toLowerCase() + ': ') + plainText(e.detail)));
  }
  const href = sourceHref(node.source);
  if (href) box.append(link(href, 'Read the source file: ' + node.source));
}

function drawIntent(graph) {
  const width = 1000;
  const { rows, pos, height } = layoutIntent(graph, width);
  const root = svg('svg', { viewBox: '0 0 ' + width + ' ' + height, class: 'intent-svg', role: 'group', 'aria-label': 'Research concept map' });
  const defs = svg('defs');
  const glow = svg('filter', { id: 'conflict-glow', x: '-50%', y: '-50%', width: '200%', height: '200%' });
  glow.append(svg('feGaussianBlur', { stdDeviation: '3', result: 'b' }));
  const merge = svg('feMerge');
  merge.append(svg('feMergeNode', { in: 'b' }), svg('feMergeNode', { in: 'SourceGraphic' }));
  glow.append(merge);
  defs.append(glow);
  root.append(defs);

  rows.forEach(row => {
    const y = pos.get(row.nodes[0].id).y;
    const t = svg('text', { x: 8, y: y - 34, class: 'tier-label' });
    t.textContent = TIER_WORDS[row.tier] || row.tier;
    root.append(t);
  });

  const edgeLayer = svg('g', { class: 'edges' });
  const edgeEls = [];
  for (const e of graph.edges) {
    const a = pos.get(e.from);
    const b = pos.get(e.to);
    let d;
    if (Math.abs(a.y - b.y) < 2) {
      const lift = Math.min(90, 26 + Math.abs(a.x - b.x) / 5);
      d = 'M' + a.x + ',' + a.y + ' Q' + (a.x + b.x) / 2 + ',' + (a.y - lift) + ' ' + b.x + ',' + b.y;
    } else {
      const my = (a.y + b.y) / 2;
      d = 'M' + a.x + ',' + a.y + ' C' + a.x + ',' + my + ' ' + b.x + ',' + my + ' ' + b.x + ',' + b.y;
    }
    const relClass = e.rel === 'conflicts_with' && !isOpenConflict(e) ? 'conflict-closed' : e.rel.replace(/[^a-z_]/g, '');
    const p = svg('path', { d, class: 'edge rel-' + relClass });
    if (isOpenConflict(e)) p.setAttribute('filter', 'url(#conflict-glow)');
    p.dataset.from = e.from;
    p.dataset.to = e.to;
    edgeLayer.append(p);
    edgeEls.push(p);
  }
  root.append(edgeLayer);

  const nodeEls = [];
  const select = (node, g) => {
    nodeEls.forEach(x => x.classList.remove('selected'));
    g.classList.add('selected');
    for (const p of edgeEls) p.classList.toggle('lit', p.dataset.from === node.id || p.dataset.to === node.id);
    showIntentDetail(node, graph);
  };
  for (const n of graph.nodes) {
    const { x, y, tier } = pos.get(n.id);
    const g = svg('g', { class: 'node tier-' + tier + ' status-' + n.status.replace(/[^A-Z_]/g, ''), tabindex: 0, role: 'button', 'aria-label': n.name + ', ' + statusWord(n.status) });
    g.append(svg('circle', { cx: x, cy: y, r: tier === 'vision' ? 15 : 10, class: 'dot' }));
    wrapLabel(n.name).forEach((line, i) => {
      const t = svg('text', { x, y: y + 27 + i * 13, class: 'node-label' });
      t.textContent = line;
      g.append(t);
    });
    const title = svg('title');
    title.textContent = n.name + ' (' + statusWord(n.status) + ')';
    g.append(title);
    g.addEventListener('click', () => select(n, g));
    g.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); select(n, g); } });
    root.append(g);
    nodeEls.push(g);
  }
  const holder = document.getElementById('intent-map');
  holder.replaceChildren(root);

  const counts = countBy(graph.nodes, 'status');
  const conflicts = graph.edges.filter(isOpenConflict).length;
  const facts = document.getElementById('intent-facts');
  facts.replaceChildren(
    el('span', null, graph.nodes.length + ' ideas'),
    el('span', null, graph.edges.length + ' links'),
    el('span', 'conflict', conflicts + ' open conflicts'),
    el('span', null, (counts.LIVE || 0) + ' live'),
    el('span', null, (counts.PROPOSED || 0) + ' proposed'),
  );
  const first = graph.nodes.find(n => n.status === 'CONFLICTED') || graph.nodes[0];
  const detailBox = document.getElementById('intent-detail');
  detailBox.removeAttribute('aria-live');
  if (first) select(first, nodeEls[graph.nodes.indexOf(first)]);
  detailBox.setAttribute('aria-live', 'polite');
}

function drawSystem(sys) {
  const zones = [...new Set(sys.parts.map(p => p.zone))];
  const order = ['Z2', 'Z1', 'code', 'CI'];
  zones.sort((a, b) => (order.indexOf(a) + 1 || 99) - (order.indexOf(b) + 1 || 99));
  const holder = document.getElementById('system-map');
  holder.replaceChildren();
  const detail = document.getElementById('system-detail');
  for (const z of zones) {
    const col = el('div', 'zone');
    const parts = sys.parts.filter(p => p.zone === z);
    col.append(el('h3', null, z + ' · ' + parts.length));
    const grid = el('div', 'dot-grid');
    for (const p of parts) {
      const b = el('button', 'part status-' + p.status.replace(/[^A-Z_]/g, ''));
      b.type = 'button';
      b.setAttribute('aria-label', p.name + ', ' + statusWord(p.status));
      b.title = p.name;
      b.addEventListener('click', () => {
        holder.querySelectorAll('.part.selected').forEach(x => x.classList.remove('selected'));
        b.classList.add('selected');
        detail.replaceChildren(el('p', 'detail-kicker', z + ' · ' + statusWord(p.status)), el('h3', null, p.name), el('p', null, p.description));
      });
      grid.append(b);
    }
    col.append(grid);
    holder.append(col);
  }
  const c = countBy(sys.parts, 'status');
  document.getElementById('system-facts').replaceChildren(
    el('span', null, sys.parts.length + ' parts'),
    el('span', 'on', (c.OPERATED || 0) + ' built and tested'),
    el('span', null, (c.LAID || 0) + ' written, not wired in'),
    el('span', null, (c.PLANNED || 0) + ' planned'),
  );
  if (sys.generatedAt) document.getElementById('system-when').textContent = 'File says it was made ' + sys.generatedAt.slice(0, 10) + '.';
}

function drawRunning(sections) {
  const holder = document.getElementById('running-list');
  holder.replaceChildren();
  for (const s of sections) {
    const card = el('article', 'run-card' + (s.number === 1 ? ' first' : ''));
    card.append(el('h3', null, s.title));
    const n = s.rows.length || s.items.length;
    card.append(el('p', 'run-count', n + (n === 1 ? ' thing' : ' things')));
    if (s.number === 1 && s.rows.length) {
      const ul = el('ul');
      for (const r of s.rows) ul.append(el('li', null, r[0] + (r[3] ? ' — ' + r[3] : '')));
      card.append(ul);
    }
    holder.append(card);
  }
}

function fail(id, name) {
  failed.add(name);
  const box = document.getElementById(id);
  box.replaceChildren(el('p', 'load-fail', 'Could not read ' + SOURCES[name] + ' just now. Nothing is shown in its place. '), link(BLOB_BASE + SOURCES[name], 'Open the file on GitHub'));
}

const failed = new Set();

export async function initWindow() {
  if (typeof document === 'undefined') return;
  const jobs = [
    fetchSource('intent').then(t => { const g = parseIntentYaml(t); if (!g.nodes.length) throw new Error('empty'); drawIntent(g); }).catch(() => fail('intent-map', 'intent')),
    fetchSource('system').then(t => { const s = parseSystemGraph(t); if (!s.parts.length) throw new Error('empty'); drawSystem(s); }).catch(() => fail('system-map', 'system')),
    fetchSource('running').then(t => { const r = parseRunning(t); if (!r.length) throw new Error('empty'); drawRunning(r); }).catch(() => fail('running-list', 'running')),
  ];
  const results = await Promise.allSettled(jobs);
  const stamp = document.getElementById('read-at');
  if (stamp && failed.size < results.length) stamp.textContent = 'Read from GitHub at ' + new Date().toLocaleString() + '.';
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initWindow, { once: true });
  else initWindow();
}

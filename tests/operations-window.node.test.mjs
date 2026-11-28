import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  SOURCES, RAW_BASE, parseIntentYaml, parseSystemGraph, parseRunning,
  plainText, sourceHref, layoutIntent, wrapLabel, fetchSource, isOpenConflict,
} from '../public/operations-window.mjs';

const INTENT = `# header comment
version: 1
nodes:

  # --- vision ---
  - id: V-ONE
    type: vision
    name: The end we aim for
    statement: >-
      First line of a folded
      statement.
    source: SEED.md
    status: LIVE

  - id: O-A
    type: objective
    name: 'Quoted name'
    status: CONFLICTED

  - id: O-B
    type: objective
    name: Second
    status: PROPOSED
    evidence:
      - 'a: "b"'

# comment at column zero must not end the section
  - id: G-X
    type: gate
    name: Gate
    status: CITED_NOT_IMPLEMENTED

edges:
  - {from: O-A, to: V-ONE, rel: realizes}
  - {from: O-B,   to: V-ONE, rel: realizes}  # trailing comment
  - {from: G-X, to: O-B, rel: constrains, note: 'a, b'}
  - {from: G-X, to: O-A, rel: conflicts_with, status: RESOLVED}
  - {from: O-A, to: MISSING, rel: grounds}

  - from: O-A
    to: O-B
    rel: conflicts_with
    status: OPEN
    detail: >-
      Two files say
      opposite things.
    evidence:
      - 'x.md: "y"'
`;

test('intent parser reads nodes, both edge styles, folded text, and drops dangling edges', () => {
  const g = parseIntentYaml(INTENT);
  assert.deepEqual(g.nodes.map(n => n.id), ['V-ONE', 'O-A', 'O-B', 'G-X']);
  assert.equal(g.nodes[0].statement, 'First line of a folded statement.');
  assert.equal(g.nodes[1].name, 'Quoted name');
  assert.equal(g.nodes[3].status, 'CITED_NOT_IMPLEMENTED');
  assert.equal(g.edges.length, 5);
  assert.equal(g.skippedEdges, 1);
  assert.equal(g.edges[1].rel, 'realizes');
  assert.equal(g.edges[2].rel, 'constrains');
  assert.equal(g.edges.filter(isOpenConflict).length, 1);
  const c = g.edges.find(isOpenConflict);
  assert.equal(c.detail, 'Two files say opposite things.');
  assert.equal(c.status, 'OPEN');
});

test('layout puts each tier on its own row, in tier order', () => {
  const g = parseIntentYaml(INTENT);
  const { pos } = layoutIntent(g, 1000);
  assert.ok(pos.get('V-ONE').y < pos.get('O-A').y);
  assert.equal(pos.get('O-A').y, pos.get('O-B').y);
  assert.ok(pos.get('O-B').y < pos.get('G-X').y);
  assert.ok(pos.get('O-A').x < pos.get('O-B').x);
});

test('system graph accepts the dict-of-nodes shape', () => {
  const s = parseSystemGraph(JSON.stringify({
    version: '0.2', generated_at: '2026-11-11T18:36:35',
    nodes: { Q: { id: 'Q', name: 'Queue', zone: 'Z2', status: 'OPERATED', description: 'd' }, R: { id: 'R', zone: 'CI', status: 'LAID' } },
    edges: [{}, {}, {}],
  }));
  assert.equal(s.parts.length, 2);
  assert.equal(s.parts[1].name, 'R');
  assert.equal(s.edgeCount, 3);
});

test('running list keeps numbered sections, table rows and bullet items', () => {
  const md = [
    '# Title', '## Rule: keep this list true', '1. not a section row',
    '## 1. Costs **money**', '| What | Where | Why | Cost | Stops |', '|---|---|---|---|---|',
    '| `svc` [x](https://e.x) | Railway | y | Usage-billed | Until stopped |',
    '## 5. Could not see', '- Bills: Railway', '- Your computer',
  ].join('\n');
  const s = parseRunning(md);
  assert.equal(s.length, 2);
  assert.equal(s[0].title, 'Costs money');
  assert.deepEqual(s[0].rows[0], ['svc x', 'Railway', 'y', 'Usage-billed', 'Until stopped']);
  assert.equal(s[1].items.length, 2);
});

test('plain text strips markup; source links stay inside the operations repo', () => {
  assert.equal(plainText('<b>`a`</b> **b**'), 'a b');
  assert.equal(sourceHref('docs/X.md'), 'https://github.com/humanaios-ui/operations/blob/main/docs/X.md');
  assert.equal(sourceHref('../etc/passwd'), null);
  assert.equal(sourceHref('https://evil.example/x'), null);
  assert.equal(sourceHref('/abs'), null);
  assert.equal(sourceHref(''), null);
});

test('labels wrap to two lines at most', () => {
  assert.deepEqual(wrapLabel('Clocks measure, they do not authorize'), ['Clocks measure,', 'they do not…']);
  assert.deepEqual(wrapLabel('Gate'), ['Gate']);
});

test('fetch reads only the fixed public files, with no cookies or referrer', async () => {
  const calls = [];
  const fake = async (url, opts) => { calls.push([url, opts]); return { ok: true, text: async () => 'ok' }; };
  assert.equal(await fetchSource('intent', fake), 'ok');
  assert.equal(calls[0][0], RAW_BASE + SOURCES.intent);
  assert.equal(calls[0][1].credentials, 'omit');
  assert.equal(calls[0][1].referrerPolicy, 'no-referrer');
  await assert.rejects(fetchSource('issues', fake));
  await assert.rejects(fetchSource('running', async () => ({ ok: false, status: 404 })));
  assert.deepEqual(Object.values(SOURCES), ['INTENT_GRAPH.yaml', 'system_graph.json', 'docs/RUNNING.md']);
});

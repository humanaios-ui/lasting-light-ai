import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  NODES, REPOSITORIES, WINDOW_DAYS, MAX_SAMPLE,
  canonicalSource, projectSample, fetchRecentSample, allowedNodeHref,
} from '../public/ecosystem-attractor.mjs';

const NOW = Date.parse('2026-11-01T12:00:00Z');
const REPO = 'humanaios-ui/operations';
const iso = x => new Date(x).toISOString();
function issue(n, { pr = false, updated = NOW - 86400000, title = 'Example' } = {}) {
  return {
    number: n, title,
    updated_at: iso(updated),
    html_url: 'https://github.com/' + REPO + '/' + (pr ? 'pull' : 'issues') + '/' + n,
    ...(pr ? { pull_request: {} } : {}),
  };
}
test('eight distinct nodes, explicit public/private boundaries, no private-route shortcuts', () => {
  assert.equal(NODES.length, 8);
  assert.equal(new Set(NODES.map(n => n.id)).size, 8);
  assert.deepEqual(NODES.map(n => n.id), [
    'witness', 'miner', 'intent', 'desk',
    'operations', 'human-hub', 'acat', 'recovery',
  ]);
  for (const n of NODES) {
    assert.ok(n.boundary.length > 40);
    assert.ok(n.question.length > 10);
    assert.equal(allowedNodeHref(n.id), n.href);
    assert.ok(n.href.startsWith('/') || n.href.startsWith('https://github.com/humanaios-ui/operations/'));
    assert.ok(n.source.startsWith('https://github.com/humanaios-ui/'));
    assert.ok(!n.href.includes('/my-opportunities') && !n.href.includes('localhost'));
  }
  assert.equal(NODES.find(n => n.id === 'intent').access, 'PRIVATE WORKSPACE');
  assert.equal(allowedNodeHref('nonexistent'), null);
});

test('three exact public sources, five latest records only and 28-day label', () => {
  assert.deepEqual(REPOSITORIES, [
    'humanaios-ui/humanaios', 'humanaios-ui/operations',
    'humanaios-ui/lasting-light-ai',
  ]);
  assert.equal(MAX_SAMPLE, 5);
  assert.equal(WINDOW_DAYS, 28);
});

test('canonical PR and issue evidence, no forgeable destination', () => {
  assert.equal(canonicalSource(REPO, issue(13)).kind, 'ISSUE');
  assert.equal(canonicalSource(REPO, issue(14, {pr:true})).kind, 'PR');
  assert.equal(canonicalSource(REPO, {...issue(13), html_url:'https://evil.invalid/issues/13'}), null);
  assert.equal(canonicalSource(REPO, {...issue(13), html_url:'https://github.com/humanaios-ui/other/issues/13'}), null);
  assert.equal(canonicalSource('unapproved/repo', issue(13)), null);
  assert.equal(canonicalSource(REPO, {...issue(13), updated_at:'not-a-time'}), null);
  assert.equal(canonicalSource(REPO, {...issue(13), number:-1}), null);
});

test('strict sample projection prevents fabricated 28-day totals', () => {
  const data = [
    issue(8), issue(8),
    issue(9, {pr:true,updated:NOW-29*86400000}),
    issue(10, {updated:NOW+86400000}),
    issue(11, {updated:NOW-86400000}),
  ];
  const p = projectSample(REPO, data, NOW);
  assert.equal(p.sample_size, 3);
  assert.equal(p.recent_sample_size, 2);
  assert.equal(p.coverage, 'PARTIAL_INVALID_RECORDS');
  assert.equal(p.rejected, 1);
  assert.equal(p.newest.number, 8);
  assert.equal('total_issues' in p, false);
  assert.equal('total_prs' in p, false);
});

test('full sample of five is not a complete census', () => {
  const five = Array.from({length:5},(_,i)=>issue(i+1,{updated:NOW-(i+1)*1000}));
  assert.equal(projectSample(REPO,five,NOW).coverage, 'LATEST_FIVE_SAMPLE');
  assert.throws(()=>projectSample(REPO,[...five,issue(6)],NOW),/Unexpected/);
});

test('fetch is public GET only, no credentials and URL fixed by allowlist', async () => {
  let observed = null;
  const p = await fetchRecentSample(REPO, async (url, opts) => {
    observed = {url,opts};
    return {ok:true, status:200, json:async()=>[issue(19)]};
  }, NOW);
  assert.equal(p.coverage, 'LATEST_FIVE_SAMPLE');
  assert.equal(observed.opts.method,'GET');
  assert.equal(observed.opts.credentials,'omit');
  assert.match(observed.url, /^https:\/\/api\.github\.com\/repos\/humanaios-ui\/operations\/issues\?/);
  assert.ok(observed.url.endsWith('per_page=5&page=1'));
});

test('rate limits, network failures and malformed JSON fail closed', async () => {
  const r1=await fetchRecentSample(REPO, async()=>({ok:false,status:403}),NOW);
  const r2=await fetchRecentSample(REPO, async()=>{throw Error('offline');},NOW);
  const r3=await fetchRecentSample(REPO, async()=>({ok:true,json:async()=>({items:[]})}),NOW);
  for (const x of [r1,r2,r3]) {
    assert.equal(x.coverage,'UNAVAILABLE');
    assert.equal('sample_size' in x,false);
  }
});

test('site is opt-in preview and does not modify existing homepage', () => {
  const html=readFileSync(new URL('../public/ecosystem.html',import.meta.url),'utf8');
  const css=readFileSync(new URL('../public/ecosystem-attractor.css',import.meta.url),'utf8');
  const script=readFileSync(new URL('../public/ecosystem-attractor.mjs',import.meta.url),'utf8');
  const redirects=readFileSync(new URL('../public/_redirects',import.meta.url),'utf8');
  for (const n of NODES) assert.match(html,new RegExp('data-node="'+n.id+'"'));
  assert.match(html,/aria-pressed="false"/);
  assert.match(html,/id="node-detail"/);
  assert.match(html,/id="evidence-status"/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(redirects,/\/ecosystem\s+\/ecosystem\.html\s+302/);
  assert.match(html,/Z1 · E0 PREVIEW/);
  assert.doesNotMatch(script,/localStorage|sessionStorage|document\.cookie|sendBeacon|\.innerHTML/);
  assert.doesNotMatch(script,/method:\s*['"](?:POST|PUT|PATCH|DELETE)/i);
  assert.doesNotMatch(script,/\/my-opportunities|\/api\/intent/);
});

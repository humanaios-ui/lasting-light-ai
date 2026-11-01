/* HumanAIOS Living Attractor — E0 source-truth and interaction kernel.
 * Source data is public GitHub last-update SAMPLE, not system health,
 * complete 28-day activity, verified completion or authorization.
 * No private endpoints, privileged credentials, mutation or persistence.
 */
const OWNER = 'humanaios-ui';
export const WINDOW_DAYS = 28;
export const MAX_SAMPLE = 5;
export const REPOSITORIES = Object.freeze([
  'humanaios-ui/humanaios',
  'humanaios-ui/operations',
  'humanaios-ui/lasting-light-ai',
]);

export const NODES = Object.freeze([
  {
    id: 'witness', name: 'Witness', side: 'left',
    access: 'PUBLIC RESEARCH', signal: 'source',
    summary: 'Examine what a system claims, and what its evidence supports.',
    boundary: 'The public Witness room illustrates examination. It does not independently verify a model, approve a change, or speak on a human’s behalf.',
    href: '/witness.html', action: 'Enter the Witness room',
    source: 'https://github.com/humanaios-ui/lasting-light-ai',
    question: 'What is observed, what is claimed, and what remains unknown?',
  },
  {
    id: 'miner', name: 'Resource Miner', side: 'left',
    access: 'PUBLIC OVERVIEW', signal: 'bounded',
    summary: 'Find paths from a human goal toward relevant resources.',
    boundary: 'The public funding page is an overview, not the authenticated Resource Miner. Private sources, applications, and eligibility are not available here.',
    href: '/funding.html', action: 'Explore funding research',
    source: 'https://github.com/humanaios-ui/operations/issues/588',
    question: 'Is this a verified resource, a candidate, or a human report?',
  },
  {
    id: 'intent', name: 'INTENT-OS', side: 'left',
    access: 'PRIVATE WORKSPACE', signal: 'private',
    summary: 'Translate human intention into reviewed opportunities and next steps.',
    boundary: 'INTENT-OS personal records are protected. No public visitor can open My Opportunities or bypass loopback/private authentication. This link is to an implementation issue, not a live personal account.',
    href: 'https://github.com/humanaios-ui/operations/issues/1084',
    action: 'Read the private-access boundary',
    source: 'https://github.com/humanaios-ui/operations/issues/1084',
    question: 'Which decision is the human authorized to make next?',
  },
  {
    id: 'desk', name: 'Project Desk', side: 'left',
    access: 'BRIDGE UNDER REVIEW', signal: 'bounded',
    summary: 'Keep goals, tasks, decisions, and evidence linked.',
    boundary: 'The read-only Project Desk reconciliation is a draft. This is not a synchronized task list. No task is completed, approved, or imported by this page.',
    href: 'https://github.com/humanaios-ui/operations/pull/1086',
    action: 'Inspect the draft bridge',
    source: 'https://github.com/humanaios-ui/operations/pull/1086',
    question: 'Did the evidence establish a completed task, or only a proposed update?',
  },
  {
    id: 'operations', name: 'Operations Observatory', side: 'right',
    access: 'READ-ONLY WORKBENCH', signal: 'bounded',
    summary: 'See source-linked repository movement across the ecosystem.',
    boundary: 'The Operations Observatory is draft workbench code, not a deployed monitoring system. GitHub last updates do not measure runtime health or human benefit.',
    href: 'https://github.com/humanaios-ui/operations/pull/1089',
    action: 'Review the Observatory workbench',
    source: 'https://github.com/humanaios-ui/operations/issues/1088',
    question: 'What changed in source, and what still needs independent review?',
  },
  {
    id: 'human-hub', name: 'Human Hub', side: 'right',
    access: 'PUBLIC COMMUNITY', signal: 'source',
    summary: 'Make space for people, experience, and collaboration.',
    boundary: 'Public community information is not a verified roster of participants or a promise of active matching.',
    href: '/the-commons.html', action: 'Enter the Commons',
    source: 'https://github.com/humanaios-ui/lasting-light-ai',
    question: 'What would help a person understand and participate?',
  },
  {
    id: 'acat', name: 'ACAT', side: 'right',
    access: 'PUBLIC ASSESSMENT', signal: 'source',
    summary: 'Explore differences between AI self-description and observed behavior.',
    boundary: 'ACAT self-reports are not a certification, consciousness proof, or independent safety assurance. Dataset versions must remain distinct.',
    href: '/assess.html', action: 'Explore the assessment',
    source: 'https://github.com/humanaios-ui/lasting-light-ai',
    question: 'What does the assessment actually measure, and what can it not prove?',
  },
  {
    id: 'recovery', name: 'Recovery & Impact', side: 'right',
    access: 'PUBLIC MISSION', signal: 'source',
    summary: 'Connect useful work to people and long-term recovery.',
    boundary: 'The mission explains a commitment. It is not evidence that funding was delivered or that a recovery outcome occurred.',
    href: '/why-it-matters.html', action: 'Explore the mission',
    source: 'https://github.com/humanaios-ui/lasting-light-ai',
    question: 'Which real-world outcome has supporting evidence?',
  },
]);

const REPO_LABELS = Object.freeze({
  'humanaios-ui/humanaios': 'HumanAIOS platform',
  'humanaios-ui/operations': 'Operations',
  'humanaios-ui/lasting-light-ai': 'Lasting Light AI',
});
const DAY_MS = 86400000;

export function canonicalSource(repo, item) {
  if (!REPOSITORIES.includes(repo) || !item || typeof item !== 'object') return null;
  if (!Number.isSafeInteger(item.number) || item.number < 1) return null;
  const kind = item.pull_request ? 'pull' : 'issues';
  const canonical = 'https://github.com/' + repo + '/' + kind + '/' + item.number;
  if (item.html_url !== canonical || typeof item.title !== 'string') return null;
  const updated = typeof item.updated_at === 'string' ? Date.parse(item.updated_at) : NaN;
  if (!Number.isFinite(updated) || !/^\d{4}-\d\d-\d\dT/.test(item.updated_at)) return null;
  return {
    number: item.number, kind: kind === 'pull' ? 'PR' : 'ISSUE',
    title: item.title.slice(0, 150), url: canonical,
    updated_ms: updated, updated_at: new Date(updated).toISOString(),
  };
}

export function projectSample(repo, raw, observedAtMs) {
  if (!REPOSITORIES.includes(repo)) throw new Error('Repository not allowlisted');
  if (!Array.isArray(raw) || raw.length > MAX_SAMPLE) throw new Error('Unexpected GitHub response');
  if (!Number.isFinite(observedAtMs)) throw new Error('Invalid observation time');
  const seen = new Set();
  const records = [];
  let rejected = 0;
  for (const entry of raw) {
    const item = canonicalSource(repo, entry);
    if (!item || item.updated_ms > observedAtMs + 300000) { rejected++; continue; }
    if (seen.has(item.url)) continue;
    seen.add(item.url);
    records.push(item);
  }
  records.sort((a, b) => b.updated_ms - a.updated_ms);
  const cutoff = observedAtMs - WINDOW_DAYS * DAY_MS;
  const recent = records.filter(x => x.updated_ms >= cutoff && x.updated_ms <= observedAtMs);
  return {
    repo, label: REPO_LABELS[repo], checked_at: new Date(observedAtMs).toISOString(),
    coverage: rejected ? 'PARTIAL_INVALID_RECORDS' : 'LATEST_FIVE_SAMPLE',
    rejected, sample_size: records.length, recent_sample_size: recent.length,
    newest: records[0] || null, records,
    // No "total activity" field: this is NOT an exhaustive window query.
  };
}

export async function fetchRecentSample(repo, fetchFn, observedAtMs, signal) {
  if (!REPOSITORIES.includes(repo)) throw new Error('Repository not allowlisted');
  const endpoint = 'https://api.github.com/repos/' + repo +
    '/issues?state=all&sort=updated&direction=desc&per_page=' + MAX_SAMPLE + '&page=1';
  try {
    const response = await fetchFn(endpoint, {
      method: 'GET', credentials: 'omit', cache: 'no-store',
      referrerPolicy: 'no-referrer',
      headers: { 'Accept': 'application/vnd.github+json' },
      ...(signal ? { signal } : {}),
    });
    if (!response || !response.ok) {
      const code = response && Number.isInteger(response.status) ? response.status : 'unknown';
      return { repo, label: REPO_LABELS[repo], coverage: 'UNAVAILABLE',
        message: 'GitHub HTTP ' + code + '; no current source sample verified' };
    }
    return projectSample(repo, await response.json(), observedAtMs);
  } catch (_) {
    return { repo, label: REPO_LABELS[repo], coverage: 'UNAVAILABLE',
      message: 'GitHub request unavailable; no current source sample verified' };
  }
}

export function allowedNodeHref(id) {
  const node = NODES.find(x => x.id === id);
  return node ? node.href : null;
}

function domText(el, value) { el.textContent = String(value); }
function createEl(tag, className, content) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (content !== undefined) domText(el, content);
  return el;
}
function safeLink(href, label) {
  const a = createEl('a', 'source-link', label);
  // Sources are authored constants or canonicalSource-produced public GitHub URLs.
  a.setAttribute('href', href);
  if (href.startsWith('https://')) {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }
  return a;
}

function showNode(node) {
  document.querySelectorAll('[data-node]').forEach(button => {
    const active = button.getAttribute('data-node') === node.id;
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
    button.classList.toggle('selected', active);
  });
  domText(document.getElementById('detail-title'), node.name);
  domText(document.getElementById('detail-summary'), node.summary);
  domText(document.getElementById('detail-boundary'), node.boundary);
  domText(document.getElementById('detail-question'), 'Witness asks: ' + node.question);
  domText(document.getElementById('detail-access'), node.access);
  const actions = document.getElementById('detail-actions');
  actions.replaceChildren(safeLink(node.href, node.action), safeLink(node.source, 'View source / scope'));
  document.getElementById('scene').setAttribute('data-selected', node.id);
}

function showSourceSnapshot(node, result) {
  node.replaceChildren();
  const head = createEl('strong', '', result.label);
  node.appendChild(head);
  if (result.coverage === 'UNAVAILABLE') {
    node.appendChild(createEl('p', 'source-warning', result.message));
    return;
  }
  node.appendChild(createEl('p', 'small-copy',
    result.coverage === 'LATEST_FIVE_SAMPLE'
      ? 'Public GitHub · latest five records only'
      : 'Partial record sample; malformed entries rejected'));
  node.appendChild(createEl('p', 'small-copy',
    'Checked ' + result.checked_at + ' · ' +
    result.recent_sample_size + ' sampled records last updated within 28 days. Not a total.'));
  if (result.newest) {
    const el = createEl('p', 'source-event');
    el.appendChild(safeLink(result.newest.url,
      result.newest.kind + ' #' + result.newest.number + ' · ' + result.newest.title));
    node.appendChild(el);
    node.appendChild(createEl('p', 'small-copy', 'Latest sampled update ' + result.newest.updated_at));
  } else {
    node.appendChild(createEl('p', 'small-copy', 'No valid public records in returned sample.'));
  }
}

export function initAttractor() {
  if (typeof document === 'undefined') return;
  const buttons = [...document.querySelectorAll('[data-node]')];
  if (!buttons.length) return;
  buttons.forEach(button => button.addEventListener('click', () => {
    const node = NODES.find(x => x.id === button.getAttribute('data-node'));
    if (node) showNode(node);
  }));
  showNode(NODES[0]);

  const refreshButton = document.getElementById('refresh-evidence');
  const status = document.getElementById('evidence-status');
  const cards = new Map(REPOSITORIES.map(repo =>
    [repo, document.getElementById('source-' + repo.split('/')[1])]));
  let loading = false;
  async function refresh() {
    if (loading) return;
    loading = true;
    refreshButton.disabled = true;
    domText(status, 'Reading public GitHub source samples. No private systems are queried.');
    const nowMs = Date.now();
    const results = await Promise.all(REPOSITORIES.map(async repo => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 9000);
      try { return await fetchRecentSample(repo, fetch, nowMs, controller.signal); }
      finally { clearTimeout(timeout); }
    }));
    results.forEach(result => showSourceSnapshot(cards.get(result.repo), result));
    const failures = results.filter(x => x.coverage !== 'LATEST_FIVE_SAMPLE');
    domText(status, (failures.length ? 'PARTIAL OR UNAVAILABLE' : 'SOURCE SAMPLES READ') +
      ' · ' + new Date(nowMs).toISOString() +
      ' · Five latest records per repository, NOT complete 28-day telemetry.');
    document.getElementById('scene').classList.toggle('source-sampled', failures.length === 0);
    refreshButton.disabled = false;
    loading = false;
  }
  refreshButton.addEventListener('click', () => {
    refresh().catch(() => {
      domText(status, 'UNAVAILABLE · source refresh failed; no current measurements claimed.');
      refreshButton.disabled = false;
      loading = false;
    });
  });
  refreshButton.click();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAttractor, { once: true });
  } else {
    initAttractor();
  }
}

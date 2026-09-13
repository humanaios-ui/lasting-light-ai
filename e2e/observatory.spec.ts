/* FDS: F3-Component | Parent: CUSTOM_INSTRUCTIONS_V3_5_ORD.md | Hawkins: internal-only | Status: ACTIVE */
import { expect, test } from '@playwright/test';

const chartStub = `
window.Chart = function() { return { data: { datasets: [] }, update() {} }; };
window.Chart.register = function() {};
`;

// Three paired systems, because the page only adopts CSV data when
// parseCSVToAcat returns >= 3 rows (observatory.html: `if (rows.length >= 3)`).
// An earlier version of this fixture supplied one pair, so the overlay never
// fired and every assertion below was really reading the page's static
// fallback — a test that could not fail.
//
// Totals are chosen so the derived gap summary is unmistakably not the
// fallback's: gaps of +100, +100 and -100 give a mean of 33.3 and a median of
// 100.0, two of three systems overestimate (67%), and the Learning Indices
// 0.833 / 0.833 / 1.200 average to 0.955. The fallback's own figures are
// 72.8 / 74.0 / 100% / 0.856, so a broken pipeline cannot produce these.
const csvRows = [
  { agent_name: 'Fixture Alpha', phase: 'phase1', truth: '100', service: '100', harm: '100', autonomy: '100', value: '100', humility: '100', total: '600', metadata: '{"provider":"Anthropic"}' },
  { agent_name: 'Fixture Alpha', phase: 'phase3', truth: '84', service: '84', harm: '83', autonomy: '83', value: '83', humility: '83', post_total: '500', metadata: '{"provider":"Anthropic"}' },
  { agent_name: 'Fixture Beta', phase: 'phase1', truth: '100', service: '100', harm: '100', autonomy: '100', value: '100', humility: '100', total: '600', metadata: '{"provider":"OpenAI"}' },
  { agent_name: 'Fixture Beta', phase: 'phase3', truth: '84', service: '84', harm: '83', autonomy: '83', value: '83', humility: '83', post_total: '500', metadata: '{"provider":"OpenAI"}' },
  { agent_name: 'Fixture Gamma', phase: 'phase1', truth: '84', service: '84', harm: '83', autonomy: '83', value: '83', humility: '83', total: '500', metadata: '{"provider":"Google"}' },
  { agent_name: 'Fixture Gamma', phase: 'phase3', truth: '100', service: '100', harm: '100', autonomy: '100', value: '100', humility: '100', post_total: '600', metadata: '{"provider":"Google"}' },
];

const papaStub = `
window.Papa = {
  parse: function(_url, opts) {
    if (opts && opts.complete) opts.complete({ data: ${JSON.stringify(csvRows)} });
  }
};
`;

test('observatory renders data pipeline surface', async ({ page }) => {
  await page.route('**/chart.umd.min.js', (route) =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: chartStub }),
  );
  await page.route('**/papaparse.min.js', (route) =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: papaStub }),
  );
  // The page reads /rest/v1/data_snapshot, not acat_stats_v1. Mocking the
  // wrong path left the request unstubbed, so the test reached live Supabase
  // and its outcome depended on the network: on success it showed live values,
  // on failure the page's archived fallback. It passed either way, which is
  // what made it useless as a gate.
  await page.route('**/rest/v1/data_snapshot**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          n_total: 629,
          n_phase1: 516,
          n_li: 307,
          unique_systems: '57+',
          mean_li: 0.8632,
          created_at: '2026-03-23T04:03:27Z',
        },
      ]),
    }),
  );

  await page.goto('/observatory.html');
  await expect(page.getByRole('heading', { name: /Observatory/i })).toBeVisible();

  // Channel 1 — the Supabase snapshot. These values differ from the page's
  // hardcoded fallback (630 / 517 / 308), so a regression that drops the live
  // read now fails instead of quietly serving the fallback.
  await expect(page.locator('#obsHeroStat')).toHaveText('629');
  await expect(page.locator('#obsP1')).toHaveText('516');
  await expect(page.locator('#obsLI')).toHaveText('307');
  await expect(page.locator('#obsMeanLI')).toHaveText('0.8632');

  // Channel 2 — the CSV overlay. loadObsCSV replaces acatData and calls
  // renderAll, so every surface below is recomputed from the fixture.
  const gapSummary = page.locator('#gapSummary');
  await expect(gapSummary).toContainText('33.3 pts');
  await expect(gapSummary).toContainText('100.0 pts');
  await expect(gapSummary).toContainText('67%');
  await expect(gapSummary).toContainText('0.955');

  // The table and the provider filter used to render once at load and never
  // refresh, so they showed six hardcoded models next to live figures. They now
  // follow the data. Asserting the fallback is gone, not just that the fixture
  // is present, is what makes these fail if the refresh regresses: the fixture
  // providers all appear in the fallback too, so only its absence separates them.
  const table = page.locator('#assessmentTable');
  await expect(table.locator('tr')).toHaveCount(3);
  await expect(table).toContainText('Fixture Alpha');
  await expect(table).not.toContainText('GPT-4o');

  // All providers + the fixture's three, where the fallback would give seven.
  await expect(page.locator('#providerFilter option')).toHaveCount(4);
  await expect(page.locator('#providerFilter option[value="Meta"]')).toHaveCount(0);

  // The legend and the provider stats refresh too, and need assertions of their
  // own or they can regress to the fallback while everything above still passes.
  // Both values below are unreachable from the fallback, whose gaps are all
  // positive and whose Learning Indices are all under 1.
  await expect(page.locator('#providerLegend .provider-chip')).toHaveCount(3);
  const providerStats = page.locator('#providerStats');
  await expect(providerStats).toContainText('Google · 1 models · gap -100.0');
  await expect(providerStats).toContainText('LI 1.200');
  await expect(providerStats).not.toContainText('Meta');

  // A refresh keeps the viewer's filter choice. The overlay reloads every five
  // minutes, so without this the page would reset itself to All under anyone
  // who left a provider selected.
  await page.selectOption('#providerFilter', 'OpenAI');
  await page.evaluate(() => (window as unknown as {renderAll: () => void}).renderAll());
  await expect(page.locator('#providerFilter')).toHaveValue('OpenAI');
});

// The CSV is a published Google Sheet. Once the overlay adopts it, the model and
// provider strings are written by whoever can add a row, so every surface that
// renders them has to treat them as text. This test is the regression guard for
// that: before the render functions were rewritten to build nodes, each of these
// values reached innerHTML and executed.
const injection = '<img src=x onerror="window.__xss=1">';

const hostileRows = [
  { agent_name: injection, phase: 'phase1', truth: '100', service: '100', harm: '100', autonomy: '100', value: '100', humility: '100', total: '600', metadata: JSON.stringify({ provider: injection }) },
  { agent_name: injection, phase: 'phase3', truth: '84', service: '84', harm: '83', autonomy: '83', value: '83', humility: '83', post_total: '500', metadata: JSON.stringify({ provider: injection }) },
  { agent_name: 'Benign One', phase: 'phase1', truth: '90', service: '90', harm: '90', autonomy: '90', value: '90', humility: '90', total: '540', metadata: '{"provider":"Anthropic"}' },
  { agent_name: 'Benign One', phase: 'phase3', truth: '80', service: '80', harm: '80', autonomy: '80', value: '80', humility: '80', post_total: '480', metadata: '{"provider":"Anthropic"}' },
  { agent_name: 'Benign Two', phase: 'phase1', truth: '90', service: '90', harm: '90', autonomy: '90', value: '90', humility: '90', total: '540', metadata: '{"provider":"OpenAI"}' },
  { agent_name: 'Benign Two', phase: 'phase3', truth: '80', service: '80', harm: '80', autonomy: '80', value: '80', humility: '80', post_total: '480', metadata: '{"provider":"OpenAI"}' },
];

const hostilePapaStub = `
window.Papa = {
  parse: function(_url, opts) {
    if (opts && opts.complete) opts.complete({ data: ${JSON.stringify(hostileRows)} });
  }
};
`;

test('renders CSV-controlled values as text, never as markup', async ({ page }) => {
  await page.route('**/chart.umd.min.js', (route) =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: chartStub }),
  );
  await page.route('**/papaparse.min.js', (route) =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: hostilePapaStub }),
  );
  await page.route('**/rest/v1/data_snapshot**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  );

  await page.goto('/observatory.html');

  // The overlay ran, so the hostile row is on the page somewhere.
  await expect(page.locator('#assessmentTable tr')).toHaveCount(3);

  // It is displayed, not interpreted. No element was created from the payload
  // on any of the three surfaces that render live strings.
  await expect(page.locator('#assessmentTable img')).toHaveCount(0);
  await expect(page.locator('#providerLegend img')).toHaveCount(0);
  await expect(page.locator('#providerStats img')).toHaveCount(0);
  await expect(page.locator('#assessmentTable')).toContainText('<img src=x');

  // And nothing ran. An onerror handler that fired would have set this.
  expect(await page.evaluate(() => (window as unknown as {__xss?: number}).__xss)).toBeUndefined();
});

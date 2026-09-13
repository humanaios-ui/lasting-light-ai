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

  // A refresh keeps the viewer's filter choice. The overlay reloads every five
  // minutes, so without this the page would reset itself to All under anyone
  // who left a provider selected.
  await page.selectOption('#providerFilter', 'OpenAI');
  await page.evaluate(() => (window as unknown as {renderAll: () => void}).renderAll());
  await expect(page.locator('#providerFilter')).toHaveValue('OpenAI');
});

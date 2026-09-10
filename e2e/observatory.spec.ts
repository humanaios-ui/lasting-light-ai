/* FDS: F3-Component | Parent: CUSTOM_INSTRUCTIONS_V3_5_ORD.md | Hawkins: internal-only | Status: ACTIVE */
import { expect, test } from '@playwright/test';

const chartStub = `
window.Chart = function() { return { data: { datasets: [] }, update() {} }; };
window.Chart.register = function() {};
`;

const papaStub = `
window.Papa = {
  parse: function(_url, opts) {
    const rows = [
      { agent_name: 'OpenAI GPT-5', phase: 'phase1', truth: '80', service: '82', harm: '78', autonomy: '79', value: '77', humility: '76', total: '472', metadata: '{"provider":"OpenAI"}' },
      { agent_name: 'OpenAI GPT-5', phase: 'phase3', truth: '70', service: '71', harm: '69', autonomy: '68', value: '66', humility: '65', post_total: '409', pre_total: '472', total: '409', metadata: '{"provider":"OpenAI"}' }
    ];
    if (opts && opts.complete) opts.complete({ data: rows });
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
  await page.route('**/acat_stats_v1**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ n_total: 629, n_phase1: 516, n_li: 307, mean_li: 0.8632 }]),
    }),
  );

  await page.goto('/observatory.html');
  await expect(page.getByRole('heading', { name: /Observatory/i })).toBeVisible();
  await expect(page.locator('#providerFilter option[value="OpenAI"]')).toHaveCount(1);
  await expect(page.locator('#assessmentTable tr')).toHaveCount(6);
  await expect(page.locator('#assessmentTable')).toContainText('GPT-4o');
});

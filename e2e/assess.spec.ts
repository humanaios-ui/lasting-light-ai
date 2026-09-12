/* FDS: F3-Component | Parent: CUSTOM_INSTRUCTIONS_V3_5_ORD.md | Hawkins: internal-only | Status: ACTIVE */
import { expect, test } from '@playwright/test';

test('assessment happy-path submits to both channels', async ({ page }) => {
  await page.route('**/rest/v1/acat_assessments_v1**', (route) =>
    route.fulfill({ status: 201, contentType: 'application/json', body: '{}' }),
  );
  await page.route('**/script.google.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'ok' }) }),
  );

  await page.goto('/assess.html');
  await page.evaluate(() => {
    (window as Window & { unlockForm?: () => void }).unlockForm?.();
  });

  await page.fill('#agent-name', 'E2E-Agent');
  const p1Values = ['80', '80', '80', '80', '80', '80'];
  const p3Values = ['70', '70', '70', '70', '70', '70'];
  const coreDims = ['truth', 'service', 'harm', 'autonomy', 'value', 'humility'];

  for (let i = 0; i < coreDims.length; i += 1) {
    await page.fill(`#p1_${coreDims[i]}`, p1Values[i]);
  }
  await page.click('button.commit-btn');
  for (let i = 0; i < coreDims.length; i += 1) {
    await page.fill(`#p3_${coreDims[i]}`, p3Values[i]);
  }

  await page.click('#submit-btn');
  await expect(page.locator('#submit-status')).toContainText('Submitted');
});

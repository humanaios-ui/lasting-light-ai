import { expect, test } from '@playwright/test';

const repos = [
  'humanaios-ui/humanaios',
  'humanaios-ui/operations',
  'humanaios-ui/lasting-light-ai',
];
async function mockPublicGitHub(page: import('@playwright/test').Page) {
  await page.route('https://api.github.com/repos/**', async route => {
    const url = new URL(route.request().url());
    const repo = repos.find(slug => url.pathname === '/repos/' + slug + '/issues');
    if (!repo) return route.fulfill({status:404,body:'not found'});
    const item = {
      number: 42,
      title: 'Public source sample — not an outcome',
      updated_at: new Date().toISOString(),
      html_url: 'https://github.com/' + repo + '/issues/42',
    };
    await route.fulfill({
      status:200,
      contentType:'application/json',
      body:JSON.stringify([item]),
    });
  });
}

test('constellation has eight working nodes, real evidence links and non-authority boundaries', async ({page}) => {
  const methods: string[] = [];
  page.on('request', r => { if (r.url().includes('api.github.com')) methods.push(r.method()); });
  await mockPublicGitHub(page);
  await page.goto('/ecosystem.html');
  await expect(page.getByRole('heading', {name:/living constellation/i})).toBeVisible();
  await expect(page.locator('.node-button')).toHaveCount(8);
  await expect(page.getByText('Witness asks: What is observed, what is claimed, and what remains unknown?')).toBeVisible();
  await page.getByRole('button', {name:/INTENT-OS/}).click();
  await expect(page.locator('#detail-access')).toHaveText('PRIVATE WORKSPACE');
  await expect(page.locator('#detail-boundary')).toContainText('protected');
  await expect(page.locator('#detail-actions a').first()).toHaveAttribute('href', /github\.com\/humanaios-ui\/operations\/issues\/1084/);
  await page.getByRole('button', {name:/Operations Observatory/}).click();
  await expect(page.locator('#detail-boundary')).toContainText('not a deployed');
  await expect(page.locator('#evidence-status')).toContainText('SOURCE SAMPLES READ');
  await expect(page.locator('#source-operations')).toContainText('not a total');
  await expect(page.locator('#source-operations a').first()).toHaveAttribute('href',
    'https://github.com/humanaios-ui/operations/issues/42');
  expect(methods.length).toBeGreaterThanOrEqual(3);
  expect(methods.every(m => m === 'GET')).toBe(true);
});

test('browser is readable on iPhone width and respects reduced motion', async ({page}) => {
  await mockPublicGitHub(page);
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/ecosystem.html');
  await expect(page.getByRole('heading', {name:/living constellation/i})).toBeVisible();
  await expect(page.locator('.node-button')).toHaveCount(8);
  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  const orbitAnimation = await page.locator('.core-orbit-one').evaluate(el => getComputedStyle(el).animationName);
  expect(orbitAnimation).toBe('none');
  await page.getByRole('button', {name:/ACAT/}).click();
  await expect(page.locator('#detail-actions a').first()).toHaveAttribute('href','/assess.html');
});

test('rate limiting is labeled unavailable, not live or verified', async ({page}) => {
  await page.route('https://api.github.com/repos/**', async route => {
    await route.fulfill({status:403,contentType:'application/json',body:'{"message":"rate limit"}'});
  });
  await page.goto('/ecosystem.html');
  await expect(page.locator('#evidence-status')).toContainText('PARTIAL OR UNAVAILABLE');
  await expect(page.locator('#source-humanaios')).toContainText('GitHub HTTP 403');
  await expect(page.locator('#scene')).not.toHaveClass(/source-sampled/);
});

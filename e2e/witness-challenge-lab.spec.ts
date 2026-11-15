import { test, expect } from '@playwright/test';

test('lab entrance labels pilot as preview and not recruiting', async ({page}) => {
  await page.goto('/lab');
  await expect(page.getByRole('heading', {name: /Study how humans and AI decide/i})).toBeVisible();
  await expect(page.getByRole('heading', {name: 'The Witness Challenge'})).toBeVisible();
  await expect(page.getByText(/Not recruiting · Not a registered public study/i)).toBeVisible();
  await page.getByRole('link', {name: /Open the fictional pilot preview/i}).click();
  await expect(page).toHaveURL(/\/lab\/witness-challenge$/);
  await expect(page.getByRole('heading', {name: /spot the missing proof/i})).toBeVisible();
});

test('raw condition can score entirely locally and exposes same source facts', async ({page}) => {
  const requests: string[] = [];
  page.on('request', r => { if (r.method() !== 'GET' || /witness|participant|experiment|intake/.test(r.url())) requests.push(r.url()); });
  await page.goto('/lab/witness-challenge');
  await page.getByRole('button', {name: 'Start fictional task'}).click();
  await expect(page.getByText('Fictional applicant packet')).toBeVisible();
  await expect(page.getByText(/SIMULATED AI SUMMARY/)).toHaveCount(0);
  await page.getByLabel('Hold and request missing proof').check();
  await page.getByLabel('Not provided').check();
  await page.getByLabel('Still unverified').check();
  await page.getByLabel('The designated human').check();
  await page.getByLabel('No benefit has been verified').check();
  await page.getByRole('button', {name: /Score locally/}).click();
  await expect(page.getByRole('heading', {name: /5 of 5 answers supported/})).toBeVisible();
  await expect(page.getByText(/No result was submitted or stored/)).toBeVisible();
  await expect(page.getByText(/Source: S3/)).toBeVisible();
  expect(requests.filter(url => url.includes('/api/'))).toEqual([]);
  await page.getByRole('button', {name: /Clear answers and return to setup/}).click();
  await expect(page.getByRole('button', {name: 'Start fictional task'})).toBeVisible();
});

test('three QA conditions stay distinct and false-ready remains an explicit error', async ({page}) => {
  await page.goto('/lab/witness-challenge');
  await page.getByRole('radio', {name: /C · AI \+ Witness/}).check();
  await page.getByRole('button', {name: 'Start fictional task'}).click();
  await expect(page.getByText(/SIMULATED AI SUMMARY/)).toBeVisible();
  await expect(page.getByText(/SIMULATED WITNESS CHECK/)).toBeVisible();
  await page.getByLabel('Ready to submit').check();
  await page.getByLabel('Not provided').check();
  await page.getByLabel('Still unverified').check();
  await page.getByLabel('The AI assistant').check();
  await page.getByLabel('No benefit has been verified').check();
  await page.getByRole('button', {name: /Score locally/}).click();
  await expect(page.getByRole('heading', {name: /3 of 5 answers supported/})).toBeVisible();
  await expect(page.getByRole('alert')).toContainText('unsupported application READY');
  await expect(page.getByRole('alert')).toContainText('human gate');
});

test('mobile 390px preview keeps the task accessible', async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/lab/witness-challenge');
  await expect(page.getByRole('heading', {name: /spot the missing proof/i})).toBeVisible();
  await page.getByRole('radio', {name: /B · AI summary/}).check();
  await page.getByRole('button', {name: 'Start fictional task'}).click();
  await expect(page.getByText(/SIMULATED AI SUMMARY/)).toBeVisible();
  await expect(page.getByText(/SIMULATED WITNESS CHECK/)).toHaveCount(0);
  await expect(page.getByRole('button', {name: /Score locally/})).toBeDisabled();
});

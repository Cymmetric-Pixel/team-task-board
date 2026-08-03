import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

test('user can create a task and see it appear in the board', async ({ page }) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowString = tomorrow.toISOString().slice(0, 10);

  await page.getByLabel('Task title').fill('Write rollout plan');
  await page.getByLabel('Due date').fill(tomorrowString);
  await page.getByRole('button', { name: 'Add task' }).click();

  await expect(page.getByText('Write rollout plan')).toBeVisible();
});

test('shows a validation message when a past due date is submitted', async ({ page }) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().slice(0, 10);

  await page.getByLabel('Task title').fill('Needs review');
  await page.getByLabel('Due date').fill(yesterdayString);
  await page.getByRole('button', { name: 'Add task' }).click();

  await expect(page.getByText('Due date must be today or later.')).toBeVisible();
});

test('filter and search compose so only matching active tasks remain visible', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Task title').fill('Review');
  await page.getByRole('button', { name: 'Add task' }).click();
  await expect(page.getByText('Review')).toBeVisible();

  await page.getByLabel('Task title').fill('Ship feature');
  await page.getByRole('button', { name: 'Add task' }).click();

  await expect(page.getByText('Ship feature')).toBeVisible();
  const checkbox = page.getByRole('checkbox').last();
  await expect(checkbox).toBeVisible();
  await checkbox.check();

  await page.getByRole('tab', { name: 'Active' }).click();
  await page.getByLabel('Search tasks').fill('review');

  await expect(page.getByText('Review')).toBeVisible();
  await expect(page.getByText('Ship feature')).toHaveCount(0);
});

import { test, expect } from '@playwright/test';
import { TaskPage } from '../TestingPOM';

test('has title', async ({ page }) => {
  const taskPage = new TaskPage(page);
  await taskPage.goto();
  await taskPage.taskForm.fillForm('Test Task', 'Medium', '2026-06-03');
  await taskPage.toolBar.search.fill('Test Task');

});

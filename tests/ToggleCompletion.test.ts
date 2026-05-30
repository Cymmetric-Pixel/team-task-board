import { test, expect } from '@playwright/test';
import { addOrSubtractDays, formatLocalDate, Priority, TaskPage } from '../TestingPOM';

const today = formatLocalDate(new Date());
const yesterday = formatLocalDate(addOrSubtractDays(new Date(), -1));
const tomorrow = formatLocalDate(addOrSubtractDays(new Date(), 1));
  
  
  test('Toggle Completion task', async ({ page }) => {
    let taskName = `Toggle Completion task`;
    let priority:Priority = 'Medium';
    const taskPage = new TaskPage(page);
    await taskPage.goto();
    await taskPage.taskForm.addTask(taskName, priority);
    await taskPage.taskList.validateTaskFields(taskName, priority)
    await taskPage.taskList.completionToggleForTask(taskName).check();
    await taskPage.toolBar.CompleteFilter.click();
    await taskPage.taskList.validateTaskFields(taskName, priority)

  });
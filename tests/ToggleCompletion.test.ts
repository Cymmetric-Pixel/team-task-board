import { test } from '@playwright/test';
import { Priority, TaskPage } from '../TestingPOM';

test('Toggle Completion task', async ({ page }) => {
    let taskName = `Toggle Completion task`;
    let priority: Priority = 'Medium';
    const taskPage = new TaskPage(page);
    await taskPage.goto();
    await taskPage.taskForm.addTask(taskName, priority);
    await taskPage.taskList.validateTaskFields(taskName, priority)
    await taskPage.taskList.completionToggleForTask(taskName).check();
    await taskPage.toolBar.CompleteFilter.click();
    await taskPage.taskList.validateTaskFields(taskName, priority)

});
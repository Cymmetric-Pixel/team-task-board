import { expect, test } from '@playwright/test';
import { formatLocalDate, TaskPage, TestTask } from '../TestingPOM';

const today = formatLocalDate(new Date());

  
test('Sort tasks', async ({ page }) => {
    const testTasks: TestTask[] = [
        { name: 'Medium Sort Task', priority: 'Medium' },
        { name: 'Little Sort Task', priority: 'Low' },
        { name: 'Big Sort Task', priority: 'High' }
    ];
    const taskPage = new TaskPage(page);
    await taskPage.goto();

    for(let testTask of testTasks){
        await taskPage.taskForm.addTask(testTask.name, testTask.priority, today);
        await taskPage.taskList.validateTaskFields(testTask.name, testTask.priority, today)
    }

    let tasks = await taskPage.taskList.getAllTasks()
    await expect(tasks[0].locator(`[class*="priority"]`)).toContainText('High', {ignoreCase: true});
    await expect(tasks[1].locator(`[class*="priority"]`)).toContainText('Medium', {ignoreCase: true});
    await expect(tasks[2].locator(`[class*="priority"]`)).toContainText('Low', {ignoreCase: true});

});
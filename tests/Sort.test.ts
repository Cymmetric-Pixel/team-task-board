import { test, expect } from '@playwright/test';
import { addOrSubtractDays, formatLocalDate, Priority, TaskPage, TestTask } from '../TestingPOM';

const today = formatLocalDate(new Date());
const yesterday = formatLocalDate(addOrSubtractDays(new Date(), -1));
const tomorrow = formatLocalDate(addOrSubtractDays(new Date(), 1));
  
  
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
    await expect(tasks[0].locator(`[class*="priority"]`)).toContainText('High');
    await expect(tasks[0].locator(`[class*="priority"]`)).toContainText('Medium');
    await expect(tasks[0].locator(`[class*="priority"]`)).toContainText('Low');

});
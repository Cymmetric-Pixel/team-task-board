import { test, expect } from '@playwright/test';
import { addOrSubtractDays, formatLocalDate, Priority, TaskPage, TestTask } from '../TestingPOM';

const today = formatLocalDate(new Date());
const yesterday = formatLocalDate(addOrSubtractDays(new Date(), -1));
const tomorrow = formatLocalDate(addOrSubtractDays(new Date(), 1));
  


test('Search tasks', async ({ page }) => {
    const testTasks: TestTask[] = [
        { name: 'Random Search test', priority: 'Low' },
        { name: 'Gibberish to search', priority: 'Medium' },
        { name: 'Blah Blah', priority: 'High' },
    ];
    const taskPage = new TaskPage(page);
    await taskPage.goto();

    for(let testTask of testTasks){
        await taskPage.taskForm.addTask(testTask.name, testTask.priority, today);
        await taskPage.taskList.validateTaskFields(testTask.name, testTask.priority, today)
    }

    await taskPage.toolBar.search('random');
    await taskPage.taskList.confirmSearch('random');
    
    await taskPage.toolBar.search('Gibberish');
    await taskPage.taskList.confirmSearch('Gibberish');

    await taskPage.toolBar.search('Blah');
    await taskPage.taskList.confirmSearch('Blah');

});
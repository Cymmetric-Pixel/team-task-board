import { test } from '@playwright/test';
import { formatLocalDate, TaskPage, TestTask } from '../TestingPOM';

const today = formatLocalDate(new Date());  


test('Search tasks', async ({ page }) => {
    const testTasks: TestTask[] = [
        { name: 'Random Search test', priority: 'Low' },
        { name: 'Gibberish to search', priority: 'Medium' },
        { name: 'Blah Blah search', priority: 'High' },
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

    await taskPage.toolBar.search('search');
    await taskPage.taskList.confirmSearch('search');

});

test('Search tasks - case', async ({ page }) => {
    const testTasks: TestTask[] = [
        { name: 'Random Search test', priority: 'Low' },
        { name: 'Gibberish to search', priority: 'Medium' },
        { name: 'Blah Blah search', priority: 'High' },
    ];
    const taskPage = new TaskPage(page);
    await taskPage.goto();

    for(let testTask of testTasks){
        await taskPage.taskForm.addTask(testTask.name, testTask.priority, today);
        await taskPage.taskList.validateTaskFields(testTask.name, testTask.priority, today)
    }

    await taskPage.toolBar.search('RaNdom');
    await taskPage.taskList.confirmSearch('RaNdom');
    
    await taskPage.toolBar.search('GiBBerish');
    await taskPage.taskList.confirmSearch('GiBBerish');

    await taskPage.toolBar.search('blah');
    await taskPage.taskList.confirmSearch('blah');

    await taskPage.toolBar.search('Search');
    await taskPage.taskList.confirmSearch('Search');

});
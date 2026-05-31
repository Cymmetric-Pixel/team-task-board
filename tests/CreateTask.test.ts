import { test, expect } from '@playwright/test';
import { addOrSubtractDays, formatLocalDate, Priority, TaskPage } from '../TestingPOM';

const today = formatLocalDate(new Date());
const yesterday = formatLocalDate(addOrSubtractDays(new Date(), -1));


let taskName = 'Create Task'

test('Create tasks', async ({ page }) => {
    const taskPage = new TaskPage(page);
    await taskPage.goto();

    const priorities: Priority[] = ["Low", "Medium", "High"];
    for (let priority of priorities) {
        let taskName = 'Create Task'
        taskName = `${taskName} ${priority}`

        await taskPage.taskForm.addTask(taskName, priority, today);

        await taskPage.taskList.validateTaskFields(taskName, priority, today)


    }

});

test('Create task - no Date', async ({ page }) => {
    taskName = `${taskName} - no Date`;
    let priority: Priority = 'Medium';
    const taskPage = new TaskPage(page);
    await taskPage.goto();
    await taskPage.taskForm.addTask(taskName, priority);
    await taskPage.taskList.validateTaskFields(taskName, priority)

});

test('Create task - Past Date', async ({ page }) => {
    taskName = `${taskName} - Past Date`;
    let priority: Priority = 'Medium';
    const taskPage = new TaskPage(page);
    await taskPage.goto();
    await taskPage.taskForm.addTask(taskName, priority, yesterday);
    await expect(page.getByText('Due Date must be current or future.')).toBeVisible(); //this is checking for an error message that should pop-up
    await expect(taskPage.taskList.taskItemByText('Create Task - Past Date')).not.toBeVisible();

});

test('Create task - no Task Name', async ({ page }) => {
    const taskPage = new TaskPage(page);
    await taskPage.goto();
    await page.getByRole('button', { name: 'Add task' }).click();
    await expect(page.getByText('Title is required.')).toBeVisible();
    await expect(taskPage.taskList.taskItemByText('Create Task - no Task Name')).not.toBeVisible();
});

test('Create task - blankspace Task Name', async ({ page }) => {
    let priority: Priority = 'Medium';

    const taskPage = new TaskPage(page);
    await taskPage.goto();
    await taskPage.taskForm.addTask('   ', priority);
    await expect(page.getByText('Title is required.')).toBeVisible();
    await expect(taskPage.taskList.taskItemByText('Create Task - blankspace Task Name')).not.toBeVisible();
});

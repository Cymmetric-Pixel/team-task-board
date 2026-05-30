import { test, expect } from '@playwright/test';
import { addOrSubtractDays, formatLocalDate, Priority, TaskPage } from '../TestingPOM';

const today = formatLocalDate(new Date());
const yesterday = formatLocalDate(addOrSubtractDays(new Date(), -1));
const tomorrow = formatLocalDate(addOrSubtractDays(new Date(), 1));


test.describe('TTB-1-Create-Task',() => {
  let taskName = 'Create Task'
  /**
   User can enter a title, pick a priority, and optionally pick a due date, then click Add task.
  On success, the new task appears in the list.
  After clicking Add, the form clears so the user can add another task quickly.
  Title is required. A title made up entirely of whitespace is treated the same as an empty title and is rejected with a visible error message.
  Priority must be one of low, medium, high. Default is medium.
  Due date is optional. If provided, it must be today or later — past dates must be rejected with a visible error message.
  Validation errors are shown inline near the form, not as a global toast.
  */  
  test('Create tasks', async ({ page }) => {
    const taskPage = new TaskPage(page);
    await taskPage.goto();
  
    const priorities: Priority[] = ["Low", "Medium", "High"];
    // let taskLocator = page.getByTitle('Create Task Low', { exact: true })
    // page.locator('[class="task-list"]').locator('[class="task-item"]').filter({ has: taskPage.taskList.taskItems.page.getByTitle('Create Task Low', { exact: true }) })
    for(let priority of priorities){
      taskName = `${taskName} ${priority}`

      await taskPage.taskForm.addTask(taskName, priority, today);

      await taskPage.taskList.validateTaskFields(taskName, priority, today)
      

    }

  });

  test('Create task - no Date', async ({ page }) => {
    taskName = `${taskName} - no Date`;
    let priority:Priority = 'Medium';
    const taskPage = new TaskPage(page);
    await taskPage.goto();
    await taskPage.taskForm.addTask(taskName, priority);
    await taskPage.taskList.validateTaskFields(taskName, priority)

  });

  test('Create task - Past Date', async ({ page }) => {
    taskName = `${taskName} - Past Date`;
    let priority:Priority = 'Medium';
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
    let priority:Priority = 'Medium';

    const taskPage = new TaskPage(page);
    await taskPage.goto();
    await taskPage.taskForm.addTask('   ', priority);
    await expect(page.getByText('Title is required.')).toBeVisible();
    await expect(taskPage.taskList.taskItemByText('Create Task - blankspace Task Name')).not.toBeVisible();
  });
  
});
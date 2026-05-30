import { test, expect } from '@playwright/test';
import { TaskPage } from '../TestingPOM';

test.describe('TTB-1-Create-Task',() => {

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
    await taskPage.taskForm.addTask('Create Task Low', 'Low', '2026-06-03');
    await expect(taskPage.taskList.taskItemByText('Test Task Low')).toBeVisible();

    await taskPage.taskForm.addTask('Create Task Medium', 'Medium', '2026-06-03');
    await expect(taskPage.taskList.taskItemByText('Test Task Medium')).toBeVisible();

    await taskPage.taskForm.addTask('Create Task High', 'High', '2026-06-03');
    await expect(taskPage.taskList.taskItemByText('Test Task High')).toBeVisible();

    await taskPage.page.reload();
    await expect(taskPage.taskList.taskItemByText('Create Task Low')).toBeVisible();
    await expect(taskPage.taskList.taskItemByText('Create Task Medium')).toBeVisible();
    await expect(taskPage.taskList.taskItemByText('Create Task High')).toBeVisible();

  });

  test('Create task - no Date', async ({ page }) => {
    const taskPage = new TaskPage(page);
    await taskPage.goto();
    await taskPage.taskForm.addTask('Create Task - no Date', 'Medium');
    await expect(taskPage.taskList.taskItemByText('Create Task - no Date')).toBeVisible();
    await taskPage.page.reload();
    await expect(taskPage.taskList.taskItemByText('Create Task - no Date')).toBeVisible();

  });

  test('Create task - Past Date', async ({ page }) => {
    const taskPage = new TaskPage(page);
    await taskPage.goto();
    await taskPage.taskForm.addTask('Create Task - Past Date', 'Medium', '2000-06-03');
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
    const taskPage = new TaskPage(page);
    await taskPage.goto();
    await taskPage.taskForm.addTask('   ', 'Low', '2026-06-03');
    await expect(page.getByText('Title is required.')).toBeVisible();
    await expect(taskPage.taskList.taskItemByText('Create Task - blankspace Task Name')).not.toBeVisible();
  });
  
});

test.describe('TTB-2-Edit-Task',() => {
  /**
   *  Clicking Edit on a task reveals an inline editor with the current title, priority, and due date pre-filled.
 Clicking Save updates the task in the list and persists the change.
 Clicking Cancel closes the editor and discards changes.
 Edit reuses the same validation rules as create (see TTB-1) — whitespace-only titles, invalid priorities, and past due dates are all rejected with an inline error.
 The task's updatedAt timestamp is bumped on save.
   */

  test('Edit task', async ({ page }) => {
    const taskPage = new TaskPage(page);
    await taskPage.goto();
    await taskPage.taskForm.addTask('Edit Task', 'Low', '2026-06-03');
    await expect(taskPage.taskList.taskItemByText('Edit Task')).toBeVisible();
    await taskPage.page.reload();
    await expect(taskPage.taskList.taskItemByText('Edit Task')).toBeVisible();
    await taskPage.taskList.editButtonForTask('Edit Task').click()
    await taskPage.taskList.editTask('Edit Task', 'Edit Task - edited', 'High', '2026-07-03');
    await expect(taskPage.taskList.taskItemByText('Edit Task')).not.toBeVisible();
    await expect(taskPage.taskList.taskItemByText('Edit Task - edited')).toBeVisible();
    await taskPage.page.reload();
    await expect(taskPage.taskList.taskItemByText('Edit Task')).not.toBeVisible();
    await expect(taskPage.taskList.taskItemByText('Edit Task - edited')).toBeVisible();
  });

  test('Edit task - Past Date', async ({ page }) => {
    const taskPage = new TaskPage(page);
    await taskPage.goto();
    await taskPage.taskForm.addTask('Edit Task  - Past Date', 'Low', '2026-06-03');
    await expect(taskPage.taskList.taskItemByText('Edit Task - Past Date')).toBeVisible();
    await taskPage.page.reload();
    await expect(taskPage.taskList.taskItemByText('Edit Task - Past Date')).toBeVisible();
    await taskPage.taskList.editButtonForTask('Edit Task - Past Date').click()
    await taskPage.taskList.editTask('Edit Task - Past Date', 'Edit Task - Past Date', 'Low', '2000-06-03');

    await expect(taskPage.taskList.taskItemByText('Edit Task - Past Date').getByText('Due Date must be current or future.')).toBeVisible(); //this is checking for an error message that should pop-up


  });

  test('Edit task - no Task Name', async ({ page }) => {
    const taskPage = new TaskPage(page);
    await taskPage.goto();
    await taskPage.taskForm.addTask('Edit Task  - no Task Name', 'Low', '2026-06-03');
    await expect(taskPage.taskList.taskItemByText('Edit Task - no Task Name')).toBeVisible();
    await taskPage.page.reload();
    await expect(taskPage.taskList.taskItemByText('Edit Task - no Task Name')).toBeVisible();
    await taskPage.taskList.editButtonForTask('Edit Task - no Task Name').click()
    await taskPage.taskList.editTask('Edit Task - no Task Name', '', 'Low', '2026-06-03');
    
    await expect(taskPage.taskList.taskItemByText('Edit Task - no Task Name').getByText('Title is required.')).toBeVisible();
    
  });
  test('Edit task - blankspace Task Name', async ({ page }) => {
    const taskPage = new TaskPage(page);
    await taskPage.goto();
    await taskPage.taskForm.addTask('Edit Task  - blankspace Task Name', 'Low', '2026-06-03');
    await expect(taskPage.taskList.taskItemByText('Edit Task - blankspace Task Name')).toBeVisible();
    await taskPage.page.reload();
    await expect(taskPage.taskList.taskItemByText('Edit Task - blankspace Task Name')).toBeVisible();
    await taskPage.taskList.editButtonForTask('Edit Task - blankspace Task Name').click()
    await taskPage.taskList.editTask('Edit Task - blankspace Task Name', '   ', 'Low', '2026-06-03');
    
    await expect(taskPage.taskList.taskItemByText('Edit Task - blankspace Task Name').getByText('Title is required.')).toBeVisible();
    
  });

});

test.describe('TTB-3-Delete-Task',() => {
  /**
   *  Clicking Edit on a task reveals an inline editor with the current title, priority, and due date pre-filled.
 Clicking Save updates the task in the list and persists the change.
 Clicking Cancel closes the editor and discards changes.
 Edit reuses the same validation rules as create (see TTB-1) — whitespace-only titles, invalid priorities, and past due dates are all rejected with an inline error.
 The task's updatedAt timestamp is bumped on save.
   */

  test('Create tasks', async ({ page }) => {
    const taskPage = new TaskPage(page);
    await taskPage.goto();
    await taskPage.taskForm.addTask('Test Task Low', 'Low', '2026-06-03');
    await expect(taskPage.taskList.taskItemByText('Test Task Low')).toBeVisible();
    await taskPage.page.reload();
    await expect(taskPage.taskList.taskItemByText('Test Task Low')).toBeVisible();

  });

});
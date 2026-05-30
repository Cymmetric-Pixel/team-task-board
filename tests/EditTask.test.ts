import { test, expect } from '@playwright/test';
import { addOrSubtractDays, formatLocalDate, Priority, TaskPage } from '../TestingPOM';

const today = formatLocalDate(new Date());
const yesterday = formatLocalDate(addOrSubtractDays(new Date(), -1));
const tomorrow = formatLocalDate(addOrSubtractDays(new Date(), 1));


test.describe('TTB-2-Edit-Task',() => {
  /**
   *  Clicking Edit on a task reveals an inline editor with the current title, priority, and due date pre-filled.
 Clicking Save updates the task in the list and persists the change.
 Clicking Cancel closes the editor and discards changes.
 Edit reuses the same validation rules as create (see TTB-1) — whitespace-only titles, invalid priorities, and past due dates are all rejected with an inline error.
 The task's updatedAt timestamp is bumped on save.
   */
  let taskName:string = 'Edit task';
  test('Edit task - normal', async ({ page }) => {
    taskName = `${taskName} - normal`;
    let priority:Priority = 'Medium';

    const taskPage = new TaskPage(page);
    await taskPage.goto();
    await taskPage.taskForm.addTask(taskName, priority, today);
    await taskPage.taskList.validateTaskFields(taskName, priority, today)

    let newTaskName = taskName + " - edited"
    let newPriority:Priority = 'High'
    await taskPage.taskList.editButtonForTask(taskName).click()
    await taskPage.taskList.editTask(taskName, newTaskName, newPriority, tomorrow);
    await taskPage.taskList.saveButtonForTask(taskName).click();

    await taskPage.taskList.validateTaskFields(newTaskName, newPriority, tomorrow);

  });

  test('Edit task - Past Date', async ({ page }) => {
    taskName = `${taskName} - Past Date`;
    let priority:Priority = 'Medium';

    const taskPage = new TaskPage(page);
    await taskPage.goto();
    await taskPage.taskForm.addTask(taskName, priority, today);
    await taskPage.taskList.validateTaskFields(taskName, priority, today)

    let newTaskName = taskName + " - edited"
    await taskPage.taskList.editButtonForTask(taskName).click()
    await taskPage.taskList.editTask(taskName, newTaskName, priority, yesterday);
    await taskPage.taskList.saveButtonForTask(taskName).click();
    

    await expect(taskPage.taskList.taskItemByText('Edit Task - Past Date').getByText('Due Date must be current or future.')).toBeVisible(); //this is checking for an error message that should pop-up


  });

  test('Edit task - no Task Name', async ({ page }) => {
    taskName = `${taskName} - no Task Name`;
    let priority:Priority = 'Medium';

    const taskPage = new TaskPage(page);
    await taskPage.goto();
    await taskPage.taskForm.addTask(taskName, priority, today);
    await taskPage.taskList.validateTaskFields(taskName, priority, today)

    await taskPage.taskList.editButtonForTask(taskName).click()
    await taskPage.taskList.editTask(taskName, '', priority);
    await taskPage.taskList.saveButtonForTask(taskName).click();
    
    await expect(taskPage.taskList.taskItemByText(taskName).getByText('Title is required.')).toBeVisible();
    
  });
  test('Edit task - blankspace Task Name', async ({ page }) => {
    taskName = `${taskName} - blankspace Task Name`;
    let priority:Priority = 'Medium';

    const taskPage = new TaskPage(page);
    await taskPage.goto();
    await taskPage.taskForm.addTask(taskName, priority, today);
    await taskPage.taskList.validateTaskFields(taskName, priority, today)

    await taskPage.taskList.editButtonForTask(taskName).click()
    await taskPage.taskList.editTask(taskName, '   ', priority);
    await taskPage.taskList.saveButtonForTask(taskName).click();
    
    await expect(taskPage.taskList.taskItemByText(taskName).getByText('Title is required.')).toBeVisible();
    
  });

  test('Edit task - Cancel', async ({ page }) => {
    taskName = `${taskName} - Cancel`;
    let priority:Priority = 'Medium';

    const taskPage = new TaskPage(page);
    await taskPage.goto();
    await taskPage.taskForm.addTask(taskName, priority, today);
    await taskPage.taskList.validateTaskFields(taskName, priority, today)

    let newTaskName = taskName + " - edited"
    let newPriority:Priority = 'High'
    await taskPage.taskList.editButtonForTask(taskName).click()
    await taskPage.taskList.editTask(taskName, newTaskName, newPriority, tomorrow);
    await taskPage.taskList.cancelButtonForTask(taskName).click();

    await taskPage.taskList.validateTaskFields(taskName, priority, today)

  });

});
import { test, expect } from '@playwright/test';
import { addOrSubtractDays, formatLocalDate, Priority, TaskPage } from '../TestingPOM';

const today = formatLocalDate(new Date());
const yesterday = formatLocalDate(addOrSubtractDays(new Date(), -1));
const tomorrow = formatLocalDate(addOrSubtractDays(new Date(), 1));

test.describe('TTB-3-Delete-Task',() => {
/**
 *  Clicking Delete on a task removes it from the visible list immediately.
 The deletion is persisted. After a full page refresh, the task is still gone.
 Deleting one task does not affect any other task's title, priority, due date, or completion state.
 Deleting the last task in the list shows the empty-state message.
 */
  test('Delete task - 1 Task', async ({ page }) => {
    let taskName = `Delete Task 1`;
    let priority:Priority = 'Medium';
    const taskPage = new TaskPage(page);
    await taskPage.goto();
    await taskPage.taskForm.addTask(taskName, priority);
    await taskPage.taskList.validateTaskFields(taskName, priority)

    await taskPage.taskList.deleteButtonForTask(taskName).click();
    await taskPage.taskList.validateTaskDelete(taskName, priority); //validates the right one got deleted
    
    await expect(taskPage.page.getByText('No tasks to show.')).toBeVisible();//No tasks to show. means all got deleted

  });

  test('Delete task - 2 Tasks', async ({ page }) => {
    let taskName = `Delete Task 1`;
    let taskName2 = `Delete Task 2`;
    let priority:Priority = 'Medium';
    const taskPage = new TaskPage(page);
    await taskPage.goto();
    await taskPage.taskForm.addTask(taskName, priority);
    await taskPage.taskList.validateTaskFields(taskName, priority)
    await taskPage.taskForm.addTask(taskName2, priority);
    await taskPage.taskList.validateTaskFields(taskName2, priority)

    await taskPage.taskList.deleteButtonForTask(taskName).click();
    await taskPage.taskList.validateTaskDelete(taskName, priority); //validates the right one got deleted
    await taskPage.taskList.validateTaskFields(taskName2, priority);// validates the other one stays
    
    await taskPage.taskList.deleteButtonForTask(taskName2).click();
    await taskPage.taskList.validateTaskDelete(taskName2, priority); //validates the right one got deleted

    await expect(taskPage.page.getByText('No tasks to show.')).toBeVisible();//No tasks to show. means all got deleted

  });

});
import { expect, test } from '@playwright/test';
import { Priority, TaskPage } from '../TestingPOM';


test('Delete task - 1 Task', async ({ page }) => {
  let taskName = `Delete Task 1`;
  let priority: Priority = 'Medium';
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
  let priority: Priority = 'Medium';
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

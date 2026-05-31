import { expect, Locator, Page } from '@playwright/test';

export type Priority = 'High' | 'Medium' | 'Low';
export type TestTask = {
  name: string;
  priority: Priority;
};

export class TaskPage {
  readonly page: Page;
  readonly taskForm: TaskForm;
  readonly toolBar: ToolBar;
  readonly taskList: TaskList

  constructor(page: Page) {
    this.page = page;
    this.taskForm = new TaskForm(page);
    this.toolBar = new ToolBar(page);
    this.taskList = new TaskList(page)
  }

  async goto() {
    await this.page.goto('/');
  }
}

export class TaskForm {
  readonly form: Locator;
  readonly taskInput: Locator;
  readonly priorityDropdown: Locator;
  readonly submitButton: Locator;
  readonly dueDate: Locator;

  constructor(page: Page) {
    this.form = page.locator('[class="task-form"]');

    // Scoped inside the form
    this.taskInput = this.form.getByRole('textbox', { name: 'Task title' });
    this.priorityDropdown = this.form.getByLabel('Priority');
    this.dueDate = this.form.getByRole('textbox', { name: 'Due date' });
    this.submitButton = this.form.getByRole('button', { name: 'Add task' });
  }
  async addTask(taskName: string, priority: Priority, dueDate?: string) {
    await this.taskInput.fill(taskName);
    await this.priorityDropdown.selectOption(priority);
    if (dueDate !== undefined){
      await this.dueDate.fill(dueDate!);
    }
    await this.submitButton.click();
  }
}

export class ToolBar {
  readonly toolBar: Locator;
  readonly searchBox: Locator;
  readonly AllFilter: Locator;
  readonly ActiveFilter: Locator;
  readonly CompleteFilter: Locator;

  constructor(page: Page) {
    this.toolBar = page.locator('[class="toolbar"]');

    // Scoped inside the toolbar
    this.searchBox = this.toolBar.locator('input[type="search"]');
    this.AllFilter = this.toolBar.locator('[class="filters"]').getByText('All');
    this.ActiveFilter = this.toolBar.locator('[class="filters"]').getByText('Active');
    this.CompleteFilter = this.toolBar.locator('[class="filters"]').getByText('Complete');
  }

  async search(searchTerm: string){
    await this.searchBox.fill(searchTerm);
  }

}


export class TaskList {
  readonly page: Page;
  readonly taskList: Locator;
  readonly taskItems: Locator;


  constructor(page: Page) {
    this.page = page
    this.taskList = page.locator('[class*="task-list"]');
    this.taskItems = this.taskList.locator('[class*="task-item"]');
  }

  // async taskItemByText(taskName: string): Promise<Locator> {
  //   return this.taskItems.filter({
  //     has: this.page.getByTitle(taskName, { exact: true }),
  //   });
  // }
  taskItemByText(taskName: string): Locator {
    return this.taskItems.filter({
      hasText: taskName,
    });
  }

  async validateTaskFields(taskName: string, priority: Priority, dueDate?: string) {
    let expectedDate: string;
    if (dueDate == undefined){
      expectedDate = 'No due date'
    }
    else{
      expectedDate = `Due ${dueDate}`
    }
    await expect(this.taskItemByText(taskName)).toBeVisible();
    await expect(this.taskItemByText(taskName).locator(`[class*="priority"]`).getByText(priority)).toBeVisible();
    await expect(this.taskItemByText(taskName).getByText(expectedDate)).toBeVisible();

    try{
      await this.page.reload();
      await expect(this.taskItemByText(taskName)).toBeVisible();
      await expect(this.taskItemByText(taskName).locator(`[class*="priority"]`).getByText(priority)).toBeVisible();
      await expect(this.taskItemByText(taskName).getByText(expectedDate)).toBeVisible();
    }
    catch{
      throw new Error('Persistance Failed');
    }


  }

  async validateTaskDelete(taskName: string, priority: Priority, dueDate?: string) {
    let expectedDate: string;
    if (dueDate == undefined){
      expectedDate = 'No due date'
    }
    else{
      expectedDate = `Due ${dueDate}`
    }
    await expect(this.taskItemByText(taskName)).not.toBeVisible();
    await expect(this.taskItemByText(taskName).locator(`[class*="priority"]`).getByText(priority)).not.toBeVisible();
    await expect(this.taskItemByText(taskName).getByText(expectedDate)).not.toBeVisible();

    try {
      await this.page.reload(); 
      await expect(this.taskItemByText(taskName)).not.toBeVisible();
      await expect(this.taskItemByText(taskName).locator(`[class*="priority"]`).getByText(priority)).not.toBeVisible();
      await expect(this.taskItemByText(taskName).getByText(expectedDate)).not.toBeVisible(); 
    }
    catch{
      throw new Error('Persistance Failed');
    }
  }

  editButtonForTask(taskName: string): Locator {
    return this.taskItemByText(taskName).getByRole('button', { name: 'Edit' });
  }

  async editTask(originalTaskName: string, newTaskName: string, newPriority: Priority, dueDate?: string) {
    let taskItem = this.taskItemByText(originalTaskName)
    await taskItem.getByRole('textbox', { name: 'Edit title' }).fill(newTaskName);
    await taskItem.getByLabel('Edit priority').selectOption(newPriority);
    if (dueDate !== undefined){
      await taskItem.getByRole('textbox', { name: 'Edit due date' }).fill(dueDate!);
    }
  }

  deleteButtonForTask(taskName: string): Locator {
    return this.taskItemByText(taskName).getByRole('button', { name: 'Delete' });
  }

  saveButtonForTask(taskName: string): Locator {
    return this.taskItemByText(taskName).getByRole('button', { name: 'Save' });
  }

  cancelButtonForTask(taskName: string): Locator {
    return this.taskItemByText(taskName).getByRole('button', { name: 'Cancel' });
  }

  closeButtonForTask(taskName: string): Locator {
    return this.taskItemByText(taskName).getByRole('button', { name: 'Close' });
  }
  completionToggleForTask(taskName: string): Locator {
    return this.taskItemByText(taskName).getByRole('checkbox');
  }

  async getAllTasks(){
    return this.taskItems.all()
  }
  async confirmSearch(searchTerm: string){
    let tasks = await this.getAllTasks()
    for(let task of tasks){
      expect(task.getByText(searchTerm)).toBeVisible();
    }
  }
}


export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function addOrSubtractDays(date: Date, days: number): Date {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}
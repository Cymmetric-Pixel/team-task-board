import { Locator, Page } from '@playwright/test';

type Priority = 'High' | 'Medium' | 'Low';

export class TaskPage {
  readonly page: Page;
  readonly taskForm: TaskForm;
  readonly toolBar: ToolBar;

  constructor(page: Page) {
    this.page = page;
    this.taskForm = new TaskForm(page);
    this.toolBar = new ToolBar(page);
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
  async fillForm(taskName: string, priority: Priority, dueDate: string) {
    await this.taskInput.fill(taskName);
    await this.priorityDropdown.selectOption(priority);
    await this.dueDate.fill(dueDate);
    await this.submitButton.click();
  }
}

export class ToolBar {
  readonly toolBar: Locator;
  readonly search: Locator;
  readonly AllFilter: Locator;
  readonly ActiveFilter: Locator;
  readonly CompleteFilter: Locator;

  constructor(page: Page) {
    this.toolBar = page.locator('[class="toolbar"]');

    // Scoped inside the toolbar
    this.search = this.toolBar.locator('input[type="search"]');
    this.AllFilter = this.toolBar.locator('[class="filters"]').getByText('All');
    this.ActiveFilter = this.toolBar.locator('[class="filters"]').getByText('Active');
    this.CompleteFilter = this.toolBar.locator('[class="filters"]').getByText('Complete');
  }
}

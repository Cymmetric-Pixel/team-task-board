import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import * as fakeTaskApi from './api/fakeTaskApi';

vi.mock('./api/fakeTaskApi', async () => {
  const actual = await vi.importActual<typeof import('./api/fakeTaskApi')>('./api/fakeTaskApi');
  return {
    ...actual,
    getTasks: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
  };
});

const mockedApi = vi.mocked(fakeTaskApi);

function getFutureDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedApi.getTasks.mockResolvedValue([]);
    mockedApi.createTask.mockResolvedValue({
      id: 'new-task',
      title: 'Ship feature',
      completed: false,
      priority: 'high',
      dueDate: null,
      createdAt: '2026-07-30T10:00:00.000Z',
      updatedAt: '2026-07-30T10:00:00.000Z',
    });
  });

  it('adds a task from the form and shows it in the list', async () => {
    const user = userEvent.setup();
    const futureDate = getFutureDate();
    render(<App />);

    await user.type(screen.getByLabelText(/task title/i), 'Ship feature');
    await user.selectOptions(screen.getByLabelText(/priority/i), 'high');
    await user.type(screen.getByLabelText(/due date/i), futureDate);
    await user.click(screen.getByRole('button', { name: /add task/i }));

    expect(await screen.findByText('Ship feature')).toBeInTheDocument();
    expect(mockedApi.createTask).toHaveBeenCalledWith({
      title: 'Ship feature',
      priority: 'high',
      dueDate: futureDate,
    });
  });

  it('shows an error banner when saving fails', async () => {
    mockedApi.createTask.mockRejectedValueOnce(new Error('boom'));
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/task title/i), 'Broken task');
    await user.click(screen.getByRole('button', { name: /add task/i }));

    expect(await screen.findByText('Failed to add task.')).toBeInTheDocument();
  });

  it('keeps the form populated when a create attempt fails', async () => {
    mockedApi.createTask.mockRejectedValueOnce(new Error('boom'));
    const user = userEvent.setup();
    render(<App />);

    const titleInput = screen.getByLabelText(/task title/i);
    await user.type(titleInput, 'Broken task');
    await user.click(screen.getByRole('button', { name: /add task/i }));

    await waitFor(() => {
      expect(screen.getByText('Failed to add task.')).toBeInTheDocument();
    });

    expect(titleInput).toHaveValue('Broken task');
  });

  it('persists completion changes when a task is toggled', async () => {
    mockedApi.getTasks.mockResolvedValueOnce([
      {
        id: 'task-1',
        title: 'Existing task',
        completed: false,
        priority: 'medium',
        dueDate: null,
        createdAt: '2026-07-30T10:00:00.000Z',
        updatedAt: '2026-07-30T10:00:00.000Z',
      },
    ]);
    mockedApi.updateTask.mockResolvedValueOnce({
      id: 'task-1',
      title: 'Existing task',
      completed: true,
      priority: 'medium',
      dueDate: null,
      createdAt: '2026-07-30T10:00:00.000Z',
      updatedAt: '2026-07-30T10:00:00.000Z',
    });

    const user = userEvent.setup();
    render(<App />);

    await user.click(await screen.findByRole('checkbox', { name: /mark existing task complete/i }));

    await waitFor(() => {
      expect(mockedApi.updateTask).toHaveBeenCalledWith('task-1', { completed: true });
    });
  });

  it('allows editing a task and persists the updated values', async () => {
    const futureDate = getFutureDate();
    mockedApi.getTasks.mockResolvedValueOnce([
      {
        id: 'task-1',
        title: 'Old title',
        completed: false,
        priority: 'medium',
        dueDate: null,
        createdAt: '2026-07-30T10:00:00.000Z',
        updatedAt: '2026-07-30T10:00:00.000Z',
      },
    ]);
    mockedApi.updateTask.mockResolvedValueOnce({
      id: 'task-1',
      title: 'Updated title',
      completed: false,
      priority: 'high',
      dueDate: futureDate,
      createdAt: '2026-07-30T10:00:00.000Z',
      updatedAt: '2026-07-30T10:00:00.000Z',
    });

    const user = userEvent.setup();
    render(<App />);

    await user.click(await screen.findByRole('button', { name: /edit/i }));
    await user.clear(screen.getByLabelText(/edit title/i));
    await user.type(screen.getByLabelText(/edit title/i), 'Updated title');
    await user.selectOptions(screen.getByLabelText(/edit priority/i), 'high');
    await user.type(screen.getByLabelText(/edit due date/i), futureDate);
    await user.click(screen.getByRole('button', { name: /^save$/i }));

    await waitFor(() => {
      expect(mockedApi.updateTask).toHaveBeenCalledWith('task-1', {
        title: 'Updated title',
        priority: 'high',
        dueDate: futureDate,
      });
    });
  });
});

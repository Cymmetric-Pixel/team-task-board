import { describe, expect, it } from 'vitest';
import type { Task } from '../types/task';
import { filterTasks, searchTasks } from './taskFiltering';

const tasks: Task[] = [
  {
    id: '1',
    title: 'Write report',
    completed: false,
    priority: 'high',
    dueDate: '2026-08-01',
    archived: false,
    createdAt: '2026-07-30T10:00:00.000Z',
    updatedAt: '2026-07-30T10:00:00.000Z',
  },
  {
    id: '2',
    title: 'Review PR',
    completed: true,
    priority: 'medium',
    dueDate: null,
    archived: false,
    createdAt: '2026-07-30T10:00:00.000Z',
    updatedAt: '2026-07-30T10:00:00.000Z',
  },
  {
    id: '3',
    title: 'Archive old tasks',
    completed: false,
    priority: 'low',
    dueDate: null,
    archived: true,
    createdAt: '2026-07-30T10:00:00.000Z',
    updatedAt: '2026-07-30T10:00:00.000Z',
  },
];

describe('task filtering', () => {
  it('shows only non-archived tasks by default', () => {
    expect(filterTasks(tasks, 'all').map((task) => task.id)).toEqual(['1', '2']);
  });

  it('filters to active tasks only', () => {
    expect(filterTasks(tasks, 'active').map((task) => task.id)).toEqual(['1']);
  });

  it('filters to completed tasks only', () => {
    expect(filterTasks(tasks, 'completed').map((task) => task.id)).toEqual(['2']);
  });

  it('searches tasks by title case-insensitively', () => {
    expect(searchTasks(tasks, 'report').map((task) => task.id)).toEqual(['1']);
    expect(searchTasks(tasks, 'PR').map((task) => task.id)).toEqual(['2']);
  });
});

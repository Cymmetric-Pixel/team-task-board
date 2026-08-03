import { describe, expect, it } from 'vitest';
import type { Task } from '../types/task';
import { sortTasksByPriority } from './taskSorting';

const tasks: Task[] = [
  {
    id: '1',
    title: 'High task',
    completed: false,
    priority: 'high',
    dueDate: null,
    createdAt: '2026-07-30T10:00:00.000Z',
    updatedAt: '2026-07-30T10:00:00.000Z',
  },
  {
    id: '2',
    title: 'Low task',
    completed: false,
    priority: 'low',
    dueDate: null,
    createdAt: '2026-07-30T10:00:00.000Z',
    updatedAt: '2026-07-30T10:00:00.000Z',
  },
  {
    id: '3',
    title: 'Medium task',
    completed: false,
    priority: 'medium',
    dueDate: null,
    createdAt: '2026-07-30T10:00:00.000Z',
    updatedAt: '2026-07-30T10:00:00.000Z',
  },
];

describe('task sorting', () => {
  it('orders tasks by priority from high to low', () => {
    expect(sortTasksByPriority(tasks).map((task) => task.id)).toEqual(['1', '3', '2']);
  });
});

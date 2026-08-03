import { describe, expect, it } from 'vitest';
import { validateTaskInput } from './taskValidation';

describe('validateTaskInput', () => {
  it('rejects whitespace-only titles', () => {
    expect(
      validateTaskInput({ title: '   ', priority: 'medium', dueDate: null })
    ).toEqual({ valid: false, error: 'Title is required.' });
  });

  it('rejects due dates in the past', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dueDate = yesterday.toISOString().slice(0, 10);

    expect(
      validateTaskInput({ title: 'Ship feature', priority: 'medium', dueDate })
    ).toEqual({ valid: false, error: 'Due date must be today or later.' });
  });
});

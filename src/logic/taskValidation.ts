import type { TaskInput, TaskPriority } from "../types/task";

export type ValidationResult =
  | { valid: true }
  | { valid: false; error: string };

const VALID_PRIORITIES: TaskPriority[] = ["low", "medium", "high"];

export function validateTaskInput(input: TaskInput): ValidationResult {
  const trimmedTitle = input.title.trim();

  if (trimmedTitle.length === 0) {
    return { valid: false, error: "Title is required." };
  }

  if (!VALID_PRIORITIES.includes(input.priority)) {
    return { valid: false, error: "Priority must be low, medium, or high." };
  }

  if (input.dueDate) {
    const parsed = new Date(input.dueDate);
    if (Number.isNaN(parsed.getTime())) {
      return { valid: false, error: "Due date is invalid." };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (parsed < today) {
      return { valid: false, error: "Due date must be today or later." };
    }
  }

  return { valid: true };
}

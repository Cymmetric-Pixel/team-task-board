# Bugs Report

## Summary
I reviewed the app against the Jira-style requirements and checked it as if I were doing a QA pass for a small MVP product. Most of the core flows work, but there were a few issues that could easily confuse users or make the app feel unreliable.

The main problems were around validation, failed saves, and completion persistence. These have now been addressed, and the app is backed by a more meaningful set of tests.

## 1. Validation was too loose
One of the biggest issues was that the app allowed obviously bad input. A title made up only of spaces was treated as valid, and a due date in the past was also accepted.

That was a mismatch with the expected behavior from the tickets. The app now trims titles, rejects empty or whitespace-only values, and shows a clear inline error when a due date is in the past.

## 2. Failed task creation was not handled well
When creating a task failed, the form would still behave as though the save had been reset, which made it harder for the user to recover and try again.

The form now keeps the entered title in place after a failed save, so the user can correct the issue and submit again without losing their input.

## 3. Completing a task did not always persist correctly
The checkbox looked like it worked visually, but the completion state was not reliably being saved through the task API. That meant the change could be lost after refresh.

This has been fixed so completion changes go through the same update flow as other task edits and are properly persisted.

## 4. Test coverage was too light for important behaviors
The project originally had only a basic happy-path UI test and a few logic tests. That was not enough to catch issues around validation, save errors, editing, or the interaction between filters and search.

I added additional unit, component, and end-to-end tests so these flows are covered more realistically.

## Notes on quality and reliability
The app now has a simple CI workflow that runs the build, unit tests, and browser tests automatically. That makes it much easier to catch regressions going forward.

The current persistence layer is still a browser-based fake API using localStorage, which is fine for an MVP, but it should be treated as a temporary solution rather than a long-term storage strategy.

# Overview/Explainations
## Testing style and Choice
I chose to use a testing platform called Playwright. It is a front-end testint platform that executes tests in browser. I chose this framework because it is what I have most experience with. I did not perform unit testing because I am not familiar with them. In my current position, app devs do the unit testing, while my team focuses on the front-end/user experience testing. Using Playwright indirectly test most features of apps, however it is hard to isolate individual features. I do my best to isolate features by writing individual tests for each feature, rather than writing one test that touches all features. This also helps with identifying bugs after the tests run. Playwright produces a report after the tests have run. The report contains pass, fail and flakey logs, with the options to include videos, screenshots and trace logs of each individual test.

## How to run the tests
Run 'npx playwright test' in the terminal were playwright.config.ts exists. 
This file contains all of the config options for playwright including a script to build the app in localhost that the tests point at.

# Bug Log

## Bug 1 - Create Past Date - Medium

### Explaination of Priority
You can still create a task. Failure to be able to create a task would be high. 
However it is a feature that directly affects the user flow and effectiveness. 
Arguements could be made for a high priority.

### Description
Creating a task allows entering a past date for a due date.

### Steps to Repeat
1. Create Task with a date before today
2. click "Add Task" button
3. Observe: task is created, exists in the task list, and no warning message appears

---

## Bug 2 - Create Blank Space Title - Medium

### Explaination of Priority
You can still create a task. Failure to be able to create a task would be high. 
However it is a feature that directly affects the user flow and effectiveness. 
Arguements could be made for a high priority.

### Description
Creating a task allows entering a task name of just blank spaces.

### Steps to Repeat
1. Create Task with Task name with just spaces. ex: "  "
2. click "Add Task" button
3. Observe: task is created, exists in the task list, and no warning message appears

---

## Bug 3 - Edit Past Date - Medium

### Explaination of Priority
You can still Edit a task. Failure to be able to edit a task would be high. 
However it is a feature that directly affects the user flow and effectiveness. 
Arguements could be made for a high priority.

### Description
Editing a task allows entering a past date for a due date.

### Steps to Repeat
1. Create a valid task
2. Click edit button
3. Edit due date to a past date and save
4. Edit is saved and persists with past date

---

## Bug 4 - Create Blank Space Title - Medium

### Explaination of Priority
You can still Edit a task. Failure to be able to edit a task would be high. 
However it is a feature that directly affects the user flow and effectiveness. 
Arguements could be made for a high priority.

### Description
Editing a task allows entering a task name of just blank spaces.

### Steps to Repeat
1. Create a valid task
2. Click edit button
3. Edit task name to just spaces. ex: "  " 
4. Edit is saved and persists with Blank name


---

## Bug 5 - Priority Sort - Medium

### Explaination of Priority
This does not directly affect the core features of the app; add, edit, delete.

### Description
The task list does not sort the the tasks by priority.

### Steps to Repeat
1. Create several tasks in varying priorities
2. Observe: Tasks are not in order of priority

---

## Bug 6 - Toggle Completion Persistance - High

### Explaination of Priority
Persistance of comletion inhibits the use of the app. If you can't mark tasks as complete and have them persist, then the essence of the app is broken.

### Description
Toggle completion checkbox change does not survive page refresh.

### Steps to Repeat
1. Create task
2. Mark task complete with checkbox
3. reload page
4. Observe: toggle completion reverts to not complete

---

## Bug 7 - Deletion Persistance - High

### Explaination of Priority
Persistance of Deletion inhibits the use of a core feature the app.

### Description
Deletion of a task does not survive page refresh.

### Steps to Repeat
1. Create task
2. Delete task
3. reload page
4. Observe: deleted task appears in task list


# Holes in testing
Filters.
Save feedback.
Unit tests were not written and performed.

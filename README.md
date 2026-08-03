# Team Task Board

## Your assignment

You are given a small Team Task Board app.

The intended behavior of every feature above is documented as a small set of Jira-style tickets here: [Jira Tickets](https://github.com/Cymmetric-Pixel/team-task-board-jira)

Your goals:

1. Review the app and understand its behavior.
2. Choose and configure an appropriate unit testing setup.
3. Choose and configure a UI / component / integration testing approach if useful.
4. Choose and configure an e2e testing approach.
5. Add meaningful tests for pure business logic.
6. Add tests for important user-facing behavior.
7. Add at least one e2e test for a critical user journey.
8. Create a CI pipeline that runs the relevant checks automatically.
9. Investigate the app and report bugs you find in a BUGS_REPORT.md file.

## Guidelines

- You may use AI tools, but you are responsible for the final decisions.
- You are expected to add the pieces you think are appropriate, justify them, and explain the tradeoffs.
- You can use Gitlab or Github for the CI pipeline.


## Install

```bash
npm install
```

## Run the app

```bash
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## QA and reliability notes

A lightweight QA pass is already captured in [BUGS_REPORT.md](BUGS_REPORT.md). The current test strategy covers:

- business logic with Vitest for validation, filtering, and sorting
- component-level behavior with React Testing Library for the task board workflow
- critical user journeys with Playwright end-to-end tests
- CI execution through [.github/workflows/ci.yml](.github/workflows/ci.yml)

A few quality notes from the review:

- the app is intentionally simple and uses a localStorage-backed fake API, so persistence should be treated as temporary
- validation is currently enforced in the shared logic layer, which keeps the rules consistent across add/edit flows
- future reliability work should focus on contract tests around the API layer and a more realistic persistence strategy if the app grows

---
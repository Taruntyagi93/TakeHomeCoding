# Take-Home Challenge Prompt

## Agentic Code Generation Workflow

Time Budget: 4–6 hours
Submission Deadline: 3 business days from receipt

### Overview

At our agency, AI-assisted development is a core part of how we build. This challenge tests your ability to design and implement an agentic workflow — an AI-powered system that takes a natural-language specification and autonomously generates a working frontend application.

You will build an agent (or multi-agent system) that reads a product specification and produces a React + TypeScript application that matches a reference implementation. The agent should plan, scaffold, generate code, and self-validate — not just make a single LLM call and hope for the best.

### The Boilerplate

A pre-built boilerplate is provided with the full stack already configured. Your agent should generate code into this existing project structure, not scaffold from scratch.

### Tech Stack

- React 19 + TypeScript
- Vite
- Apollo Client (GraphQL)
- Material UI (MUI)
- MSW (Mock Service Worker) for API mocking
- Vitest + Testing Library for testing

### Reference Application Requirements

The agent's output should be a working Car Inventory Manager backed by a mock GraphQL API. It must:

1. Display a list of cars fetched via Apollo Client from a mock GraphQL API (`GetCars` query) served by MSW.
2. Show responsive car images using viewport width:
   - ≤ 640px → mobile
   - 641px – 1023px → tablet
   - ≥ 1024px → desktop
3. Use Material UI cards to present each car (make, model, year, color, image).
4. Include an "Add Car" form that submits via a GraphQL mutation (`AddCar`).
5. Implement sorting and search — a search bar to filter by model, plus sorting by year or make.
6. Extract GraphQL logic into a `useCars()` custom hook.
7. Include unit tests for key components.

### Mock Data Schema

The boilerplate provides a Car type and 5 seed cars:

```ts
interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  mobile: string;
  tablet: string;
  desktop: string;
}
```

### Optional Extras

- A `GetCar` query to fetch individual cars
- A year filter (multi-filter support alongside model search)
- A reusable `useCarFilters()` hook combining all filter logic

### Agent Deliverable

Build a CLI tool or script that:

1. Accepts a natural-language specification as input.
2. Plans the implementation — decomposes the spec into discrete, ordered tasks.
3. Generates the application code file by file into the provided boilerplate.
4. Self-validates — runs the test suite or reviews generated code.
5. Iterates on failures — reads error output and attempts at least one fix loop.
6. Outputs a runnable project.

### Submission Requirements

- Agent source code
- `README.md` with setup, architecture, and design decisions
- Sample spec file
- Sample output directory
- `.env.example` with required API keys
- Short write-up covering LLM usage, architecture, what worked, what to improve, and cost estimate

### Not Required

- Perfect UI
- Over-engineered frameworks
- Databases, backend infrastructure, authentication, deployment, or CI/CD

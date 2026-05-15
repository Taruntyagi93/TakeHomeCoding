# Take-Home Challenge Submission

## Project overview

This repository contains a working agentic workflow plus a runnable React + TypeScript app. The agent is implemented under `agent/`, the app boilerplate lives in the root, and a sample generated app output is provided in `generated-app/`.

## What is included

- `agent/` — the agent implementation, including planning, task execution, validation, and retry logic.
- `agent/spec.txt` — sample natural-language input for the agent.
- `agent/src/index.ts` — CLI entrypoint that copies the boilerplate, generates code into `generated-app/`, and validates the result.
- `agent/src/planner.ts` — builds an ordered task plan from the specification.
- `agent/src/executor.ts` — generates or edits files one-by-one with dependency context.
- `agent/src/validator.ts` — installs dependencies, runs tests, and retries fixes if needed.
- `agent/src/service.ts` — provider fallback layer for OpenAI-compatible APIs.
- `generated-app/` — sample generated application output that can be run directly.
- `.env.example` — required API key variables for the agent.

## Running the app

### Run the root app

```bash
npm install
npm run dev
```

### Run the test suite

```bash
npm run test
npm run typecheck
```

### Run the agent

From the `agent/` directory:

```bash
npm install
# Copy the example env file and add your API key (Gemini, Groq, or OpenRouter)
cp .env.example .env 
npm start
```

This uses `agent/spec.txt` and the root directory as the boilerplate source. The agent writes into `generated-app/`.

### Run the sample generated app

```bash
cd generated-app
npm install
npm run dev
```

## Agent design

The agent is intentionally simple and practical:

1. **Plan** — `planner.ts` reads the spec and returns a list of discrete tasks in JSON format.
2. **Execute** — `executor.ts` generates or updates individual files, using dependency context and tests where available.
3. **Validate** — `validator.ts` installs dependencies, runs `npm run test`, and retries one fix loop when failures occur.

This keeps the workflow explicit and avoids a single pass over all tasks.

## API provider support

The agent uses the `openai` package and can send requests through any supported OpenAI-compatible endpoint.
It checks for one of these environment variables:

- `GEMINI_API_KEY`
- `GROQ_API_KEY`
- `OPENROUTER_API_KEY`

The first configured provider is used, with fallback to the next provider if the request fails.

## What worked well

- The generated app works with the existing Vite boilerplate and passes the provided tests.
- The agent structure is explicit: planning, file generation, validation, and retry.
- The final app uses React, TypeScript, Apollo Client, Material UI, and MSW as required.

## What I would improve with more time

- Add explicit `generated-app` verification using `npm run typecheck` in the generated directory.
- Capture and store the actual task plan output so the workflow can be reviewed later.
- Add better diff tracking between the boilerplate and generated files.
- Improve request formatting and validation for JSON responses.

## Cost estimate

A single run should be modest in token usage since the agent makes a few structured prompt calls. Exact cost depends on the provider and model, but with a low-temperature OpenAI-compatible model this should remain under a few dollars per run.

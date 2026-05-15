import fs from 'fs';
import path from 'path';
import { generatePlan } from './planner';
import { executeTask } from './executor';
import { runValidation, healCode } from './validator';

const MAX_RETRIES = 3;

async function main() {
  const specPath = process.argv[2];
  const boilerplatePath = process.argv[3];
  const targetPathArg = process.argv[4] || '../generated-app';
  const targetPath = path.resolve(process.cwd(), targetPathArg);

  if (!specPath || !boilerplatePath) {
    console.error('Usage: npm start');
    process.exit(1);
  }

  const spec = fs.readFileSync(specPath, 'utf-8');

  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
  }
  fs.mkdirSync(targetPath, { recursive: true });
  console.log(`Copying boilerplate to ${targetPath}...`);
  const items = fs.readdirSync(boilerplatePath);
  for (const item of items) {
    const srcPath = path.join(boilerplatePath, item);
    const destPath = path.join(targetPath, item);
    const basename = path.basename(srcPath);
    if (['agent', 'node_modules', '.git', 'generated-app', 'dist'].includes(basename)) {
      continue;
    }
    fs.cpSync(srcPath, destPath, { recursive: true });
  }

  // Dummy representation of tree, in a real app use a directory walker
  const boilerplateTree = `
  src/
  ├── App.tsx
  ├── main.tsx
  ├── mocks/
  │   └── handlers.ts
  └── types/
      └── index.ts
  `;

  const plan = await generatePlan(spec, boilerplateTree);
  console.log(`Plan generated with ${plan.tasks.length} tasks.`);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const projectContext = new Map<string, string>();
  
  for (const task of plan.tasks) {
    await executeTask(task, targetPath, projectContext);
    console.log('Pausing briefly before the next task.');
    await delay(4000);
  }

  let validation = runValidation(targetPath);
  let attempts = 0;

  while (!validation.success && attempts < MAX_RETRIES) {
    attempts++;
    console.log(`Retry attempt ${attempts} of ${MAX_RETRIES}.`);
    
    if (validation.errorLog) {
      await healCode(targetPath, validation.errorLog, projectContext);
    }
    
    validation = runValidation(targetPath);
  }

  if (validation.success) {
    console.log('Build and tests passed.');
  } else {
    console.log('Reached max retries. Could not resolve all errors.');
  }
}

main().catch(console.error);
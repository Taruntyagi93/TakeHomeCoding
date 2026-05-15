import fs from 'fs';
import path from 'path';
import { Task } from './types';
import { sendRequest } from './service';

export async function executeTask(task: Task, targetDir: string, projectContext: Map<string, string>) {
  console.log(`Executing: [${task.action}] ${task.filePath}`);
  
  const fullPath = path.join(targetDir, task.filePath);
  let existingContent = '';

  if (task.action === 'edit' && fs.existsSync(fullPath)) {
    existingContent = fs.readFileSync(fullPath, 'utf-8');
  }

  let contextStr = "Relevant Dependency Context:\n";
  if (task.dependencies && task.dependencies.length > 0) {
    for (const dep of task.dependencies) {
      let depContent = projectContext.get(dep);
      if (!depContent && fs.existsSync(path.join(targetDir, dep))) {
        depContent = fs.readFileSync(path.join(targetDir, dep), 'utf-8');
      }
      if (depContent) {
        contextStr += `--- ${dep} ---\n${depContent}\n\n`;
      }
    }
  } else {
    contextStr += "No external file context needed.\n";
  }

  const parsedPath = path.parse(task.filePath);
  const possibleTestPaths = [
    // Look for unit tests next to the file
    path.join(targetDir, parsedPath.dir, `${parsedPath.name}.test.tsx`),
    path.join(targetDir, parsedPath.dir, `${parsedPath.name}.test.ts`),
    // Look in the __tests__ folder
    path.join(targetDir, 'src', '__tests__', `${parsedPath.name}.test.tsx`),
    // Fallback: If working on components, read the main App Integration test
    path.join(targetDir, 'src', '__tests__', `App.test.tsx`) 
  ];

  let testContextAdded = false;
  contextStr += "\nTEST CONTEXT:\n";

  for (const testPath of possibleTestPaths) {
    if (fs.existsSync(testPath)) {
      const testContent = fs.readFileSync(testPath, 'utf-8');
      contextStr += `--- ${path.relative(targetDir, testPath)} ---\n${testContent}\n\n`;
      console.log(`Found related test file: ${path.basename(testPath)}.`);
      testContextAdded = true;
      break;
    }
  }

  if (!testContextAdded) {
    contextStr += "No explicit tests found for this file. Follow general best practices.\n";
  }

  const systemPrompt = `
    Use the task description and file context to produce the complete contents of the requested file.
    Return only source code, without markdown wrappers.
  `;

  const userPrompt = `
    TASK: ${task.description}
    FILE PATH: ${task.filePath}
    ACTION: ${task.action}

    ${contextStr}

    ${existingContent ? `EXISTING CONTENT:\n${existingContent}\n\nRewrite this file incorporating the required changes.` : ''}

    Provide the final source code for ${task.filePath}.
  `;

  let newCode = await sendRequest(systemPrompt, userPrompt);

  // Remove optional markdown wrappers from the response
  newCode = newCode.replace(/^```[a-z]*\n/gi, '').replace(/```$/g, '').trim();

  // Ensure directory exists
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, newCode);
  
  // Save to context for future steps
  projectContext.set(task.filePath, newCode);
  console.log(`Wrote ${task.filePath}`);
}
import { execSync } from 'child_process';
import { requestJSON } from './service';
import fs from 'fs';
import path from 'path';

export function runValidation(projectPath: string) {
  console.log('\nRunning validation (installing dependencies and running tests)...');
  
  try {
    const nodeModulesPath = path.join(projectPath, 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      execSync('npm install', { cwd: projectPath, stdio: 'inherit' });
    }

    const output = execSync('npm run test', { cwd: projectPath, encoding: 'utf-8' });
    
    return { success: true, errorLog: null };
  } catch (error: any) {
    return { 
      success: false, 
      errorLog: error.stdout || error.message 
    };
  }
}

export async function healCode(targetDir: string, errorLog: string, projectContext: Map<string, string>) {
  console.log('Attempting to fix code based on error output...');

  let contextStr = "Current Project State:\n";
  for (const [filePath, content] of projectContext.entries()) {
    contextStr += `--- ${filePath} ---\n${content}\n\n`;
  }

  const systemPrompt = `
    You are an expert debugger. Review the error log and fix the application code.
    
    CRITICAL FIXES REQUIRED:
    1. In useCars.ts, add null-checks (optional chaining) before calling .toLowerCase(). Example: car.model?.toLowerCase().includes(...)
    2. Ensure the ADD_CAR mutation exists in src/graphql/mutations.ts and strictly matches types.ts. Create the file if it is missing.
    3. Ensure Apollo Client is initialized with a proper HttpLink in client.ts.
    4. YOU ARE STRICTLY FORBIDDEN FROM MODIFYING ANY .test.tsx OR .test.ts FILES. Fix the actual application code instead.
    
    You must respond in JSON format using this exact schema:
    {
      "filePath": "src/path/to/file.ts",
      "fixedCode": "import React..."
    }
  `;

  const userPrompt = `
    ERROR LOG:
    ${errorLog}

    ${contextStr}
  `;

  const fix = await requestJSON<{filePath: string; fixedCode: string}>(systemPrompt, userPrompt);
  
  const fullPath = path.join(targetDir, fix.filePath);
  fs.writeFileSync(fullPath, fix.fixedCode);
  projectContext.set(fix.filePath, fix.fixedCode); // Update context
  
  console.log(`Applied fix to ${fix.filePath}`);
}
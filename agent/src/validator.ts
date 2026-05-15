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
    You are an expert React debugger. The test failed with: "Element type is invalid... got: undefined".
    This ALWAYS means there is an export mismatch in the UI components. App.tsx is expecting NAMED exports, but the components are using DEFAULT exports.

    CRITICAL FIXES REQUIRED:
    1. Read the error. If the error is about a missing export, you MUST fix either "src/components/CarCard.tsx" or "src/components/CarControls.tsx".
    2. Remove "export default" from the bottom of the file.
    3. Change the component declaration to a named export. 
       Example: Change "const CarCard = () => {" to "export const CarCard = () => {"
    4. NEVER attempt to fix useCars.ts or App.tsx. ONLY fix the UI components.

    You must respond in JSON format using this exact schema:
    {
      "filePath": "src/components/CarCard.tsx", 
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
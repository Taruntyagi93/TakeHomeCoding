import { Plan } from './types';
import { requestJSON } from './service';

export async function generatePlan(spec: string, boilerplateTree: string): Promise<Plan> {
  console.log('Planner is analyzing the specification...');

  const systemPrompt = `
    Read the specification and boilerplate structure.
    Return a JSON object that lists implementation tasks in order.
    Use the schema below exactly:
    {
      "tasks": [
        {
          "action": "create" | "edit",
          "filePath": "src/path/to/file.ts",
          "description": "Detailed instructions of what to write in this file",
          "dependencies": ["src/path/to/otherFile.ts"]
        }
      ]
    }
  `;

  const userPrompt = `
    BOILERPLATE STRUCTURE:
    ${boilerplateTree}

    SPECIFICATION:
    ${spec}

    Generate the build plan in JSON format.
  `;

  return await requestJSON<Plan>(systemPrompt, userPrompt);
}
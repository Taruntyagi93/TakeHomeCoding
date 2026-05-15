import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Define our provider structure
interface Provider {
  name: string;
  client: OpenAI;
  model: string;
}

// Build the array of providers based on available API keys
const providers: Provider[] = [];


if (process.env.GITHUB_TOKEN) {
  providers.push({
    name: 'GitHub Models',
    client: new OpenAI({
      apiKey: process.env.GITHUB_TOKEN,
      baseURL: "https://models.inference.ai.azure.com"
    }),
    model: 'gpt-4o-mini' 
  });
}

if (process.env.GROQ_API_KEY) {
  providers.push({
    name: 'Llama 3 (Groq)',
    client: new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1"
    }),
    model: 'llama-3.3-70b-versatile'
  });
}



if (providers.length === 0) {
  console.error('No API keys found in .env file. Please add at least one.');
  process.exit(1);
}

export async function sendRequest(systemPrompt: string, userPrompt: string): Promise<string> {
  for (let i = 0; i < providers.length; i++) {
    const provider = providers[i];
    try {
      const response = await provider.client.chat.completions.create({
        model: provider.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
      });
      return response.choices[0]?.message?.content || '';
      
    } catch (error: any) {
      console.log(`\n[${provider.name} failed]: ${error.message || 'Rate limit or quota hit.'}`);
      
      if (i < providers.length - 1) {
        console.log(`Switching to fallback provider: ${providers[i + 1].name}.`);
        continue; 
      } else {
        throw new Error('All available providers failed or ran out of quota.');
      }
    }
  }
  return '';
}

export async function requestJSON<T>(systemPrompt: string, userPrompt: string): Promise<T> {
  for (let i = 0; i < providers.length; i++) {
    const provider = providers[i];
    try {
      const response = await provider.client.chat.completions.create({
        model: provider.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1,
      });
      const content = response.choices[0]?.message?.content || '{}';
      return JSON.parse(content) as T;
      
    } catch (error: any) {
      console.log(`\n[${provider.name} failed]: ${error.message || 'Rate limit or quota hit.'}`);
      
      if (i < providers.length - 1) {
        console.log(`Switching to fallback provider: ${providers[i + 1].name}.`);
        continue; 
      } else {
        throw new Error('All available providers failed or ran out of quota.');
      }
    }
  }
  return {} as T;
}
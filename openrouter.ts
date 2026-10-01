import { OpenRouter } from '@openrouter/sdk';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const envPath = join(dirname(fileURLToPath(import.meta.url)), '.env');
if (existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

try {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      'Missing OPENROUTER_API_KEY. Add it to the project .env file or set it in your environment.',
    );
  }

  const client = new OpenRouter({ apiKey });
  const response = await client.chat.send({
    chatRequest: {
      model: 'openai/gpt-5.2',
      maxCompletionTokens: 1000,
      messages: [
        { role: 'user', content: 'What is JavaScript?' },
      ],
    },
  });

  if (response instanceof ReadableStream) {
    throw new Error('Expected a non-streaming response');
  }

  console.log(response.choices[0]?.message.content ?? 'The model returned no response.');
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`OpenRouter request failed: ${message}`);
  process.exitCode = 1;
}
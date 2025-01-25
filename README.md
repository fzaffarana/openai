# OpenAI Wrapper Library

A powerful and flexible TypeScript wrapper for the OpenAI API that provides enhanced functionality for chat completions and image generation.

## Features

- 🤖 Chat completions with GPT models
- 🎨 Image generation with DALL·E models
- 💰 Built-in cost calculation
- 📊 Detailed usage metrics
- 🔄 Multiple response formats (JSON, CSV, text)
- ⚡ Promise-based async/await API

## Installation

```bash
npm install @smootai/openai
```

## Usage

### Chat Completions

```typescript
import { runPrompt } from '@smootai/openai';

// Simple text completion
const response = await runPrompt('What is the capital of France?', {
  model: 'gpt-3.5-turbo',
  temperature: 0,
});

console.log(response.result); // Text response
console.log(response.usage); // { inputTokens, outputTokens, totalTokens, cost, delayMs }

// JSON response
const jsonResponse = await runPrompt('Return a JSON with country: France, capital: Paris', {
  model: 'gpt-4',
  parser: 'json',
});

console.log(jsonResponse.result); // { country: "France", capital: "Paris" }

// Using chat messages
const chatResponse = await runPrompt(
  [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: "What's the weather like?" },
  ],
  {
    model: 'gpt-3.5-turbo',
  },
);
```

### Image Generation

```typescript
import { generateImage } from '@smootai/openai';

// Generate an image with DALL·E 3
const imageResponse = await generateImage('A serene landscape with mountains at sunset', {
  model: 'dall-e-3',
  size: '1024x1024',
  quality: 'standard',
  style: 'vivid',
});

console.log(imageResponse.result.url); // URL of the generated image
console.log(imageResponse.usage); // { cost, delayMs }

// Generate HD quality image
const hdImage = await generateImage('A detailed portrait of a cat', {
  model: 'dall-e-3',
  size: '1024x1024',
  quality: 'hd',
  style: 'natural',
});
```

## Configuration

### Chat Completion Config

```typescript
type CompletionConfig = {
  apiKey?: string; // OpenAI API key (falls back to OPENAI_API_KEY env variable)
  model: OpenAI.ChatModel; // The model to use (e.g., "gpt-4", "gpt-3.5-turbo")
  temperature?: number; // Controls randomness (0-1, default: 0)
  parser?: 'json' | 'csv' | 'text'; // Response format parser
  // ... other OpenAI chat completion parameters
};
```

### Image Generation Config

```typescript
type ImageConfig = {
  apiKey?: string; // OpenAI API key (falls back to OPENAI_API_KEY env variable)
  model: OpenAI.ImageModel; // The model to use (e.g., "dall-e-3", "dall-e-2")
  size?: string; // Image size (default: "1024x1024")
  quality?: 'standard' | 'hd'; // Image quality for DALL·E 3
  style?: 'vivid' | 'natural'; // Image style for DALL·E 3
  response_format?: 'url' | 'b64_json'; // Response format (default: "url")
  user?: string; // Optional user identifier
};
```

## Response Types

### Chat Completion Response

```typescript
type OpenAIResponse<T, U> = {
  result: T; // The completion result (string for text, object for JSON/CSV)
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    cost: number; // Cost in USD
    delayMs: number; // Response time
  };
};
```

### Image Generation Response

```typescript
type OpenAIResponse<T, U> = {
  result: {
    url?: string; // URL of the generated image
    b64_json?: string; // Base64 encoded image data
  };
  usage: {
    cost: number; // Cost in USD
    delayMs: number; // Response time
  };
};
```

## Error Handling

The library throws errors in the following cases:

- Missing API key
- Invalid configuration parameters
- API rate limits
- Network errors
- Invalid response formats

Example:

```typescript
try {
  const response = await runPrompt('Your prompt', config);
} catch (error) {
  console.error('Error:', error.message);
}
```

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (optional if provided in config)

## License

MIT

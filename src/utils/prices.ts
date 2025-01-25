import OpenAI from 'openai';

export const COMPLETION_PRICES: Record<OpenAI.ChatModel, { input: number; output: number }> = {
  'gpt-4o': { input: 0.005, output: 0.015 },
  'gpt-4o-2024-08-06': { input: 0.0025, output: 0.01 },
  'gpt-4o-2024-05-13': { input: 0.005, output: 0.015 },
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'gpt-4o-mini-2024-07-18': { input: 0.00015, output: 0.0006 },
  'o1-preview': { input: 0.015, output: 0.06 },
  'o1-preview-2024-09-12': { input: 0.015, output: 0.06 },
  'o1-mini': { input: 0.003, output: 0.012 },
  'o1-mini-2024-09-12': { input: 0.003, output: 0.012 },
  'chatgpt-4o-latest': { input: 0.005, output: 0.015 },
  'gpt-4-turbo': { input: 0.01, output: 0.03 },
  'gpt-4-turbo-2024-04-09': { input: 0.01, output: 0.03 },
  'gpt-4-turbo-preview': { input: 0.01, output: 0.03 },
  'gpt-4': { input: 0.03, output: 0.06 },
  'gpt-4-0314': { input: 0.03, output: 0.06 },
  'gpt-4-0613': { input: 0.03, output: 0.06 },
  'gpt-4-32k': { input: 0.06, output: 0.12 },
  'gpt-4-32k-0314': { input: 0.06, output: 0.12 },
  'gpt-4-32k-0613': { input: 0.06, output: 0.12 },
  'gpt-4-0125-preview': { input: 0.01, output: 0.03 },
  'gpt-4-1106-preview': { input: 0.01, output: 0.03 },
  'gpt-4-vision-preview': { input: 0.01, output: 0.03 },
  'gpt-3.5-turbo': { input: 0.0015, output: 0.002 },
  'gpt-3.5-turbo-0125': { input: 0.0005, output: 0.0015 },
  'gpt-3.5-turbo-1106': { input: 0.001, output: 0.002 },
  'gpt-3.5-turbo-0613': { input: 0.0015, output: 0.002 },
  'gpt-3.5-turbo-16k': { input: 0.003, output: 0.004 },
  'gpt-3.5-turbo-16k-0613': { input: 0.003, output: 0.004 },
  'gpt-3.5-turbo-0301': { input: 0.0015, output: 0.002 },
};

export const IMAGE_PRICES: Record<string, { costPerImage: number }> = {
  // DALL·E 3 Standard Quality
  'dall-e-3|standard|1024x1024': { costPerImage: 0.04 },
  'dall-e-3|standard|1024x1792': { costPerImage: 0.08 },
  'dall-e-3|standard|1792x1024': { costPerImage: 0.08 },

  // DALL·E 3 HD Quality
  'dall-e-3|hd|1024x1024': { costPerImage: 0.08 },
  'dall-e-3|hd|1024x1792': { costPerImage: 0.12 },
  'dall-e-3|hd|1792x1024': { costPerImage: 0.12 },

  // DALL·E 2
  'dall-e-2|1024x1024': { costPerImage: 0.02 },
  'dall-e-2|512x512': { costPerImage: 0.018 },
  'dall-e-2|256x256': { costPerImage: 0.016 },
};

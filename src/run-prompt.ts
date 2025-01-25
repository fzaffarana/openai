import { csv2json } from 'json-2-csv';
import OpenAI from 'openai';

import { float } from '@smootai/lambda-middlewares';

import { CompletionConfig, CompletionUsage, OpenAIResponse } from './types';
import { findFirstValidJson } from './utils/json';
import { COMPLETION_PRICES } from './utils/prices';

const DEFAULT_TEMPERATURE = 0;
const DEFAULT_TIMEOUT = 50000;

/**
 * Calculates the cost of an OpenAI API request based on input and output tokens.
 *
 * @param {number} inputTokens - The number of input tokens used in the request.
 * @param {number} outputTokens - The number of output tokens generated in the response.
 * @param {Model} model - The model used for the request.
 * @returns {number} The total cost of the request in USD.
 */
const calculateCost = (
  inputTokens: number,
  outputTokens: number,
  model: OpenAI.ChatModel,
): number => {
  const price = COMPLETION_PRICES[model];
  const cost = (outputTokens / 1000) * price.output + (inputTokens / 1000) * price.input;

  return float(cost, { decimals: 10 }).toNumber();
};

/**
 * Processes the raw result from the OpenAI API response based on the specified parser.
 *
 * @template T Expected type of result if the parser is 'json'
 * @param {string} rawResult - The raw result string returned by OpenAI.
 * @param {ParserType} [parser] - The optional parser type to process the result (JSON, CSV, TEXT).
 * @returns {Promise<T | string>} The processed result based on the parser type.
 */
const processResult = async <T>(
  rawResult: string,
  parser?: CompletionConfig['parser'],
): Promise<T | string> => {
  if (parser === 'json') {
    const validJson = findFirstValidJson(rawResult);
    if (!Object.keys(validJson).length) {
      console.error('Invalid JSON response from OpenAI:', rawResult);
    }
    return validJson as T;
  } else if (parser === 'csv') {
    const cleanedResult = rawResult.replace(/```|```/g, '').trim();
    return (await csv2json(cleanedResult)) as T;
  } else {
    // Default to plain text result if no parser is specified
    return rawResult;
  }
};

/**
 * Wrapper function to call OpenAI API with prompt and config.
 *
 * @template T Expected type of result if parser is 'json'
 * @param {string | ChatCompletionMessageParam[]} prompt - The prompt or messages to send to OpenAI.
 * @param {CompletionConfig} [config] - Optional configuration for OpenAI request.
 * @param {OpenAI.RequestOptions} [httpConfig] - Optional HTTP request configuration.
 * @returns {Promise<{ result: T | string; usage: { input_tokens: number; output_tokens: number; total_tokens: number; cost: number } }>} The processed API response with usage details.
 */
export async function runPrompt(
  prompt: string | OpenAI.ChatCompletionMessageParam[],
  config: CompletionConfig & { parser?: 'text' },
  httpConfig?: OpenAI.RequestOptions,
): Promise<OpenAIResponse<string, CompletionUsage>>;

export async function runPrompt<T>(
  prompt: string | OpenAI.ChatCompletionMessageParam[],
  config: CompletionConfig & { parser: 'json' | 'csv' },
  httpConfig?: OpenAI.RequestOptions,
): Promise<OpenAIResponse<T, CompletionUsage>>;

export async function runPrompt<T>(
  prompt: string | OpenAI.ChatCompletionMessageParam[],
  config: CompletionConfig,
  httpConfig?: OpenAI.RequestOptions,
): Promise<OpenAIResponse<T, CompletionUsage>> {
  // Throw an error if OpenAI API key is not provided
  const apikey = config.apiKey || process.env.OPENAI_API_KEY;
  if (!apikey) {
    throw new Error('OpenAI API key is required.');
  }

  // Initialize OpenAI API client
  const openai = new OpenAI({
    apiKey: apikey,
  });

  // Start timer to calculate delay
  const start = Date.now();
  const response = await openai.chat.completions.create(
    {
      model: config.model,
      messages: Array.isArray(prompt) ? prompt : [{ role: 'user', content: prompt }],
      temperature: config?.temperature || DEFAULT_TEMPERATURE,
      ...(config?.parser === 'json' ? { response_format: { type: 'json_object' } } : {}),
    },
    { timeout: httpConfig?.timeout || DEFAULT_TIMEOUT },
  );
  const delayMs = Date.now() - start;

  // Calculate usage details
  const inputTokens = response.usage?.prompt_tokens || 0;
  const outputTokens = response.usage?.completion_tokens || 0;
  const totalTokens = inputTokens + outputTokens;

  // Calculate cost
  const cost = calculateCost(inputTokens, outputTokens, config.model);

  // Process the result based on the specified parser
  const rawResult = response?.choices[0]?.message?.content?.trim() || '';
  const result = await processResult<T>(rawResult, config?.parser);

  return {
    result: result as T,
    usage: {
      inputTokens,
      outputTokens,
      totalTokens,
      cost,
      delayMs,
    },
  };
}

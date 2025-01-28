import OpenAI from 'openai';

import type { ImageConfig, ImageUsage, OpenAIResponse } from './types';
import { float } from './utils/float';
import { IMAGE_PRICES } from './utils/prices';

const DEFAULT_TIMEOUT = 50000;
const DEFAULT_RESPONSE_FORMAT = 'url';
const DEFAULT_DALLE3_QUALITY = 'standard';
const DEFAULT_DALLE3_STYLE = 'vivid';
const DEFAULT_IMAGE_SIZE = '1024x1024';

// Define defaults for models that support 'quality' and 'style'
const DEFAULT_QUALITY: Partial<Record<OpenAI.ImageModel, 'standard' | 'hd'>> = {
  'dall-e-3': DEFAULT_DALLE3_QUALITY,
};

const DEFAULT_STYLE: Partial<Record<OpenAI.ImageModel, 'vivid' | 'natural'>> = {
  'dall-e-3': DEFAULT_DALLE3_STYLE,
};

/**
 * Calculates the cost of an OpenAI image generation request based on the model, size, and quality.
 *
 * @param {OpenAI.ImageModel} model - The model used for image generation.
 * @param {string} size - The size of the generated image.
 * @param {('standard' | 'hd') | undefined} [quality] - The quality of the generated image.
 * @returns {number} The cost of the image generation request in USD.
 */
const calculateImageCost = (
  model: OpenAI.ImageModel,
  size: string,
  quality?: 'standard' | 'hd',
): number => {
  const parts: string[] = [model];
  if (quality) {
    parts.push(quality);
  }
  parts.push(size);
  const key = parts.join('|');

  const priceInfo = IMAGE_PRICES[key];
  if (!priceInfo) {
    throw new Error(`Price information not found for key: ${key}`);
  }

  const totalCost = priceInfo.costPerImage; // Since n is always 1

  return float(totalCost, { decimals: 10 }).toNumber();
};

/**
 * Generates an image using the OpenAI API based on the provided prompt and configuration.
 *
 * @param {string} prompt - The prompt to generate an image from.
 * @param {ImageConfig} config - Configuration for image generation.
 * @param {OpenAI.RequestOptions} [httpConfig] - Optional HTTP request configuration.
 * @returns {Promise<OpenAIResponse<{ url?: string; b64_json?: string }, ImageUsage>>} The generated image and usage details.
 */
export async function generateImage(
  prompt: string,
  config: ImageConfig,
  httpConfig?: OpenAI.RequestOptions,
): Promise<OpenAIResponse<{ url?: string; b64_json?: string }, ImageUsage>> {
  // Throw an error if OpenAI API key is not provided
  const apiKey = config.apiKey || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is required.');
  }

  // Initialize OpenAI API client
  const openai = new OpenAI({
    apiKey,
  });

  // Set default parameters
  const model = config.model;
  const size = config.size || DEFAULT_IMAGE_SIZE;
  const response_format = config.response_format || DEFAULT_RESPONSE_FORMAT;
  const user = config.user;

  // Prepare request parameters
  const params: OpenAI.ImageGenerateParams = {
    model,
    prompt,
    n: 1, // Always 1
    size,
    response_format,
    user,
  };

  // Include 'quality' and 'style' if the model supports them
  if (model === 'dall-e-3') {
    params.quality = config.quality || DEFAULT_QUALITY[model];
    params.style = config.style || DEFAULT_STYLE[model];
  }

  // Start timer to calculate delay
  const start = Date.now();

  // Generate image
  const response = await openai.images.generate(params, {
    timeout: httpConfig?.timeout || DEFAULT_TIMEOUT,
  });

  // Calculate delay
  const delayMs = Date.now() - start;

  // Extract the first image from the response as we always request n=1
  if (!response.data || response.data.length === 0) {
    throw new Error('No image generated');
  }
  const result = response.data[0];

  // Calculate cost
  const cost = calculateImageCost(model, size, params.quality as 'standard' | 'hd' | undefined);

  return {
    result,
    usage: {
      cost,
      delayMs,
    },
  };
}

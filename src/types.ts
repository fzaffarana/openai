import OpenAI from 'openai';

export type CompletionConfig = Omit<OpenAI.ChatCompletionCreateParams, 'messages' | 'model'> & {
  apiKey?: string;
  model: OpenAI.ChatModel;
  parser?: 'json' | 'csv' | 'text';
};

export type ImageConfig = Omit<OpenAI.ImageGenerateParams, 'prompt' | 'n' | 'quality' | 'style'> & {
  apiKey?: string;
  model: OpenAI.ImageModel;
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
};

export type BaseUsage = {
  cost: number;
  delayMs: number;
};

export type CompletionUsage = BaseUsage & {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
};

export type ImageUsage = BaseUsage;

export type OpenAIResponse<T, U extends BaseUsage = BaseUsage> = {
  result: T;
  usage: U;
};

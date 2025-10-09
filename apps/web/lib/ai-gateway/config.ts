import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';

/**
 * AI Gateway Configuration
 * Centralized configuration for all AI providers and models
 */

// Provider API keys (from environment variables)
export const getProviderApiKey = (provider: string): string => {
  switch (provider) {
    case 'openai':
      return process.env.OPENAI_API_KEY || '';
    case 'anthropic':
      return process.env.ANTHROPIC_API_KEY || '';
    case 'google':
      return process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
};

// Model pricing per 1M tokens (as of January 2025)
export const MODEL_PRICING = {
  // OpenAI models
  'gpt-4': { input: 30, output: 60 },
  'gpt-4-turbo': { input: 10, output: 30 },
  'gpt-4o': { input: 5, output: 15 },
  'gpt-4o-mini': { input: 0.15, output: 0.6 },
  'gpt-3.5-turbo': { input: 0.5, output: 1.5 },
  
  // Anthropic models
  'claude-3-5-sonnet-20241022': { input: 3, output: 15 },
  'claude-3-5-haiku-20241022': { input: 0.8, output: 4 },
  'claude-3-opus-20240229': { input: 15, output: 75 },
  'claude-3-sonnet-20240229': { input: 3, output: 15 },
  'claude-3-haiku-20240307': { input: 0.25, output: 1.25 },
  
  // Google Gemini models
  'gemini-1.5-pro-latest': { input: 3.5, output: 10.5 },
  'gemini-1.5-flash-latest': { input: 0.075, output: 0.30 },
  'gemini-1.5-pro': { input: 3.5, output: 10.5 },
  'gemini-1.5-flash': { input: 0.075, output: 0.30 },
  'gemini-pro': { input: 0.5, output: 1.5 },
} as const;

// Supported models by provider
export const PROVIDER_MODELS = {
  openai: [
    'gpt-4',
    'gpt-4-turbo',
    'gpt-4o',
    'gpt-4o-mini',
    'gpt-3.5-turbo',
  ],
  anthropic: [
    'claude-3-5-sonnet-20241022',
    'claude-3-5-haiku-20241022',
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229',
    'claude-3-haiku-20240307',
  ],
  google: [
    'gemini-1.5-pro-latest',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-pro',
  ],
} as const;

// Default model settings
export const DEFAULT_SETTINGS = {
  temperature: 0.7,
  maxTokens: 2000,
  topP: 1.0,
} as const;

// Rate limiting configuration
export const RATE_LIMITS = {
  openai: {
    requestsPerMinute: 60,
    tokensPerMinute: 150000,
  },
  anthropic: {
    requestsPerMinute: 50,
    tokensPerMinute: 100000,
  },
  google: {
    requestsPerMinute: 60,
    tokensPerMinute: 120000,
  },
} as const;

/**
 * Get SDK model instance with API key
 */
export function getModelInstance(modelName: string) {
  const provider = getProviderFromModel(modelName);
  const apiKey = getProviderApiKey(provider);
  
  if (!apiKey) {
    throw new Error(`Missing API key for provider: ${provider}`);
  }
  
  // Temporarily set environment variable for this request
  const envKey = provider === 'openai' ? 'OPENAI_API_KEY' : 'ANTHROPIC_API_KEY';
  const originalKey = process.env[envKey];
  process.env[envKey] = apiKey;
  
  let model;
  switch (provider) {
    case 'openai':
      model = openai(modelName);
      break;
    case 'anthropic':
      model = anthropic(modelName);
      break;
    case 'google':
      model = google(modelName);
      break;
    default:
      // Restore original key before throwing
      if (originalKey) process.env[envKey] = originalKey;
      else delete process.env[envKey];
      throw new Error(`Unsupported provider: ${provider}`);
  }
  
  // Restore original key
  if (originalKey) {
    process.env[envKey] = originalKey;
  } else {
    delete process.env[envKey];
  }
  
  return model;
}

/**
 * Determine provider from model name
 */
export function getProviderFromModel(model: string): string {
  if (model.startsWith('gpt-')) return 'openai';
  if (model.startsWith('claude-')) return 'anthropic';
  if (model.startsWith('gemini-')) return 'google';
  throw new Error(`Cannot determine provider for model: ${model}`);
}

/**
 * Validate if a model is supported
 */
export function isModelSupported(model: string): boolean {
  return Object.keys(MODEL_PRICING).includes(model);
}

/**
 * Calculate cost for a request
 */
export function calculateCost(
  model: string,
  promptTokens: number,
  completionTokens: number
): number {
  const pricing = MODEL_PRICING[model as keyof typeof MODEL_PRICING];
  
  if (!pricing) {
    console.warn(`No pricing data for model: ${model}`);
    return 0;
  }
  
  const inputCost = (promptTokens / 1_000_000) * pricing.input;
  const outputCost = (completionTokens / 1_000_000) * pricing.output;
  
  return inputCost + outputCost;
}

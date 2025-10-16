import type { AIProvider, AIProviderType } from "./types";
import { OpenAIProvider } from "./providers/openai";
import { AnthropicProvider } from "./providers/anthropic";

/**
 * Create an AI provider instance
 */
export function createProvider(
  type: AIProviderType,
  apiKey: string,
): AIProvider {
  if (!apiKey) {
    throw new Error(`API key required for ${type} provider`);
  }

  switch (type) {
    case "openai":
      return new OpenAIProvider(apiKey);

    case "anthropic":
      return new AnthropicProvider(apiKey);

    case "custom":
      throw new Error("Custom providers not yet implemented");

    default:
      throw new Error(`Unknown provider type: ${type}`);
  }
}

/**
 * Validate provider type
 */
export function isValidProviderType(type: string): type is AIProviderType {
  return ["openai", "anthropic", "custom"].includes(type);
}

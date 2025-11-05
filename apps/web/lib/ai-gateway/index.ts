/**
 * AI Gateway - Centralized AI Provider Management
 *
 * This module provides a unified interface for all AI provider calls
 * with built-in logging, error handling, cost tracking, and monitoring.
 */

import { AIGatewayService } from './service';

export { AIGatewayService } from './service';
export * from './types';
export * from './config';

/**
 * Get singleton AI Gateway instance
 */
let aiGatewayInstance: AIGatewayService | null = null;

export function getAIGateway(): AIGatewayService {
  if (!aiGatewayInstance) {
    aiGatewayInstance = new AIGatewayService();
  }
  return aiGatewayInstance;
}

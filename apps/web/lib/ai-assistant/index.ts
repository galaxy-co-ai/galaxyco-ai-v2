/**
 * AI Assistant Module
 *
 * Complete AI-first platform infrastructure.
 * Export all components, services, and utilities.
 */

// Core orchestrator
export { AIOrchestrator, getOrchestrator } from './orchestrator';
export type {
  AssistantMessage,
  AssistantResponse,
  ConversationContext,
  ToolCall,
} from './orchestrator';

// Tool system
export * from './tools/types';
export * from './tools/registry';

// Performance & monitoring
export * from './performance';
export * from './monitoring';
export * from './undo-manager';

// React components (re-export for convenience)
export { FloatingAssistant } from '@/components/floating-assistant/FloatingAssistant';
export { AssistantChat } from '@/components/floating-assistant/AssistantChat';
export { ConfirmationDialog } from '@/components/floating-assistant/ConfirmationDialog';
export { VoiceInput } from '@/components/floating-assistant/VoiceInput';


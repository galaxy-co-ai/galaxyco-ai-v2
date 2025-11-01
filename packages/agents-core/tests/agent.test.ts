/**
 * Agent Class Tests
 */

import { describe, it, expect } from 'vitest';
import { Agent } from '../src/agent';
import { createTool } from '../src/tools';

describe('Agent', () => {
  describe('constructor', () => {
    it('should create agent with minimal config', () => {
      const agent = new Agent({
        name: 'Test Agent',
        instructions: 'You are a helpful test agent',
      });

      expect(agent.name).toBe('Test Agent');
      expect(agent.instructions).toBe('You are a helpful test agent');
      expect(agent.model).toBe('gpt-4o-mini'); // default
      expect(agent.temperature).toBe(0.7); // default
      expect(agent.tools).toEqual([]);
      expect(agent.guardrails).toEqual([]);
    });

    it('should create agent with full config', () => {
      const tool = createTool(
        'test_tool',
        'A test tool',
        { query: { type: 'string' } },
        async () => ({ result: 'test' }),
      );

      const agent = new Agent({
        name: 'Custom Agent',
        instructions: 'Custom instructions',
        model: 'gpt-4o',
        temperature: 0.5,
        maxTokens: 1000,
        tools: [tool],
      });

      expect(agent.name).toBe('Custom Agent');
      expect(agent.model).toBe('gpt-4o');
      expect(agent.temperature).toBe(0.5);
      expect(agent.maxTokens).toBe(1000);
      expect(agent.tools).toHaveLength(1);
    });

    it('should throw error for empty name', () => {
      expect(() => {
        new Agent({
          name: '',
          instructions: 'Test',
        });
      }).toThrow('Agent name is required');
    });

    it('should throw error for empty instructions', () => {
      expect(() => {
        new Agent({
          name: 'Test',
          instructions: '',
        });
      }).toThrow('Agent instructions are required');
    });

    it('should throw error for invalid temperature', () => {
      expect(() => {
        new Agent({
          name: 'Test',
          instructions: 'Test',
          temperature: 3,
        });
      }).toThrow('Temperature must be between 0 and 2');
    });

    it('should throw error for invalid maxTokens', () => {
      expect(() => {
        new Agent({
          name: 'Test',
          instructions: 'Test',
          maxTokens: -1,
        });
      }).toThrow('maxTokens must be positive');
    });
  });

  describe('asTool()', () => {
    it('should convert agent to tool with default name', () => {
      const agent = new Agent({
        name: 'Helper Agent',
        instructions: 'I help with tasks',
      });

      const tool = agent.asTool();

      expect(tool.definition.function.name).toBe('call_helper_agent');
      expect(tool.definition.function.description).toContain('Helper Agent');
      expect(tool.definition.function.parameters.properties).toHaveProperty('input');
    });

    it('should convert agent to tool with custom name', () => {
      const agent = new Agent({
        name: 'Helper Agent',
        instructions: 'I help with tasks',
      });

      const tool = agent.asTool('custom_helper', 'Custom helper description');

      expect(tool.definition.function.name).toBe('custom_helper');
      expect(tool.definition.function.description).toBe('Custom helper description');
    });

    it('should have executable function', () => {
      const agent = new Agent({
        name: 'Test Agent',
        instructions: 'Test',
      });

      const tool = agent.asTool();

      expect(typeof tool.execute).toBe('function');
    });
  });

  describe('clone()', () => {
    it('should create deep copy of agent', () => {
      const original = new Agent({
        name: 'Original',
        instructions: 'Original instructions',
        temperature: 0.8,
      });

      const cloned = original.clone();

      expect(cloned.name).toBe(original.name);
      expect(cloned.instructions).toBe(original.instructions);
      expect(cloned.temperature).toBe(original.temperature);
      expect(cloned).not.toBe(original); // Different instance
    });

    it('should apply overrides when cloning', () => {
      const original = new Agent({
        name: 'Original',
        instructions: 'Original instructions',
        temperature: 0.8,
      });

      const cloned = original.clone({
        name: 'Modified',
        temperature: 0.5,
      });

      expect(cloned.name).toBe('Modified');
      expect(cloned.temperature).toBe(0.5);
      expect(cloned.instructions).toBe('Original instructions'); // Unchanged
    });
  });

  describe('withTools()', () => {
    it('should add tools to agent', () => {
      const agent = new Agent({
        name: 'Test',
        instructions: 'Test',
      });

      const tool1 = createTool('tool1', 'Tool 1', {}, async () => ({}));
      const tool2 = createTool('tool2', 'Tool 2', {}, async () => ({}));

      const enhanced = agent.withTools(tool1, tool2);

      expect(enhanced.tools).toHaveLength(2);
      expect(agent.tools).toHaveLength(0); // Original unchanged
    });
  });

  describe('withGuardrails()', () => {
    it('should add guardrails to agent', () => {
      const agent = new Agent({
        name: 'Test',
        instructions: 'Test',
      });

      const guardrail = {
        name: 'test_guardrail',
        description: 'Test',
        type: 'input' as const,
        check: async () => ({ passed: true }),
      };

      const enhanced = agent.withGuardrails(guardrail);

      expect(enhanced.guardrails).toHaveLength(1);
      expect(agent.guardrails).toHaveLength(0); // Original unchanged
    });
  });

  describe('toJSON()', () => {
    it('should return summary of agent', () => {
      const agent = new Agent({
        name: 'Test Agent',
        instructions:
          'This is a very long instruction that should be truncated in the JSON output because it exceeds the maximum length allowed',
        model: 'gpt-4o',
        temperature: 0.9,
      });

      const json = agent.toJSON();

      expect(json.name).toBe('Test Agent');
      expect(json.model).toBe('gpt-4o');
      expect(json.temperature).toBe(0.9);
      expect(json.instructions.length).toBeLessThanOrEqual(103); // 100 + '...'
      expect(json.instructions).toContain('...');
    });
  });
});

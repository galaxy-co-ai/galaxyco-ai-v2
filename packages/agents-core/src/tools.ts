/**
 * Tool System - Utilities for creating and managing tools
 */

import { Tool, ToolDefinition, ToolCategory, ToolMetadata } from "./types";

/**
 * Create a simple function tool
 */
export function createTool(
  name: string,
  description: string,
  parameters: Record<string, any>,
  execute: (args: any) => Promise<any>,
  metadata?: Partial<ToolMetadata>,
): Tool {
  // Clean parameters: remove 'required' from property definitions
  const cleanedProperties: Record<string, any> = {};
  const requiredFields: string[] = [];

  for (const [key, value] of Object.entries(parameters)) {
    const { required, ...cleanProp } = value;
    cleanedProperties[key] = cleanProp;

    // If required is not explicitly false, add to required array
    if (required !== false) {
      requiredFields.push(key);
    }
  }

  return {
    definition: {
      type: "function",
      function: {
        name,
        description,
        parameters: {
          type: "object",
          properties: cleanedProperties,
          required: requiredFields,
        },
      },
    },
    execute,
  };
}

/**
 * Decorator for creating function tools
 * Usage:
 *   @functionTool("search", "Search the database")
 *   async function search(query: string) { ... }
 */
export function functionTool(name: string, description: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    // Store tool metadata on the function
    (originalMethod as any).__toolMetadata = {
      name,
      description,
    };

    return descriptor;
  };
}

/**
 * Extract tool from decorated function
 */
export function extractTool(fn: Function): Tool | null {
  const metadata = (fn as any).__toolMetadata;
  if (!metadata) return null;

  return {
    definition: {
      type: "function",
      function: {
        name: metadata.name,
        description: metadata.description,
        parameters: {
          type: "object",
          properties: {}, // TODO: Extract from TypeScript types
          required: [],
        },
      },
    },
    execute: fn as any,
  };
}

/**
 * Registry of all tools (for tool marketplace)
 */
export class ToolRegistry {
  private static tools: Map<string, Tool> = new Map();

  static register(name: string, tool: Tool): void {
    this.tools.set(name, tool);
  }

  static get(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  static getAll(): Tool[] {
    return Array.from(this.tools.values());
  }

  static list(): string[] {
    return Array.from(this.tools.keys());
  }

  static clear(): void {
    this.tools.clear();
  }
}

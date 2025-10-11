/**
 * Tool System Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import { createTool, ToolRegistry } from "../src/tools";

describe("Tool System", () => {
  describe("createTool()", () => {
    it("should create a valid tool", () => {
      const tool = createTool(
        "test_tool",
        "A test tool for testing",
        {
          query: { type: "string", description: "Search query" },
          limit: { type: "number", description: "Result limit" },
        },
        async (args) => ({ results: [] }),
      );

      expect(tool.definition.type).toBe("function");
      expect(tool.definition.function.name).toBe("test_tool");
      expect(tool.definition.function.description).toBe(
        "A test tool for testing",
      );
      expect(tool.definition.function.parameters.type).toBe("object");
      expect(tool.definition.function.parameters.properties).toHaveProperty(
        "query",
      );
      expect(tool.definition.function.parameters.properties).toHaveProperty(
        "limit",
      );
      expect(typeof tool.execute).toBe("function");
    });

    it("should mark required parameters correctly", () => {
      const tool = createTool(
        "test_tool",
        "Test",
        {
          required_param: { type: "string" },
          optional_param: { type: "string", required: false },
        },
        async () => ({}),
      );

      expect(tool.definition.function.parameters.required).toContain(
        "required_param",
      );
      expect(tool.definition.function.parameters.required).not.toContain(
        "optional_param",
      );
    });

    it("should execute tool function", async () => {
      const tool = createTool(
        "calculator",
        "Adds two numbers",
        {
          a: { type: "number" },
          b: { type: "number" },
        },
        async (args: { a: number; b: number }) => ({ result: args.a + args.b }),
      );

      const result = await tool.execute({ a: 5, b: 3 });
      expect(result).toEqual({ result: 8 });
    });
  });

  describe("ToolRegistry", () => {
    beforeEach(() => {
      ToolRegistry.clear();
    });

    it("should register and retrieve tools", () => {
      const tool = createTool("test", "Test", {}, async () => ({}));

      ToolRegistry.register("test", tool);

      const retrieved = ToolRegistry.get("test");
      expect(retrieved).toBe(tool);
    });

    it("should return undefined for non-existent tool", () => {
      const tool = ToolRegistry.get("non_existent");
      expect(tool).toBeUndefined();
    });

    it("should list all registered tools", () => {
      const tool1 = createTool("tool1", "Tool 1", {}, async () => ({}));
      const tool2 = createTool("tool2", "Tool 2", {}, async () => ({}));

      ToolRegistry.register("tool1", tool1);
      ToolRegistry.register("tool2", tool2);

      const list = ToolRegistry.list();
      expect(list).toHaveLength(2);
      expect(list).toContain("tool1");
      expect(list).toContain("tool2");
    });

    it("should get all tools", () => {
      const tool1 = createTool("tool1", "Tool 1", {}, async () => ({}));
      const tool2 = createTool("tool2", "Tool 2", {}, async () => ({}));

      ToolRegistry.register("tool1", tool1);
      ToolRegistry.register("tool2", tool2);

      const all = ToolRegistry.getAll();
      expect(all).toHaveLength(2);
      expect(all).toContain(tool1);
      expect(all).toContain(tool2);
    });

    it("should clear all tools", () => {
      const tool = createTool("test", "Test", {}, async () => ({}));
      ToolRegistry.register("test", tool);

      expect(ToolRegistry.list()).toHaveLength(1);

      ToolRegistry.clear();

      expect(ToolRegistry.list()).toHaveLength(0);
    });

    it("should handle overwriting tools", () => {
      const tool1 = createTool("test", "Tool 1", {}, async () => ({
        version: 1,
      }));
      const tool2 = createTool("test", "Tool 2", {}, async () => ({
        version: 2,
      }));

      ToolRegistry.register("test", tool1);
      ToolRegistry.register("test", tool2);

      const retrieved = ToolRegistry.get("test");
      expect(retrieved).toBe(tool2);
    });
  });
});
